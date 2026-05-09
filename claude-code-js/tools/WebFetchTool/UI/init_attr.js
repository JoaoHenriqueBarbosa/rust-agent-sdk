// var: init_attr
var init_attr = __esm(() => {
  init_constants10();
  init_symbols();
  init_utils14();
  init_jsdon();
  init_attributes();
  init_mutation_observer();
  init_custom_element_registry();
  init_node11();
  init_text_escaper();
  QUOTE = /"/g;
  Attr = class Attr extends Node3 {
    constructor(ownerDocument, name3, value = "") {
      super(ownerDocument, name3, ATTRIBUTE_NODE);
      this.ownerElement = null, this.name = $String(name3), this[VALUE] = $String(value), this[CHANGED] = !1;
    }
    get value() {
      return this[VALUE];
    }
    set value(newValue) {
      let { [VALUE]: oldValue, name: name3, ownerElement } = this;
      if (this[VALUE] = $String(newValue), this[CHANGED] = !0, ownerElement)
        attributeChangedCallback2(ownerElement, name3, oldValue), attributeChangedCallback(ownerElement, name3, oldValue, this[VALUE]);
    }
    cloneNode() {
      let { ownerDocument, name: name3, [VALUE]: value } = this;
      return new Attr(ownerDocument, name3, value);
    }
    toString() {
      let { name: name3, [VALUE]: value } = this;
      if (emptyAttributes.has(name3) && !value)
        return ignoreCase(this) ? name3 : `${name3}=""`;
      let escapedValue = (ignoreCase(this) ? value : escape4(value)).replace(QUOTE, "&quot;");
      return `${name3}="${escapedValue}"`;
    }
    toJSON() {
      let json2 = [];
      return attrAsJSON(this, json2), json2;
    }
  };
});
