export default async function buildStyles(...css: string[]) {

    const styles   = new Array<CSSStyleSheet>(css.length);
    const promises = new Array<Promise<CSSStyleSheet>>(css.length);
    for(let i = 0; i < css.length; ++i) {
        styles[i] = new CSSStyleSheet();
        promises[i] = styles[i].replace(css[i]);
    }

    await Promise.all(promises);

    return styles;
}