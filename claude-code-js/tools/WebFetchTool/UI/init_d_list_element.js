// var: init_d_list_element
var init_d_list_element = __esm(() => {
  init_element3();
  HTMLDListElement = class HTMLDListElement extends HTMLElement {
    constructor(ownerDocument, localName = "dl") {
      super(ownerDocument, localName);
    }
  };
});
