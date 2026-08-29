// var: init_string_map
var init_string_map = __esm(() => {
  init_object2();
  refs = /* @__PURE__ */ new WeakMap, handler = {
    get(dataset, name3) {
      if (name3 in dataset)
        return refs.get(dataset).getAttribute(key2(name3));
    },
    set(dataset, name3, value) {
      return dataset[name3] = value, refs.get(dataset).setAttribute(key2(name3), value), !0;
    },
    deleteProperty(dataset, name3) {
      if (name3 in dataset)
        refs.get(dataset).removeAttribute(key2(name3));
      return delete dataset[name3];
    }
  };
  setPrototypeOf(DOMStringMap.prototype, null);
});
