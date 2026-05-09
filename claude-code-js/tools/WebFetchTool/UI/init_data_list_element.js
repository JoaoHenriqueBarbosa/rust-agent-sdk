// var: init_data_list_element
var init_data_list_element = __esm(() => {
  init_element3();
  HTMLDataListElement = class HTMLDataListElement extends HTMLElement {
    constructor(ownerDocument, localName = "datalist") {
      super(ownerDocument, localName);
    }
  };
});
