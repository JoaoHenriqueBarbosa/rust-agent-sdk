// var: init_hr_element
var init_hr_element = __esm(() => {
  init_element3();
  HTMLHRElement = class HTMLHRElement extends HTMLElement {
    constructor(ownerDocument, localName = "hr") {
      super(ownerDocument, localName);
    }
  };
});
