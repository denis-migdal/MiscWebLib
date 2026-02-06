/**
 * @param Klass 
 * @param tagname_or_prefix ending with "-" => is a prefix.
 */
export default function define(Klass            : {new(): HTMLElement},
                               tagname_or_prefix: string|null = null) {

    let prefix: string|null  = "";
    if( tagname_or_prefix !== null && tagname_or_prefix.at(-1) === "-" )
        prefix = tagname_or_prefix;

    let tagname = tagname_or_prefix!;
    if( tagname_or_prefix === null || prefix !== null )
        tagname = Klass.name.replaceAll(/([A-Z])/g, (a) => "-" + a.toLowerCase())
                            .slice(1);

    if( prefix !== null )
        tagname = prefix + tagname;

    customElements.define(tagname, Klass);
}