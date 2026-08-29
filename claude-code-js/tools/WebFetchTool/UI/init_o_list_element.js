// var: init_o_list_element
var init_o_list_element = __esm(() => {
  init_element3();
  HTMLOListElement = class HTMLOListElement extends HTMLElement {
    constructor(ownerDocument, localName = "ol") {
      super(ownerDocument, localName);
    }
  };
});
