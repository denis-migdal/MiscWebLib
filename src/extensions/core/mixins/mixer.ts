import { Cstr } from "../../../types/Cstr";
import { Mixin, MixinArgs, OnlyFirstParam, WithMixins } from "./types";

type MixBuilder<B   extends Cstr,
                Acc extends Mixin[] = []
            > = WithMixins<B, Acc> & {

    With<M extends Mixin>(mixin: M): WithMixins<B, [...Acc, M]>
                                   & MixBuilder<B, [...Acc, M]>;
}

export default function Mix<B extends Cstr>(base: B) {

    return class Mix extends base {

        static With<M extends Mixin>( mixin: M,
                                    ...args: MixinArgs<NoInfer<M>>
                                ): MixBuilder<B, [M]> {

            return mixin(this, ...args);
        }
    }
}

export function createExtension<M extends Mixin>(m: M)
            : (...opts: MixinArgs<M>) => OnlyFirstParam<M> {

    const name = m.name.slice(4);
    const fct  = (...opts: unknown[]) => (target: Cstr) => m(target, ...opts);

    Object.defineProperty(fct, "name", {value: name});

    return fct as any;
}