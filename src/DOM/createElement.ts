type Props = {
    class: string[]|string;
    style: Record<string, string>;
    attrs: Record<string, string>
};

export default function createElement(tagname: string, props: Partial<Props>) {

    const elem = document.createElement(tagname);

    let klass = props.class;
    if( klass !== undefined ) {
        if( ! Array.isArray(klass) ) klass = [klass];
        elem.classList.add(...klass);
    }


    let style = props.style;
    if( style !== undefined ) {
        Object.assign(elem.style, style);
    }

    const attrs = props.attrs;
    if( attrs !== undefined )
        for(let attrname in attrs)
            elem.setAttribute(attrname, attrs[attrname]);

    return elem;
}