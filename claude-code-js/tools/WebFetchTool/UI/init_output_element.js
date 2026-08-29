// var: init_output_element
var init_output_element = __esm(() => {
  init_element3();
  HTMLOutputElement = class HTMLOutputElement extends HTMLElement {
    constructor(ownerDocument, localName = "output") {
      super(ownerDocument, localName);
    }
  };
});
