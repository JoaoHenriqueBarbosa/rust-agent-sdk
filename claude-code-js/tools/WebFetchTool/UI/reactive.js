// var: reactive
var reactive = !1, Classes, customElements, attributeChangedCallback = (element, attributeName, oldValue, newValue) => {
  if (reactive && customElements.has(element) && element.attributeChangedCallback && element.constructor.observedAttributes.includes(attributeName))
    element.attributeChangedCallback(attributeName, oldValue, newValue);
}, createTrigger = (method, isConnected2) => (element) => {
  if (customElements.has(element)) {
    let info = customElements.get(element);
    if (info.connected !== isConnected2 && element.isConnected === isConnected2) {
      if (info.connected = isConnected2, method in element)
        element[method]();
    }
  }
}, triggerConnected, connectedCallback = (element) => {
  if (reactive) {
    if (triggerConnected(element), shadowRoots.has(element))
      element = shadowRoots.get(element).shadowRoot;
    let { [NEXT]: next, [END]: end } = element;
    while (next !== end) {
      if (next.nodeType === ELEMENT_NODE)
        triggerConnected(next);
      next = next[NEXT];
    }
  }
}, triggerDisconnected, disconnectedCallback = (element) => {
  if (reactive) {
    if (triggerDisconnected(element), shadowRoots.has(element))
      element = shadowRoots.get(element).shadowRoot;
    let { [NEXT]: next, [END]: end } = element;
    while (next !== end) {
      if (next.nodeType === ELEMENT_NODE)
        triggerDisconnected(next);
      next = next[NEXT];
    }
  }
};
