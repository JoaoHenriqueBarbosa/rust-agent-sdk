// var: init_picture_element
var init_picture_element = __esm(() => {
  init_element3();
  HTMLPictureElement = class HTMLPictureElement extends HTMLElement {
    constructor(ownerDocument, localName = "picture") {
      super(ownerDocument, localName);
    }
  };
});
