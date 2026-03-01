import NO_VALUE_PROVIDER, { NO_VALUE } from "../signals/providers/no_value";
import RSignal, { ValueProvider }      from "../signals/RSignal";
import Signal, { setValueProvider }    from "../signals/Signal";
import { Unlikable } from "./link";

import Cache    from "../signals/providers/Cache";
import computed from "../signals/providers/computed";

type ARG<T> = [provider : ValueProvider<T>] 
            | (T extends typeof NO_VALUE
                ? []
                : never )

export default function computedLink<T, U>(src: RSignal<T>,
                                           dst: Signal<U>,
                                           compute: () => NoInfer<U>
                                        ): Unlikable<U> {

    const provider = new Cache(computed( compute ) );

    // src is the one optimizing event emissions if necessary.
    const startChange = () => Signal.startChange(dst);
    const   endChange = () => {
        provider.invalidateCache();
        Signal.endChange(dst, provider);
    }
    
    src.events.beforeChange.addListener(startChange);
    src.events.afterChange .addListener(  endChange);

    if( src.isChanging ) {
        startChange();
    } else {
        provider.invalidateCache();
        setValueProvider(dst, provider);
    }

    return {
        unlink: (...[provider]: ARG<U>) => {
            src.events.beforeChange.removeListener(startChange);
            src.events.afterChange .removeListener(  endChange);

            if( provider === undefined)
                provider = NO_VALUE_PROVIDER as ValueProvider<U>;

            // if isChanging should have already sent a beforeChange.
            if( dst.isChanging ) {
                Signal.endChange(dst, provider);
            } else {
                setValueProvider(dst, provider);
            }
        }
    }
}