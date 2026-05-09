// var: tagName14
var tagName14 = "slot", HTMLSlotElement;
var init_slot_element = __esm(() => {
  init_element3();
  init_register_html_class();
  HTMLSlotElement = class HTMLSlotElement extends HTMLElement {
    constructor(ownerDocument, localName = tagName14) {
      super(ownerDocument, localName);
    }
    get name() {
      return this.getAttribute("name");
    }
    set name(value) {
      this.setAttribute("name", value);
    }
    assign() {}
    assignedNodes(options2) {
      let isNamedSlot = !!this.name, hostChildNodes = this.getRootNode().host?.childNodes ?? [], slottables;
      if (isNamedSlot)
        slottables = [...hostChildNodes].filter((node2) => node2.slot === this.name);
      else
        slottables = [...hostChildNodes].filter((node2) => !node2.slot);
      if (options2?.flatten) {
        let result = [];
        for (let slottable of slottables)
          if (slottable.localName === "slot")
            result.push(...slottable.assignedNodes({ flatten: !0 }));
          else
            result.push(slottable);
        slottables = result;
      }
      return slottables.length ? slottables : [...this.childNodes];
    }
    assignedElements(options2) {
      let slottables = this.assignedNodes(options2).filter((n5) => n5.nodeType === 1);
      return slottables.length ? slottables : [...this.children];
    }
  };
  registerHTMLClass(tagName14, HTMLSlotElement);
});
