import { Observable } from "../../contract";
import { OBSERVABLE } from "../../contract/internals";

export class ObservableProxy<
                                This extends object|void = void,
                                Args extends any[] = []
                            > implements Observable<This, Args> {

    readonly [OBSERVABLE]: Observable<This, Args>[OBSERVABLE];

    constructor(target: Observable<This, Args>) {
        this[OBSERVABLE] = target[OBSERVABLE];
    }
}