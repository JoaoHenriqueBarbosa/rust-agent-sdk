// var: require_lib9
var require_lib9 = __commonJS((exports) => {
  var DOMImplementation = require_DOMImplementation(), HTMLParser = require_HTMLParser(), Window = require_Window(), impl = require_impl();
  exports.createDOMImplementation = function() {
    return new DOMImplementation(null);
  };
  exports.createDocument = function(html2, force) {
    if (html2 || force) {
      var parser2 = new HTMLParser;
      return parser2.parse(html2 || "", !0), parser2.document();
    }
    return new DOMImplementation(null).createHTMLDocument("");
  };
  exports.createIncrementalHTMLParser = function() {
    var parser2 = new HTMLParser;
    return {
      write: function(s2) {
        if (s2.length > 0)
          parser2.parse(s2, !1, function() {
            return !0;
          });
      },
      end: function(s2) {
        parser2.parse(s2 || "", !0, function() {
          return !0;
        });
      },
      process: function(shouldPauseFunc) {
        return parser2.parse("", !1, shouldPauseFunc);
      },
      document: function() {
        return parser2.document();
      }
    };
  };
  exports.createWindow = function(html2, address) {
    var document2 = exports.createDocument(html2);
    if (address !== void 0)
      document2._address = address;
    return new impl.Window(document2);
  };
  exports.impl = impl;
});
