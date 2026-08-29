// var: require_default2
var require_default2 = __commonJS((exports) => {
  var FilterCSS = require_lib7().FilterCSS, getDefaultCSSWhiteList = require_lib7().getDefaultWhiteList, _ = require_util6();
  function getDefaultWhiteList() {
    return {
      a: ["target", "href", "title"],
      abbr: ["title"],
      address: [],
      area: ["shape", "coords", "href", "alt"],
      article: [],
      aside: [],
      audio: [
        "autoplay",
        "controls",
        "crossorigin",
        "loop",
        "muted",
        "preload",
        "src"
      ],
      b: [],
      bdi: ["dir"],
      bdo: ["dir"],
      big: [],
      blockquote: ["cite"],
      br: [],
      caption: [],
      center: [],
      cite: [],
      code: [],
      col: ["align", "valign", "span", "width"],
      colgroup: ["align", "valign", "span", "width"],
      dd: [],
      del: ["datetime"],
      details: ["open"],
      div: [],
      dl: [],
      dt: [],
      em: [],
      figcaption: [],
      figure: [],
      font: ["color", "size", "face"],
      footer: [],
      h1: [],
      h2: [],
      h3: [],
      h4: [],
      h5: [],
      h6: [],
      header: [],
      hr: [],
      i: [],
      img: ["src", "alt", "title", "width", "height", "loading"],
      ins: ["datetime"],
      kbd: [],
      li: [],
      mark: [],
      nav: [],
      ol: [],
      p: [],
      pre: [],
      s: [],
      section: [],
      small: [],
      span: [],
      sub: [],
      summary: [],
      sup: [],
      strong: [],
      strike: [],
      table: ["width", "border", "align", "valign"],
      tbody: ["align", "valign"],
      td: ["width", "rowspan", "colspan", "align", "valign"],
      tfoot: ["align", "valign"],
      th: ["width", "rowspan", "colspan", "align", "valign"],
      thead: ["align", "valign"],
      tr: ["rowspan", "align", "valign"],
      tt: [],
      u: [],
      ul: [],
      video: [
        "autoplay",
        "controls",
        "crossorigin",
        "loop",
        "muted",
        "playsinline",
        "poster",
        "preload",
        "src",
        "height",
        "width"
      ]
    };
  }
  var defaultCSSFilter = new FilterCSS;
  function onTag(tag2, html2, options2) {}
  function onIgnoreTag(tag2, html2, options2) {}
  function onTagAttr(tag2, name3, value) {}
  function onIgnoreTagAttr(tag2, name3, value) {}
  function escapeHtml(html2) {
    return html2.replace(REGEXP_LT, "&lt;").replace(REGEXP_GT, "&gt;");
  }
  function safeAttrValue(tag2, name3, value, cssFilter) {
    if (value = friendlyAttrValue(value), name3 === "href" || name3 === "src") {
      if (value = _.trim(value), value === "#")
        return "#";
      if (!(value.substr(0, 7) === "http://" || value.substr(0, 8) === "https://" || value.substr(0, 7) === "mailto:" || value.substr(0, 4) === "tel:" || value.substr(0, 11) === "data:image/" || value.substr(0, 6) === "ftp://" || value.substr(0, 2) === "./" || value.substr(0, 3) === "../" || value[0] === "#" || value[0] === "/"))
        return "";
    } else if (name3 === "background") {
      if (REGEXP_DEFAULT_ON_TAG_ATTR_4.lastIndex = 0, REGEXP_DEFAULT_ON_TAG_ATTR_4.test(value))
        return "";
    } else if (name3 === "style") {
      if (REGEXP_DEFAULT_ON_TAG_ATTR_7.lastIndex = 0, REGEXP_DEFAULT_ON_TAG_ATTR_7.test(value))
        return "";
      if (REGEXP_DEFAULT_ON_TAG_ATTR_8.lastIndex = 0, REGEXP_DEFAULT_ON_TAG_ATTR_8.test(value)) {
        if (REGEXP_DEFAULT_ON_TAG_ATTR_4.lastIndex = 0, REGEXP_DEFAULT_ON_TAG_ATTR_4.test(value))
          return "";
      }
      if (cssFilter !== !1)
        cssFilter = cssFilter || defaultCSSFilter, value = cssFilter.process(value);
    }
    return value = escapeAttrValue(value), value;
  }
  var REGEXP_LT = /</g, REGEXP_GT = />/g, REGEXP_QUOTE = /"/g, REGEXP_QUOTE_2 = /&quot;/g, REGEXP_ATTR_VALUE_1 = /&#([a-zA-Z0-9]*);?/gim, REGEXP_ATTR_VALUE_COLON = /&colon;?/gim, REGEXP_ATTR_VALUE_NEWLINE = /&newline;?/gim, REGEXP_DEFAULT_ON_TAG_ATTR_4 = /((j\s*a\s*v\s*a|v\s*b|l\s*i\s*v\s*e)\s*s\s*c\s*r\s*i\s*p\s*t\s*|m\s*o\s*c\s*h\s*a):/gi, REGEXP_DEFAULT_ON_TAG_ATTR_7 = /e\s*x\s*p\s*r\s*e\s*s\s*s\s*i\s*o\s*n\s*\(.*/gi, REGEXP_DEFAULT_ON_TAG_ATTR_8 = /u\s*r\s*l\s*\(.*/gi;
  function escapeQuote(str2) {
    return str2.replace(REGEXP_QUOTE, "&quot;");
  }
  function unescapeQuote(str2) {
    return str2.replace(REGEXP_QUOTE_2, '"');
  }
  function escapeHtmlEntities(str2) {
    return str2.replace(REGEXP_ATTR_VALUE_1, function(str3, code) {
      return code[0] === "x" || code[0] === "X" ? String.fromCharCode(parseInt(code.substr(1), 16)) : String.fromCharCode(parseInt(code, 10));
    });
  }
  function escapeDangerHtml5Entities(str2) {
    return str2.replace(REGEXP_ATTR_VALUE_COLON, ":").replace(REGEXP_ATTR_VALUE_NEWLINE, " ");
  }
  function clearNonPrintableCharacter(str2) {
    var str22 = "";
    for (var i5 = 0, len = str2.length;i5 < len; i5++)
      str22 += str2.charCodeAt(i5) < 32 ? " " : str2.charAt(i5);
    return _.trim(str22);
  }
  function friendlyAttrValue(str2) {
    return str2 = unescapeQuote(str2), str2 = escapeHtmlEntities(str2), str2 = escapeDangerHtml5Entities(str2), str2 = clearNonPrintableCharacter(str2), str2;
  }
  function escapeAttrValue(str2) {
    return str2 = escapeQuote(str2), str2 = escapeHtml(str2), str2;
  }
  function onIgnoreTagStripAll() {
    return "";
  }
  function StripTagBody(tags, next) {
    if (typeof next !== "function")
      next = function() {};
    var isRemoveAllTag = !Array.isArray(tags);
    function isRemoveTag(tag2) {
      if (isRemoveAllTag)
        return !0;
      return _.indexOf(tags, tag2) !== -1;
    }
    var removeList = [], posStart = !1;
    return {
      onIgnoreTag: function(tag2, html2, options2) {
        if (isRemoveTag(tag2))
          if (options2.isClosing) {
            var ret = "[/removed]", end = options2.position + ret.length;
            return removeList.push([
              posStart !== !1 ? posStart : options2.position,
              end
            ]), posStart = !1, ret;
          } else {
            if (!posStart)
              posStart = options2.position;
            return "[removed]";
          }
        else
          return next(tag2, html2, options2);
      },
      remove: function(html2) {
        var rethtml = "", lastPos = 0;
        return _.forEach(removeList, function(pos) {
          rethtml += html2.slice(lastPos, pos[0]), lastPos = pos[1];
        }), rethtml += html2.slice(lastPos), rethtml;
      }
    };
  }
  function stripCommentTag(html2) {
    var retHtml = "", lastPos = 0;
    while (lastPos < html2.length) {
      var i5 = html2.indexOf("<!--", lastPos);
      if (i5 === -1) {
        retHtml += html2.slice(lastPos);
        break;
      }
      retHtml += html2.slice(lastPos, i5);
      var j4 = html2.indexOf("-->", i5);
      if (j4 === -1)
        break;
      lastPos = j4 + 3;
    }
    return retHtml;
  }
  function stripBlankChar(html2) {
    var chars = html2.split("");
    return chars = chars.filter(function(char) {
      var c3 = char.charCodeAt(0);
      if (c3 === 127)
        return !1;
      if (c3 <= 31) {
        if (c3 === 10 || c3 === 13)
          return !0;
        return !1;
      }
      return !0;
    }), chars.join("");
  }
  exports.whiteList = getDefaultWhiteList();
  exports.getDefaultWhiteList = getDefaultWhiteList;
  exports.onTag = onTag;
  exports.onIgnoreTag = onIgnoreTag;
  exports.onTagAttr = onTagAttr;
  exports.onIgnoreTagAttr = onIgnoreTagAttr;
  exports.safeAttrValue = safeAttrValue;
  exports.escapeHtml = escapeHtml;
  exports.escapeQuote = escapeQuote;
  exports.unescapeQuote = unescapeQuote;
  exports.escapeHtmlEntities = escapeHtmlEntities;
  exports.escapeDangerHtml5Entities = escapeDangerHtml5Entities;
  exports.clearNonPrintableCharacter = clearNonPrintableCharacter;
  exports.friendlyAttrValue = friendlyAttrValue;
  exports.escapeAttrValue = escapeAttrValue;
  exports.onIgnoreTagStripAll = onIgnoreTagStripAll;
  exports.StripTagBody = StripTagBody;
  exports.stripCommentTag = stripCommentTag;
  exports.stripBlankChar = stripBlankChar;
  exports.attributeWrapSign = '"';
  exports.cssFilter = defaultCSSFilter;
  exports.getDefaultCSSWhiteList = getDefaultCSSWhiteList;
});
