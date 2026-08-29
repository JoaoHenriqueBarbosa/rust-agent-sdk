// var: createRecord
var createRecord = (type, target, element, addedNodes, removedNodes, attributeName, oldValue) => ({
  type,
  target,
  addedNodes,
  removedNodes,
  attributeName,
  oldValue,
  previousSibling: element?.previousSibling || null,
  nextSibling: element?.nextSibling || null
}), queueAttribute = (observer, target, attributeName, attributeFilter, attributeOldValue, oldValue) => {
  if (!attributeFilter || attributeFilter.includes(attributeName)) {
    let { callback, records, scheduled } = observer;
    if (records.push(createRecord("attributes", target, null, [], [], attributeName, attributeOldValue ? oldValue : void 0)), !scheduled)
      observer.scheduled = !0, Promise.resolve().then(() => {
        observer.scheduled = !1, callback(records.splice(0), observer);
      });
  }
}, attributeChangedCallback2 = (element, attributeName, oldValue) => {
  let { ownerDocument } = element, { active, observers } = ownerDocument[MUTATION_OBSERVER];
  if (active) {
    for (let observer of observers)
      for (let [
        target,
        {
          childList,
          subtree,
          attributes,
          attributeFilter,
          attributeOldValue
        }
      ] of observer.nodes)
        if (childList) {
          if (subtree && (target === ownerDocument || target.contains(element)) || !subtree && target.children.includes(element)) {
            queueAttribute(observer, element, attributeName, attributeFilter, attributeOldValue, oldValue);
            break;
          }
        } else if (attributes && target === element) {
          queueAttribute(observer, element, attributeName, attributeFilter, attributeOldValue, oldValue);
          break;
        }
  }
}, moCallback = (element, parentNode) => {
  let { ownerDocument } = element, { active, observers } = ownerDocument[MUTATION_OBSERVER];
  if (active) {
    for (let observer of observers)
      for (let [target, { subtree, childList, characterData }] of observer.nodes)
        if (childList) {
          if (parentNode && (target === parentNode || subtree && target.contains(parentNode)) || !parentNode && (subtree && (target === ownerDocument || target.contains(element)) || !subtree && target[characterData ? "childNodes" : "children"].includes(element))) {
            let { callback, records, scheduled } = observer;
            if (records.push(createRecord("childList", target, element, parentNode ? [] : [element], parentNode ? [element] : [])), !scheduled)
              observer.scheduled = !0, Promise.resolve().then(() => {
                observer.scheduled = !1, callback(records.splice(0), observer);
              });
            break;
          }
        }
  }
};
