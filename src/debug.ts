const ID = Symbol();

// setID(target)
// cond && log(target, ...msg)

export function setID(o: {}, id: string){
    (o as any)[ID] = id;
}

export function getID(o: {}) {
    return (o as any)[ID] as string;
}

export function log(target: {},
                    ...msg: string[]) {

    const id = getID(target) || null;

    // to get the stack
    console.error(`[${id}]`, ...msg);
}