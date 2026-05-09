// var: init_track_element
var init_track_element = __esm(() => {
  init_element3();
  HTMLTrackElement = class HTMLTrackElement extends HTMLElement {
    constructor(ownerDocument, localName = "track") {
      super(ownerDocument, localName);
    }
  };
});
