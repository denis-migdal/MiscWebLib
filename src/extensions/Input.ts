import { Cstr } from "../types/Cstr";
import { createNullableSignal } from "../events/signals/createSignal";
import mergeLink from "../events/links/mergeLink";

import PartialOverlaySignal from "../events/signals/PartialOverlaySignal";
import createProxyClass from "../Proxy";

export function createInputConfig<T extends Record<string, any>>(defaults: T) {
    return {
        defaults,
        defaultsProvider: constant(defaults), // opti
        Proxy           : createProxyClass(Object.keys(defaults)),
    };
}

function config<T extends Record<string, any>>(o: {
    input: T
}) {
    return (o.constructor as any).InputConfig as ReturnType<typeof createInputConfig<T>>
}

function createProxy<T extends Record<string, any>>(o: {input: T}): T
{
    const cfg = (o.constructor as any).InputConfig as ReturnType<typeof createInputConfig<T>>;

    return new cfg.Proxy( (o as any).manualInput) as T;
}

export type Input<T extends {InputConfig: ReturnType<typeof config>}> = T['InputConfig']['defaults'];

export function WithInput<B extends Cstr, T extends Record<string, any> = {}>(base: B, defaults: T = {} as T) {
    return class WithInputMixed extends base {

        static readonly InputConfig = createInputConfig(defaults);

        // re-declare when modifying input...
        declare InputDefaults: Input<typeof WithInputMixed>;

        readonly inputSignal = createNullableSignal<Partial<this["InputDefaults"]>>();

        protected readonly parsedInput = new Signal<this["InputDefaults"]>( config(this).defaultsProvider );
        protected readonly manualInput = new PartialOverlaySignal<this["InputDefaults"]>(this.parsedInput);
        protected readonly  proxyInput = createProxy<this["InputDefaults"]>(this);

        constructor(...args: any[]) {
            super(...args);

            mergeLink(  [this.inputSignal, this.manualInput],
                        this.parsedInput,
                        config<this["InputDefaults"]>(this).defaults);
        }

        get input(): this["InputDefaults"] {
            return this.proxyInput as any; // dunno why required
        }
        set input(value: Partial<this["InputDefaults"]>) {
            this.manualInput.value = value;
        }
    }
}

import {createExtension} from "./core/mixins/mixer";

const Input = createExtension(WithInput);
export default Input;

// === Register ===

import { Mixin  } from "./core/mixins/types";
import { registerExtension} from "./Base";
import constant from "@MWL/events/signals/providers/constant";
import Signal from "@MWL/events/signals/Signal";

declare module "./Base" {
    interface Ext<B   extends Cstr    = Cstr,
                  Acc extends Mixin[] = []
                > {

        WithInput<T extends Record<string, any> = {}>(props?: T):
            NextBuilder<B, Acc, (props: T) => typeof WithInput<B, T>>
    }
}
registerExtension(Input);

/*
class Z extends WithInput(Object, {faa: "43", foo: 34}) {
    foo() {
        this.parsedInput.value.faa  // ok
        this.manualInput.value.faa  // (?)
        this.inputSignal.value!.faa // (?)
        this.proxyInput.faa         // ok

    }
}

/*

const z = new Z();
z.input.faa;

class X extends WithInput(Object, {faa: "43"}) {

    static override readonly InputConfig = createInputConfig({
        ...super.InputConfig.defaults,
        foo: 34
    });

    declare InputDefaults: Input<typeof X>;

    foo() {

        this.parsedInput.value.foo  // ok
        this.manualInput.value.foo  // (?)
        this.inputSignal.value!.foo // (?)
        this.proxyInput.foo         // ok
    }
}

const y = new X();
y.input.faa;
y.input.foo;
*/