// var: init_meter_element
var init_meter_element = __esm(() => {
  init_element3();
  HTMLMeterElement = class HTMLMeterElement extends HTMLElement {
    constructor(ownerDocument, localName = "meter") {
      super(ownerDocument, localName);
    }
  };
});
