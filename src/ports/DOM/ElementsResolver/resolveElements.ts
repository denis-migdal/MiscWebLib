import { Elements, ExtractionTarget } from "./core/types";

// throws if error.
export type Resolver<E extends HTMLElement>  = (element: HTMLElement) => E;
export type Resolvers<E extends Elements> = {
    [K in keyof E]: Resolver<E[K]>
}

export function resolveElements<E extends Elements>(
            target   : ExtractionTarget,
            resolvers: Resolvers<E>,
        ): E {

    const results = {} as E;

    for(const name in resolvers) {

        const element  = target.getElementById(name);
        __ASSERT__(element !== null, `Element #${name} not found.`);

        const resolved = resolvers[name](element)!;

        if( resolved !== element)
            element.replaceWith(resolved);

        results[name] = resolved;
    }

    return results;
}