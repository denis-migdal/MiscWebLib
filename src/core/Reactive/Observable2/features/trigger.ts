import { TriggerableObservable } from "../contract";
import { ctrler } from "../contract/internals";

export function trigger<
                            TriggerArgs extends any[] = []
                        >(
                            target: TriggerableObservable<TriggerArgs>,
                            ...args: NoInfer<TriggerArgs>
                        ) {

    return ctrler(target).trigger(...args);
}

export function canSkipTrigger<
                                TriggerArgs extends any[] = []
                            >(target: TriggerableObservable<TriggerArgs>) {

    return ctrler(target).canSkipTrigger();
}