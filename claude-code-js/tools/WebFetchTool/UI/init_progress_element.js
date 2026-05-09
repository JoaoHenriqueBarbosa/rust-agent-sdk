// var: init_progress_element
var init_progress_element = __esm(() => {
  init_element3();
  HTMLProgressElement = class HTMLProgressElement extends HTMLElement {
    constructor(ownerDocument, localName = "progress") {
      super(ownerDocument, localName);
    }
  };
});
