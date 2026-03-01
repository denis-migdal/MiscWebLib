import { getID, log } from "@MWL/debug";
import RSignal from "../signals/RSignal";
import Signal  from "../signals/Signal";

import Cache    from "../signals/providers/Cache";
import computed from "../signals/providers/computed";

export default function toManyLink<T, U>(
    src    : RSignal<T>,
    dst    : Signal<U>[],
    compute: (idx: number) => NoInfer<U>
) {

    let providers = new Array<Cache<U>>(dst.length);
    for(let i = 0; i < dst.length; ++i)
        providers[i] = new Cache( computed( () => compute(i) ) );

    const startChange = () => {
        for(let i = 0; i < dst.length; ++i)
            Signal.startChange(dst[i]);
        getID(src) === "IN" && log(src, "START");
    }
    const endChange = () => {
        for(let i = 0; i < dst.length; ++i) {
            providers[i].invalidateCache();
            Signal.endChange(dst[i], providers[i]);
        }
        getID(src) === "IN" && log(src, "END");
    }

    src.events.beforeChange.addListener( startChange );
    src.events. afterChange.addListener(   endChange );
    
    //TODO: return unlink

}
