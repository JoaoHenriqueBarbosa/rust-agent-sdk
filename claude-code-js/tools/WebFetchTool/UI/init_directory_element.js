// var: init_directory_element
var init_directory_element = __esm(() => {
  init_element3();
  HTMLDirectoryElement = class HTMLDirectoryElement extends HTMLElement {
    constructor(ownerDocument, localName = "dir") {
      super(ownerDocument, localName);
    }
  };
});
