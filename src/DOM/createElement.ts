export default function createElement(tagname: string, attrs: Record<string, string>) {

    const elem = document.createElement(tagname);

    for(let attrname in attrs)
        elem.setAttribute(attrname, attrs[attrname]);

    return elem;
}