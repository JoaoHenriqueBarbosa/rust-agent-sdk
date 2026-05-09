// var: init_menu_element
var init_menu_element = __esm(() => {
  init_element3();
  HTMLMenuElement = class HTMLMenuElement extends HTMLElement {
    constructor(ownerDocument, localName = "menu") {
      super(ownerDocument, localName);
    }
  };
});
