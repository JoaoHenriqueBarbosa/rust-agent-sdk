// class: CustomElementRegistry
class CustomElementRegistry {
  constructor(ownerDocument) {
    this.ownerDocument = ownerDocument, this.registry = /* @__PURE__ */ new Map, this.waiting = /* @__PURE__ */ new Map, this.active = !1;
  }
  define(localName, Class2, options2 = {}) {
    let { ownerDocument, registry: registry2, waiting } = this;
    if (registry2.has(localName))
      throw Error("unable to redefine " + localName);
    if (Classes.has(Class2))
      throw Error("unable to redefine the same class: " + Class2);
    this.active = reactive = !0;
    let { extends: extend4 } = options2;
    Classes.set(Class2, {
      ownerDocument,
      options: { is: extend4 ? localName : "" },
      localName: extend4 || localName
    });
    let check3 = extend4 ? (element) => {
      return element.localName === extend4 && element.getAttribute("is") === localName;
    } : (element) => element.localName === localName;
    if (registry2.set(localName, { Class: Class2, check: check3 }), waiting.has(localName)) {
      for (let resolve35 of waiting.get(localName))
        resolve35(Class2);
      waiting.delete(localName);
    }
    ownerDocument.querySelectorAll(extend4 ? `${extend4}[is="${localName}"]` : localName).forEach(this.upgrade, this);
  }
  upgrade(element) {
    if (customElements.has(element))
      return;
    let { ownerDocument, registry: registry2 } = this, ce = element.getAttribute("is") || element.localName;
    if (registry2.has(ce)) {
      let { Class: Class2, check: check3 } = registry2.get(ce);
      if (check3(element)) {
        let { attributes, isConnected: isConnected2 } = element;
        for (let attr of attributes)
          element.removeAttributeNode(attr);
        let values3 = entries(element);
        for (let [key2] of values3)
          delete element[key2];
        setPrototypeOf(element, Class2.prototype), ownerDocument[UPGRADE] = { element, values: values3 }, new Class2(ownerDocument, ce), customElements.set(element, { connected: isConnected2 });
        for (let attr of attributes)
          element.setAttributeNode(attr);
        if (isConnected2 && element.connectedCallback)
          element.connectedCallback();
      }
    }
  }
  whenDefined(localName) {
    let { registry: registry2, waiting } = this;
    return new Promise((resolve35) => {
      if (registry2.has(localName))
        resolve35(registry2.get(localName).Class);
      else {
        if (!waiting.has(localName))
          waiting.set(localName, []);
        waiting.get(localName).push(resolve35);
      }
    });
  }
  get(localName) {
    let info = this.registry.get(localName);
    return info && info.Class;
  }
  getName(Class2) {
    if (Classes.has(Class2)) {
      let { localName } = Classes.get(Class2);
      return localName;
    }
    return null;
  }
}
