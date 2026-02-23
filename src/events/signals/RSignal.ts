import {createEvents, Listener} from "../Event";

export const NO_VALUE = Symbol("NO VALUE");

export type ValueProvider<T> = {
    readonly value: T|typeof NO_VALUE
}

export default abstract class RSignal<T> {

    abstract readonly outdated: boolean;
    abstract readonly value   : T | typeof NO_VALUE ;
    abstract readonly currentProvider: ValueProvider<T>;

    readonly events = createEvents(this, "change", "outdated");

    addListener(listener: Listener<this>) {
        return this.events.change.addListener(listener);
    }
    removeListener(listener: Listener<this>) {
        return this.events.change.removeListener(listener);
    }
}

export function getValue<T, U>(s: RSignal<T>, defaultValue: U) {
    const value = s.value;
    if( value === NO_VALUE )
        return defaultValue;
    return value;
}

/*
const s = {} as RSignal<number>;
const v = getValue(s, 3)
*/