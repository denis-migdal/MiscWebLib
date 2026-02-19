type Listener<T> = (event: Event<T>) => void;

const NOOP = () => {}

export interface REvent<T> {
    addListener   (listener: Listener<T>): void;
    removeListener(listener: Listener<T>): void;
    flush(): Promise<void>;
}

export interface WEvent<T> {
    trigger(): Promise<void>
}

//TODO: removeListener.
export default class Event<T> implements REvent<T>, WEvent<T> {

    protected listeners = new Array<Listener<T>>();
    readonly target: T;
    readonly name  : string|null;

    constructor(target: T, name: string|null = null) {
        this.target = target;
        this.name   = name;
    }

    async flush() {
        if( this.promise !== null)
            await this.promise;
    }

    protected promise: null|Promise<void> = null;
    trigger(): Promise<void> {

        // protect against re-entry.
        if( this.promise !== null)
            return this.promise;

        const {promise, resolve} = Promise.withResolvers<void>();
        this.promise = promise;

        queueMicrotask( () => {

            this.compactListeners();

            for(let i = 0; i < this.listeners.length; ++i)
                this.listeners[i](this);
            this.promise = null;
            resolve();
        });

        return promise;
    }

    protected removalPending: boolean = false;
    addListener(listener: Listener<T>) {
        this.listeners.push(listener);
    }
    removeListener(listener: Listener<T>): void {

        const idx = this.listeners.indexOf(listener);
        if( idx === -1)
            return;

        this.listeners[idx] = NOOP;
        this.removalPending = true;
    }
    protected compactListeners() {

        if( ! this.removalPending ) // compact if necessary.
            return;

        let offset = 0;
        for(let i = 0; i < this.listeners.length; ++i) {
            if( this.listeners[i] !== NOOP)
                this.listeners[offset++] = this.listeners[i];
        }

        this.listeners.length = offset;
        this.removalPending = false;
    }
}

export function createEvents<T, N extends string>(target: T, ...names: N[]
    ): Record<N, REvent<T>> {

    const result: Record<string, Event<T>> = {};

    for(let i = 0; i < names.length; ++i)
        result[names[i]] = new Event(target);

    return result as Record<N, Event<T>>;
}

import "../types/asRW"
declare module "../types/asRW" {
    export interface TasRW {
        <T>(ro: REvent<T>): REvent<T>&WEvent<T>
    }
}