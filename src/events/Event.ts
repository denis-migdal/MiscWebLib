export type Listener<T> = (event: REvent<T>) => void;

const NOOP = () => {}

export interface REvent<T> {
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
    readonly name  : string|null;

    constructor(target: T, name: string|null = null) {
        this.target = target;
        this.name   = name;
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

// prevents multiple calls if events are triggered at the same time.
export function listenAll<T>(events: REvent<T>[], listener: () => void) {

    // prevents re-entry
    let pending = false;
    const callback = () => {

        if( pending )
            return;

        pending = true;
        queueMicrotask( () => {
            listener();
            pending = false;
        });
    }

    for(let i = 0; i < events.length; ++i)
        events[i].addListener(callback);
}

import "../types/asRW"
declare module "../types/asRW" {
    export interface TasRW {
        <T>(ro: REvent<T>): REvent<T>&WEvent<T>
    }
}