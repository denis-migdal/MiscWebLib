import asRW from "../../types/asRW";
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
        return this.source.value[name];
    }

    set<K extends keyof T>(name: K, value: T[K]) {
        this.internalValue[name] = value;
        //TODO: guard + debounce.
    }
}