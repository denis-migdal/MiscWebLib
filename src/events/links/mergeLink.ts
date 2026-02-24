import RSignal from "../signals/RSignal";
import Signal from "../signals/Signal";
import {getValue, NO_VALUE} from "../signals/providers/no_value";

import Cache    from "../signals/providers/Cache";
import computed from "../signals/providers/computed";

// no batch/no debounce
export default function mergeLink<T extends Record<string, any>,
                                  S extends RSignal<Partial<NoInfer<T>>|typeof NO_VALUE>[]>(
                                    src     : S,
                                    dst     : Signal<T>,
                                    defaults: Readonly<T>
                                ) {

    const provider = new Cache( computed( () => {
        return Object.assign({},
                             ...src.map( s => getValue(s, {})),
                             defaults);
    }));

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