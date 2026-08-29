// var: init_legend_element
var init_legend_element = __esm(() => {
  init_element3();
  HTMLLegendElement = class HTMLLegendElement extends HTMLElement {
    constructor(ownerDocument, localName = "legend") {
      super(ownerDocument, localName);
    }
  };
});
