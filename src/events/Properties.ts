import asRW from "@MWL/types/asRW";
import { createEvents, REvent } from "./Event";

type Property<T> = T;

export type RProperties<T extends Record<string, Property<any>>> = Readonly<T> & {
    events: {change: REvent<RProperties<T>>}
};
export type WProperties<T extends Record<string, Property<any>>> = T & {
    events: {change: REvent<unknown>}
};

export function Properties<T extends Record<string, Property<any>>>(desc: T) {

    class Properties {

        static readonly Descriptors = desc;
        
        //TODO: infer type if Descriptor is more complex than {[key]: T}
        protected readonly values: T = desc;
        readonly events = createEvents(this as any as RProperties<T>, "change");
    }

    for(const key in desc) {
        Object.defineProperty(Properties.prototype, key, {
            set: function (this: Properties, value: any) { 
                this.values[key] = value;
                asRW(this.events.change).trigger();
            },
            get: function (this: Properties) {
                return this.values[key]
            },
            enumerable: true
        })
    }

    return Properties as {
        readonly Descriptors: T,
        new (): Properties & T
    }
}


import "../types/asRW"
declare module "../types/asRW" {
    export default function asRW<T extends Record<string, unknown>>(ro: RProperties<T>): RProperties<T>&WProperties<T>
}