import NO_VALUE_PROVIDER, { NO_VALUE } from "../signals/providers/no_value";
import RSignal, { ValueProvider } from "../signals/RSignal";
import Signal  from "../signals/Signal";

type ARG<T> = [provider : ValueProvider<T>] 
            | (T extends typeof NO_VALUE
                ? []
                : never )

type Unlikable<T> = {
    unlink: (...[provider]: ARG<T>) => void;
}

export default function link<T>(src: RSignal<T>, dst: Signal<T>): Unlikable<T> {

    const startChange = () => Signal.startChange(dst);
    const   endChange = () => Signal.endChange(dst, src.currentProvider);
    
    src.events.beforeChange.addListener(startChange);
    src.events.afterChange .addListener(  endChange);

    startChange();
    if( ! dst.isChanging )
        endChange();

    return {
        unlink: (...[provider]: ARG<T>) => {
            src.events.beforeChange.removeListener(startChange);
            src.events.afterChange .removeListener(  endChange);

            if( provider === undefined)
                provider = NO_VALUE_PROVIDER as ValueProvider<T>;

            // if isChanging should have already sent a beforeChange.
            if( ! dst.isChanging )
                Signal.startChange(dst);
            
            Signal.endChange(dst, provider);
        }
    }
}