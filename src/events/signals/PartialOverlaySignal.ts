import asRW from "../../types/asRW";
import RSignal from "./RSignal";

export default class PartialOverlaySignal<T extends Record<string, any>> extends RSignal<Readonly<Partial<T>>> {

    get currentProvider() {
        return this;
    }

    protected internalValue: Partial<Readonly<T>> = {};

    get value() {
        return this.internalValue;
    }
    set value(value: Partial<Readonly<T>>) {
        this.internalValue = value;

        //TODO trigger no debounce... ~> if debounce en cours ?
        // => guard ???
        //asRW(this.events.outdated).trigger();
        asRW(this.events.beforeChange).trigger();
        asRW(this.events.afterChange).trigger();
    }

    get isChanging() {
        return false; //TODO: guard...
    }

    get<K extends keyof T>(name: K): T[K] {
        return this.value[name] as T[K] //TODO...
    }

    set<K extends keyof T>(name: K, value: T[K]) {

    }

    // clear ?
}