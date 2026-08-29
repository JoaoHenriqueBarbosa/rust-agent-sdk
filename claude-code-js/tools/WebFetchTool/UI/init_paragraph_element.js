// var: init_paragraph_element
var init_paragraph_element = __esm(() => {
  init_element3();
  HTMLParagraphElement = class HTMLParagraphElement extends HTMLElement {
    constructor(ownerDocument, localName = "p") {
      super(ownerDocument, localName);
    }
  };
});
