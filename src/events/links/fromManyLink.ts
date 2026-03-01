import RSignal from "../signals/RSignal";
import Signal  from "../signals/Signal";

import Cache    from "../signals/providers/Cache";
import computed from "../signals/providers/computed";

import {getID, log} from "@MWL/debug";

export default function fromManyLink<T, U>(
    src: RSignal<T>[],
    dst: Signal<U>,
    merge: () => NoInfer<U>
) {

    const provider = new Cache( computed( merge ) );

    //TODO: initial value ?

    const startChange = () => {
        Signal.startChange(dst);
    }
    const endChange = () => {
        provider.invalidateCache();
        Signal.endChange(dst, provider);
    }

    for(let i = 0; i < src.length; ++i) {
        src[i].events.beforeChange.addListener( startChange );
        src[i].events. afterChange.addListener(   endChange );
    }
    
    //TODO: return unlink

}