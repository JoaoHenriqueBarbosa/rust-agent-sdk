// var: require_xss
var require_xss = __commonJS((exports, module) => {
  var FilterCSS = require_lib7().FilterCSS, DEFAULT = require_default2(), parser2 = require_parser4(), parseTag = parser2.parseTag, parseAttr = parser2.parseAttr, _ = require_util6();
  function isNull(obj) {
    return obj === void 0 || obj === null;
  }
  function getAttrs(html2) {
    var i5 = _.spaceIndex(html2);
    if (i5 === -1)
      return {
        html: "",
        closing: html2[html2.length - 2] === "/"
      };
    html2 = _.trim(html2.slice(i5 + 1, -1));
    var isClosing = html2[html2.length - 1] === "/";
    if (isClosing)
      html2 = _.trim(html2.slice(0, -1));
    return {
      html: html2,
      closing: isClosing
    };
  }
  function shallowCopyObject(obj) {
    var ret = {};
    for (var i5 in obj)
      ret[i5] = obj[i5];
    return ret;
  }
  function keysToLowerCase(obj) {
    var ret = {};
    for (var i5 in obj)
      if (Array.isArray(obj[i5]))
        ret[i5.toLowerCase()] = obj[i5].map(function(item) {
          return item.toLowerCase();
        });
      else
        ret[i5.toLowerCase()] = obj[i5];
    return ret;
  }
  function FilterXSS(options2) {
    if (options2 = shallowCopyObject(options2 || {}), options2.stripIgnoreTag) {
      if (options2.onIgnoreTag)
        console.error('Notes: cannot use these two options "stripIgnoreTag" and "onIgnoreTag" at the same time');
      options2.onIgnoreTag = DEFAULT.onIgnoreTagStripAll;
    }
    if (options2.whiteList || options2.allowList)
      options2.whiteList = keysToLowerCase(options2.whiteList || options2.allowList);
    else
      options2.whiteList = DEFAULT.whiteList;
    if (this.attributeWrapSign = options2.singleQuotedAttributeValue === !0 ? "'" : DEFAULT.attributeWrapSign, options2.onTag = options2.onTag || DEFAULT.onTag, options2.onTagAttr = options2.onTagAttr || DEFAULT.onTagAttr, options2.onIgnoreTag = options2.onIgnoreTag || DEFAULT.onIgnoreTag, options2.onIgnoreTagAttr = options2.onIgnoreTagAttr || DEFAULT.onIgnoreTagAttr, options2.safeAttrValue = options2.safeAttrValue || DEFAULT.safeAttrValue, options2.escapeHtml = options2.escapeHtml || DEFAULT.escapeHtml, this.options = options2, options2.css === !1)
      this.cssFilter = !1;
    else
      options2.css = options2.css || {}, this.cssFilter = new FilterCSS(options2.css);
  }
  FilterXSS.prototype.process = function(html2) {
    if (html2 = html2 || "", html2 = html2.toString(), !html2)
      return "";
    var me = this, options2 = me.options, whiteList = options2.whiteList, onTag = options2.onTag, onIgnoreTag = options2.onIgnoreTag, onTagAttr = options2.onTagAttr, onIgnoreTagAttr = options2.onIgnoreTagAttr, safeAttrValue = options2.safeAttrValue, escapeHtml = options2.escapeHtml, attributeWrapSign = me.attributeWrapSign, cssFilter = me.cssFilter;
    if (options2.stripBlankChar)
      html2 = DEFAULT.stripBlankChar(html2);
    if (!options2.allowCommentTag)
      html2 = DEFAULT.stripCommentTag(html2);
    var stripIgnoreTagBody = !1;
    if (options2.stripIgnoreTagBody)
      stripIgnoreTagBody = DEFAULT.StripTagBody(options2.stripIgnoreTagBody, onIgnoreTag), onIgnoreTag = stripIgnoreTagBody.onIgnoreTag;
    var retHtml = parseTag(html2, function(sourcePosition, position, tag2, html3, isClosing) {
      var info = {
        sourcePosition,
        position,
        isClosing,
        isWhite: Object.prototype.hasOwnProperty.call(whiteList, tag2)
      }, ret = onTag(tag2, html3, info);
      if (!isNull(ret))
        return ret;
      if (info.isWhite) {
        if (info.isClosing)
          return "</" + tag2 + ">";
        var attrs = getAttrs(html3), whiteAttrList = whiteList[tag2], attrsHtml = parseAttr(attrs.html, function(name3, value) {
          var isWhiteAttr = _.indexOf(whiteAttrList, name3) !== -1, ret2 = onTagAttr(tag2, name3, value, isWhiteAttr);
          if (!isNull(ret2))
            return ret2;
          if (isWhiteAttr)
            if (value = safeAttrValue(tag2, name3, value, cssFilter), value)
              return name3 + "=" + attributeWrapSign + value + attributeWrapSign;
            else
              return name3;
          else {
            if (ret2 = onIgnoreTagAttr(tag2, name3, value, isWhiteAttr), !isNull(ret2))
              return ret2;
            return;
          }
        });
        if (html3 = "<" + tag2, attrsHtml)
          html3 += " " + attrsHtml;
        if (attrs.closing)
          html3 += " /";
        return html3 += ">", html3;
      } else {
        if (ret = onIgnoreTag(tag2, html3, info), !isNull(ret))
          return ret;
        return escapeHtml(html3);
      }
    }, escapeHtml);
    if (stripIgnoreTagBody)
      retHtml = stripIgnoreTagBody.remove(retHtml);
    return retHtml;
  };
  module.exports = FilterXSS;
});
