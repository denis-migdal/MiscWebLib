import { Cstr } from "../types/Cstr";

import Mix  from "../mixins/mixer";
import { Mixin, WithMixins } from "../mixins/types";

export interface Ext<B   extends Cstr    = Cstr,
                     Acc extends Mixin[] = []
                    > {

}

export type NextBuilder<B   extends Cstr,
                        Acc extends Mixin[],
                        E   extends (...args: any[]) => Mixin
            > = WithMixins<B, [...Acc, ReturnType<E>]>
              & MixBuilder<B, [...Acc, ReturnType<E>]>;

type MixBuilder<B   extends Cstr    = Cstr,
                Acc extends Mixin[] = []
                > = WithMixins<B, Acc> & {

    With<M extends Mixin>(mixin: M): WithMixins    <B, [...Acc, M]>
                                   & MixBuilder<B, [...Acc, M]>;

} & Ext<B, Acc>;

export type WithExt<
                B   extends Cstr,
                Acc extends Mixin[],
                Ext extends (...args: any[]) => Mixin,
            > = (...opts: Parameters<Ext>) => NextBuilder<B, Acc, Ext>;

const Base = Mix(Object) as any as MixBuilder;
export default Base;

export function registerExtension(Ext: (...args: any[]) => Mixin) {
    // @ts-ignore
    Base[`With${Ext.name}`] = function(...args: any[]) {
        return Ext(...args)(this);
    }
}