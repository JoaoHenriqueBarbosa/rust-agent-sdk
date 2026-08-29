// var: init_details_element
var init_details_element = __esm(() => {
  init_element3();
  HTMLDetailsElement = class HTMLDetailsElement extends HTMLElement {
    constructor(ownerDocument, localName = "details") {
      super(ownerDocument, localName);
    }
  };
});
