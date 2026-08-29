// var: require_parse7
var require_parse7 = __commonJS((exports, module) => {
  var constants11 = require_constants3(), utils = require_utils3(), {
    MAX_LENGTH,
    POSIX_REGEX_SOURCE,
    REGEX_NON_SPECIAL_CHARS,
    REGEX_SPECIAL_CHARS_BACKREF,
    REPLACEMENTS
  } = constants11, expandRange = (args, options2) => {
    if (typeof options2.expandRange === "function")
      return options2.expandRange(...args, options2);
    args.sort();
    let value = `[${args.join("-")}]`;
    try {
      new RegExp(value);
    } catch (ex) {
      return args.map((v2) => utils.escapeRegex(v2)).join("..");
    }
    return value;
  }, syntaxError = (type, char) => {
    return `Missing ${type}: "${char}" - use "\\\\${char}" to match literal characters`;
  }, splitTopLevel = (input) => {
    let parts = [], bracket = 0, paren = 0, quote = 0, value = "", escaped = !1;
    for (let ch2 of input) {
      if (escaped === !0) {
        value += ch2, escaped = !1;
        continue;
      }
      if (ch2 === "\\") {
        value += ch2, escaped = !0;
        continue;
      }
      if (ch2 === '"') {
        quote = quote === 1 ? 0 : 1, value += ch2;
        continue;
      }
      if (quote === 0) {
        if (ch2 === "[")
          bracket++;
        else if (ch2 === "]" && bracket > 0)
          bracket--;
        else if (bracket === 0) {
          if (ch2 === "(")
            paren++;
          else if (ch2 === ")" && paren > 0)
            paren--;
          else if (ch2 === "|" && paren === 0) {
            parts.push(value), value = "";
            continue;
          }
        }
      }
      value += ch2;
    }
    return parts.push(value), parts;
  }, isPlainBranch = (branch) => {
    let escaped = !1;
    for (let ch2 of branch) {
      if (escaped === !0) {
        escaped = !1;
        continue;
      }
      if (ch2 === "\\") {
        escaped = !0;
        continue;
      }
      if (/[?*+@!()[\]{}]/.test(ch2))
        return !1;
    }
    return !0;
  }, normalizeSimpleBranch = (branch) => {
    let value = branch.trim(), changed = !0;
    while (changed === !0)
      if (changed = !1, /^@\([^\\()[\]{}|]+\)$/.test(value))
        value = value.slice(2, -1), changed = !0;
    if (!isPlainBranch(value))
      return;
    return value.replace(/\\(.)/g, "$1");
  }, hasRepeatedCharPrefixOverlap = (branches) => {
    let values3 = branches.map(normalizeSimpleBranch).filter(Boolean);
    for (let i5 = 0;i5 < values3.length; i5++)
      for (let j4 = i5 + 1;j4 < values3.length; j4++) {
        let a2 = values3[i5], b = values3[j4], char = a2[0];
        if (!char || a2 !== char.repeat(a2.length) || b !== char.repeat(b.length))
          continue;
        if (a2 === b || a2.startsWith(b) || b.startsWith(a2))
          return !0;
      }
    return !1;
  }, parseRepeatedExtglob = (pattern, requireEnd = !0) => {
    if (pattern[0] !== "+" && pattern[0] !== "*" || pattern[1] !== "(")
      return;
    let bracket = 0, paren = 0, quote = 0, escaped = !1;
    for (let i5 = 1;i5 < pattern.length; i5++) {
      let ch2 = pattern[i5];
      if (escaped === !0) {
        escaped = !1;
        continue;
      }
      if (ch2 === "\\") {
        escaped = !0;
        continue;
      }
      if (ch2 === '"') {
        quote = quote === 1 ? 0 : 1;
        continue;
      }
      if (quote === 1)
        continue;
      if (ch2 === "[") {
        bracket++;
        continue;
      }
      if (ch2 === "]" && bracket > 0) {
        bracket--;
        continue;
      }
      if (bracket > 0)
        continue;
      if (ch2 === "(") {
        paren++;
        continue;
      }
      if (ch2 === ")") {
        if (paren--, paren === 0) {
          if (requireEnd === !0 && i5 !== pattern.length - 1)
            return;
          return {
            type: pattern[0],
            body: pattern.slice(2, i5),
            end: i5
          };
        }
      }
    }
  }, getStarExtglobSequenceOutput = (pattern) => {
    let index = 0, chars = [];
    while (index < pattern.length) {
      let match = parseRepeatedExtglob(pattern.slice(index), !1);
      if (!match || match.type !== "*")
        return;
      let branches = splitTopLevel(match.body).map((branch2) => branch2.trim());
      if (branches.length !== 1)
        return;
      let branch = normalizeSimpleBranch(branches[0]);
      if (!branch || branch.length !== 1)
        return;
      chars.push(branch), index += match.end + 1;
    }
    if (chars.length < 1)
      return;
    return `${chars.length === 1 ? utils.escapeRegex(chars[0]) : `[${chars.map((ch2) => utils.escapeRegex(ch2)).join("")}]`}*`;
  }, repeatedExtglobRecursion = (pattern) => {
    let depth = 0, value = pattern.trim(), match = parseRepeatedExtglob(value);
    while (match)
      depth++, value = match.body.trim(), match = parseRepeatedExtglob(value);
    return depth;
  }, analyzeRepeatedExtglob = (body, options2) => {
    if (options2.maxExtglobRecursion === !1)
      return { risky: !1 };
    let max2 = typeof options2.maxExtglobRecursion === "number" ? options2.maxExtglobRecursion : constants11.DEFAULT_MAX_EXTGLOB_RECURSION, branches = splitTopLevel(body).map((branch) => branch.trim());
    if (branches.length > 1) {
      if (branches.some((branch) => branch === "") || branches.some((branch) => /^[*?]+$/.test(branch)) || hasRepeatedCharPrefixOverlap(branches))
        return { risky: !0 };
    }
    for (let branch of branches) {
      let safeOutput = getStarExtglobSequenceOutput(branch);
      if (safeOutput)
        return { risky: !0, safeOutput };
      if (repeatedExtglobRecursion(branch) > max2)
        return { risky: !0 };
    }
    return { risky: !1 };
  }, parse10 = (input, options2) => {
    if (typeof input !== "string")
      throw TypeError("Expected a string");
    input = REPLACEMENTS[input] || input;
    let opts = { ...options2 }, max2 = typeof opts.maxLength === "number" ? Math.min(MAX_LENGTH, opts.maxLength) : MAX_LENGTH, len = input.length;
    if (len > max2)
      throw SyntaxError(`Input length: ${len}, exceeds maximum allowed length: ${max2}`);
    let bos = { type: "bos", value: "", output: opts.prepend || "" }, tokens = [bos], capture = opts.capture ? "" : "?:", PLATFORM_CHARS = constants11.globChars(opts.windows), EXTGLOB_CHARS = constants11.extglobChars(PLATFORM_CHARS), {
      DOT_LITERAL,
      PLUS_LITERAL,
      SLASH_LITERAL,
      ONE_CHAR,
      DOTS_SLASH,
      NO_DOT,
      NO_DOT_SLASH,
      NO_DOTS_SLASH,
      QMARK,
      QMARK_NO_DOT,
      STAR,
      START_ANCHOR
    } = PLATFORM_CHARS, globstar = (opts2) => {
      return `(${capture}(?:(?!${START_ANCHOR}${opts2.dot ? DOTS_SLASH : DOT_LITERAL}).)*?)`;
    }, nodot = opts.dot ? "" : NO_DOT, qmarkNoDot = opts.dot ? QMARK : QMARK_NO_DOT, star = opts.bash === !0 ? globstar(opts) : STAR;
    if (opts.capture)
      star = `(${star})`;
    if (typeof opts.noext === "boolean")
      opts.noextglob = opts.noext;
    let state3 = {
      input,
      index: -1,
      start: 0,
      dot: opts.dot === !0,
      consumed: "",
      output: "",
      prefix: "",
      backtrack: !1,
      negated: !1,
      brackets: 0,
      braces: 0,
      parens: 0,
      quotes: 0,
      globstar: !1,
      tokens
    };
    input = utils.removePrefix(input, state3), len = input.length;
    let extglobs = [], braces = [], stack = [], prev = bos, value, eos = () => state3.index === len - 1, peek = state3.peek = (n5 = 1) => input[state3.index + n5], advance = state3.advance = () => input[++state3.index] || "", remaining = () => input.slice(state3.index + 1), consume = (value2 = "", num = 0) => {
      state3.consumed += value2, state3.index += num;
    }, append2 = (token) => {
      state3.output += token.output != null ? token.output : token.value, consume(token.value);
    }, negate5 = () => {
      let count3 = 1;
      while (peek() === "!" && (peek(2) !== "(" || peek(3) === "?"))
        advance(), state3.start++, count3++;
      if (count3 % 2 === 0)
        return !1;
      return state3.negated = !0, state3.start++, !0;
    }, increment2 = (type) => {
      state3[type]++, stack.push(type);
    }, decrement = (type) => {
      state3[type]--, stack.pop();
    }, push = (tok) => {
      if (prev.type === "globstar") {
        let isBrace = state3.braces > 0 && (tok.type === "comma" || tok.type === "brace"), isExtglob = tok.extglob === !0 || extglobs.length && (tok.type === "pipe" || tok.type === "paren");
        if (tok.type !== "slash" && tok.type !== "paren" && !isBrace && !isExtglob)
          state3.output = state3.output.slice(0, -prev.output.length), prev.type = "star", prev.value = "*", prev.output = star, state3.output += prev.output;
      }
      if (extglobs.length && tok.type !== "paren")
        extglobs[extglobs.length - 1].inner += tok.value;
      if (tok.value || tok.output)
        append2(tok);
      if (prev && prev.type === "text" && tok.type === "text") {
        prev.output = (prev.output || prev.value) + tok.value, prev.value += tok.value;
        return;
      }
      tok.prev = prev, tokens.push(tok), prev = tok;
    }, extglobOpen = (type, value2) => {
      let token = { ...EXTGLOB_CHARS[value2], conditions: 1, inner: "" };
      token.prev = prev, token.parens = state3.parens, token.output = state3.output, token.startIndex = state3.index, token.tokensIndex = tokens.length;
      let output = (opts.capture ? "(" : "") + token.open;
      increment2("parens"), push({ type, value: value2, output: state3.output ? "" : ONE_CHAR }), push({ type: "paren", extglob: !0, value: advance(), output }), extglobs.push(token);
    }, extglobClose = (token) => {
      let literal2 = input.slice(token.startIndex, state3.index + 1), body = input.slice(token.startIndex + 2, state3.index), analysis = analyzeRepeatedExtglob(body, opts);
      if ((token.type === "plus" || token.type === "star") && analysis.risky) {
        let safeOutput = analysis.safeOutput ? (token.output ? "" : ONE_CHAR) + (opts.capture ? `(${analysis.safeOutput})` : analysis.safeOutput) : void 0, open5 = tokens[token.tokensIndex];
        open5.type = "text", open5.value = literal2, open5.output = safeOutput || utils.escapeRegex(literal2);
        for (let i5 = token.tokensIndex + 1;i5 < tokens.length; i5++)
          tokens[i5].value = "", tokens[i5].output = "", delete tokens[i5].suffix;
        state3.output = token.output + open5.output, state3.backtrack = !0, push({ type: "paren", extglob: !0, value, output: "" }), decrement("parens");
        return;
      }
      let output = token.close + (opts.capture ? ")" : ""), rest;
      if (token.type === "negate") {
        let extglobStar = star;
        if (token.inner && token.inner.length > 1 && token.inner.includes("/"))
          extglobStar = globstar(opts);
        if (extglobStar !== star || eos() || /^\)+$/.test(remaining()))
          output = token.close = `)$))${extglobStar}`;
        if (token.inner.includes("*") && (rest = remaining()) && /^\.[^\\/.]+$/.test(rest)) {
          let expression = parse10(rest, { ...options2, fastpaths: !1 }).output;
          output = token.close = `)${expression})${extglobStar})`;
        }
        if (token.prev.type === "bos")
          state3.negatedExtglob = !0;
      }
      push({ type: "paren", extglob: !0, value, output }), decrement("parens");
    };
    if (opts.fastpaths !== !1 && !/(^[*!]|[/()[\]{}"])/.test(input)) {
      let backslashes = !1, output = input.replace(REGEX_SPECIAL_CHARS_BACKREF, (m4, esc2, chars, first, rest, index) => {
        if (first === "\\")
          return backslashes = !0, m4;
        if (first === "?") {
          if (esc2)
            return esc2 + first + (rest ? QMARK.repeat(rest.length) : "");
          if (index === 0)
            return qmarkNoDot + (rest ? QMARK.repeat(rest.length) : "");
          return QMARK.repeat(chars.length);
        }
        if (first === ".")
          return DOT_LITERAL.repeat(chars.length);
        if (first === "*") {
          if (esc2)
            return esc2 + first + (rest ? star : "");
          return star;
        }
        return esc2 ? m4 : `\\${m4}`;
      });
      if (backslashes === !0)
        if (opts.unescape === !0)
          output = output.replace(/\\/g, "");
        else
          output = output.replace(/\\+/g, (m4) => {
            return m4.length % 2 === 0 ? "\\\\" : m4 ? "\\" : "";
          });
      if (output === input && opts.contains === !0)
        return state3.output = input, state3;
      return state3.output = utils.wrapOutput(output, state3, options2), state3;
    }
    while (!eos()) {
      if (value = advance(), value === "\x00")
        continue;
      if (value === "\\") {
        let next = peek();
        if (next === "/" && opts.bash !== !0)
          continue;
        if (next === "." || next === ";")
          continue;
        if (!next) {
          value += "\\", push({ type: "text", value });
          continue;
        }
        let match = /^\\+/.exec(remaining()), slashes = 0;
        if (match && match[0].length > 2) {
          if (slashes = match[0].length, state3.index += slashes, slashes % 2 !== 0)
            value += "\\";
        }
        if (opts.unescape === !0)
          value = advance();
        else
          value += advance();
        if (state3.brackets === 0) {
          push({ type: "text", value });
          continue;
        }
      }
      if (state3.brackets > 0 && (value !== "]" || prev.value === "[" || prev.value === "[^")) {
        if (opts.posix !== !1 && value === ":") {
          let inner = prev.value.slice(1);
          if (inner.includes("[")) {
            if (prev.posix = !0, inner.includes(":")) {
              let idx = prev.value.lastIndexOf("["), pre = prev.value.slice(0, idx), rest2 = prev.value.slice(idx + 2), posix = POSIX_REGEX_SOURCE[rest2];
              if (posix) {
                if (prev.value = pre + posix, state3.backtrack = !0, advance(), !bos.output && tokens.indexOf(prev) === 1)
                  bos.output = ONE_CHAR;
                continue;
              }
            }
          }
        }
        if (value === "[" && peek() !== ":" || value === "-" && peek() === "]")
          value = `\\${value}`;
        if (value === "]" && (prev.value === "[" || prev.value === "[^"))
          value = `\\${value}`;
        if (opts.posix === !0 && value === "!" && prev.value === "[")
          value = "^";
        prev.value += value, append2({ value });
        continue;
      }
      if (state3.quotes === 1 && value !== '"') {
        value = utils.escapeRegex(value), prev.value += value, append2({ value });
        continue;
      }
      if (value === '"') {
        if (state3.quotes = state3.quotes === 1 ? 0 : 1, opts.keepQuotes === !0)
          push({ type: "text", value });
        continue;
      }
      if (value === "(") {
        increment2("parens"), push({ type: "paren", value });
        continue;
      }
      if (value === ")") {
        if (state3.parens === 0 && opts.strictBrackets === !0)
          throw SyntaxError(syntaxError("opening", "("));
        let extglob = extglobs[extglobs.length - 1];
        if (extglob && state3.parens === extglob.parens + 1) {
          extglobClose(extglobs.pop());
          continue;
        }
        push({ type: "paren", value, output: state3.parens ? ")" : "\\)" }), decrement("parens");
        continue;
      }
      if (value === "[") {
        if (opts.nobracket === !0 || !remaining().includes("]")) {
          if (opts.nobracket !== !0 && opts.strictBrackets === !0)
            throw SyntaxError(syntaxError("closing", "]"));
          value = `\\${value}`;
        } else
          increment2("brackets");
        push({ type: "bracket", value });
        continue;
      }
      if (value === "]") {
        if (opts.nobracket === !0 || prev && prev.type === "bracket" && prev.value.length === 1) {
          push({ type: "text", value, output: `\\${value}` });
          continue;
        }
        if (state3.brackets === 0) {
          if (opts.strictBrackets === !0)
            throw SyntaxError(syntaxError("opening", "["));
          push({ type: "text", value, output: `\\${value}` });
          continue;
        }
        decrement("brackets");
        let prevValue = prev.value.slice(1);
        if (prev.posix !== !0 && prevValue[0] === "^" && !prevValue.includes("/"))
          value = `/${value}`;
        if (prev.value += value, append2({ value }), opts.literalBrackets === !1 || utils.hasRegexChars(prevValue))
          continue;
        let escaped = utils.escapeRegex(prev.value);
        if (state3.output = state3.output.slice(0, -prev.value.length), opts.literalBrackets === !0) {
          state3.output += escaped, prev.value = escaped;
          continue;
        }
        prev.value = `(${capture}${escaped}|${prev.value})`, state3.output += prev.value;
        continue;
      }
      if (value === "{" && opts.nobrace !== !0) {
        increment2("braces");
        let open5 = {
          type: "brace",
          value,
          output: "(",
          outputIndex: state3.output.length,
          tokensIndex: state3.tokens.length
        };
        braces.push(open5), push(open5);
        continue;
      }
      if (value === "}") {
        let brace = braces[braces.length - 1];
        if (opts.nobrace === !0 || !brace) {
          push({ type: "text", value, output: value });
          continue;
        }
        let output = ")";
        if (brace.dots === !0) {
          let arr = tokens.slice(), range = [];
          for (let i5 = arr.length - 1;i5 >= 0; i5--) {
            if (tokens.pop(), arr[i5].type === "brace")
              break;
            if (arr[i5].type !== "dots")
              range.unshift(arr[i5].value);
          }
          output = expandRange(range, opts), state3.backtrack = !0;
        }
        if (brace.comma !== !0 && brace.dots !== !0) {
          let out = state3.output.slice(0, brace.outputIndex), toks = state3.tokens.slice(brace.tokensIndex);
          brace.value = brace.output = "\\{", value = output = "\\}", state3.output = out;
          for (let t2 of toks)
            state3.output += t2.output || t2.value;
        }
        push({ type: "brace", value, output }), decrement("braces"), braces.pop();
        continue;
      }
      if (value === "|") {
        if (extglobs.length > 0)
          extglobs[extglobs.length - 1].conditions++;
        push({ type: "text", value });
        continue;
      }
      if (value === ",") {
        let output = value, brace = braces[braces.length - 1];
        if (brace && stack[stack.length - 1] === "braces")
          brace.comma = !0, output = "|";
        push({ type: "comma", value, output });
        continue;
      }
      if (value === "/") {
        if (prev.type === "dot" && state3.index === state3.start + 1) {
          state3.start = state3.index + 1, state3.consumed = "", state3.output = "", tokens.pop(), prev = bos;
          continue;
        }
        push({ type: "slash", value, output: SLASH_LITERAL });
        continue;
      }
      if (value === ".") {
        if (state3.braces > 0 && prev.type === "dot") {
          if (prev.value === ".")
            prev.output = DOT_LITERAL;
          let brace = braces[braces.length - 1];
          prev.type = "dots", prev.output += value, prev.value += value, brace.dots = !0;
          continue;
        }
        if (state3.braces + state3.parens === 0 && prev.type !== "bos" && prev.type !== "slash") {
          push({ type: "text", value, output: DOT_LITERAL });
          continue;
        }
        push({ type: "dot", value, output: DOT_LITERAL });
        continue;
      }
      if (value === "?") {
        if (!(prev && prev.value === "(") && opts.noextglob !== !0 && peek() === "(" && peek(2) !== "?") {
          extglobOpen("qmark", value);
          continue;
        }
        if (prev && prev.type === "paren") {
          let next = peek(), output = value;
          if (prev.value === "(" && !/[!=<:]/.test(next) || next === "<" && !/<([!=]|\w+>)/.test(remaining()))
            output = `\\${value}`;
          push({ type: "text", value, output });
          continue;
        }
        if (opts.dot !== !0 && (prev.type === "slash" || prev.type === "bos")) {
          push({ type: "qmark", value, output: QMARK_NO_DOT });
          continue;
        }
        push({ type: "qmark", value, output: QMARK });
        continue;
      }
      if (value === "!") {
        if (opts.noextglob !== !0 && peek() === "(") {
          if (peek(2) !== "?" || !/[!=<:]/.test(peek(3))) {
            extglobOpen("negate", value);
            continue;
          }
        }
        if (opts.nonegate !== !0 && state3.index === 0) {
          negate5();
          continue;
        }
      }
      if (value === "+") {
        if (opts.noextglob !== !0 && peek() === "(" && peek(2) !== "?") {
          extglobOpen("plus", value);
          continue;
        }
        if (prev && prev.value === "(" || opts.regex === !1) {
          push({ type: "plus", value, output: PLUS_LITERAL });
          continue;
        }
        if (prev && (prev.type === "bracket" || prev.type === "paren" || prev.type === "brace") || state3.parens > 0) {
          push({ type: "plus", value });
          continue;
        }
        push({ type: "plus", value: PLUS_LITERAL });
        continue;
      }
      if (value === "@") {
        if (opts.noextglob !== !0 && peek() === "(" && peek(2) !== "?") {
          push({ type: "at", extglob: !0, value, output: "" });
          continue;
        }
        push({ type: "text", value });
        continue;
      }
      if (value !== "*") {
        if (value === "$" || value === "^")
          value = `\\${value}`;
        let match = REGEX_NON_SPECIAL_CHARS.exec(remaining());
        if (match)
          value += match[0], state3.index += match[0].length;
        push({ type: "text", value });
        continue;
      }
      if (prev && (prev.type === "globstar" || prev.star === !0)) {
        prev.type = "star", prev.star = !0, prev.value += value, prev.output = star, state3.backtrack = !0, state3.globstar = !0, consume(value);
        continue;
      }
      let rest = remaining();
      if (opts.noextglob !== !0 && /^\([^?]/.test(rest)) {
        extglobOpen("star", value);
        continue;
      }
      if (prev.type === "star") {
        if (opts.noglobstar === !0) {
          consume(value);
          continue;
        }
        let prior = prev.prev, before = prior.prev, isStart = prior.type === "slash" || prior.type === "bos", afterStar = before && (before.type === "star" || before.type === "globstar");
        if (opts.bash === !0 && (!isStart || rest[0] && rest[0] !== "/")) {
          push({ type: "star", value, output: "" });
          continue;
        }
        let isBrace = state3.braces > 0 && (prior.type === "comma" || prior.type === "brace"), isExtglob = extglobs.length && (prior.type === "pipe" || prior.type === "paren");
        if (!isStart && prior.type !== "paren" && !isBrace && !isExtglob) {
          push({ type: "star", value, output: "" });
          continue;
        }
        while (rest.slice(0, 3) === "/**") {
          let after = input[state3.index + 4];
          if (after && after !== "/")
            break;
          rest = rest.slice(3), consume("/**", 3);
        }
        if (prior.type === "bos" && eos()) {
          prev.type = "globstar", prev.value += value, prev.output = globstar(opts), state3.output = prev.output, state3.globstar = !0, consume(value);
          continue;
        }
        if (prior.type === "slash" && prior.prev.type !== "bos" && !afterStar && eos()) {
          state3.output = state3.output.slice(0, -(prior.output + prev.output).length), prior.output = `(?:${prior.output}`, prev.type = "globstar", prev.output = globstar(opts) + (opts.strictSlashes ? ")" : "|$)"), prev.value += value, state3.globstar = !0, state3.output += prior.output + prev.output, consume(value);
          continue;
        }
        if (prior.type === "slash" && prior.prev.type !== "bos" && rest[0] === "/") {
          let end = rest[1] !== void 0 ? "|$" : "";
          state3.output = state3.output.slice(0, -(prior.output + prev.output).length), prior.output = `(?:${prior.output}`, prev.type = "globstar", prev.output = `${globstar(opts)}${SLASH_LITERAL}|${SLASH_LITERAL}${end})`, prev.value += value, state3.output += prior.output + prev.output, state3.globstar = !0, consume(value + advance()), push({ type: "slash", value: "/", output: "" });
          continue;
        }
        if (prior.type === "bos" && rest[0] === "/") {
          prev.type = "globstar", prev.value += value, prev.output = `(?:^|${SLASH_LITERAL}|${globstar(opts)}${SLASH_LITERAL})`, state3.output = prev.output, state3.globstar = !0, consume(value + advance()), push({ type: "slash", value: "/", output: "" });
          continue;
        }
        state3.output = state3.output.slice(0, -prev.output.length), prev.type = "globstar", prev.output = globstar(opts), prev.value += value, state3.output += prev.output, state3.globstar = !0, consume(value);
        continue;
      }
      let token = { type: "star", value, output: star };
      if (opts.bash === !0) {
        if (token.output = ".*?", prev.type === "bos" || prev.type === "slash")
          token.output = nodot + token.output;
        push(token);
        continue;
      }
      if (prev && (prev.type === "bracket" || prev.type === "paren") && opts.regex === !0) {
        token.output = value, push(token);
        continue;
      }
      if (state3.index === state3.start || prev.type === "slash" || prev.type === "dot") {
        if (prev.type === "dot")
          state3.output += NO_DOT_SLASH, prev.output += NO_DOT_SLASH;
        else if (opts.dot === !0)
          state3.output += NO_DOTS_SLASH, prev.output += NO_DOTS_SLASH;
        else
          state3.output += nodot, prev.output += nodot;
        if (peek() !== "*")
          state3.output += ONE_CHAR, prev.output += ONE_CHAR;
      }
      push(token);
    }
    while (state3.brackets > 0) {
      if (opts.strictBrackets === !0)
        throw SyntaxError(syntaxError("closing", "]"));
      state3.output = utils.escapeLast(state3.output, "["), decrement("brackets");
    }
    while (state3.parens > 0) {
      if (opts.strictBrackets === !0)
        throw SyntaxError(syntaxError("closing", ")"));
      state3.output = utils.escapeLast(state3.output, "("), decrement("parens");
    }
    while (state3.braces > 0) {
      if (opts.strictBrackets === !0)
        throw SyntaxError(syntaxError("closing", "}"));
      state3.output = utils.escapeLast(state3.output, "{"), decrement("braces");
    }
    if (opts.strictSlashes !== !0 && (prev.type === "star" || prev.type === "bracket"))
      push({ type: "maybe_slash", value: "", output: `${SLASH_LITERAL}?` });
    if (state3.backtrack === !0) {
      state3.output = "";
      for (let token of state3.tokens)
        if (state3.output += token.output != null ? token.output : token.value, token.suffix)
          state3.output += token.suffix;
    }
    return state3;
  };
  parse10.fastpaths = (input, options2) => {
    let opts = { ...options2 }, max2 = typeof opts.maxLength === "number" ? Math.min(MAX_LENGTH, opts.maxLength) : MAX_LENGTH, len = input.length;
    if (len > max2)
      throw SyntaxError(`Input length: ${len}, exceeds maximum allowed length: ${max2}`);
    input = REPLACEMENTS[input] || input;
    let {
      DOT_LITERAL,
      SLASH_LITERAL,
      ONE_CHAR,
      DOTS_SLASH,
      NO_DOT,
      NO_DOTS,
      NO_DOTS_SLASH,
      STAR,
      START_ANCHOR
    } = constants11.globChars(opts.windows), nodot = opts.dot ? NO_DOTS : NO_DOT, slashDot = opts.dot ? NO_DOTS_SLASH : NO_DOT, capture = opts.capture ? "" : "?:", state3 = { negated: !1, prefix: "" }, star = opts.bash === !0 ? ".*?" : STAR;
    if (opts.capture)
      star = `(${star})`;
    let globstar = (opts2) => {
      if (opts2.noglobstar === !0)
        return star;
      return `(${capture}(?:(?!${START_ANCHOR}${opts2.dot ? DOTS_SLASH : DOT_LITERAL}).)*?)`;
    }, create = (str) => {
      switch (str) {
        case "*":
          return `${nodot}${ONE_CHAR}${star}`;
        case ".*":
          return `${DOT_LITERAL}${ONE_CHAR}${star}`;
        case "*.*":
          return `${nodot}${star}${DOT_LITERAL}${ONE_CHAR}${star}`;
        case "*/*":
          return `${nodot}${star}${SLASH_LITERAL}${ONE_CHAR}${slashDot}${star}`;
        case "**":
          return nodot + globstar(opts);
        case "**/*":
          return `(?:${nodot}${globstar(opts)}${SLASH_LITERAL})?${slashDot}${ONE_CHAR}${star}`;
        case "**/*.*":
          return `(?:${nodot}${globstar(opts)}${SLASH_LITERAL})?${slashDot}${star}${DOT_LITERAL}${ONE_CHAR}${star}`;
        case "**/.*":
          return `(?:${nodot}${globstar(opts)}${SLASH_LITERAL})?${DOT_LITERAL}${ONE_CHAR}${star}`;
        default: {
          let match = /^(.*?)\.(\w+)$/.exec(str);
          if (!match)
            return;
          let source2 = create(match[1]);
          if (!source2)
            return;
          return source2 + DOT_LITERAL + match[2];
        }
      }
    }, output = utils.removePrefix(input, state3), source = create(output);
    if (source && opts.strictSlashes !== !0)
      source += `${SLASH_LITERAL}?`;
    return source;
  };
  module.exports = parse10;
});
