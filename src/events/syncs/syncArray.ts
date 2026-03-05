import { REvent } from "../Event";
import LockGuard from "../guards/LockGuard";
import { ValueProvider } from "../signals/RSignal";
import Signal from "../signals/Signal";

import computed from "../signals/providers/computed";
import Cache    from "../signals/providers/Cache";

export function createSignalFromArray<T>(array: Signal<T>[]) {

    const signalProvider = new Cache( computed( () => {
        return array.map( s => s.value);
    }));

    const signal = new Signal(signalProvider);

    syncArray(array, signal);

    return signal;
}

//TODO: enable different types ?
export default function syncArray<T>(array: Signal<T>[], signal: Signal<T[]>) {
    
    const guard = new LockGuard();

    const arrayProviders = new Array<ValueProvider<T>>(array.length);
    for(let i = 0; i < array.length; ++i)
        arrayProviders[i] = computed( () => signal.value[i]);

    const signalProvider = new Cache( computed( () => {
        return array.map( s => s.value);
    }));

    function startChange(ev: REvent<unknown>) {

        if( ! guard.enter() ) return;

        // notify the other.
        if( ev.target === signal ) {
            for(let i = 0; i < array.length; ++i)
                Signal.startChange(array[i]);
        } else
            Signal.startChange(signal);

        guard.leave();
    }

    function endChange(ev: REvent<unknown>) {

        if( ! guard.enter() ) return;

        // notify the other.
        if( ev.target === signal ) {
            for(let i = 0; i < array.length; ++i)
                Signal.endChange(array[i], arrayProviders[i]);
        } else {
            signalProvider.invalidateCache();
            Signal.endChange(signal, signalProvider);
        }

        guard.leave();
    }

    // becomes pending...
    signal.events.beforeChange.addListener( startChange );
    for(let i = 0; i < array.length; ++i)
        array[i].events.beforeChange.addListener( startChange );

    // has a value...
    signal.events.afterChange.addListener( endChange );
    for(let i = 0; i < array.length; ++i)
        array[i].events.afterChange.addListener( endChange );
}