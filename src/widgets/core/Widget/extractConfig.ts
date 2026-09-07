import { NULL_OBJ } from "MWL@2026/core/types";

// short and can't be used in CSS (so no risks of collisions).
const CFG_ATTR_PREFIX = "@";

export function extractConfig<D extends Record<string,any>>(
                                                target: HTMLElement,
                                                override: Partial<D>
                                            ) {

    if( override !== NULL_OBJ )
        return override;

    let props: Partial<D> = {};

    const attrs = [...target.attributes];

    for(let i = 0; i < attrs.length; ++i) {

        console.warn(attrs[i].name);

        if( ! attrs[i].name.startsWith(CFG_ATTR_PREFIX) )
            continue;

        const key   = attrs[i].name.slice(CFG_ATTR_PREFIX.length);
        const value = parse(attrs[i].value);

        // @ts-expect-error
        props[key] = value;
    }

    return props;
}

const NUMBER_REGEX = /^[+-]?(?:\d+\.?\d*|\.\d+)$/;

function parse(str: string) {
    if( str === "null")
        return null;
    if( str === "true")
        return true;
    if( str === "false")
        return false;

    if( NUMBER_REGEX.test(str) )
        return Number(str);

    return str;
}