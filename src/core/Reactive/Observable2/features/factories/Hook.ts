import { OBSERVABLE } from "../../contract/internals";
import { Observable, ObservationController } from "../../contract/impl";
import { ObservableContext } from "../../contract";

export type Hook<
                T extends Record<string, any> = {},
                Args extends any[]            = []
            > = T & Observable<ObservableContext<T>, Args>;

export function createHook<
                    Meta extends Record<string, any> = {},
                    Args extends any[]               = []
                >(metadata: Meta): Hook<Meta, Args> {

    const context = {} as {invoker: Meta};

    const obsCtrler = new ObservationController<Readonly<typeof context>, Args>(context);

    const hook = {
        ...metadata,
        [OBSERVABLE]: obsCtrler
    };

    context.invoker = hook;

    return hook;
}

/////
// HookFactory
/////

type HookFactory<ARGS extends any[]> = {
    create<M extends Record<string, any>>(metadata: M): Hook<M, ARGS>;
};

const HookFactory = {
    create<M extends Record<string, any>>(metadata: M) {
        return createHook(metadata);
    }
} satisfies HookFactory<[]>;

export function hookFactory<ARGS extends any[]>() {
    return HookFactory as HookFactory<ARGS>;
}

/////
// Event
/////

//export const createEvent = createHook;
//type Event = Hook; //TODO...

/*
const x = hookFactory<[number]>().create({name: 34});
void x;
*/