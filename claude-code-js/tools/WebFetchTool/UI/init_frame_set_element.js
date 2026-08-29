// var: init_frame_set_element
var init_frame_set_element = __esm(() => {
  init_element3();
  HTMLFrameSetElement = class HTMLFrameSetElement extends HTMLElement {
    constructor(ownerDocument, localName = "frameset") {
      super(ownerDocument, localName);
    }
  };
});
