import { Cstr } from "MWL@2026/exports/types";
import { CallbackRegistry } from "../CallbackRegistry";
import {createEvent, Event} from "./Event";
import { MAIN_EVENT } from "./MAIN_EVENT";

export type Observable<
                            T extends object|null
                        > = {readonly [MAIN_EVENT]: Event<T>};

export class ObservableObject implements Observable<ObservableObject> {
    readonly [MAIN_EVENT] = createEvent(this);
}

// ================

export function ObservableMixin<K extends Cstr<object, any[]>>(klass: K) {
    return class ObservableMixin extends klass {
        readonly [MAIN_EVENT] = createEvent(this);
    }
}

export class ObservableProxy<T extends object|null> {
    readonly [MAIN_EVENT]: Event<T>;
    constructor(target: Observable<T>) {
        this[MAIN_EVENT] = target[MAIN_EVENT];
    }
}

// ================

export function triggerEvent<
                        T    extends object|null
                    >(
                        target : Observable<T>
                    ) {
    (target[MAIN_EVENT] as CallbackRegistry<T>).trigger();
}
export const trigger = triggerEvent;

export function hasListeners<
                        T    extends object|null
                    >(target : Observable<T>) {

    return (target[MAIN_EVENT] as CallbackRegistry<T>).hasListener();
}