import style, {CSS}  from "./parsers/style";
import template, {HTML} from "./parsers/template";
import type {Cstr} from "../../types/Cstr";

type STYLE = CSS | CSS[];
type SHADOW_MODE = "open"|"closed"|null;

// TODO: Ressource<>
// import { isRessourceReady, Ressource, waitRessource } from "@LISS/src/utils/network/ressource"
// + readyness

export type ContentGenerator_Opts = {
    html?: HTML,
    css ?: STYLE,
    mode?: SHADOW_MODE
}

// TODO: static prop ?
const sharedCSS = new CSSStyleSheet();

export default class ContentGenerator {

    readonly mode: SHADOW_MODE;

    // TODO: for now we assume this is ready... (cf Ressource)

    constructor({html, css, mode = "closed"}: ContentGenerator_Opts) {
        
        this.prepare(html, css);
        this.mode = mode;
    }

    /** init content :
        - createContent : build the HTML
        - fillContent   : replace the HTML (uses createContent)
        - initContent   : initialize DOM (create shadow root + uses fillContent + CSS)
    **/
    initContent(target: HTMLElement) {

        let content: ShadowRoot|HTMLElement = target;
        if( this.mode !== null) {
            content = target.attachShadow({mode: this.mode});
            content.adoptedStyleSheets.push(sharedCSS, ...this.stylesheets);
        }
        
        this.fillContent(content);

        return content;
    }

    fillContent(target: ShadowRoot|HTMLElement|DocumentFragment) {
        
        if( this.template !== null)
            target.replaceChildren( this.createContent() );

        //TODO...
        customElements.upgrade(target);
    }

    createContent() {
        return this.template!.cloneNode(true);
    }

    /** process ressources **/
    
    protected stylesheets: CSSStyleSheet[]       = [];
    protected template   : DocumentFragment|null = null;

    protected prepare(html: HTML|undefined, css: STYLE|undefined) {
        if( html !== undefined )
            this.prepareTemplate(html);
        if( css  !== undefined )
            this.prepareStyle   (css);
    }

    protected prepareTemplate(html: HTML) {
        this.template = template(html);
    }
    protected prepareStyle(css: STYLE) {

        if( ! Array.isArray(css) )
            css = [css];

        this.stylesheets = css.map(e => style(e) );
    }
}

/**
 * Initialize the shadowRoot + add the protected content property.
 */
export function WithContent<T extends Cstr<HTMLElement>>(
                                                base : T,
                                            generator: ContentGenerator
                                        ) {

    return class WithContentMixin extends base {

        // enables generator override inside children classes.
        protected static Generator = generator;

        constructor(...args: any[]) {
            super(...args);
        }

        // this.constructor.Generator : get the lastest Generator.
        protected readonly content: ShadowRoot|HTMLElement = (this.constructor as typeof WithContentMixin).Generator.initContent(this);
    }
}