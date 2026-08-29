// var: init_area_element
var init_area_element = __esm(() => {
  init_element3();
  HTMLAreaElement = class HTMLAreaElement extends HTMLElement {
    constructor(ownerDocument, localName = "area") {
      super(ownerDocument, localName);
    }
  };
});
