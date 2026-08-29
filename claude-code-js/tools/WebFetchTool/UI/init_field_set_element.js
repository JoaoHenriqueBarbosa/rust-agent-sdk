// var: init_field_set_element
var init_field_set_element = __esm(() => {
  init_element3();
  HTMLFieldSetElement = class HTMLFieldSetElement extends HTMLElement {
    constructor(ownerDocument, localName = "fieldset") {
      super(ownerDocument, localName);
    }
  };
});
