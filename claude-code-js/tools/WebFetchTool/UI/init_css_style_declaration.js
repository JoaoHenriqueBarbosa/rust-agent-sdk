// var: init_css_style_declaration
var init_css_style_declaration = __esm(() => {
  init_symbols();
  refs2 = /* @__PURE__ */ new WeakMap, handler2 = {
    get(style, name3) {
      if (name3 in prototype2)
        return style[name3];
      if (updateKeys(style), name3 === "length")
        return getKeys(style).length;
      if (/^\d+$/.test(name3))
        return getKeys(style)[name3];
      return style.get(esm_default7(name3));
    },
    set(style, name3, value) {
      if (name3 === "cssText")
        style[name3] = value;
      else {
        let attr = updateKeys(style);
        if (value == null)
          style.delete(esm_default7(name3));
        else
          style.set(esm_default7(name3), value);
        if (!attr) {
          let element = refs2.get(style);
          attr = element.ownerDocument.createAttribute("style"), element.setAttributeNode(attr), style.set(PRIVATE, attr);
        }
        attr[CHANGED] = !1, attr[VALUE] = style.toString();
      }
      return !0;
    }
  };
  CSSStyleDeclaration = class CSSStyleDeclaration extends Map {
    constructor(element) {
      super();
      return refs2.set(this, element), new Proxy(this, handler2);
    }
    get cssText() {
      return this.toString();
    }
    set cssText(value) {
      refs2.get(this).setAttribute("style", value);
    }
    getPropertyValue(name3) {
      let self2 = this[PRIVATE];
      return handler2.get(self2, name3);
    }
    setProperty(name3, value) {
      let self2 = this[PRIVATE];
      handler2.set(self2, name3, value);
    }
    removeProperty(name3) {
      let self2 = this[PRIVATE];
      handler2.set(self2, name3, null);
    }
    [Symbol.iterator]() {
      let self2 = this[PRIVATE];
      updateKeys(self2);
      let keys3 = getKeys(self2), { length } = keys3, i5 = 0;
      return {
        next() {
          let done = i5 === length;
          return { done, value: done ? null : keys3[i5++] };
        }
      };
    }
    get [PRIVATE]() {
      return this;
    }
    toString() {
      let self2 = this[PRIVATE];
      updateKeys(self2);
      let cssText = [];
      return self2.forEach(push, cssText), cssText.join(";");
    }
  };
  ({ prototype: prototype2 } = CSSStyleDeclaration);
});
