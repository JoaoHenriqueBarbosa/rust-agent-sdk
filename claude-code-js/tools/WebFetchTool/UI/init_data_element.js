// var: init_data_element
var init_data_element = __esm(() => {
  init_element3();
  HTMLDataElement = class HTMLDataElement extends HTMLElement {
    constructor(ownerDocument, localName = "data") {
      super(ownerDocument, localName);
    }
  };
});
