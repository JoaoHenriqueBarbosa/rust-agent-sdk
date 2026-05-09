// var: require_CSSStyleRule
var require_CSSStyleRule = __commonJS((exports) => {
  var CSSOM = {
    CSSStyleDeclaration: require_CSSStyleDeclaration().CSSStyleDeclaration,
    CSSRule: require_CSSRule().CSSRule
  };
  CSSOM.CSSStyleRule = function() {
    CSSOM.CSSRule.call(this), this.selectorText = "", this.style = new CSSOM.CSSStyleDeclaration, this.style.parentRule = this;
  };
  CSSOM.CSSStyleRule.prototype = new CSSOM.CSSRule;
  CSSOM.CSSStyleRule.prototype.constructor = CSSOM.CSSStyleRule;
  CSSOM.CSSStyleRule.prototype.type = 1;
  Object.defineProperty(CSSOM.CSSStyleRule.prototype, "cssText", {
    get: function() {
      var text2;
      if (this.selectorText)
        text2 = this.selectorText + " {" + this.style.cssText + "}";
      else
        text2 = "";
      return text2;
    },
    set: function(cssText) {
      var rule = CSSOM.CSSStyleRule.parse(cssText);
      this.style = rule.style, this.selectorText = rule.selectorText;
    }
  });
  CSSOM.CSSStyleRule.parse = function(ruleText) {
    var i5 = 0, state3 = "selector", index, j4 = i5, buffer = "", SIGNIFICANT_WHITESPACE = {
      selector: !0,
      value: !0
    }, styleRule = new CSSOM.CSSStyleRule, name3, priority = "";
    for (var character;character = ruleText.charAt(i5); i5++)
      switch (character) {
        case " ":
        case "\t":
        case "\r":
        case `
`:
        case "\f":
          if (SIGNIFICANT_WHITESPACE[state3])
            switch (ruleText.charAt(i5 - 1)) {
              case " ":
              case "\t":
              case "\r":
              case `
`:
              case "\f":
                break;
              default:
                buffer += " ";
                break;
            }
          break;
        case '"':
          if (j4 = i5 + 1, index = ruleText.indexOf('"', j4) + 1, !index)
            throw '" is missing';
          buffer += ruleText.slice(i5, index), i5 = index - 1;
          break;
        case "'":
          if (j4 = i5 + 1, index = ruleText.indexOf("'", j4) + 1, !index)
            throw "' is missing";
          buffer += ruleText.slice(i5, index), i5 = index - 1;
          break;
        case "/":
          if (ruleText.charAt(i5 + 1) === "*")
            if (i5 += 2, index = ruleText.indexOf("*/", i5), index === -1)
              throw SyntaxError("Missing */");
            else
              i5 = index + 1;
          else
            buffer += character;
          break;
        case "{":
          if (state3 === "selector")
            styleRule.selectorText = buffer.trim(), buffer = "", state3 = "name";
          break;
        case ":":
          if (state3 === "name")
            name3 = buffer.trim(), buffer = "", state3 = "value";
          else
            buffer += character;
          break;
        case "!":
          if (state3 === "value" && ruleText.indexOf("!important", i5) === i5)
            priority = "important", i5 += 9;
          else
            buffer += character;
          break;
        case ";":
          if (state3 === "value")
            styleRule.style.setProperty(name3, buffer.trim(), priority), priority = "", buffer = "", state3 = "name";
          else
            buffer += character;
          break;
        case "}":
          if (state3 === "value")
            styleRule.style.setProperty(name3, buffer.trim(), priority), priority = "", buffer = "";
          else if (state3 === "name")
            break;
          else
            buffer += character;
          state3 = "selector";
          break;
        default:
          buffer += character;
          break;
      }
    return styleRule;
  };
  exports.CSSStyleRule = CSSOM.CSSStyleRule;
});
