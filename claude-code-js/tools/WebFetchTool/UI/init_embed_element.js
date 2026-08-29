// var: init_embed_element
var init_embed_element = __esm(() => {
  init_element3();
  HTMLEmbedElement = class HTMLEmbedElement extends HTMLElement {
    constructor(ownerDocument, localName = "embed") {
      super(ownerDocument, localName);
    }
  };
});
