import RSignal from "../signals/RSignal";
import Signal from "../signals/Signal";
import {getValue, NO_VALUE} from "../signals/providers/no_value";

import fromManyLink from "./fromManyLink";

// no batch/no debounce
export default function mergeLink<T extends Record<string, any>,
                                  S extends RSignal<Partial<NoInfer<T>>|typeof NO_VALUE>[]>(
                                    src     : S,
                                    dst     : Signal<T>,
                                    defaults: Readonly<T>
                                ) {

    const merge = () => {
        return Object.assign({},
                             ...src.map( s => getValue(s, {})),
                             defaults);
    }

    return fromManyLink(src, dst, merge);
}