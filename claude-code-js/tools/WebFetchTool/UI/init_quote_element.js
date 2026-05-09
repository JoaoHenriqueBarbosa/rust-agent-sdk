// var: init_quote_element
var init_quote_element = __esm(() => {
  init_element3();
  HTMLQuoteElement = class HTMLQuoteElement extends HTMLElement {
    constructor(ownerDocument, localName = "quote") {
      super(ownerDocument, localName);
    }
  };
});
