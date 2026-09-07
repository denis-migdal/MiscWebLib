import { ReactiveProxy } from "../ReactiveObject/ReactiveObject";
import { PropertiesFactory, PropertiesType } from "./Properties";
import { Properties, PropertiesDescriptors } from "./PropertiesImpl";

export type WithProperties<T extends Record<string, any>> = {
    readonly properties  : Properties<T>;
} & T & ReactiveProxy<Properties<T>> & {toJSON(): Properties<T>};

export type WithPropertiesCstr<T extends Record<string, any>> = {
    new(initialValues?: Partial<T>): WithProperties<T>;
}

export function WithProperties<PD extends PropertiesDescriptors<any>>(
                    descriptors: PD & PropertiesDescriptors<PropertiesType<PD>>
                ): WithPropertiesCstr<PropertiesType<PD>>
                    & {
                        Descriptors: NoInfer<PD>
                    }
                
                {

    const Properties = PropertiesFactory(descriptors);

    return class WithProperties
                    extends ReactiveProxy<Properties<PropertiesType<PD>>> {

        static readonly Descriptors = descriptors;

        constructor(initialValues: Partial<PropertiesType<PD>> = {}) {
            // @ts-expect-error
            const properties  = Properties(initialValues);
            super(properties);

            // @ts-expect-error
            this.properties = properties;
        }

        toJSON() {
            return this.properties;
        }

        // for clean Object.keys() / JSON.stringify() / structuredClone()
        readonly properties: Properties<PropertiesType<PD>>;

        // for easier access
        static {
            for(const name in descriptors)
                Object.defineProperty(WithProperties.prototype, name, {
                    // not enumerable.
                    set(value: unknown) {
                        this.properties[name] = value;
                    },
                    get() {
                        return this.properties[name];
                    }
                })
        }
    } as any;
}