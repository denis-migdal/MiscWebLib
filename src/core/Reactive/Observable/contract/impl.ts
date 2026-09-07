import { ObservableClass, Observable as ObservableContract, ObservationControllerClass} from "./";
import { CallbackRegistry } from "../impl/CallbackRegistry";

// do not leak impl.
export const Observable: ObservableClass = CallbackRegistry;
// re-export type and merge it with value.
export type  Observable<This extends object|void = void, Args extends any[] = []> = ObservableContract<This, Args>;

export const ObservationController: ObservationControllerClass = CallbackRegistry;
