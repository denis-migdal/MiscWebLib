export type Cstr<T                  = any,
                 ARGS extends any[] = any[]
            > = {new(...args: ARGS): T};