import { Cstr } from "../types/Cstr";
import { Mixin, MixinArgs, WithMixins } from "./types";

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