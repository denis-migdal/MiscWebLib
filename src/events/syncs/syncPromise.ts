import { REvent } from "../Event";
import LockGuard  from "../guards/LockGuard";
import computed   from "../signals/providers/computed";
import Signal     from "../signals/Signal";
import Cache      from "../signals/providers/Cache";
import { ValueProvider } from "../signals/RSignal";
import constant from "../signals/providers/constant";

type PromiseExecutor<T> = (resolve: (value: T) => void,
                            reject: (reason?: any) => void
                        ) => void;

class LazyPromise<T> implements Promise<T> {

    protected executor: PromiseExecutor<T>
    constructor( executor: PromiseExecutor<T> ) {
        this.executor = executor;
    }

    protected promise: Promise<T>|null = null;
    protected getPromise() {
        if( this.promise === null )
            this.promise = new Promise( this.executor );

        return this.promise;
    }


    then<TResult1 = T, TResult2 = never>(
                onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | null | undefined, 
                onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | null | undefined
            ): Promise<TResult1 | TResult2> {

        return this.getPromise().then<TResult1, TResult2>( onfulfilled, onrejected );
    }

    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | null | undefined): Promise<T | TResult> {
        
        return this.getPromise().catch<TResult>( onrejected );
    }
    finally(onfinally?: (() => void) | null | undefined): Promise<T> {
        return this.getPromise().finally( onfinally );
    }

    get [Symbol.toStringTag]() {
        return this.getPromise()[Symbol.toStringTag];
    }   
}

//TODO: await + ack for promise...
export function syncPromise<T>(promiseSignal: Signal<PromiseLike<T>>,
                                      signal: Signal<T>) {

    const guard = new LockGuard();

    const pending   = new LockGuard();
    const resolving = new LockGuard();
    const read      = new LockGuard();

    let resolvedValue!: T;

    const resolvedValueProvider = {
        isConstant  : false,
        isValueKnown: true,
        get value() {
            read.enter();
            requestRefresh();
            return resolvedValue;
        }
    } satisfies ValueProvider<T>;

    async function requestRefresh() {

        // no refresh to perform
        if( ! pending.isInside ) return;
        // another value is coming, do not refresh yet.
        if( promiseSignal.isChanging ) return;

        // re-entry protection
        if( ! resolving.enter() ) return;

        resolvedValue = await promiseSignal.value;

        read.leave();
        Signal.endChange(signal, resolvedValueProvider);

        resolving.leave();
        pending  .leave();
    }

    const promiseSignalProvider = new Cache( computed( async () => signal.value ) );
    
    function startChange(ev: REvent<unknown>) {

        if( ! guard.enter() ) return;

        // notify the other.
        if( ev.target === signal ) {
            Signal.startChange(promiseSignal);
        } else {
            if( pending.enter() )
                Signal.startChange(signal);
        }

        guard.leave();
    }

    // TODO ~ await...
    function endChange(ev: REvent<unknown>) {

        if( ! guard.enter() ) return;

        // notify the other.
        if( ev.target === signal ) {

            // this is re-entry
            if( signal.currentProvider !== resolvedValueProvider ) {
                promiseSignalProvider.invalidateCache();
                Signal.endChange(promiseSignal, promiseSignalProvider);
            }
        } else {
            if(    read.isInside
                || signal.currentProvider !== resolvedValueProvider )
                requestRefresh();
        }

        guard.leave();
    }

    // becomes pending...
    signal       .events.beforeChange.addListener( startChange );
    promiseSignal.events.beforeChange.addListener( startChange );

    // has a value...
    signal       .events.afterChange.addListener( endChange );
    promiseSignal.events.afterChange.addListener( endChange );
}

export async function createSignalFromASync<T>(promiseSignal: Signal<PromiseLike<T>>) {

    const signalProvider = constant( await promiseSignal.value );
    const signal         = new Signal(signalProvider);

    syncPromise(promiseSignal, signal);

    return signal;
}

export function createASignalFromSync<T>(signal: Signal<T>) {

    const signalProvider = new Cache( computed( () => {
        return new LazyPromise<T>( (r) => {
            r(signal.value);
        });
    }));
    
    const promiseSignal = new Signal(signalProvider);

    syncPromise(promiseSignal, signal);

    return promiseSignal;
}