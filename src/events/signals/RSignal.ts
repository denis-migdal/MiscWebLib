import {createEvents, Listener} from "../Event";


export type ValueProvider<T> = {
    readonly value: T
}

export default abstract class RSignal<T> {

    abstract readonly outdated: boolean;
    abstract readonly value   : T;
    abstract readonly currentProvider: ValueProvider<T>;

    readonly events = createEvents(this, "change", "outdated");

    addListener(listener: Listener<this>) {
        return this.events.change.addListener(listener);
    }
    removeListener(listener: Listener<this>) {
        return this.events.change.removeListener(listener);
    }
}

/*
const s = {} as RSignal<number>;
const v = getValue(s, 3)
*/