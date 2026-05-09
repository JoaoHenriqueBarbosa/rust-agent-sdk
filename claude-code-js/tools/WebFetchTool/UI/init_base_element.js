// var: init_base_element
var init_base_element = __esm(() => {
  init_element3();
  HTMLBaseElement = class HTMLBaseElement extends HTMLElement {
    constructor(ownerDocument, localName = "base") {
      super(ownerDocument, localName);
    }
  };
});
