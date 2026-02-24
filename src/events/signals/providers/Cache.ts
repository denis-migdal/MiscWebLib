import LockGuard from "../../guards/LockGuard";
import { ValueProvider } from "../RSignal";

export default class Cache<T> implements ValueProvider<T> {

    readonly source: ValueProvider<T>;
    protected cache: T|null = null;

    // inside = we have a cache.
    protected guard = new LockGuard();

    constructor(src: ValueProvider<T>) {

        this.source     = src;
        this.isConstant = this.source.isConstant;

        this.guard.enter(); // by default no cache.
    }

    invalidateCache() {
        this.guard.enter();
        this.cache = null; // coûte rien.
    }

    get value() {

        if( this.guard.leave() )
            this.cache = this.source.value;

        return this.cache as T;
    }

    readonly isConstant;
    get isValueKnown() {
        return this.source.isValueKnown
    }
}