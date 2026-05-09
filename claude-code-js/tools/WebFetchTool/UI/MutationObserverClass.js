// class: MutationObserverClass
class MutationObserverClass {
  constructor(ownerDocument) {
    let observers = /* @__PURE__ */ new Set;
    this.observers = observers, this.active = !1, this.class = class {
      constructor(callback) {
        this.callback = callback, this.nodes = /* @__PURE__ */ new Map, this.records = [], this.scheduled = !1;
      }
      disconnect() {
        this.records.splice(0), this.nodes.clear(), observers.delete(this), ownerDocument[MUTATION_OBSERVER].active = !!observers.size;
      }
      observe(target, options2 = {
        subtree: !1,
        childList: !1,
        attributes: !1,
        attributeFilter: null,
        attributeOldValue: !1,
        characterData: !1
      }) {
        if ("attributeOldValue" in options2 || "attributeFilter" in options2)
          options2.attributes = !0;
        options2.childList = !!options2.childList, options2.subtree = !!options2.subtree, this.nodes.set(target, options2), observers.add(this), ownerDocument[MUTATION_OBSERVER].active = !0;
      }
      takeRecords() {
        return this.records.splice(0);
      }
    };
  }
}
