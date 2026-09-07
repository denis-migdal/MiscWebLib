import { ObservableObject, ObservableProxy } from "MWL@2026/exports/Reactive/Observable";
import { ReactiveNode } from "./ReactiveNode";
import { ObservableContext } from "../../Observable/contract";

export const REACTIVE_NODE = Symbol();

export class ReactiveObject extends ObservableObject {
    readonly [REACTIVE_NODE] = new ReactiveNode();
}

export class ReactiveProxy<T extends object|void> extends ObservableProxy<ObservableContext<T>> {
    readonly [REACTIVE_NODE]: ReactiveNode;
    constructor(target: ReactiveProxy<T>) {
        super(target);
        this[REACTIVE_NODE] = target[REACTIVE_NODE];
    }
}