import RSignal from "../signals/RSignal";
import Signal, { NO_VALUE_PROVIDER } from "../signals/Signal";

type Unlikable = {
    unlink: () => void;
}

export default function link<T>(src: RSignal<T>, dst: Signal<T>): Unlikable {

    const outdated = () => Signal.needsRefresh(dst);
    const change   = () => Signal.refreshWith(dst, src.currentProvider);
    
    src.events.outdated.addListener(outdated);
    src.events.change  .addListener(change);

    return {
        unlink: () => {
            src.events.outdated.removeListener(outdated);
            src.events.change  .removeListener(change);

            // do NOT check if the currentProvider are the same.
            // => unlink could have been performed during src change.
            Signal.needsRefresh(dst);
            Signal.refreshWith (dst, NO_VALUE_PROVIDER);
        }
    }
}