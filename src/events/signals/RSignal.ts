import {createEvents, Listener, REvent} from "../Event";
import Event from "../Event";

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
    // don't ask me why we can't use Event directly...
    protected changeEvent: REvent<this> = new Event(this);

    addListener(listener: Listener<this>) {
        return this.changeEvent.addListener(listener);
    }
    removeListener(listener: Listener<this>) {
        return this.changeEvent.removeListener(listener);
    }
}

/*
const s = {} as RSignal<number>;
const v = getValue(s, 3)
*/