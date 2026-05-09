// var: init_br_element
var init_br_element = __esm(() => {
  init_element3();
  HTMLBRElement = class HTMLBRElement extends HTMLElement {
    constructor(ownerDocument, localName = "br") {
      super(ownerDocument, localName);
    }
  };
});
