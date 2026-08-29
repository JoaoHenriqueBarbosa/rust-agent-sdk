// var: require_parse8
var require_parse8 = __commonJS((exports) => {
  var CSSOM = {};
  CSSOM.parse = function(token) {
    var i5 = 0, state3 = "before-selector", index, buffer = "", valueParenthesisDepth = 0, SIGNIFICANT_WHITESPACE = {
      selector: !0,
      value: !0,
      "value-parenthesis": !0,
      atRule: !0,
      "importRule-begin": !0,
      importRule: !0,
      atBlock: !0,
      conditionBlock: !0,
      "documentRule-begin": !0
    }, styleSheet = new CSSOM.CSSStyleSheet, currentScope = styleSheet, parentRule, ancestorRules = [], hasAncestors = !1, prevScope, name3, priority = "", styleRule, mediaRule, supportsRule, importRule, fontFaceRule, keyframesRule, documentRule, hostRule, atKeyframesRegExp = /@(-(?:\w+-)+)?keyframes/g, parseError = function(message) {
      var lines2 = token.substring(0, i5).split(`
`), lineCount = lines2.length, charCount = lines2.pop().length + 1, error44 = Error(message + " (line " + lineCount + ", char " + charCount + ")");
      throw error44.line = lineCount, error44.char = charCount, error44.styleSheet = styleSheet, error44;
    };
    for (var character;character = token.charAt(i5); i5++)
      switch (character) {
        case " ":
        case "\t":
        case "\r":
        case `
`:
        case "\f":
          if (SIGNIFICANT_WHITESPACE[state3])
            buffer += character;
          break;
        case '"':
          index = i5 + 1;
          do
            if (index = token.indexOf('"', index) + 1, !index)
              parseError('Unmatched "');
          while (token[index - 2] === "\\");
          switch (buffer += token.slice(i5, index), i5 = index - 1, state3) {
            case "before-value":
              state3 = "value";
              break;
            case "importRule-begin":
              state3 = "importRule";
              break;
          }
          break;
        case "'":
          index = i5 + 1;
          do
            if (index = token.indexOf("'", index) + 1, !index)
              parseError("Unmatched '");
          while (token[index - 2] === "\\");
          switch (buffer += token.slice(i5, index), i5 = index - 1, state3) {
            case "before-value":
              state3 = "value";
              break;
            case "importRule-begin":
              state3 = "importRule";
              break;
          }
          break;
        case "/":
          if (token.charAt(i5 + 1) === "*")
            if (i5 += 2, index = token.indexOf("*/", i5), index === -1)
              parseError("Missing */");
            else
              i5 = index + 1;
          else
            buffer += character;
          if (state3 === "importRule-begin")
            buffer += " ", state3 = "importRule";
          break;
        case "@":
          if (token.indexOf("@-moz-document", i5) === i5) {
            state3 = "documentRule-begin", documentRule = new CSSOM.CSSDocumentRule, documentRule.__starts = i5, i5 += 13, buffer = "";
            break;
          } else if (token.indexOf("@media", i5) === i5) {
            state3 = "atBlock", mediaRule = new CSSOM.CSSMediaRule, mediaRule.__starts = i5, i5 += 5, buffer = "";
            break;
          } else if (token.indexOf("@supports", i5) === i5) {
            state3 = "conditionBlock", supportsRule = new CSSOM.CSSSupportsRule, supportsRule.__starts = i5, i5 += 8, buffer = "";
            break;
          } else if (token.indexOf("@host", i5) === i5) {
            state3 = "hostRule-begin", i5 += 4, hostRule = new CSSOM.CSSHostRule, hostRule.__starts = i5, buffer = "";
            break;
          } else if (token.indexOf("@import", i5) === i5) {
            state3 = "importRule-begin", i5 += 6, buffer += "@import";
            break;
          } else if (token.indexOf("@font-face", i5) === i5) {
            state3 = "fontFaceRule-begin", i5 += 9, fontFaceRule = new CSSOM.CSSFontFaceRule, fontFaceRule.__starts = i5, buffer = "";
            break;
          } else {
            atKeyframesRegExp.lastIndex = i5;
            var matchKeyframes = atKeyframesRegExp.exec(token);
            if (matchKeyframes && matchKeyframes.index === i5) {
              state3 = "keyframesRule-begin", keyframesRule = new CSSOM.CSSKeyframesRule, keyframesRule.__starts = i5, keyframesRule._vendorPrefix = matchKeyframes[1], i5 += matchKeyframes[0].length - 1, buffer = "";
              break;
            } else if (state3 === "selector")
              state3 = "atRule";
          }
          buffer += character;
          break;
        case "{":
          if (state3 === "selector" || state3 === "atRule")
            styleRule.selectorText = buffer.trim(), styleRule.style.__starts = i5, buffer = "", state3 = "before-name";
          else if (state3 === "atBlock") {
            if (mediaRule.media.mediaText = buffer.trim(), parentRule)
              ancestorRules.push(parentRule);
            currentScope = parentRule = mediaRule, mediaRule.parentStyleSheet = styleSheet, buffer = "", state3 = "before-selector";
          } else if (state3 === "conditionBlock") {
            if (supportsRule.conditionText = buffer.trim(), parentRule)
              ancestorRules.push(parentRule);
            currentScope = parentRule = supportsRule, supportsRule.parentStyleSheet = styleSheet, buffer = "", state3 = "before-selector";
          } else if (state3 === "hostRule-begin") {
            if (parentRule)
              ancestorRules.push(parentRule);
            currentScope = parentRule = hostRule, hostRule.parentStyleSheet = styleSheet, buffer = "", state3 = "before-selector";
          } else if (state3 === "fontFaceRule-begin") {
            if (parentRule)
              fontFaceRule.parentRule = parentRule;
            fontFaceRule.parentStyleSheet = styleSheet, styleRule = fontFaceRule, buffer = "", state3 = "before-name";
          } else if (state3 === "keyframesRule-begin") {
            if (keyframesRule.name = buffer.trim(), parentRule)
              ancestorRules.push(parentRule), keyframesRule.parentRule = parentRule;
            keyframesRule.parentStyleSheet = styleSheet, currentScope = parentRule = keyframesRule, buffer = "", state3 = "keyframeRule-begin";
          } else if (state3 === "keyframeRule-begin")
            styleRule = new CSSOM.CSSKeyframeRule, styleRule.keyText = buffer.trim(), styleRule.__starts = i5, buffer = "", state3 = "before-name";
          else if (state3 === "documentRule-begin") {
            if (documentRule.matcher.matcherText = buffer.trim(), parentRule)
              ancestorRules.push(parentRule), documentRule.parentRule = parentRule;
            currentScope = parentRule = documentRule, documentRule.parentStyleSheet = styleSheet, buffer = "", state3 = "before-selector";
          }
          break;
        case ":":
          if (state3 === "name")
            name3 = buffer.trim(), buffer = "", state3 = "before-value";
          else
            buffer += character;
          break;
        case "(":
          if (state3 === "value")
            if (buffer.trim() === "expression") {
              var info = new CSSOM.CSSValueExpression(token, i5).parse();
              if (info.error)
                parseError(info.error);
              else
                buffer += info.expression, i5 = info.idx;
            } else
              state3 = "value-parenthesis", valueParenthesisDepth = 1, buffer += character;
          else if (state3 === "value-parenthesis")
            valueParenthesisDepth++, buffer += character;
          else
            buffer += character;
          break;
        case ")":
          if (state3 === "value-parenthesis") {
            if (valueParenthesisDepth--, valueParenthesisDepth === 0)
              state3 = "value";
          }
          buffer += character;
          break;
        case "!":
          if (state3 === "value" && token.indexOf("!important", i5) === i5)
            priority = "important", i5 += 9;
          else
            buffer += character;
          break;
        case ";":
          switch (state3) {
            case "value":
              styleRule.style.setProperty(name3, buffer.trim(), priority), priority = "", buffer = "", state3 = "before-name";
              break;
            case "atRule":
              buffer = "", state3 = "before-selector";
              break;
            case "importRule":
              importRule = new CSSOM.CSSImportRule, importRule.parentStyleSheet = importRule.styleSheet.parentStyleSheet = styleSheet, importRule.cssText = buffer + character, styleSheet.cssRules.push(importRule), buffer = "", state3 = "before-selector";
              break;
            default:
              buffer += character;
              break;
          }
          break;
        case "}":
          switch (state3) {
            case "value":
              styleRule.style.setProperty(name3, buffer.trim(), priority), priority = "";
            case "before-name":
            case "name":
              if (styleRule.__ends = i5 + 1, parentRule)
                styleRule.parentRule = parentRule;
              if (styleRule.parentStyleSheet = styleSheet, currentScope.cssRules.push(styleRule), buffer = "", currentScope.constructor === CSSOM.CSSKeyframesRule)
                state3 = "keyframeRule-begin";
              else
                state3 = "before-selector";
              break;
            case "keyframeRule-begin":
            case "before-selector":
            case "selector":
              if (!parentRule)
                parseError("Unexpected }");
              hasAncestors = ancestorRules.length > 0;
              while (ancestorRules.length > 0) {
                if (parentRule = ancestorRules.pop(), parentRule.constructor.name === "CSSMediaRule" || parentRule.constructor.name === "CSSSupportsRule") {
                  prevScope = currentScope, currentScope = parentRule, currentScope.cssRules.push(prevScope);
                  break;
                }
                if (ancestorRules.length === 0)
                  hasAncestors = !1;
              }
              if (!hasAncestors)
                currentScope.__ends = i5 + 1, styleSheet.cssRules.push(currentScope), currentScope = styleSheet, parentRule = null;
              buffer = "", state3 = "before-selector";
              break;
          }
          break;
        default:
          switch (state3) {
            case "before-selector":
              state3 = "selector", styleRule = new CSSOM.CSSStyleRule, styleRule.__starts = i5;
              break;
            case "before-name":
              state3 = "name";
              break;
            case "before-value":
              state3 = "value";
              break;
            case "importRule-begin":
              state3 = "importRule";
              break;
          }
          buffer += character;
          break;
      }
    return styleSheet;
  };
