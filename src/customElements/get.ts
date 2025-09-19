export default function get<T extends HTMLElement>(e    : Element,
                                                   sync?: false
                                                ) : Promise<T>
export default function get<T extends HTMLElement>(e   : Element,
                                                   sync: true
                                                ) : T
export default function get<T extends HTMLElement>(e   : Element,
                                                   sync: boolean = true
                                                ) : T|Promise<T> {
    
    if( e.ownerDocument !== document )
        document.adoptNode(e);

    if( customElements.get(e.localName) !== undefined ) {
        customElements.upgrade(e);
        return e as any;
    }

    if( sync === true)
        throw new Error(`${e.localName} isn't defined!`);

    const p = Promise.withResolvers<T>();
    customElements.whenDefined(e.localName).then( () => p.resolve(e as any) );
    return p.promise;
}