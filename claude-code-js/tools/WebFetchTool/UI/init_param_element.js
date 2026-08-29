// var: init_param_element
var init_param_element = __esm(() => {
  init_element3();
  HTMLParamElement = class HTMLParamElement extends HTMLElement {
    constructor(ownerDocument, localName = "param") {
      super(ownerDocument, localName);
    }
  };
});
