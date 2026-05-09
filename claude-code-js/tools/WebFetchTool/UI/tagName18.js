// var: tagName18
var tagName18 = "source", HTMLSourceElement;
var init_source_element = __esm(() => {
  init_register_html_class();
  init_attributes();
  init_element3();
  HTMLSourceElement = class HTMLSourceElement extends HTMLElement {
    constructor(ownerDocument, localName = tagName18) {
      super(ownerDocument, localName);
    }
    get src() {
      return stringAttribute.get(this, "src");
    }
    set src(value) {
      stringAttribute.set(this, "src", value);
    }
    get srcset() {
      return stringAttribute.get(this, "srcset");
    }
    set srcset(value) {
      stringAttribute.set(this, "srcset", value);
    }
    get sizes() {
      return stringAttribute.get(this, "sizes");
    }
    set sizes(value) {
      stringAttribute.set(this, "sizes", value);
    }
    get type() {
      return stringAttribute.get(this, "type");
    }
    set type(value) {
      stringAttribute.set(this, "type", value);
    }
  };
  registerHTMLClass(tagName18, HTMLSourceElement);
});
