// var: init_unknown_element
var init_unknown_element = __esm(() => {
  init_element3();
  HTMLUnknownElement = class HTMLUnknownElement extends HTMLElement {
    constructor(ownerDocument, localName = "unknown") {
      super(ownerDocument, localName);
    }
  };
});
