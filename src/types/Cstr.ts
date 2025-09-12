// default T needs to be {}, not any.
// else adds [keyof string]: any in mixins classes.
// https://www.typescriptlang.org/docs/handbook/mixins.html
export type Cstr<T                  = {},
                 ARGS extends any[] = any[]
            > = {new(...args: ARGS): T};