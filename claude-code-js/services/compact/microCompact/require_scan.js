// var: require_scan
var require_scan = __commonJS((exports, module) => {
  var utils = require_utils3(), {
    CHAR_ASTERISK,
    CHAR_AT,
    CHAR_BACKWARD_SLASH,
    CHAR_COMMA,
    CHAR_DOT,
    CHAR_EXCLAMATION_MARK,
    CHAR_FORWARD_SLASH,
    CHAR_LEFT_CURLY_BRACE,
    CHAR_LEFT_PARENTHESES,
    CHAR_LEFT_SQUARE_BRACKET,
    CHAR_PLUS,
    CHAR_QUESTION_MARK,
    CHAR_RIGHT_CURLY_BRACE,
    CHAR_RIGHT_PARENTHESES,
    CHAR_RIGHT_SQUARE_BRACKET
  } = require_constants3(), isPathSeparator = (code) => {
    return code === CHAR_FORWARD_SLASH || code === CHAR_BACKWARD_SLASH;
  }, depth = (token) => {
    if (token.isPrefix !== !0)
      token.depth = token.isGlobstar ? 1 / 0 : 1;
  }, scan = (input, options2) => {
    let opts = options2 || {}, length = input.length - 1, scanToEnd = opts.parts === !0 || opts.scanToEnd === !0, slashes = [], tokens = [], parts = [], str = input, index = -1, start = 0, lastIndex = 0, isBrace = !1, isBracket = !1, isGlob = !1, isExtglob = !1, isGlobstar = !1, braceEscaped = !1, backslashes = !1, negated = !1, negatedExtglob = !1, finished7 = !1, braces = 0, prev, code, token = { value: "", depth: 0, isGlob: !1 }, eos = () => index >= length, peek = () => str.charCodeAt(index + 1), advance = () => {
      return prev = code, str.charCodeAt(++index);
    };
    while (index < length) {
      code = advance();
      let next;
      if (code === CHAR_BACKWARD_SLASH) {
        if (backslashes = token.backslashes = !0, code = advance(), code === CHAR_LEFT_CURLY_BRACE)
          braceEscaped = !0;
        continue;
      }
      if (braceEscaped === !0 || code === CHAR_LEFT_CURLY_BRACE) {
        braces++;
        while (eos() !== !0 && (code = advance())) {
          if (code === CHAR_BACKWARD_SLASH) {
            backslashes = token.backslashes = !0, advance();
            continue;
          }
          if (code === CHAR_LEFT_CURLY_BRACE) {
            braces++;
            continue;
          }
          if (braceEscaped !== !0 && code === CHAR_DOT && (code = advance()) === CHAR_DOT) {
            if (isBrace = token.isBrace = !0, isGlob = token.isGlob = !0, finished7 = !0, scanToEnd === !0)
              continue;
            break;
          }
          if (braceEscaped !== !0 && code === CHAR_COMMA) {
            if (isBrace = token.isBrace = !0, isGlob = token.isGlob = !0, finished7 = !0, scanToEnd === !0)
              continue;
            break;
          }
          if (code === CHAR_RIGHT_CURLY_BRACE) {
            if (braces--, braces === 0) {
              braceEscaped = !1, isBrace = token.isBrace = !0, finished7 = !0;
              break;
            }
          }
        }
        if (scanToEnd === !0)
          continue;
        break;
      }
      if (code === CHAR_FORWARD_SLASH) {
        if (slashes.push(index), tokens.push(token), token = { value: "", depth: 0, isGlob: !1 }, finished7 === !0)
          continue;
        if (prev === CHAR_DOT && index === start + 1) {
          start += 2;
          continue;
        }
        lastIndex = index + 1;
        continue;
      }
      if (opts.noext !== !0) {
        if ((code === CHAR_PLUS || code === CHAR_AT || code === CHAR_ASTERISK || code === CHAR_QUESTION_MARK || code === CHAR_EXCLAMATION_MARK) === !0 && peek() === CHAR_LEFT_PARENTHESES) {
          if (isGlob = token.isGlob = !0, isExtglob = token.isExtglob = !0, finished7 = !0, code === CHAR_EXCLAMATION_MARK && index === start)
            negatedExtglob = !0;
          if (scanToEnd === !0) {
            while (eos() !== !0 && (code = advance())) {
              if (code === CHAR_BACKWARD_SLASH) {
                backslashes = token.backslashes = !0, code = advance();
                continue;
              }
              if (code === CHAR_RIGHT_PARENTHESES) {
                isGlob = token.isGlob = !0, finished7 = !0;
                break;
              }
            }
            continue;
          }
          break;
        }
      }
      if (code === CHAR_ASTERISK) {
        if (prev === CHAR_ASTERISK)
          isGlobstar = token.isGlobstar = !0;
        if (isGlob = token.isGlob = !0, finished7 = !0, scanToEnd === !0)
          continue;
        break;
      }
      if (code === CHAR_QUESTION_MARK) {
        if (isGlob = token.isGlob = !0, finished7 = !0, scanToEnd === !0)
          continue;
        break;
      }
      if (code === CHAR_LEFT_SQUARE_BRACKET) {
        while (eos() !== !0 && (next = advance())) {
          if (next === CHAR_BACKWARD_SLASH) {
            backslashes = token.backslashes = !0, advance();
            continue;
          }
          if (next === CHAR_RIGHT_SQUARE_BRACKET) {
            isBracket = token.isBracket = !0, isGlob = token.isGlob = !0, finished7 = !0;
            break;
          }
        }
        if (scanToEnd === !0)
          continue;
        break;
      }
      if (opts.nonegate !== !0 && code === CHAR_EXCLAMATION_MARK && index === start) {
        negated = token.negated = !0, start++;
        continue;
      }
      if (opts.noparen !== !0 && code === CHAR_LEFT_PARENTHESES) {
        if (isGlob = token.isGlob = !0, scanToEnd === !0) {
          while (eos() !== !0 && (code = advance())) {
            if (code === CHAR_LEFT_PARENTHESES) {
              backslashes = token.backslashes = !0, code = advance();
              continue;
            }
            if (code === CHAR_RIGHT_PARENTHESES) {
              finished7 = !0;
              break;
            }
          }
          continue;
        }
        break;
      }
      if (isGlob === !0) {
        if (finished7 = !0, scanToEnd === !0)
          continue;
        break;
      }
    }
    if (opts.noext === !0)
      isExtglob = !1, isGlob = !1;
    let base2 = str, prefix = "", glob = "";
    if (start > 0)
      prefix = str.slice(0, start), str = str.slice(start), lastIndex -= start;
    if (base2 && isGlob === !0 && lastIndex > 0)
      base2 = str.slice(0, lastIndex), glob = str.slice(lastIndex);
    else if (isGlob === !0)
      base2 = "", glob = str;
    else
      base2 = str;
    if (base2 && base2 !== "" && base2 !== "/" && base2 !== str) {
      if (isPathSeparator(base2.charCodeAt(base2.length - 1)))
        base2 = base2.slice(0, -1);
    }
    if (opts.unescape === !0) {
      if (glob)
        glob = utils.removeBackslashes(glob);
      if (base2 && backslashes === !0)
        base2 = utils.removeBackslashes(base2);
    }
    let state3 = {
      prefix,
      input,
      start,
      base: base2,
      glob,
      isBrace,
      isBracket,
      isGlob,
      isExtglob,
      isGlobstar,
      negated,
      negatedExtglob
    };
    if (opts.tokens === !0) {
      if (state3.maxDepth = 0, !isPathSeparator(code))
        tokens.push(token);
      state3.tokens = tokens;
    }
    if (opts.parts === !0 || opts.tokens === !0) {
      let prevIndex;
      for (let idx = 0;idx < slashes.length; idx++) {
        let n5 = prevIndex ? prevIndex + 1 : start, i5 = slashes[idx], value = input.slice(n5, i5);
        if (opts.tokens) {
          if (idx === 0 && start !== 0)
            tokens[idx].isPrefix = !0, tokens[idx].value = prefix;
          else
            tokens[idx].value = value;
          depth(tokens[idx]), state3.maxDepth += tokens[idx].depth;
        }
        if (idx !== 0 || value !== "")
          parts.push(value);
        prevIndex = i5;
      }
      if (prevIndex && prevIndex + 1 < input.length) {
        let value = input.slice(prevIndex + 1);
        if (parts.push(value), opts.tokens)
          tokens[tokens.length - 1].value = value, depth(tokens[tokens.length - 1]), state3.maxDepth += tokens[tokens.length - 1].depth;
      }
      state3.slashes = slashes, state3.parts = parts;
    }
    return state3;
  };
  module.exports = scan;
});
