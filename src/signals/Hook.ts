import REvent from "./REvent";
import WEvent from "./WEvent";

const NOOP = () => {}

export function createHooks<T extends string>(...names: T[]) : Record<T, REvent> {

    const result: Record<string, Hook> = {};

    for(let i = 0; i < names.length; ++i)
        result[names[i]] = new Hook();

    return result;
}

export function triggerHook<K extends string>(target: { hooks: Record<K, REvent> },
                                              name: K) {

    (target.hooks[name] as Hook).trigger();
}

// Trigger re-entry = loop = dangerous.
// We need protections against suppressions during trigger.
export default class Hook implements REvent, WEvent {

    protected callbacks = new Array<() =>void>();
    private removalPending = false;
    private inTrigger = false;

    trigger(): void {

        // ensure no loop.
        if( this.inTrigger === true )
            throw new Error("Loop detected!");
        this.inTrigger = true;
        
        // compact if necessary.
        if( this.removalPending ) {

            let offset = 0;
            for(let i = 0; i < this.callbacks.length; ++i) {
                if( this.callbacks[i] !== NOOP)
                    this.callbacks[offset++] = this.callbacks[i];
            }

            this.callbacks.length = offset;
            this.removalPending = false;
        }

        for(let i = 0; i < this.callbacks.length; ++i)
            this.callbacks[i]();
    }

    addListener(callback: () => void): void {
        this.callbacks.push(callback);
    }

    removeListener(callback: () => void): void {

        const idx = this.callbacks.indexOf(callback);
        if( idx === -1)
            return;

        this.callbacks[idx] = NOOP;
        this.removalPending = true;
    }
}