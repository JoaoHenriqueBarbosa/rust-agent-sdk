// var: init_audio_element
var init_audio_element = __esm(() => {
  init_element3();
  HTMLAudioElement = class HTMLAudioElement extends HTMLElement {
    constructor(ownerDocument, localName = "audio") {
      super(ownerDocument, localName);
    }
  };
});
