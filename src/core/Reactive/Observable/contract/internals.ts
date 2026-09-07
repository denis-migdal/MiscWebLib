const OBSERVABLE = Symbol();
type  OBSERVABLE = typeof OBSERVABLE;

export {OBSERVABLE};

export type ObservableWithCapacities<T extends object> = {
    readonly [OBSERVABLE] : T;
}

export type Ctrler<T extends {readonly [OBSERVABLE]: any}> = T[OBSERVABLE];

// used to make some features independent on the way this is stored.
export function ctrler<T extends {readonly [OBSERVABLE]: any}>(target: T): Ctrler<T> {
    return target[OBSERVABLE];
}