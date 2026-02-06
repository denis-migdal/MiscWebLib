export default function addStyles(shadow: ShadowRoot, styles: CSSStyleSheet[]) {
    shadow.adoptedStyleSheets.push( ...styles );
}