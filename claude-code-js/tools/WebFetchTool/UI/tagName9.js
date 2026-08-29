// var: tagName9
var tagName9 = "title", HTMLTitleElement;
var init_title_element = __esm(() => {
  init_register_html_class();
  init_text_element();
  HTMLTitleElement = class HTMLTitleElement extends TextElement {
    constructor(ownerDocument, localName = tagName9) {
      super(ownerDocument, localName);
    }
  };
  registerHTMLClass(tagName9, HTMLTitleElement);
});
