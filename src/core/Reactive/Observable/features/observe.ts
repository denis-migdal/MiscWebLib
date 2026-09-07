import { Callback, SubscribableObservable } from "../contract";
import { ctrler } from "../contract/internals";

export function listen<
                            This extends object|void     = void,
                            Args extends any[]           = []
                        >(
                        target  : SubscribableObservable<This, Args>,
                        callback: NoInfer<Callback<This, Args>>
                    ) {
    ctrler(target).add(callback);
}

export function observe<
                            This extends object|void     = void,
                        >(
                        target  : SubscribableObservable<This, []>,
                        callback: NoInfer<Callback<This, []>>
                    ) {
    listen(target, callback);
    ctrler(target).call(callback);
}

export function isListening<
                            This extends object|void     = void,
                            Args extends any[]           = []
                        >(
                        target  : SubscribableObservable<This, Args>,
                        callback: NoInfer<Callback<This, Args>>
                    ) {
    return ctrler(target).has(callback);
}

export function unlisten<
                            This extends object|void     = void,
                            Args extends any[]           = []
                        >(
                        target  : SubscribableObservable<This, Args>,
                        callback: NoInfer<Callback<This, Args>>
                    ) {
    ctrler(target).remove(callback);
}

export const unobserve = unlisten;