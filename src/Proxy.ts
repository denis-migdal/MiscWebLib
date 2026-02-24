type ProxyTarget<T extends Record<string, any>> = {
    get<K extends keyof T>(name: K): T[K];
    set<K extends keyof T>(name: K, value: T[NoInfer<K>]): void;
}

export default function createProxyClass<K extends string>(keys: K[]) {

    class Proxy<T extends Record<K, any>> {
        
        readonly target: ProxyTarget<T>;
        constructor(target: ProxyTarget<T>) {
            this.target = target;
        }
    }

    for(let i = 0; i < keys.length; ++i) {
        
        const key = keys[i];

        Object.defineProperty(Proxy.prototype, key, {

            enumerable: true,
            set: function (this: Proxy<Record<string,any>>, value: any) {
                this.target.set(key, value);
            },
            get: function (this: Proxy<Record<string,any>>) {
                return this.target.get(key);
            },
        })
    }

    return Proxy as {
        new<T extends Record<K, any>>(target: ProxyTarget<T>)
                                        : Proxy<Pick<T, K>> & Pick<T, K>
    };
}

/*
const P = createProxyClass(["ok", "foo"]);
const p = new P({} as ProxyTarget<{ok: 34, foo: "ok", faa:34}>);
*/