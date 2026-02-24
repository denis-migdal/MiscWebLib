export type Listener<T> = (event: REvent<T>) => void;

const NOOP = () => {}

export interface REvent<T> {

    readonly target: T;

    addListener   (listener: Listener<T>): void;
    removeListener(listener: Listener<T>): void;
}

export interface WEvent<T> {
    trigger(): void
}

//TODO: removeListener.
export default class Event<T> implements REvent<T>, WEvent<T> {

    protected listeners = new Array<Listener<T>>();
    readonly target: T;
    constructor(target: T) {
        this.target = target;
    }

    trigger() {

        this.compactListeners();

        for(let i = 0; i < this.listeners.length; ++i)
            this.listeners[i](this);
    }

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

    protected removalPending: boolean = false;
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