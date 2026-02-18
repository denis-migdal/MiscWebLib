import { Cstr } from "../types/Cstr";
import { Properties, trigger } from "./Properties";

export type Input<T extends {InputProperties: Cstr}> = InstanceType<T["InputProperties"]>;

export function WithInput<B extends Cstr, T extends Record<string, any> = {}>(base: B, props: T = {} as T) {
    return class WithInputMixed extends base {

        static readonly InputProperties = Properties(props);

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
const Z = WithInput(Object, {faa: "43"});
Z.InputProperties.Descriptors

class X extends WithInput(Object, {faa: "43"}) {

    static override readonly InputProperties = Properties({
        ...super.InputProperties.Descriptors,
        foo: 32 as number
    });

    declare input: Input<typeof X>

    override onInputChange(): void {
        console.warn("called");
    }
}

const y = new X();
y.input.faa;*/