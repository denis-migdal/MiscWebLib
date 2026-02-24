import NO_VALUE_PROVIDER, { NO_VALUE } from "../signals/providers/no_value";
import RSignal, { ValueProvider }      from "../signals/RSignal";
import Signal, { setValueProvider }    from "../signals/Signal";

type ARG<T> = [provider : ValueProvider<T>] 
            | (T extends typeof NO_VALUE
                ? []
                : never )

type Unlikable<T> = {
    unlink: (...[provider]: ARG<T>) => void;
}

export default function link<T>(src: RSignal<T>, dst: Signal<T>): Unlikable<T> {

    // src is the one optimizing event emissions if necessary.
    const startChange = () => Signal.startChange(dst);
    const   endChange = () => Signal.endChange(dst, src.currentProvider);
    
    src.events.beforeChange.addListener(startChange);
    src.events.afterChange .addListener(  endChange);

    if( src.isChanging ) {
        startChange();
    } else {
        setValueProvider(dst, src.currentProvider);
    }

    return {
        unlink: (...[provider]: ARG<T>) => {
            src.events.beforeChange.removeListener(startChange);
            src.events.afterChange .removeListener(  endChange);

            if( provider === undefined)
                provider = NO_VALUE_PROVIDER as ValueProvider<T>;

            // if isChanging should have already sent a beforeChange.
            if( dst.isChanging ) {
                Signal.endChange(dst, provider);
            } else {
                setValueProvider(dst, provider);
            }
        }
    }
}