// var: init_span_element
var init_span_element = __esm(() => {
  init_element3();
  HTMLSpanElement = class HTMLSpanElement extends HTMLElement {
    constructor(ownerDocument, localName = "span") {
      super(ownerDocument, localName);
    }
  };
});
