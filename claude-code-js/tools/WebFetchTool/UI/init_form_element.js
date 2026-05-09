// var: init_form_element
var init_form_element = __esm(() => {
  init_element3();
  HTMLFormElement = class HTMLFormElement extends HTMLElement {
    constructor(ownerDocument, localName = "form") {
      super(ownerDocument, localName);
    }
  };
});
