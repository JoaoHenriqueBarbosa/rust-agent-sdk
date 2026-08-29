// var: require_utils12
var require_utils12 = __commonJS((exports) => {
  var DOMException2 = require_DOMException(), ERR = DOMException2, isApiWritable = require_config().isApiWritable;
  exports.NAMESPACE = {
    HTML: "http://www.w3.org/1999/xhtml",
    XML: "http://www.w3.org/XML/1998/namespace",
    XMLNS: "http://www.w3.org/2000/xmlns/",
    MATHML: "http://www.w3.org/1998/Math/MathML",
    SVG: "http://www.w3.org/2000/svg",
    XLINK: "http://www.w3.org/1999/xlink"
  };
  exports.IndexSizeError = function() {
    throw new DOMException2(ERR.INDEX_SIZE_ERR);
  };
  exports.HierarchyRequestError = function() {
    throw new DOMException2(ERR.HIERARCHY_REQUEST_ERR);
  };
  exports.WrongDocumentError = function() {
    throw new DOMException2(ERR.WRONG_DOCUMENT_ERR);
  };
  exports.InvalidCharacterError = function() {
    throw new DOMException2(ERR.INVALID_CHARACTER_ERR);
  };
  exports.NoModificationAllowedError = function() {
    throw new DOMException2(ERR.NO_MODIFICATION_ALLOWED_ERR);
  };
  exports.NotFoundError = function() {
    throw new DOMException2(ERR.NOT_FOUND_ERR);
  };
  exports.NotSupportedError = function() {
    throw new DOMException2(ERR.NOT_SUPPORTED_ERR);
  };
  exports.InvalidStateError = function() {
    throw new DOMException2(ERR.INVALID_STATE_ERR);
  };
  exports.SyntaxError = function() {
    throw new DOMException2(ERR.SYNTAX_ERR);
  };
  exports.InvalidModificationError = function() {
    throw new DOMException2(ERR.INVALID_MODIFICATION_ERR);
  };
  exports.NamespaceError = function() {
    throw new DOMException2(ERR.NAMESPACE_ERR);
  };
  exports.InvalidAccessError = function() {
    throw new DOMException2(ERR.INVALID_ACCESS_ERR);
  };
  exports.TypeMismatchError = function() {
    throw new DOMException2(ERR.TYPE_MISMATCH_ERR);
  };
  exports.SecurityError = function() {
    throw new DOMException2(ERR.SECURITY_ERR);
  };
  exports.NetworkError = function() {
    throw new DOMException2(ERR.NETWORK_ERR);
  };
  exports.AbortError = function() {
    throw new DOMException2(ERR.ABORT_ERR);
  };
  exports.UrlMismatchError = function() {
    throw new DOMException2(ERR.URL_MISMATCH_ERR);
  };
  exports.QuotaExceededError = function() {
    throw new DOMException2(ERR.QUOTA_EXCEEDED_ERR);
  };
  exports.TimeoutError = function() {
    throw new DOMException2(ERR.TIMEOUT_ERR);
  };
  exports.InvalidNodeTypeError = function() {
    throw new DOMException2(ERR.INVALID_NODE_TYPE_ERR);
  };
  exports.DataCloneError = function() {
    throw new DOMException2(ERR.DATA_CLONE_ERR);
  };
  exports.nyi = function() {
    throw Error("NotYetImplemented");
  };
  exports.shouldOverride = function() {
    throw Error("Abstract function; should be overriding in subclass.");
  };
  exports.assert = function(expr, msg) {
    if (!expr)
      throw Error("Assertion failed: " + (msg || "") + `
` + Error().stack);
  };
  exports.expose = function(src, c3) {
    for (var n5 in src)
      Object.defineProperty(c3.prototype, n5, { value: src[n5], writable: isApiWritable });
  };
  exports.merge = function(a2, b) {
    for (var n5 in b)
      a2[n5] = b[n5];
  };
  exports.documentOrder = function(n5, m4) {
    return 3 - (n5.compareDocumentPosition(m4) & 6);
  };
  exports.toASCIILowerCase = function(s2) {
    return s2.replace(/[A-Z]+/g, function(c3) {
      return c3.toLowerCase();
    });
  };
  exports.toASCIIUpperCase = function(s2) {
    return s2.replace(/[a-z]+/g, function(c3) {
      return c3.toUpperCase();
    });
  };
});
