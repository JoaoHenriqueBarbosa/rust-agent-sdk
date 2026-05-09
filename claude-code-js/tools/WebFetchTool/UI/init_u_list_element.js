// var: init_u_list_element
var init_u_list_element = __esm(() => {
  init_element3();
  HTMLUListElement = class HTMLUListElement extends HTMLElement {
    constructor(ownerDocument, localName = "ul") {
      super(ownerDocument, localName);
    }
  };
});
