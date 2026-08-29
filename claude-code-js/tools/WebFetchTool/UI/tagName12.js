// var: tagName12
var tagName12 = "textarea", HTMLTextAreaElement;
var init_text_area_element = __esm(() => {
  init_register_html_class();
  init_attributes();
  init_text_element();
  HTMLTextAreaElement = class HTMLTextAreaElement extends TextElement {
    constructor(ownerDocument, localName = tagName12) {
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
      return this.textContent;
    }
    set value(content) {
      this.textContent = content;
    }
  };
  registerHTMLClass(tagName12, HTMLTextAreaElement);
});
