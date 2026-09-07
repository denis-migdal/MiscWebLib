import { Observable, ObservableContext } from "../../contract";
import { ObservationController } from "../../contract/impl";
import { OBSERVABLE } from "../../contract/internals";

export class ObservableObject<Args extends any[] = []>
                                    implements Observable<any, Args> {

    readonly [OBSERVABLE] = new ObservationController<ObservableContext<this>, Args>({invoker: this});
}