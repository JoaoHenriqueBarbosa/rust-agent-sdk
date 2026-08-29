// var: require_Collection
var require_Collection = __commonJS((exports) => {
  var createNode2 = require_createNode(), identity16 = require_identity(), Node2 = require_Node();
  function collectionFromPath(schema5, path12, value) {
    let v2 = value;
    for (let i4 = path12.length - 1;i4 >= 0; --i4) {
      let k3 = path12[i4];
      if (typeof k3 === "number" && Number.isInteger(k3) && k3 >= 0) {
        let a2 = [];
        a2[k3] = v2, v2 = a2;
      } else
        v2 = /* @__PURE__ */ new Map([[k3, v2]]);
    }
    return createNode2.createNode(v2, void 0, {
      aliasDuplicateObjects: !1,
      keepUndefined: !1,
      onAnchor: () => {
        throw Error("This should not happen, please report a bug.");
      },
      schema: schema5,
      sourceObjects: /* @__PURE__ */ new Map
    });
  }
  var isEmptyPath = (path12) => path12 == null || typeof path12 === "object" && !!path12[Symbol.iterator]().next().done;

  class Collection extends Node2.NodeBase {
    constructor(type, schema5) {
      super(type);
      Object.defineProperty(this, "schema", {
        value: schema5,
        configurable: !0,
        enumerable: !1,
        writable: !0
      });
    }
    clone(schema5) {
      let copy = Object.create(Object.getPrototypeOf(this), Object.getOwnPropertyDescriptors(this));
      if (schema5)
        copy.schema = schema5;
      if (copy.items = copy.items.map((it) => identity16.isNode(it) || identity16.isPair(it) ? it.clone(schema5) : it), this.range)
        copy.range = this.range.slice();
      return copy;
    }
    addIn(path12, value) {
      if (isEmptyPath(path12))
        this.add(value);
      else {
        let [key, ...rest] = path12, node = this.get(key, !0);
        if (identity16.isCollection(node))
          node.addIn(rest, value);
        else if (node === void 0 && this.schema)
          this.set(key, collectionFromPath(this.schema, rest, value));
        else
          throw Error(`Expected YAML collection at ${key}. Remaining path: ${rest}`);
      }
    }
    deleteIn(path12) {
      let [key, ...rest] = path12;
      if (rest.length === 0)
        return this.delete(key);
      let node = this.get(key, !0);
      if (identity16.isCollection(node))
        return node.deleteIn(rest);
      else
        throw Error(`Expected YAML collection at ${key}. Remaining path: ${rest}`);
    }
    getIn(path12, keepScalar) {
      let [key, ...rest] = path12, node = this.get(key, !0);
      if (rest.length === 0)
        return !keepScalar && identity16.isScalar(node) ? node.value : node;
      else
        return identity16.isCollection(node) ? node.getIn(rest, keepScalar) : void 0;
    }
    hasAllNullValues(allowScalar) {
      return this.items.every((node) => {
        if (!identity16.isPair(node))
          return !1;
        let n5 = node.value;
        return n5 == null || allowScalar && identity16.isScalar(n5) && n5.value == null && !n5.commentBefore && !n5.comment && !n5.tag;
      });
    }
    hasIn(path12) {
      let [key, ...rest] = path12;
      if (rest.length === 0)
        return this.has(key);
      let node = this.get(key, !0);
      return identity16.isCollection(node) ? node.hasIn(rest) : !1;
    }
    setIn(path12, value) {
      let [key, ...rest] = path12;
      if (rest.length === 0)
        this.set(key, value);
      else {
        let node = this.get(key, !0);
        if (identity16.isCollection(node))
          node.setIn(rest, value);
        else if (node === void 0 && this.schema)
          this.set(key, collectionFromPath(this.schema, rest, value));
        else
          throw Error(`Expected YAML collection at ${key}. Remaining path: ${rest}`);
      }
    }
  }
  exports.Collection = Collection;
  exports.collectionFromPath = collectionFromPath;
  exports.isEmptyPath = isEmptyPath;
});
