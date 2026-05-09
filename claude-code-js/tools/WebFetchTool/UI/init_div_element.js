// var: init_div_element
var init_div_element = __esm(() => {
  init_element3();
  HTMLDivElement = class HTMLDivElement extends HTMLElement {
    constructor(ownerDocument, localName = "div") {
      super(ownerDocument, localName);
    }
  };
});
