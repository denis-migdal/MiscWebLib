// @ts-nocheck

import { NULL_OP } from "MWL@2026/core/types";
import { Observable } from "./Observable";
import { MAIN_EVENT } from "./Observable/MAIN_EVENT";

export type CallbackContext<T extends object|null> = {
    readonly target: T,
    readonly event : unknown, /* we hide implementation */
}

export type Callback<
                T extends object|null,
            > = (this: CallbackContext<T>) => void;

// do NOT extend ObservableObject.
export class CallbackRegistry<
                                T extends object|null
                            > implements Observable<any> {

    private readonly callbacks = new Array<Callback<T>>();
    private readonly clearAfterTrigger: boolean;

    private readonly triggerContext;
    readonly target: T;

    // avoid conditions when trying to get the main Event...
    readonly [MAIN_EVENT] = this;

    constructor(
                    target: T,
                    clearAfterTrigger = false
                ) {

        this.clearAfterTrigger = clearAfterTrigger;
        this.target = target;

        this.triggerContext = {
            event : this,
            target,
        };
    }

    // aliases for Event.
    hasListener() {
        return this.callbacks.length !== 0;
    }
    
    addListener(callback: Callback<T>) {
        return this.add(callback);
    }
    removeListener(callback: Callback<T>) {
        return this.remove(callback);
    }
    //

    // re-entry is forbidden, therefore we can reuse the trigger context.
    //TODO: make RO prop.
    getTriggerContext() {
        return this.triggerContext;
    }

    // reentry is FORBIDDEN
    trigger() {

        // need to compact to avoid growing callback list.
        if( ! this.clearAfterTrigger )
            this.compactCallbacks();

        if( this.callbacks.length === 0) // opti.
            return;

        const ctx = this.getTriggerContext();

        // we could bind...
        for(let i = 0; i < this.callbacks.length; ++i)
            this.callbacks[i].apply(ctx);

        if( this.clearAfterTrigger )
            this.clear();
    }

    has(callback: Callback<T>) {
        return this.callbacks.includes(callback);
    }

    add(callback: Callback<T>) {
        this.callbacks.push(callback);
    }

    private removalPending = false;

    remove(callback: Callback<T>): void {

        const idx = this.callbacks.indexOf(callback);
        if( idx === -1)
            return;

        this.callbacks[idx] = NULL_OP;
        this.removalPending = true;
    }

    // do NOT call it during a trigger.
    clear() {
        this.callbacks.length = 0;
        this.removalPending = false;
    }

    compactCallbacks() {

        if( ! this.removalPending ) // compact only if necessary.
            return;

        let offset = 0;
        for(let i = 0; i < this.callbacks.length; ++i)
            if( this.callbacks[i] !== NULL_OP)
                this.callbacks[offset++] = this.callbacks[i];

        this.callbacks.length = offset;
        this.removalPending = false;
    }
}