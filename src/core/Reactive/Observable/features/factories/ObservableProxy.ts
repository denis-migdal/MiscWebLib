import { SubscribableObservable } from "../../contract";
import { OBSERVABLE } from "../../contract/internals";

export class ObservableProxy<
                                This extends object|void = void,
                                Args extends any[] = []
                            > implements SubscribableObservable<This, Args> {

    readonly [OBSERVABLE]: SubscribableObservable<This, Args>[OBSERVABLE];

    constructor(target: SubscribableObservable<This, Args>) {
        this[OBSERVABLE] = target[OBSERVABLE];
    }
}