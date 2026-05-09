// var: init_table_row_element
var init_table_row_element = __esm(() => {
  init_element3();
  HTMLTableRowElement = class HTMLTableRowElement extends HTMLElement {
    constructor(ownerDocument, localName = "tr") {
      super(ownerDocument, localName);
    }
  };
});
