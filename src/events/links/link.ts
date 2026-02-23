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

    const outdated = () => Signal.needsRefresh(dst);
    const change   = () => Signal.refreshWith(dst, src.currentProvider);
    
    src.events.outdated.addListener(outdated);
    src.events.change  .addListener(change);

    return {
        unlink: (...[provider]: ARG<T>) => {
            src.events.outdated.removeListener(outdated);
            src.events.change  .removeListener(change);

            if( provider === undefined)
                provider = NO_VALUE_PROVIDER as ValueProvider<T>;

            Signal.needsRefresh(dst);
            Signal.refreshWith (dst, provider);
        }
    }
}