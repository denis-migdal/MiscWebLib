import asRW from "../../types/asRW";
import LockGuard from "../guards/LockGuard";
import RSignal from "./RSignal";

export default class PartialOverlaySignal<T extends Record<string, any>> extends RSignal<Readonly<Partial<T>>> {

    readonly source: RSignal<Readonly<T>>;

    constructor(src: RSignal<Readonly<T>>) {
        super();

        this.source = src;
    }

    get currentProvider() {
        return this;
    }

    protected readonly guard = new LockGuard();
    protected internalValue: Partial<Readonly<T>> = {};

    get value() {
        return this.internalValue;
    }
    set value(value: Partial<Readonly<T>>) {

        this.internalValue = value;

        this.startChange();
        this.endChange();
    }

    protected startChange() {
        
        if( ! this.guard.enter() ) return false;

        asRW(this.events.beforeChange).trigger();
        return true;
    }
    protected endChange() {
        
        if( ! this.guard.leave() ) return;

        asRW(this.events.afterChange).trigger();
    }

    get isChanging() {
        return this.guard.isInside;
    }

    get<K extends keyof T>(name: K): T[K] {
        return this.source.value[name];
    }

    set<K extends keyof T>(name: K, value: T[K]) {

        this.internalValue[name] = value;

        if( ! this.startChange() ) return;

        // no needs for batchers.microtask: already behind a guard...
        queueMicrotask( () => this.endChange() );
    }
}