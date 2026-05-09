// var: tagName13
var tagName13 = "link", HTMLLinkElement;
var init_link_element = __esm(() => {
  init_register_html_class();
  init_attributes();
  init_element3();
  HTMLLinkElement = class HTMLLinkElement extends HTMLElement {
    constructor(ownerDocument, localName = tagName13) {
      super(ownerDocument, localName);
    }
    get disabled() {
      return booleanAttribute.get(this, "disabled");
    }
    set disabled(value) {
      booleanAttribute.set(this, "disabled", value);
    }
    get href() {
      return stringAttribute.get(this, "href").trim();
    }
    set href(value) {
      stringAttribute.set(this, "href", value);
    }
    get hreflang() {
      return stringAttribute.get(this, "hreflang");
    }
    set hreflang(value) {
      stringAttribute.set(this, "hreflang", value);
    }
    get media() {
      return stringAttribute.get(this, "media");
    }
    set media(value) {
      stringAttribute.set(this, "media", value);
    }
    get rel() {
      return stringAttribute.get(this, "rel");
    }
    set rel(value) {
      stringAttribute.set(this, "rel", value);
    }
    get type() {
      return stringAttribute.get(this, "type");
    }
    set type(value) {
      stringAttribute.set(this, "type", value);
    }
  };
  registerHTMLClass(tagName13, HTMLLinkElement);
});
