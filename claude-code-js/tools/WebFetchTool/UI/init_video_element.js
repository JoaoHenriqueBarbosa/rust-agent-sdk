// var: init_video_element
var init_video_element = __esm(() => {
  init_element3();
  HTMLVideoElement = class HTMLVideoElement extends HTMLElement {
    constructor(ownerDocument, localName = "video") {
      super(ownerDocument, localName);
    }
  };
});
