// var: init_marquee_element
var init_marquee_element = __esm(() => {
  init_element3();
  HTMLMarqueeElement = class HTMLMarqueeElement extends HTMLElement {
    constructor(ownerDocument, localName = "marquee") {
      super(ownerDocument, localName);
    }
  };
});
