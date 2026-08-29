// var: init_mod_element
var init_mod_element = __esm(() => {
  init_element3();
  HTMLModElement = class HTMLModElement extends HTMLElement {
    constructor(ownerDocument, localName = "mod") {
      super(ownerDocument, localName);
    }
  };
});
