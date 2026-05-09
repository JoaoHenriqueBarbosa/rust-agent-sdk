// var: tagName15
var tagName15 = "img", HTMLImageElement;
var init_image_element = __esm(() => {
  init_register_html_class();
  init_attributes();
  init_element3();
  HTMLImageElement = class HTMLImageElement extends HTMLElement {
    constructor(ownerDocument, localName = tagName15) {
      super(ownerDocument, localName);
    }
    get alt() {
      return stringAttribute.get(this, "alt");
    }
    set alt(value) {
      stringAttribute.set(this, "alt", value);
    }
    get sizes() {
      return stringAttribute.get(this, "sizes");
    }
    set sizes(value) {
      stringAttribute.set(this, "sizes", value);
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
    get title() {
      return stringAttribute.get(this, "title");
    }
    set title(value) {
      stringAttribute.set(this, "title", value);
    }
    get width() {
      return numericAttribute.get(this, "width");
    }
    set width(value) {
      numericAttribute.set(this, "width", value);
    }
    get height() {
      return numericAttribute.get(this, "height");
    }
    set height(value) {
      numericAttribute.set(this, "height", value);
    }
  };
  registerHTMLClass(tagName15, HTMLImageElement);
});
