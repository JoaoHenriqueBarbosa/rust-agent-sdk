// var: init_head_element
var init_head_element = __esm(() => {
  init_element3();
  HTMLHeadElement = class HTMLHeadElement extends HTMLElement {
    constructor(ownerDocument, localName = "head") {
      super(ownerDocument, localName);
    }
  };
});
