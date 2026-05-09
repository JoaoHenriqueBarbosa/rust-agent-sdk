// var: init_object_element
var init_object_element = __esm(() => {
  init_element3();
  HTMLObjectElement = class HTMLObjectElement extends HTMLElement {
    constructor(ownerDocument, localName = "object") {
      super(ownerDocument, localName);
    }
  };
});
