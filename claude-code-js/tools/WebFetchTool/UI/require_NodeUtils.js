// var: require_NodeUtils
var require_NodeUtils = __commonJS((exports, module) => {
  module.exports = {
    serializeOne,
    \u{275}escapeMatchingClosingTag: escapeMatchingClosingTag,
    \u{275}escapeClosingCommentTag: escapeClosingCommentTag,
    \u{275}escapeProcessingInstructionContent: escapeProcessingInstructionContent
  };
  var utils = require_utils12(), NAMESPACE = utils.NAMESPACE, hasRawContent2 = {
    STYLE: !0,
    SCRIPT: !0,
    XMP: !0,
    IFRAME: !0,
    NOEMBED: !0,
    NOFRAMES: !0,
    PLAINTEXT: !0
  }, emptyElements = {
    area: !0,
    base: !0,
    basefont: !0,
    bgsound: !0,
    br: !0,
    col: !0,
    embed: !0,
    frame: !0,
    hr: !0,
    img: !0,
    input: !0,
    keygen: !0,
    link: !0,
    meta: !0,
    param: !0,
    source: !0,
    track: !0,
    wbr: !0
  }, extraNewLine = {}, ESCAPE_REGEXP = /[&<>\u00A0]/g, ESCAPE_ATTR_REGEXP = /[&"<>\u00A0]/g;
  function escape5(s2) {
    if (!ESCAPE_REGEXP.test(s2))
      return s2;
    return s2.replace(ESCAPE_REGEXP, (c3) => {
      switch (c3) {
        case "&":
          return "&amp;";
        case "<":
          return "&lt;";
        case ">":
          return "&gt;";
        case "\xA0":
          return "&nbsp;";
      }
    });
  }
  function escapeAttr(s2) {
    if (!ESCAPE_ATTR_REGEXP.test(s2))
      return s2;
    return s2.replace(ESCAPE_ATTR_REGEXP, (c3) => {
      switch (c3) {
        case "<":
          return "&lt;";
        case ">":
          return "&gt;";
        case "&":
          return "&amp;";
        case '"':
          return "&quot;";
        case "\xA0":
          return "&nbsp;";
      }
    });
  }
  function attrname(a2) {
    var ns = a2.namespaceURI;
    if (!ns)
      return a2.localName;
    if (ns === NAMESPACE.XML)
      return "xml:" + a2.localName;
    if (ns === NAMESPACE.XLINK)
      return "xlink:" + a2.localName;
    if (ns === NAMESPACE.XMLNS)
      if (a2.localName === "xmlns")
        return "xmlns";
      else
        return "xmlns:" + a2.localName;
    return a2.name;
  }
  function escapeMatchingClosingTag(rawText, parentTag) {
    let parentClosingTag = "</" + parentTag;
    if (!rawText.toLowerCase().includes(parentClosingTag))
      return rawText;
    let result = [...rawText], matches2 = rawText.matchAll(new RegExp(parentClosingTag, "ig"));
    for (let match of matches2)
      result[match.index] = "&lt;";
    return result.join("");
  }
  var CLOSING_COMMENT_REGEXP = /--!?>/;
  function escapeClosingCommentTag(rawContent2) {
    if (!CLOSING_COMMENT_REGEXP.test(rawContent2))
      return rawContent2;
    return rawContent2.replace(/(--\!?)>/g, "$1&gt;");
  }
  function escapeProcessingInstructionContent(rawContent2) {
    return rawContent2.includes(">") ? rawContent2.replaceAll(">", "&gt;") : rawContent2;
  }
  function serializeOne(kid, parent2) {
    var s2 = "";
    switch (kid.nodeType) {
      case 1:
        var ns = kid.namespaceURI, html2 = ns === NAMESPACE.HTML, tagname = html2 || ns === NAMESPACE.SVG || ns === NAMESPACE.MATHML ? kid.localName : kid.tagName;
        s2 += "<" + tagname;
        for (var j4 = 0, k3 = kid._numattrs;j4 < k3; j4++) {
          var a2 = kid._attr(j4);
          if (s2 += " " + attrname(a2), a2.value !== void 0)
            s2 += '="' + escapeAttr(a2.value) + '"';
        }
        if (s2 += ">", !(html2 && emptyElements[tagname])) {
          var ss = kid.serialize();
          if (hasRawContent2[tagname.toUpperCase()])
            ss = escapeMatchingClosingTag(ss, tagname);
          if (html2 && extraNewLine[tagname] && ss.charAt(0) === `
`)
            s2 += `
`;
          s2 += ss, s2 += "</" + tagname + ">";
        }
        break;
      case 3:
      case 4:
        var parenttag;
        if (parent2.nodeType === 1 && parent2.namespaceURI === NAMESPACE.HTML)
          parenttag = parent2.tagName;
        else
          parenttag = "";
        if (hasRawContent2[parenttag] || parenttag === "NOSCRIPT" && parent2.ownerDocument._scripting_enabled)
          s2 += kid.data;
        else
          s2 += escape5(kid.data);
        break;
      case 8:
        s2 += "<!--" + escapeClosingCommentTag(kid.data) + "-->";
        break;
      case 7:
        let content = escapeProcessingInstructionContent(kid.data);
        s2 += "<?" + kid.target + " " + content + "?>";
        break;
      case 10:
        s2 += "<!DOCTYPE " + kid.name, s2 += ">";
        break;
      default:
        utils.InvalidStateError();
    }
    return s2;
  }
});
