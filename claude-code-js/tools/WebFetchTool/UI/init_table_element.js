// var: init_table_element
var init_table_element = __esm(() => {
  init_element3();
  HTMLTableElement = class HTMLTableElement extends HTMLElement {
    constructor(ownerDocument, localName = "table") {
      super(ownerDocument, localName);
    }
  };
});
