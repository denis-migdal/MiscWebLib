import { NULL_OP } from "MWL@2026/core/types";
import { Observable, Prefixes } from "../contract";
import { OBSERVABLE } from "../contract/internals";

type Callback<
                Ctx   extends object|void = void,
                Args  extends any[]  = []
            > = (this: Ctx, ...args: Args) => void;

// Issues with assignation, but osef as we use public interfaces.
export class CallbackRegistry<
                                TriggerContext extends object|void = void,
                                TriggerArgs    extends any[]  = [],
            > implements Observable<TriggerContext, TriggerArgs> {

    readonly [OBSERVABLE] = this;

    private readonly clearAfterTrigger: boolean;
    private readonly triggerContext   : TriggerContext;
    private readonly callbacks = new Array<Callback<TriggerContext, TriggerArgs>>();

    constructor(
                    ...args: [TriggerContext]|[TriggerContext, boolean]|(
                                    TriggerContext extends void
                                        ? []
                                        : never
                                    )
                ) {
        this.triggerContext    = args[0]!;
        this.clearAfterTrigger = args[1] ?? false;
    }

    canSkipTrigger() {
        this.compactCallbacks();
        return this.callbacks.length === 0;
    }

    call<A extends Prefixes<TriggerArgs>>(callback: Callback<TriggerContext, A>, ...args: A) {
        callback.apply(this.triggerContext, args);
    }

    trigger(...args: TriggerArgs) {

        // need to compact to avoid growing callback list.
        if( ! this.clearAfterTrigger )
            this.compactCallbacks();

        if( this.callbacks.length === 0) // opti.
            return;

        // we could bind...
        for(let i = 0; i < this.callbacks.length; ++i)
            this.callbacks[i].apply(this.triggerContext, args);

        if( this.clearAfterTrigger )
            this.clear();
    }

    has(callback: Callback<TriggerContext, TriggerArgs>) {
        return this.callbacks.includes(callback);
    }
    add(callback: Callback<TriggerContext, TriggerArgs>){
        this.callbacks.push(callback);
    }

    private removalPending = false;
    remove(callback: Callback<TriggerContext, TriggerArgs>): void {

        //TODO lazyRemove()...
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

    private compactCallbacks() {

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