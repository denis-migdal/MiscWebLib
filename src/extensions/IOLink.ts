import { Cstr } from "../types/Cstr";

//TODO: Register + verif type checker
export default function WithIOLink<I, O, B extends Cstr>(base: B) {

    abstract class WithIOLinkMixed extends base {

        // we can't put a default as we do not know if I/O are compatibles.
        abstract readonly compute: (input: I) => O;

        constructor(...args: any[]) {
            super(...args);

            // linkCompute(inputParsed, output, compute)
                // ==> cache() + compute()
        }
    }

    return WithIOLinkMixed;
}