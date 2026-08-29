// var: init_map_element
var init_map_element = __esm(() => {
  init_element3();
  HTMLMapElement = class HTMLMapElement extends HTMLElement {
    constructor(ownerDocument, localName = "map") {
      super(ownerDocument, localName);
    }
  };
});
