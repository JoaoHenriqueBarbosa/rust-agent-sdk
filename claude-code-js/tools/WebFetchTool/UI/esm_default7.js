// var: esm_default7
var esm_default7 = (camel) => camel.replace(/(([A-Z0-9])([A-Z0-9][a-z]))|(([a-z0-9]+)([A-Z]))/g, "$2$5-$3$6").toLowerCase();

// node_modules/linkedom/esm/dom/string-map.js
class DOMStringMap {
  constructor(ref) {
    for (let { name: name3, value } of ref.attributes)
      if (/^data-/.test(name3))
        this[prop(name3)] = value;
    return refs.set(this, ref), new Proxy(this, handler);
  }
}
