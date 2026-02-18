import { Cstr } from "../types/Cstr";
import { Properties, trigger } from "./Properties";

export type Input<T extends {InputProperties: Cstr}> = InstanceType<T["InputProperties"]>;

export function WithInput<B extends Cstr>(base: B) {
    return class WithInputMixed extends base {

        static readonly InputProperties = Properties({});

        onInputChange() {}

        readonly input = new (this.constructor as any).InputProperties(
                () => trigger(this, "inputChange")
            ) as Input<typeof WithInputMixed>;
    }
}

import {createExtension} from "../mixins/mixer";

const Input = createExtension(WithInput);
export default Input;

/*
class X extends WithInput(Object) {

    static readonly InputProperties = Properties({
        ...super.InputProperties.Descriptors,
        foo: 32 as number
    });

    declare input: Input<typeof X>

    onInputChange(): void {
        console.warn("called");
    }
}

const y = new X();
y.input.foo;
*/