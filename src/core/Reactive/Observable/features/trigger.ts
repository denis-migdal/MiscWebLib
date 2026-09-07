import { TriggerableObservable, ClearableObservable } from "../contract";
import { ctrler } from "../contract/internals";

export function clear(target: ClearableObservable) {
    ctrler(target).clear();
}

export function trigger<
                            TriggerArgs extends any[] = []
                        >(
                            target: TriggerableObservable<TriggerArgs>,
                            ...args: NoInfer<TriggerArgs>
                        ) {

    return ctrler(target).trigger(...args);
}

export function triggerDrain<
                            TriggerArgs extends any[] = []
                        >(
                            target: TriggerableObservable<TriggerArgs>
                                  & ClearableObservable,
                            ...args: NoInfer<TriggerArgs>
                        ) {
    trigger(target, ...args);
    clear(target);
}

export function canSkipTrigger<
                                TriggerArgs extends any[] = []
                            >(target: TriggerableObservable<TriggerArgs>) {

    return ctrler(target).canSkipTrigger();
}