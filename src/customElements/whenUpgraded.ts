export default async function whenUpgraded<T extends HTMLElement>(e: Element) {
    if( customElements.get(e.localName) === undefined )
        await customElements.whenDefined(e.localName);
    customElements.upgrade(e);
}