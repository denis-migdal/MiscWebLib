import { Cstr } from "../types/Cstr";
import { createRequiredSignal } from "../events/signals/createSignal";

export type Output<T extends {OutputInitialValue: Record<string, any>}>
                                            = Readonly<T["OutputInitialValue"]>;

export function WithOutput<B extends Cstr, T extends Record<string, any> = {}>(base: B, initialValue: T = {} as T) {
    return class WithOutputMixed extends base {

        readonly outputSignal = createRequiredSignal<this["output"]>(
                                    (this.constructor as any).OutputInitialValue
                                );

        // need to redeclare it if OutputInitialValue redefined.
        get output(): Output<typeof WithOutputMixed> {
            return this.outputSignal.value;
        }

        static readonly OutputInitialValue = initialValue;
    }
}

import {createExtension} from "../mixins/mixer";

const Output = createExtension(WithOutput);
export default Output;

// === Register ===

import { Mixin  } from "../mixins/types";
import { registerExtension} from "./Base";

declare module "./Base" {
    interface Ext<B   extends Cstr    = Cstr,
                  Acc extends Mixin[] = []
                > {

        WithOutput<T extends Record<string, any> = {}>(props?: T):
            NextBuilder<B, Acc, (props: T) => typeof WithOutput<B, T>>
    }
}
registerExtension(Output);

/*
class X extends WithOutput(Object) {

    static readonly OutputProperties = Properties({
        ...super.OutputProperties.Descriptors,
        foo: 32 as number
    });

    declare output: Output<typeof X>

    onOutputChange(): void {
        console.warn("called");
    }
}

const y = new X();
y.output.foo;
*/