export default function addCSS(shadow: ShadowRoot, css: string) {

    const style = new CSSStyleSheet();
    style.replaceSync(css); // .replace also possible (but async).
    shadow.adoptedStyleSheets.push( style );
}