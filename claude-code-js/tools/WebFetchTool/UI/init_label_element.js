// var: init_label_element
var init_label_element = __esm(() => {
  init_element3();
  HTMLLabelElement = class HTMLLabelElement extends HTMLElement {
    constructor(ownerDocument, localName = "label") {
      super(ownerDocument, localName);
    }
  };
});
