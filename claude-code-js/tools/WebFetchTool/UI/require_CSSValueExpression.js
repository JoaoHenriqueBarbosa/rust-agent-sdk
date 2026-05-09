// var: require_CSSValueExpression
var require_CSSValueExpression = __commonJS((exports) => {
  var CSSOM = {
    CSSValue: require_CSSValue().CSSValue
  };
  CSSOM.CSSValueExpression = function(token, idx) {
    this._token = token, this._idx = idx;
  };
  CSSOM.CSSValueExpression.prototype = new CSSOM.CSSValue;
  CSSOM.CSSValueExpression.prototype.constructor = CSSOM.CSSValueExpression;
  CSSOM.CSSValueExpression.prototype.parse = function() {
    var token = this._token, idx = this._idx, character = "", expression = "", error44 = "", info, paren = [];
    for (;; ++idx) {
      if (character = token.charAt(idx), character === "") {
        error44 = "css expression error: unfinished expression!";
        break;
      }
      switch (character) {
        case "(":
          paren.push(character), expression += character;
          break;
        case ")":
          paren.pop(character), expression += character;
          break;
        case "/":
          if (info = this._parseJSComment(token, idx))
            if (info.error)
              error44 = "css expression error: unfinished comment in expression!";
            else
              idx = info.idx;
          else if (info = this._parseJSRexExp(token, idx))
            idx = info.idx, expression += info.text;
          else
            expression += character;
          break;
        case "'":
        case '"':
          if (info = this._parseJSString(token, idx, character), info)
            idx = info.idx, expression += info.text;
          else
            expression += character;
          break;
        default:
          expression += character;
          break;
      }
      if (error44)
        break;
      if (paren.length === 0)
        break;
    }
    var ret;
    if (error44)
      ret = {
        error: error44
      };
    else
      ret = {
        idx,
        expression
      };
    return ret;
  };
  CSSOM.CSSValueExpression.prototype._parseJSComment = function(token, idx) {
    var nextChar = token.charAt(idx + 1), text2;
    if (nextChar === "/" || nextChar === "*") {
      var startIdx = idx, endIdx, commentEndChar;
      if (nextChar === "/")
        commentEndChar = `
`;
      else if (nextChar === "*")
        commentEndChar = "*/";
      if (endIdx = token.indexOf(commentEndChar, startIdx + 1 + 1), endIdx !== -1)
        return endIdx = endIdx + commentEndChar.length - 1, text2 = token.substring(idx, endIdx + 1), {
          idx: endIdx,
          text: text2
        };
      else {
        var error44 = "css expression error: unfinished comment in expression!";
        return {
          error: error44
        };
      }
    } else
      return !1;
  };
  CSSOM.CSSValueExpression.prototype._parseJSString = function(token, idx, sep20) {
    var endIdx = this._findMatchedIdx(token, idx, sep20), text2;
    if (endIdx === -1)
      return !1;
    else
      return text2 = token.substring(idx, endIdx + sep20.length), {
        idx: endIdx,
        text: text2
      };
  };
  CSSOM.CSSValueExpression.prototype._parseJSRexExp = function(token, idx) {
    var before2 = token.substring(0, idx).replace(/\s+$/, ""), legalRegx = [
      /^$/,
      /\($/,
      /\[$/,
      /\!$/,
      /\+$/,
      /\-$/,
      /\*$/,
      /\/\s+/,
      /\%$/,
      /\=$/,
      /\>$/,
      /<$/,
      /\&$/,
      /\|$/,
      /\^$/,
      /\~$/,
      /\?$/,
      /\,$/,
      /delete$/,
      /in$/,
      /instanceof$/,
      /new$/,
      /typeof$/,
      /void$/
    ], isLegal = legalRegx.some(function(reg) {
      return reg.test(before2);
    });
    if (!isLegal)
      return !1;
    else {
      var sep20 = "/";
      return this._parseJSString(token, idx, sep20);
    }
  };
  CSSOM.CSSValueExpression.prototype._findMatchedIdx = function(token, idx, sep20) {
    var startIdx = idx, endIdx, NOT_FOUND = -1;
    while (!0)
      if (endIdx = token.indexOf(sep20, startIdx + 1), endIdx === -1) {
        endIdx = NOT_FOUND;
        break;
      } else {
        var text2 = token.substring(idx + 1, endIdx), matched = text2.match(/\\+$/);
        if (!matched || matched[0] % 2 === 0)
          break;
        else
          startIdx = endIdx;
      }
    var nextNewLineIdx = token.indexOf(`
`, idx + 1);
    if (nextNewLineIdx < endIdx)
      endIdx = NOT_FOUND;
    return endIdx;
  };
  exports.CSSValueExpression = CSSOM.CSSValueExpression;
});
