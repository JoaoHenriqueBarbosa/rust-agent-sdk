// var: tagName8
var tagName8 = "option", HTMLOptionElement;
var init_option_element = __esm(() => {
  init_element3();
  init_attributes();
  init_register_html_class();
  HTMLOptionElement = class HTMLOptionElement extends HTMLElement {
    constructor(ownerDocument, localName = tagName8) {
      super(ownerDocument, localName);
    }
    get value() {
      return stringAttribute.get(this, "value");
    }
    set value(value) {
      stringAttribute.set(this, "value", value);
    }
    get selected() {
      return booleanAttribute.get(this, "selected");
    }
    set selected(value) {
      let option = this.parentElement?.querySelector("option[selected]");
      if (option && option !== this)
        option.selected = !1;
      booleanAttribute.set(this, "selected", value);
    }
  };
  registerHTMLClass(tagName8, HTMLOptionElement);
});
