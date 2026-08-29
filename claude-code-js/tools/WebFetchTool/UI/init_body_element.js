// var: init_body_element
var init_body_element = __esm(() => {
  init_element3();
  HTMLBodyElement = class HTMLBodyElement extends HTMLElement {
    constructor(ownerDocument, localName = "body") {
      super(ownerDocument, localName);
    }
  };
});
