// var: tagName11
var tagName11 = "button", HTMLButtonElement;
var init_button_element = __esm(() => {
  init_register_html_class();
  init_attributes();
  init_element3();
  HTMLButtonElement = class HTMLButtonElement extends HTMLElement {
    constructor(ownerDocument, localName = tagName11) {
      super(ownerDocument, localName);
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
    get type() {
      return this.getAttribute("type");
    }
    set type(value) {
      this.setAttribute("type", value);
    }
  };
  registerHTMLClass(tagName11, HTMLButtonElement);
});
