import asRW from "../../types/asRW";
import { mutable } from "../../types/mutable";
import NestedGuard from "../guards/NestedGuard";
import constant from "./providers/constant";
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
    get outdated() {
        return this.guard.isInside;
    }

    protected needsRefresh() {

        if( ! this.guard.enter() )
            return;
        
        asRW(this.events.outdated).trigger();
    }

    protected refreshWith(provider: ValueProvider<T>) {
        
        if( ! this.guard.leave() )
            return;

        mutable(this).currentProvider = provider;
        asRW(this.events.change).trigger();
    }

    // internal interface.
    static needsRefresh<T>(s: Signal<T>) {
        return s.needsRefresh();
    }
    static refreshWith<T>(s: Signal<T>, provider: ValueProvider<NoInfer<T>>) {
        return s.refreshWith(provider);
    }
}

export function setValue<T>(s: Signal<T>, value: NoInfer<T>) {
    Signal.needsRefresh(s);
    Signal.refreshWith(s, constant(value) );
}