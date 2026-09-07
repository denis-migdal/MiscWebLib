import { Observable } from "./Observable";
import { CallbackRegistry, Callback } from "../CallbackRegistry";
import { MAIN_EVENT } from "./MAIN_EVENT";

type Observed<T extends Observable<any>> = T extends Observable<infer U>
                                            ? U
                                            : never;

export function listen<
                        T    extends Observable<object|null>
                    >(
                        target  : T,
                        callback: NoInfer<Callback<Observed<T>>>
                    ) {
    (target[MAIN_EVENT] as CallbackRegistry<Observed<T>>).add(callback);
}

export function observe<
                        T    extends object|null
                    >(
                        target  : Observable<T>,
                        callback: NoInfer<Callback<T>>
                    ) {

    (target[MAIN_EVENT] as CallbackRegistry<T>).add(callback);
    
    triggerCallback(target, callback);
}

// ==============

export function unlisten<
                        T    extends object|null,
                    >(
                        target  : Observable<T>,
                        callback: NoInfer<Callback<T>>
                    ) {
    (target[MAIN_EVENT]as CallbackRegistry<T>).remove(callback);
}

export const unobserve = unlisten;

// ==============

export function triggerCallback<T extends object|null> (
                        target  : Observable<T>,
                        callback: NoInfer<Callback<T>>,
                    ) {
    const ctx = (target[MAIN_EVENT] as CallbackRegistry<T>).getTriggerContext();
    callback.apply(ctx);
}