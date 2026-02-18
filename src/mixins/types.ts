import {Cstr}                from "../types/Cstr";
import {UnionToIntersection} from "../types/misc";

export type Mixin<T extends Cstr  = any,
                  U extends Cstr  = any,
                  V extends any[] = any[]
                > = (base: T, ...args: V) => U;

export type MixinArgs<T extends Mixin> = T extends Mixin<any, any, infer Args>
                                            ? Args
                                            : never

export type OnlyFirstParam<
                            T extends (arg: any, ...args: any[]) => any
                        > = T extends (arg: infer A, ...args: any[]) => infer R
                                    ? (arg: A) => R
                                    : never;

export type MixinReturn<T extends Mixin> = T extends Mixin<any, infer Ret, any>
                                            ? Ret
                                            : never

export type WithMixins<B extends Cstr,
                       T extends Mixin[],
                       // not sure if we can remove K.
                       K extends keyof T & number = keyof T & number
                    > = 
    // instance props
    Cstr<UnionToIntersection<InstanceType<B|MixinReturn<T[K]>>>>
    // static props
  & Omit<UnionToIntersection<B|MixinReturn<T[K]>>, "new">;