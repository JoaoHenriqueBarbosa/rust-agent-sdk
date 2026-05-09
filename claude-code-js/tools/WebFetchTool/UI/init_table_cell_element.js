// var: init_table_cell_element
var init_table_cell_element = __esm(() => {
  init_element3();
  HTMLTableCellElement = class HTMLTableCellElement extends HTMLElement {
    constructor(ownerDocument, localName = "td") {
      super(ownerDocument, localName);
    }
  };
});
