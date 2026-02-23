import {createEvents} from "../Event";

const NO_VALUE = Symbol("NO VALUE");

export default abstract class RSignal<T> {

    abstract readonly outdated: boolean;
    abstract readonly value   : T | typeof NO_VALUE ;

    readonly events = createEvents("change", "outdated");
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