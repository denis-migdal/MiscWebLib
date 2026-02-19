import { Cstr } from "../types/Cstr";
import { Properties } from "../events/Properties";

export type Output<T extends {OutputProperties: Cstr}> = Readonly<InstanceType<T["OutputProperties"]>>

export function WithOutput<B extends Cstr, T extends Record<string, any> = {}>(base: B, props: T = {} as T) {
    return class WithOutputMixed extends base {

        static readonly OutputProperties = Properties(props);
        readonly output = new (this.constructor as any).OutputProperties() as Output<typeof WithOutputMixed>;

        onOutputChange() {}

        constructor(...args: any[]) {
            super(...args);

            this.output.events.change.addListener( () => this.onOutputChange() );
        }
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