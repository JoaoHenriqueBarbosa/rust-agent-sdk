// var: require_parser4
var require_parser4 = __commonJS((exports) => {
  var _ = require_util6();
  function getTagName(html2) {
    var i5 = _.spaceIndex(html2), tagName;
    if (i5 === -1)
      tagName = html2.slice(1, -1);
    else
      tagName = html2.slice(1, i5 + 1);
    if (tagName = _.trim(tagName).toLowerCase(), tagName.slice(0, 1) === "/")
      tagName = tagName.slice(1);
    if (tagName.slice(-1) === "/")
      tagName = tagName.slice(0, -1);
    return tagName;
  }
  function isClosing(html2) {
    return html2.slice(0, 2) === "</";
  }
  function parseTag(html2, onTag, escapeHtml) {
    var rethtml = "", lastPos = 0, tagStart = !1, quoteStart = !1, currentPos = 0, len = html2.length, currentTagName = "", currentHtml = "";
    chariterator:
      for (currentPos = 0;currentPos < len; currentPos++) {
        var c3 = html2.charAt(currentPos);
        if (tagStart === !1) {
          if (c3 === "<") {
            tagStart = currentPos;
            continue;
          }
        } else if (quoteStart === !1) {
          if (c3 === "<") {
            rethtml += escapeHtml(html2.slice(lastPos, currentPos)), tagStart = currentPos, lastPos = currentPos;
            continue;
          }
          if (c3 === ">" || currentPos === len - 1) {
            rethtml += escapeHtml(html2.slice(lastPos, tagStart)), currentHtml = html2.slice(tagStart, currentPos + 1), currentTagName = getTagName(currentHtml), rethtml += onTag(tagStart, rethtml.length, currentTagName, currentHtml, isClosing(currentHtml)), lastPos = currentPos + 1, tagStart = !1;
            continue;
          }
          if (c3 === '"' || c3 === "'") {
            var i5 = 1, ic = html2.charAt(currentPos - i5);
            while (ic.trim() === "" || ic === "=") {
              if (ic === "=") {
                quoteStart = c3;
                continue chariterator;
              }
              ic = html2.charAt(currentPos - ++i5);
            }
          }
        } else if (c3 === quoteStart) {
          quoteStart = !1;
          continue;
        }
      }
    if (lastPos < len)
      rethtml += escapeHtml(html2.substr(lastPos));
    return rethtml;
  }
  var REGEXP_ILLEGAL_ATTR_NAME = /[^a-zA-Z0-9\\_:.-]/gim;
  function parseAttr(html2, onAttr) {
    var lastPos = 0, lastMarkPos = 0, retAttrs = [], tmpName = !1, len = html2.length;
    function addAttr(name3, value) {
      if (name3 = _.trim(name3), name3 = name3.replace(REGEXP_ILLEGAL_ATTR_NAME, "").toLowerCase(), name3.length < 1)
        return;
      var ret = onAttr(name3, value || "");
      if (ret)
        retAttrs.push(ret);
    }
    for (var i5 = 0;i5 < len; i5++) {
      var c3 = html2.charAt(i5), v2, j4;
      if (tmpName === !1 && c3 === "=") {
        tmpName = html2.slice(lastPos, i5), lastPos = i5 + 1, lastMarkPos = html2.charAt(lastPos) === '"' || html2.charAt(lastPos) === "'" ? lastPos : findNextQuotationMark(html2, i5 + 1);
        continue;
      }
      if (tmpName !== !1) {
        if (i5 === lastMarkPos)
          if (j4 = html2.indexOf(c3, i5 + 1), j4 === -1)
            break;
          else {
            v2 = _.trim(html2.slice(lastMarkPos + 1, j4)), addAttr(tmpName, v2), tmpName = !1, i5 = j4, lastPos = i5 + 1;
            continue;
          }
      }
      if (/\s|\n|\t/.test(c3))
        if (html2 = html2.replace(/\s|\n|\t/g, " "), tmpName === !1)
          if (j4 = findNextEqual(html2, i5), j4 === -1) {
            v2 = _.trim(html2.slice(lastPos, i5)), addAttr(v2), tmpName = !1, lastPos = i5 + 1;
            continue;
          } else {
            i5 = j4 - 1;
            continue;
          }
        else if (j4 = findBeforeEqual(html2, i5 - 1), j4 === -1) {
          v2 = _.trim(html2.slice(lastPos, i5)), v2 = stripQuoteWrap(v2), addAttr(tmpName, v2), tmpName = !1, lastPos = i5 + 1;
          continue;
        } else
          continue;
    }
    if (lastPos < html2.length)
      if (tmpName === !1)
        addAttr(html2.slice(lastPos));
      else
        addAttr(tmpName, stripQuoteWrap(_.trim(html2.slice(lastPos))));
    return _.trim(retAttrs.join(" "));
  }
  function findNextEqual(str2, i5) {
    for (;i5 < str2.length; i5++) {
      var c3 = str2[i5];
      if (c3 === " ")
        continue;
      if (c3 === "=")
        return i5;
      return -1;
    }
  }
  function findNextQuotationMark(str2, i5) {
    for (;i5 < str2.length; i5++) {
      var c3 = str2[i5];
      if (c3 === " ")
        continue;
      if (c3 === "'" || c3 === '"')
        return i5;
      return -1;
    }
  }
  function findBeforeEqual(str2, i5) {
    for (;i5 > 0; i5--) {
      var c3 = str2[i5];
      if (c3 === " ")
        continue;
      if (c3 === "=")
        return i5;
      return -1;
    }
  }
  function isQuoteWrapString(text2) {
    if (text2[0] === '"' && text2[text2.length - 1] === '"' || text2[0] === "'" && text2[text2.length - 1] === "'")
      return !0;
    else
      return !1;
  }
  function stripQuoteWrap(text2) {
    if (isQuoteWrapString(text2))
      return text2.substr(1, text2.length - 2);
    else
      return text2;
  }
  exports.parseTag = parseTag;
  exports.parseAttr = parseAttr;
});
