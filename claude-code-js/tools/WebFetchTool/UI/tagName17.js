// var: tagName17
var tagName17 = "a", HTMLAnchorElement;
var init_anchor_element = __esm(() => {
  init_register_html_class();
  init_attributes();
  init_element3();
  HTMLAnchorElement = class HTMLAnchorElement extends HTMLElement {
    constructor(ownerDocument, localName = tagName17) {
      super(ownerDocument, localName);
    }
    get href() {
      return encodeURI(decodeURI(stringAttribute.get(this, "href"))).trim();
    }
    set href(value) {
      stringAttribute.set(this, "href", decodeURI(value));
    }
    get download() {
      return encodeURI(decodeURI(stringAttribute.get(this, "download")));
    }
    set download(value) {
      stringAttribute.set(this, "download", decodeURI(value));
    }
    get target() {
      return stringAttribute.get(this, "target");
    }
    set target(value) {
      stringAttribute.set(this, "target", value);
    }
    get type() {
      return stringAttribute.get(this, "type");
    }
    set type(value) {
      stringAttribute.set(this, "type", value);
    }
    get rel() {
      return stringAttribute.get(this, "rel");
    }
    set rel(value) {
      stringAttribute.set(this, "rel", value);
    }
  };
  registerHTMLClass(tagName17, HTMLAnchorElement);
});
