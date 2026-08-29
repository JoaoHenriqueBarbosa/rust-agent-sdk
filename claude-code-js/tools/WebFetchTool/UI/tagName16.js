// var: tagName16
var tagName16 = "meta", HTMLMetaElement;
var init_meta_element = __esm(() => {
  init_element3();
  init_register_html_class();
  init_attributes();
  HTMLMetaElement = class HTMLMetaElement extends HTMLElement {
    constructor(ownerDocument, localName = tagName16) {
      super(ownerDocument, localName);
    }
    get name() {
      return stringAttribute.get(this, "name");
    }
    set name(value) {
      stringAttribute.set(this, "name", value);
    }
    get httpEquiv() {
      return stringAttribute.get(this, "http-equiv");
    }
    set httpEquiv(value) {
      stringAttribute.set(this, "http-equiv", value);
    }
    get content() {
      return stringAttribute.get(this, "content");
    }
    set content(value) {
      stringAttribute.set(this, "content", value);
    }
    get charset() {
      return stringAttribute.get(this, "charset");
    }
    set charset(value) {
      stringAttribute.set(this, "charset", value);
    }
    get media() {
      return stringAttribute.get(this, "media");
    }
    set media(value) {
      stringAttribute.set(this, "media", value);
    }
  };
  registerHTMLClass(tagName16, HTMLMetaElement);
});
