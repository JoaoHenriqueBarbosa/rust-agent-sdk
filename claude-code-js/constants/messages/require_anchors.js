// var: require_anchors
var require_anchors = __commonJS((exports) => {
  var identity16 = require_identity(), visit2 = require_visit();
  function anchorIsValid(anchor) {
    if (/[\x00-\x19\s,[\]{}]/.test(anchor)) {
      let msg = `Anchor must not contain whitespace or control characters: ${JSON.stringify(anchor)}`;
      throw Error(msg);
    }
    return !0;
  }
  function anchorNames(root2) {
    let anchors = /* @__PURE__ */ new Set;
    return visit2.visit(root2, {
      Value(_key, node) {
        if (node.anchor)
          anchors.add(node.anchor);
      }
    }), anchors;
  }
  function findNewAnchor(prefix, exclude) {
    for (let i4 = 1;; ++i4) {
      let name3 = `${prefix}${i4}`;
      if (!exclude.has(name3))
        return name3;
    }
  }
  function createNodeAnchors(doc2, prefix) {
    let aliasObjects = [], sourceObjects = /* @__PURE__ */ new Map, prevAnchors = null;
    return {
      onAnchor: (source) => {
        aliasObjects.push(source), prevAnchors ?? (prevAnchors = anchorNames(doc2));
        let anchor = findNewAnchor(prefix, prevAnchors);
        return prevAnchors.add(anchor), anchor;
      },
      setAnchors: () => {
        for (let source of aliasObjects) {
          let ref = sourceObjects.get(source);
          if (typeof ref === "object" && ref.anchor && (identity16.isScalar(ref.node) || identity16.isCollection(ref.node)))
            ref.node.anchor = ref.anchor;
          else {
            let error44 = Error("Failed to resolve repeated object (this should not happen)");
            throw error44.source = source, error44;
          }
        }
      },
      sourceObjects
    };
  }
  exports.anchorIsValid = anchorIsValid;
  exports.anchorNames = anchorNames;
  exports.createNodeAnchors = createNodeAnchors;
  exports.findNewAnchor = findNewAnchor;
});
