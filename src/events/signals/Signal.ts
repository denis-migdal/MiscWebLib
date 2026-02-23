import asRW from "../../types/asRW";
import { mutable } from "../../types/mutable";
import RSignal, { NO_VALUE } from "./RSignal";

export type ValueProvider<T> = {
    readonly value: T|typeof NO_VALUE
}

export const NO_VALUE_PROVIDER = {
    value: NO_VALUE
} as const

export default class Signal<T> extends RSignal<T> {

    readonly currentProvider: ValueProvider<T>;
    get value() {
        return this.currentProvider.value;
    }

    readonly outdated: boolean = false;

    constructor(initialProvider: ValueProvider<T> = NO_VALUE_PROVIDER) {
        super();
        this.currentProvider = initialProvider;
    }

    protected refreshAnnounced = 0;
    needsRefresh() {

        if( ++this.refreshAnnounced !== 1)
            return
        
        mutable(this).outdated = true;
        asRW(this.events.outdated).trigger();
    }

    refreshWith(provider: ValueProvider<T>) {
        
        if( --this.refreshAnnounced !== 0)
            return;

        mutable(this).outdated        = false;
        mutable(this).currentProvider = provider;
        asRW(this.events.change).trigger();
    }
}
