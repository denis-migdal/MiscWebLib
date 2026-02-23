import asRW from "../../types/asRW";
import { mutable } from "../../types/mutable";
import NestedGuard from "../guards/NestedGuard";
import constant from "./providers/constant";
import RSignal, { NO_VALUE, ValueProvider } from "./RSignal";

export const NO_VALUE_PROVIDER = {
    value: NO_VALUE
} as const

export default class Signal<T> extends RSignal<T> {

    override readonly currentProvider: ValueProvider<T> = NO_VALUE_PROVIDER;
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

    static setValue<T>(s: Signal<T>, value: NoInfer<T>) {
        s.needsRefresh();
        s.refreshWith( constant(value) );
    }
}

export const setValue = Signal.setValue;