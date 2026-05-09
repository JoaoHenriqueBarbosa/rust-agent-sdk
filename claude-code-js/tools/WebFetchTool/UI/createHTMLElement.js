// var: createHTMLElement
var createHTMLElement = (ownerDocument, builtin, localName, options2) => {
  if (!builtin && htmlClasses.has(localName))
    return new (htmlClasses.get(localName))(ownerDocument, localName);
  let { [CUSTOM_ELEMENTS]: { active, registry: registry2 } } = ownerDocument;
  if (active) {
    let ce = builtin ? options2.is : localName;
    if (registry2.has(ce)) {
      let { Class: Class2 } = registry2.get(ce), element = new Class2(ownerDocument, localName);
      return customElements.set(element, { connected: !1 }), element;
    }
  }
  return new HTMLElement(ownerDocument, localName);
}, HTMLDocument;
