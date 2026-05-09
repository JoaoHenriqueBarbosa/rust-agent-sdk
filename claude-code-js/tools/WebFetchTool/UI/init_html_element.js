// var: init_html_element
var init_html_element = __esm(() => {
  init_element3();
  HTMLHtmlElement = class HTMLHtmlElement extends HTMLElement {
    constructor(ownerDocument, localName = "html") {
      super(ownerDocument, localName);
    }
  };
});
