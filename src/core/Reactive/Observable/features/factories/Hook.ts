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

export function createOwnedHook<
                    Owner extends object,
                    Args extends any[] = []
                >(owner: Owner): Hook<{owner: Owner}, Args>
export function createOwnedHook<
                    Owner extends object,
                    Meta extends Record<string, any> = {},
                    Args extends any[]               = []
                >(owner: Owner, metadata: Meta): Hook<Meta & {owner: Owner}, Args>
export function createOwnedHook<
                    Owner extends object,
                    Meta extends Record<string, any> = {},
                    Args extends any[]               = []
                >(owner: Owner, metadata = {} as Meta): Hook<Meta & {owner: Owner}, Args> {
    
    return createHook({
        owner,
        ...metadata,
    });
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