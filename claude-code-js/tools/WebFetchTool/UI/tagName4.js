// var: tagName4
var tagName4 = "style", HTMLStyleElement;
var init_style_element = __esm(() => {
  init_lib2();
  init_register_html_class();
  init_symbols();
  init_text_element();
  HTMLStyleElement = class HTMLStyleElement extends TextElement {
    constructor(ownerDocument, localName = tagName4) {
      super(ownerDocument, localName);
      this[SHEET] = null;
    }
    get sheet() {
      let sheet = this[SHEET];
      if (sheet !== null)
        return sheet;
      return this[SHEET] = $parse(this.textContent);
    }
    get innerHTML() {
      return super.innerHTML || "";
    }
    set innerHTML(value) {
      super.textContent = value, this[SHEET] = null;
    }
    get innerText() {
      return super.innerText || "";
    }
    set innerText(value) {
      super.textContent = value, this[SHEET] = null;
    }
    get textContent() {
      return super.textContent || "";
    }
    set textContent(value) {
      super.textContent = value, this[SHEET] = null;
    }
  };
  registerHTMLClass(tagName4, HTMLStyleElement);
});
