// var: init_font_element
var init_font_element = __esm(() => {
  init_element3();
  HTMLFontElement = class HTMLFontElement extends HTMLElement {
    constructor(ownerDocument, localName = "font") {
      super(ownerDocument, localName);
    }
  };
});
