// var: tagName
var tagName = "template", HTMLTemplateElement;
var init_template_element = __esm(() => {
  init_symbols();
  init_register_html_class();
  init_element3();
  HTMLTemplateElement = class HTMLTemplateElement extends HTMLElement {
    constructor(ownerDocument) {
      super(ownerDocument, tagName);
      let content = this.ownerDocument.createDocumentFragment();
      (this[CONTENT] = content)[PRIVATE] = this;
    }
    get content() {
      if (this.hasChildNodes() && !this[CONTENT].hasChildNodes())
        for (let node2 of this.childNodes)
          this[CONTENT].appendChild(node2.cloneNode(!0));
      return this[CONTENT];
    }
  };
  registerHTMLClass(tagName, HTMLTemplateElement);
});
