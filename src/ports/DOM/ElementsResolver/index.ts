import { Cstr, isClass } from "MWL@2026/core/types";
import { FCT_NULL_OBJ } from "MWL@2026/core/types/NullObjects";

import { Elements, ExtractionTarget } from "./core/types";
import {resolveElements, Resolver, Resolvers } from "./resolveElements";
import {classResolver} from "./resolvers/classResolver";
import {instanceResolver} from "./resolvers/instanceResolver";

type Descriptors<E extends Elements> = {
    [K in keyof E]: Resolver<E[K]>|Cstr<E[K]>|E[K]
}

export {type Elements} from "./core/types";
export {Descriptors as ElementsDescriptors};

export class ElementsResolver<E extends Elements> {

    private readonly resolvers: Resolvers<E>;

    constructor(descriptors: Descriptors<E>) {

        this.resolvers = {} as Resolvers<E>;
        for(const name in descriptors) {

            let descriptor = descriptors[name];

            if( isClass(descriptor) )
                // @ts-expect-error
                descriptor = classResolver(descriptor);
            else if( typeof descriptor !== "function" )
                // @ts-expect-error
                descriptor = instanceResolver(descriptor);
            
            // @ts-expect-error
            this.resolvers[name] = descriptor;
        }
    }

    resolve(target: ExtractionTarget) {
        return resolveElements(target, this.resolvers);
    }
}

export function resolve<E extends Elements>(
                        target: ExtractionTarget,
                        descriptors: Descriptors<E>
                    ) {
    const resolver = new ElementsResolver(descriptors);
    return resolver.resolve(target);
}

export function createResolver<E extends Elements>(
                                        descriptors?: Descriptors<E>
                                    ) {

    // opti
    if( descriptors === undefined || isEmptyObject(descriptors) )
        return FCT_NULL_OBJ<E>;

    const resolver = new ElementsResolver(descriptors);
    
    return (target: ExtractionTarget) => resolver.resolve(target);
}

//TODO: move ?
function isEmptyObject(obj: object) {
  return Object.keys(obj).length === 0;
}