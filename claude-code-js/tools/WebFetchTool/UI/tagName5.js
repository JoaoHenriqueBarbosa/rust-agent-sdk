// var: tagName5
var tagName5 = "input", HTMLInputElement;
var init_input_element = __esm(() => {
  init_register_html_class();
  init_attributes();
  init_element3();
  HTMLInputElement = class HTMLInputElement extends HTMLElement {
    constructor(ownerDocument, localName = tagName5) {
      super(ownerDocument, localName);
    }
    get autofocus() {
      return booleanAttribute.get(this, "autofocus") || -1;
    }
    set autofocus(value) {
      booleanAttribute.set(this, "autofocus", value);
    }
    get disabled() {
      return booleanAttribute.get(this, "disabled");
    }
    set disabled(value) {
      booleanAttribute.set(this, "disabled", value);
    }
    get name() {
      return this.getAttribute("name");
    }
    set name(value) {
      this.setAttribute("name", value);
    }
    get placeholder() {
      return this.getAttribute("placeholder");
    }
    set placeholder(value) {
      this.setAttribute("placeholder", value);
    }
    get type() {
      return this.getAttribute("type");
    }
    set type(value) {
      this.setAttribute("type", value);
    }
    get value() {
      return stringAttribute.get(this, "value");
    }
    set value(value) {
      stringAttribute.set(this, "value", value);
    }
  };
  registerHTMLClass(tagName5, HTMLInputElement);
});
