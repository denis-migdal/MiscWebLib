import { REvent } from "../Event";
import LockGuard  from "../guards/LockGuard";
import Cache      from "../signals/providers/Cache";
import computed   from "../signals/providers/computed";
import Signal     from "../signals/Signal";

interface Converter<T, U> {
    to  (a: T): U;
    from(b: U): T;
};

export function createSignalView<T, U>( src: Signal<T>,
                                       conv: Converter<T,U>) {

    //TODO...
    const signalProvider = new Cache( computed( () => conv.to  (src.value) ));
    const signal = new Signal<U>(signalProvider);

    syncWithConverter(src, signal, conv);

    return signal;
}

export default function syncWithConverter<T, U>(a   : Signal<T>,
                                                b   : Signal<U>,
                                                conv: Converter<T,U>) {

    
        const guard = new LockGuard();

        const aProvider = new Cache( computed( () => conv.from(b.value) ));
        const bProvider = new Cache( computed( () => conv.to  (a.value) ));
    
        function startChange(ev: REvent<unknown>) {
    
            if( ! guard.enter() ) return;
    
            // notify the other.
            if( ev.target === a )
                Signal.startChange(b);
            else
                Signal.startChange(a);
    
            guard.leave();
        }
    
        function endChange(ev: REvent<unknown>) {
    
            if( ! guard.enter() ) return;
    
            // notify the other.
            if( ev.target === a ) {
                bProvider.invalidateCache();
                Signal.endChange(b, bProvider);
            } else {
                aProvider.invalidateCache();
                Signal.endChange(a, aProvider);
            }
    
            guard.leave();
        }
    
        // becomes pending...
        a.events.beforeChange.addListener( startChange );
        b.events.beforeChange.addListener( startChange );
    
        // has a value...
        a.events.afterChange.addListener( endChange );
        b.events.afterChange.addListener( endChange );
}