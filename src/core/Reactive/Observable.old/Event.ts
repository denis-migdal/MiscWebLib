import { CallbackRegistry, Callback } from "../CallbackRegistry";
import { MAIN_EVENT } from "./MAIN_EVENT";

export type Event<
            T extends object|null,
        > = {
    // Can't use CallbackRegistry to get access to internals.
    // We need to prevent some type issues...
    readonly [MAIN_EVENT]: Event<T>;
    addListener   (callback: Callback<T>): void;
    removeListener(callback: Callback<T>): void;
}

export function createEvent<
                                T extends object|null,
                            >(
                                target: T
                            ): Event<T> {

    return new CallbackRegistry(target);
}