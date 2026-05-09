// var: tagName6
var tagName6 = "h1", HTMLHeadingElement;
var init_heading_element = __esm(() => {
  init_register_html_class();
  init_element3();
  HTMLHeadingElement = class HTMLHeadingElement extends HTMLElement {
    constructor(ownerDocument, localName = tagName6) {
      super(ownerDocument, localName);
    }
  };
  registerHTMLClass([tagName6, "h2", "h3", "h4", "h5", "h6"], HTMLHeadingElement);
});
