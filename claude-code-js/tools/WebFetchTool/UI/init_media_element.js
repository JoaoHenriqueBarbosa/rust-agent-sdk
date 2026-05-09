// var: init_media_element
var init_media_element = __esm(() => {
  init_element3();
  HTMLMediaElement = class HTMLMediaElement extends HTMLElement {
    constructor(ownerDocument, localName = "media") {
      super(ownerDocument, localName);
    }
  };
});
