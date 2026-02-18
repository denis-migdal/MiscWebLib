
type Property<T> = T;

export function Properties<T extends Record<string, Property<any>>>(desc: T) {

    class Properties {

        static readonly Descriptors = desc;
        
        //TODO...
        protected readonly values: T = desc;
        
        protected readonly onChange: () => void;
        constructor(onChange: () => void) {
            this.onChange = onChange;
        }

        setProperties(vals: Partial<T>) {
            Object.assign(this.values, vals);
            this.onChange();
        }
    }

    for(const key in desc) {
        Object.defineProperty(Properties.prototype, key, {
            set: function (this: Properties, value: any) { 
                this.values[key] = value;
                this.onChange();
            },
            get: function (this: Properties) {
                return this.values[key]
            },
            enumerable: true
        })
    }

    return Properties as {
        readonly Descriptors: T,
        new (onChange: () => void): Properties & T
    }
}

export function trigger<T extends Object>(target: T, name: string) {

    const method = `on${name[0].toUpperCase() + name.slice(1)}`;

    // @ts-ignore
    return target[method]();
}

export function listenChange(target: unknown, callback: () => void) {
    const t = target as any as {onChange: () => void };
    const p = t.onChange;

    //TODO: better
    t.onChange = () => {
        p();
        callback();
    }
}

export function setProperty<T extends Readonly<Record<string, any>>, N extends keyof T>(target: T, name: N, value: T[N]) {
    target[name] = value;
}