// var: init_time_element
var init_time_element = __esm(() => {
  init_attributes();
  init_register_html_class();
  init_element3();
  HTMLTimeElement = class HTMLTimeElement extends HTMLElement {
    constructor(ownerDocument, localName = "time") {
      super(ownerDocument, localName);
    }
    get dateTime() {
      return stringAttribute.get(this, "datetime");
    }
    set dateTime(value) {
      stringAttribute.set(this, "datetime", value);
    }
  };
  registerHTMLClass("time", HTMLTimeElement);
});
