import asRW from "../../types/asRW";
import { mutable } from "../../types/mutable";
import NestedGuard from "../guards/NestedGuard";
import constant from "./providers/constant";
import NO_VALUE_PROVIDER, { NO_VALUE } from "./providers/no_value";
import RSignal, { ValueProvider } from "./RSignal";

export default class Signal<T> extends RSignal<T> {

    constructor(initialProvider: ValueProvider<T>) {
        super();

        this.currentProvider = initialProvider;
    }

    override readonly currentProvider: ValueProvider<T>;

    override get value() {
        return this.currentProvider.value;
    }

    protected readonly guard = new NestedGuard();
    get isChanging() {
        return this.guard.isInside;
    }

    protected startChange() {

        if( ! this.guard.enter() )
            return;
        
        asRW(this.events.beforeChange).trigger();
    }

    protected endChange(provider: ValueProvider<T>) {
        
        if( ! this.guard.leave() )
            return;

        mutable(this).currentProvider = provider;
        asRW(this.events.afterChange).trigger();
    }

    // internal interface.
    static startChange<T>(s: Signal<T>) {
        return s.startChange();
    }
    static endChange<T>(s: Signal<T>, provider: ValueProvider<NoInfer<T>>) {
        return s.endChange(provider);
    }
    static change<T>(s: Signal<T>, provider: ValueProvider<NoInfer<T>>) {
        s.startChange();
        return s.endChange(provider);
    }
}

export function setValue<T>(s: Signal<T>, value: NoInfer<T>) {
    Signal.change(s, constant(value) );
}

export function clearValue<T>(s: Signal<T|typeof NO_VALUE>) {
    Signal.change(s, NO_VALUE_PROVIDER );
}