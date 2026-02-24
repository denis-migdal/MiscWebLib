import { Cstr } from "../types/Cstr";
import { createNullableSignal, createSignal } from "@MWL/events/signals/createSignal";

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

export type Input<T extends {InputConfig: ReturnType<typeof config>}> = T['InputConfig']['defaults'];

export function WithInput<B extends Cstr, T extends Record<string, any> = {}>(base: B, defaults: T = {} as T) {
    return class WithInputMixed extends base {

        static readonly InputConfig = createInputConfig(defaults);
        readonly inputSignal = createNullableSignal<Partial<this["input"]>>();

        //TODO: merge...
        protected readonly parsedInput = new Signal( config(this).defaultsProvider );
        protected readonly manualInput = new PartialOverlaySignal(this.parsedInput);
        protected readonly  proxyInput = new (config(this).Proxy)(this.manualInput);

        // re-declare when modifying input...
        get input(): Input<typeof WithInputMixed> {
            return this.proxyInput as any; // dunno why required
        }
        set input(value: Partial<this["input"]>) {
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

class Z extends WithInput(Object, {faa: "43"}) {
    foo() {
        this.parsedInput.value.faa
    }
}

const z = new Z();
z.input.faa;

/*
class X extends WithInput(Object, {faa: "43"}) {

    static override readonly InputProperties = Properties({
        ...super.InputProperties.Descriptors,
        foo: 32 as number
    });

    declare input: Input<typeof X>

}

const y = new X();
y.input.faa;*/