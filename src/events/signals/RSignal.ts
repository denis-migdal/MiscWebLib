import {createEvents, Listener} from "../Event";


export type ValueProvider<T> = {
    readonly isConstant  : boolean,
    readonly isValueKnown: boolean
    readonly value       : T,
}

export default abstract class RSignal<T> {

    abstract readonly value       : T;

    abstract readonly isChanging: boolean;
    abstract readonly currentProvider: ValueProvider<T>;

    readonly events = createEvents(this, "beforeChange", "afterChange");

    addListener(listener: Listener<this>) {
        return this.events.afterChange.addListener(listener);
    }
    removeListener(listener: Listener<this>) {
        return this.events.afterChange.removeListener(listener);
    }
}

/*
const s = {} as RSignal<number>;
const v = getValue(s, 3)
*/