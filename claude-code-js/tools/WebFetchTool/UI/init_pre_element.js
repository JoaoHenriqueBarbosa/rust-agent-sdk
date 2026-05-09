// var: init_pre_element
var init_pre_element = __esm(() => {
  init_element3();
  HTMLPreElement = class HTMLPreElement extends HTMLElement {
    constructor(ownerDocument, localName = "pre") {
      super(ownerDocument, localName);
    }
  };
});
