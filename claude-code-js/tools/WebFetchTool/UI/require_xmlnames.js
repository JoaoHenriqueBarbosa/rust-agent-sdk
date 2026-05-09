// var: require_xmlnames
var require_xmlnames = __commonJS((exports) => {
  exports.isValidName = isValidName;
  exports.isValidQName = isValidQName;
  var simplename = /^[_:A-Za-z][-.:\w]+$/, simpleqname = /^([_A-Za-z][-.\w]+|[_A-Za-z][-.\w]+:[_A-Za-z][-.\w]+)$/, ncnamestartchars = "_A-Za-z\xC0-\xD6\xD8-\xF6\xF8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD", ncnamechars = "-._A-Za-z0-9\xB7\xC0-\xD6\xD8-\xF6\xF8-\u02FF\u0300-\u037D\u037F-\u1FFF\u200C\u200D\u203F\u2040\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD", ncname = "[" + ncnamestartchars + "][" + ncnamechars + "]*", namestartchars = ncnamestartchars + ":", namechars = ncnamechars + ":", name3 = new RegExp("^[" + namestartchars + "][" + namechars + "]*$"), qname = new RegExp("^(" + ncname + "|" + ncname + ":" + ncname + ")$"), hassurrogates = /[\uD800-\uDB7F\uDC00-\uDFFF]/, surrogatechars = /[\uD800-\uDB7F\uDC00-\uDFFF]/g, surrogatepairs = /[\uD800-\uDB7F][\uDC00-\uDFFF]/g;
  ncnamestartchars += "\uD800-\uDB7F\uDC00-\uDFFF";
  ncnamechars += "\uD800-\uDB7F\uDC00-\uDFFF";
  ncname = "[" + ncnamestartchars + "][" + ncnamechars + "]*";
  namestartchars = ncnamestartchars + ":";
  namechars = ncnamechars + ":";
  var surrogatename = new RegExp("^[" + namestartchars + "][" + namechars + "]*$"), surrogateqname = new RegExp("^(" + ncname + "|" + ncname + ":" + ncname + ")$");
  function isValidName(s2) {
    if (simplename.test(s2))
      return !0;
    if (name3.test(s2))
      return !0;
    if (!hassurrogates.test(s2))
      return !1;
    if (!surrogatename.test(s2))
      return !1;
    var chars = s2.match(surrogatechars), pairs = s2.match(surrogatepairs);
    return pairs !== null && 2 * pairs.length === chars.length;
  }
  function isValidQName(s2) {
    if (simpleqname.test(s2))
      return !0;
    if (qname.test(s2))
      return !0;
    if (!hassurrogates.test(s2))
      return !1;
    if (!surrogateqname.test(s2))
      return !1;
    var chars = s2.match(surrogatechars), pairs = s2.match(surrogatepairs);
    return pairs !== null && 2 * pairs.length === chars.length;
  }
});
