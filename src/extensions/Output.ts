import { Cstr } from "../types/Cstr";
import { Properties, trigger } from "./Properties";

export type Output<T extends {OutputProperties: Cstr}> = Readonly<InstanceType<T["OutputProperties"]>>

export function WithOutput<B extends Cstr>(base: B) {
    return class WithOutputMixed extends base {

        static readonly OutputProperties = Properties({});

        onOutputChange() {}

        readonly output = new (this.constructor as any).OutputProperties(
                () => trigger(this, "outputChange")
            ) as Output<typeof WithOutputMixed>;
    }
}

import {createExtension} from "../mixins/mixer";

const Output = createExtension(WithOutput);
export default Output;

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