export default async function get<T extends HTMLElement>(e: Element)
                                                             : Promise<T> {
    
    if( e.ownerDocument !== document )
        document.adoptNode(e);
    
    if( customElements.get(e.localName) === undefined )
        await customElements.whenDefined(e.localName);
    
    customElements.upgrade(e);

    return e as any;
}