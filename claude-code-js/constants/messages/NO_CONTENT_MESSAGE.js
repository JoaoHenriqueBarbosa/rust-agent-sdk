// var: NO_CONTENT_MESSAGE
var NO_CONTENT_MESSAGE = "(no content)";

// node_modules/yaml/dist/nodes/identity.js
var require_identity = __commonJS((exports) => {
  var ALIAS = Symbol.for("yaml.alias"), DOC = Symbol.for("yaml.document"), MAP = Symbol.for("yaml.map"), PAIR = Symbol.for("yaml.pair"), SCALAR = Symbol.for("yaml.scalar"), SEQ = Symbol.for("yaml.seq"), NODE_TYPE = Symbol.for("yaml.node.type"), isAlias = (node) => !!node && typeof node === "object" && node[NODE_TYPE] === ALIAS, isDocument = (node) => !!node && typeof node === "object" && node[NODE_TYPE] === DOC, isMap2 = (node) => !!node && typeof node === "object" && node[NODE_TYPE] === MAP, isPair = (node) => !!node && typeof node === "object" && node[NODE_TYPE] === PAIR, isScalar = (node) => !!node && typeof node === "object" && node[NODE_TYPE] === SCALAR, isSeq = (node) => !!node && typeof node === "object" && node[NODE_TYPE] === SEQ;
  function isCollection(node) {
    if (node && typeof node === "object")
      switch (node[NODE_TYPE]) {
        case MAP:
        case SEQ:
          return !0;
      }
    return !1;
  }
  function isNode2(node) {
    if (node && typeof node === "object")
      switch (node[NODE_TYPE]) {
        case ALIAS:
        case MAP:
        case SCALAR:
        case SEQ:
          return !0;
      }
    return !1;
  }
  var hasAnchor = (node) => (isScalar(node) || isCollection(node)) && !!node.anchor;
  exports.ALIAS = ALIAS;
  exports.DOC = DOC;
  exports.MAP = MAP;
  exports.NODE_TYPE = NODE_TYPE;
  exports.PAIR = PAIR;
  exports.SCALAR = SCALAR;
  exports.SEQ = SEQ;
  exports.hasAnchor = hasAnchor;
  exports.isAlias = isAlias;
  exports.isCollection = isCollection;
  exports.isDocument = isDocument;
  exports.isMap = isMap2;
  exports.isNode = isNode2;
  exports.isPair = isPair;
  exports.isScalar = isScalar;
  exports.isSeq = isSeq;
});
