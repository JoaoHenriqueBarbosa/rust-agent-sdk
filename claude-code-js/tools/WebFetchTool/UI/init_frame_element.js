// var: init_frame_element
var init_frame_element = __esm(() => {
  init_element3();
  HTMLFrameElement = class HTMLFrameElement extends HTMLElement {
    constructor(ownerDocument, localName = "frame") {
      super(ownerDocument, localName);
    }
  };
});
