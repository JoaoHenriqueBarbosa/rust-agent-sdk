// var: init_li_element
var init_li_element = __esm(() => {
  init_element3();
  HTMLLIElement = class HTMLLIElement extends HTMLElement {
    constructor(ownerDocument, localName = "li") {
      super(ownerDocument, localName);
    }
  };
});
