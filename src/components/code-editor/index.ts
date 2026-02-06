import ContentGenerator, {WithContent } from "../../customElements/content/ContentGenerator";
import define from "../../customElements/define";

const content = new ContentGenerator({
    html: "<div contenteditable></div>",
    css : require("!!raw-loader!./index.css").default,
})

//TODO value getter/setter + hooks
//TODO key hooks...
class CodeEditor extends WithContent(HTMLElement, content) {}

define(CodeEditor);