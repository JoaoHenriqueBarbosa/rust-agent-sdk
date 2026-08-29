// var: tagName10
var tagName10 = "select", HTMLSelectElement;
var init_select_element = __esm(() => {
  init_register_html_class();
  init_attributes();
  init_element3();
  init_node_list();
  HTMLSelectElement = class HTMLSelectElement extends HTMLElement {
    constructor(ownerDocument, localName = tagName10) {
      super(ownerDocument, localName);
    }
    get options() {
      let children = new NodeList, { firstElementChild } = this;
      while (firstElementChild) {
        if (firstElementChild.tagName === "OPTGROUP")
          children.push(...firstElementChild.children);
        else
          children.push(firstElementChild);
        firstElementChild = firstElementChild.nextElementSibling;
      }
      return children;
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
    get value() {
      return this.querySelector("option[selected]")?.value;
    }
  };
  registerHTMLClass(tagName10, HTMLSelectElement);
});
