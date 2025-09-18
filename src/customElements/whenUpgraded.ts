export default async function whenUpgraded<T extends HTMLElement>(e: Element) {
    
    if( e.ownerDocument !== document )
        document.adoptNode(e);
    
    if( customElements.get(e.localName) === undefined )
        await customElements.whenDefined(e.localName);
    customElements.upgrade(e);
}