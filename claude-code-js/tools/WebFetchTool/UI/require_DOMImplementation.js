// var: require_DOMImplementation
var require_DOMImplementation = __commonJS((exports, module) => {
  module.exports = DOMImplementation;
  var Document5 = require_Document2(), DocumentType3 = require_DocumentType(), HTMLParser = require_HTMLParser(), utils = require_utils12(), xml = require_xmlnames();
  function DOMImplementation(contextObject) {
    this.contextObject = contextObject;
  }
  var supportedFeatures = {
    xml: { "": !0, "1.0": !0, "2.0": !0 },
    core: { "": !0, "2.0": !0 },
    html: { "": !0, "1.0": !0, "2.0": !0 },
    xhtml: { "": !0, "1.0": !0, "2.0": !0 }
  };
  DOMImplementation.prototype = {
    hasFeature: function(feature, version5) {
      var f = supportedFeatures[(feature || "").toLowerCase()];
      return f && f[version5 || ""] || !1;
    },
    createDocumentType: function(qualifiedName, publicId, systemId) {
      if (!xml.isValidQName(qualifiedName))
        utils.InvalidCharacterError();
      return new DocumentType3(this.contextObject, qualifiedName, publicId, systemId);
    },
    createDocument: function(namespace, qualifiedName, doctype) {
      var d = new Document5(!1, null), e;
      if (qualifiedName)
        e = d.createElementNS(namespace, qualifiedName);
      else
        e = null;
      if (doctype)
        d.appendChild(doctype);
      if (e)
        d.appendChild(e);
      if (namespace === utils.NAMESPACE.HTML)
        d._contentType = "application/xhtml+xml";
      else if (namespace === utils.NAMESPACE.SVG)
        d._contentType = "image/svg+xml";
      else
        d._contentType = "application/xml";
      return d;
    },
    createHTMLDocument: function(titleText) {
      var d = new Document5(!0, null);
      d.appendChild(new DocumentType3(d, "html"));
      var html2 = d.createElement("html");
      d.appendChild(html2);
      var head = d.createElement("head");
      if (html2.appendChild(head), titleText !== void 0) {
        var title = d.createElement("title");
        head.appendChild(title), title.appendChild(d.createTextNode(titleText));
      }
      return html2.appendChild(d.createElement("body")), d.modclock = 1, d;
    },
    mozSetOutputMutationHandler: function(doc2, handler4) {
      doc2.mutationHandler = handler4;
    },
    mozGetInputMutationHandler: function(doc2) {
      utils.nyi();
    },
    mozHTMLParser: HTMLParser
  };
});
