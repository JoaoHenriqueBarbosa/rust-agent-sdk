// var: init_opt_group_element
var init_opt_group_element = __esm(() => {
  init_element3();
  HTMLOptGroupElement = class HTMLOptGroupElement extends HTMLElement {
    constructor(ownerDocument, localName = "optgroup") {
      super(ownerDocument, localName);
    }
  };
});
