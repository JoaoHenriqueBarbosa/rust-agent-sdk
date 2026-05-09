// var: require_Node
var require_Node = __commonJS((exports) => {
  var applyReviver = require_applyReviver(), identity16 = require_identity(), toJS = require_toJS();

  class NodeBase {
    constructor(type) {
      Object.defineProperty(this, identity16.NODE_TYPE, { value: type });
    }
    clone() {
      let copy = Object.create(Object.getPrototypeOf(this), Object.getOwnPropertyDescriptors(this));
      if (this.range)
        copy.range = this.range.slice();
      return copy;
    }
    toJS(doc2, { mapAsMap, maxAliasCount, onAnchor, reviver } = {}) {
      if (!identity16.isDocument(doc2))
        throw TypeError("A document argument is required");
      let ctx = {
        anchors: /* @__PURE__ */ new Map,
        doc: doc2,
        keep: !0,
        mapAsMap: mapAsMap === !0,
        mapKeyWarned: !1,
        maxAliasCount: typeof maxAliasCount === "number" ? maxAliasCount : 100
      }, res = toJS.toJS(this, "", ctx);
      if (typeof onAnchor === "function")
        for (let { count: count3, res: res2 } of ctx.anchors.values())
          onAnchor(res2, count3);
      return typeof reviver === "function" ? applyReviver.applyReviver(reviver, { "": res }, "", res) : res;
    }
  }
  exports.NodeBase = NodeBase;
});
