export default function define(Klass            : {new(): HTMLElement},
                               tagname_or_prefix: string = "gui-") {

    let tagname = tagname_or_prefix;
    if( tagname_or_prefix[tagname_or_prefix.length-1] === '-') {
        tagname = tagname_or_prefix.slice(0, -1)
            + Klass.name.replaceAll(/([A-Z])/g, (a) => "-" + a.toLowerCase())
    }

    customElements.define(tagname, Klass);
}