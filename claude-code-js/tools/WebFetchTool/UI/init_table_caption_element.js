// var: init_table_caption_element
var init_table_caption_element = __esm(() => {
  init_element3();
  HTMLTableCaptionElement = class HTMLTableCaptionElement extends HTMLElement {
    constructor(ownerDocument, localName = "caption") {
      super(ownerDocument, localName);
    }
  };
});
