import { REvent } from "../Event";
import RSignal from "../signals/RSignal";
import Signal from "../signals/Signal";
import {NO_VALUE} from "../signals/providers/no_value";

// no batch/no debounce
export default function mergeLink<T extends Record<string, any>,
                                  S extends RSignal<Partial<NoInfer<T>>|typeof NO_VALUE>[]>(
                                    src     : S,
                                    dst     : Signal<T>,
                                    defaults: Partial<T> = {}
                                ) {

    const provider = {
        // CACHE ?
        get value() {
            return {} as T
        }
    }
    //TODO: initial value...

    const startChange = () => {
        Signal.startChange(dst);
    }
    const endChange = () => {
        Signal.endChange(dst, provider);
    }

    for(let i = 0; i < src.length; ++i) {
        src[i].events.beforeChange.addListener( startChange );
        src[i].events. afterChange.addListener(   endChange );
    }
    
    //TODO: return unlink
}