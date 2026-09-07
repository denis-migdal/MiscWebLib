import { Ctrler, ObservableWithCapacities } from "./internals";

//////
// Capacities
/////

export type SubscribableObservable<
        This extends object|void = void,
        Args extends any[]       = [],
    > = ObservableWithCapacities<{
        has   (callback: Callback<This, Args>): boolean;
        add   (callback: Callback<This, Args>): void;
        remove(callback: Callback<This, Args>): void;

        call<A extends Prefixes<Args>>(callback: Callback<This, A>, ...args: A): void;
    }>;

export type TriggerableObservable<
        TriggerArgs extends any[] = []
    > = ObservableWithCapacities<{
        trigger(...args: TriggerArgs): void;

        canSkipTrigger(): boolean;
    }>
type ClearableObservable = ObservableWithCapacities<{
        clear(): void;
    }>

export type Observable<
        This extends object|void     = void,
        Args extends any[]           = [],
        TriggerArgs extends any[]    = Args
    > =   SubscribableObservable<This, Args>
        & TriggerableObservable<TriggerArgs>
        & ClearableObservable;

//////
// Factories
/////

export type ObservableContext<T> = {readonly invoker: T};

export type ObservableClass = {
    new<
        This extends object|void = void,
        Args extends any[]       = []
    >(...args: [This]|(This extends void ? []: never)): Observable<This, Args>;
}

export type ObservationControllerClass = {
    new<
        This extends object|void = void,
        Args extends any[]       = []
    >(...args: [This]|(This extends void ? []: never)): Ctrler<Observable<This, Args>>;
}

//////
// Helpers
/////

export type Callback<  This extends object|void = void,
                Args extends any[]       = [],
            > = (this: This, ...args: Args) => void;

export type Prefixes<T extends any[], Acc extends any[] = []> =
    T extends [infer Head, ...infer Tail]
        ? Acc | Prefixes<Tail, [...Acc, Head]>
        : Acc;