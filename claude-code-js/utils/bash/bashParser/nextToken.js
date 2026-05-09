// function: nextToken
function nextToken(L2, ctx = "arg") {
  skipBlanks(L2);
  let start = L2.b;
  if (L2.i >= L2.len)
    return { type: "EOF", value: "", start, end: start };
  let c3 = L2.src[L2.i], c1 = peek2(L2, 1), c22 = peek2(L2, 2);
  if (c3 === `
`)
    return advance(L2), { type: "NEWLINE", value: `
`, start, end: L2.b };
  if (c3 === "#") {
    let si = L2.i;
    while (L2.i < L2.len && L2.src[L2.i] !== `
`)
      advance(L2);
    return {
      type: "COMMENT",
      value: L2.src.slice(si, L2.i),
      start,
      end: L2.b
    };
  }
  if (c3 === "&" && c1 === "&")
    return advance(L2), advance(L2), { type: "OP", value: "&&", start, end: L2.b };
  if (c3 === "|" && c1 === "|")
    return advance(L2), advance(L2), { type: "OP", value: "||", start, end: L2.b };
  if (c3 === "|" && c1 === "&")
    return advance(L2), advance(L2), { type: "OP", value: "|&", start, end: L2.b };
  if (c3 === ";" && c1 === ";" && c22 === "&")
    return advance(L2), advance(L2), advance(L2), { type: "OP", value: ";;&", start, end: L2.b };
  if (c3 === ";" && c1 === ";")
    return advance(L2), advance(L2), { type: "OP", value: ";;", start, end: L2.b };
  if (c3 === ";" && c1 === "&")
    return advance(L2), advance(L2), { type: "OP", value: ";&", start, end: L2.b };
  if (c3 === ">" && c1 === ">")
    return advance(L2), advance(L2), { type: "OP", value: ">>", start, end: L2.b };
  if (c3 === ">" && c1 === "&" && c22 === "-")
    return advance(L2), advance(L2), advance(L2), { type: "OP", value: ">&-", start, end: L2.b };
  if (c3 === ">" && c1 === "&")
    return advance(L2), advance(L2), { type: "OP", value: ">&", start, end: L2.b };
  if (c3 === ">" && c1 === "|")
    return advance(L2), advance(L2), { type: "OP", value: ">|", start, end: L2.b };
  if (c3 === "&" && c1 === ">" && c22 === ">")
    return advance(L2), advance(L2), advance(L2), { type: "OP", value: "&>>", start, end: L2.b };
  if (c3 === "&" && c1 === ">")
    return advance(L2), advance(L2), { type: "OP", value: "&>", start, end: L2.b };
  if (c3 === "<" && c1 === "<" && c22 === "<")
    return advance(L2), advance(L2), advance(L2), { type: "OP", value: "<<<", start, end: L2.b };
  if (c3 === "<" && c1 === "<" && c22 === "-")
    return advance(L2), advance(L2), advance(L2), { type: "OP", value: "<<-", start, end: L2.b };
  if (c3 === "<" && c1 === "<")
    return advance(L2), advance(L2), { type: "OP", value: "<<", start, end: L2.b };
  if (c3 === "<" && c1 === "&" && c22 === "-")
    return advance(L2), advance(L2), advance(L2), { type: "OP", value: "<&-", start, end: L2.b };
  if (c3 === "<" && c1 === "&")
    return advance(L2), advance(L2), { type: "OP", value: "<&", start, end: L2.b };
  if (c3 === "<" && c1 === "(")
    return advance(L2), advance(L2), { type: "LT_PAREN", value: "<(", start, end: L2.b };
  if (c3 === ">" && c1 === "(")
    return advance(L2), advance(L2), { type: "GT_PAREN", value: ">(", start, end: L2.b };
  if (c3 === "(" && c1 === "(")
    return advance(L2), advance(L2), { type: "OP", value: "((", start, end: L2.b };
  if (c3 === ")" && c1 === ")")
    return advance(L2), advance(L2), { type: "OP", value: "))", start, end: L2.b };
  if (c3 === "|" || c3 === "&" || c3 === ";" || c3 === ">" || c3 === "<")
    return advance(L2), { type: "OP", value: c3, start, end: L2.b };
  if (c3 === "(" || c3 === ")")
    return advance(L2), { type: "OP", value: c3, start, end: L2.b };
  if (ctx === "cmd") {
    if (c3 === "[" && c1 === "[")
      return advance(L2), advance(L2), { type: "OP", value: "[[", start, end: L2.b };
    if (c3 === "[")
      return advance(L2), { type: "OP", value: "[", start, end: L2.b };
    if (c3 === "{" && (c1 === " " || c1 === "\t" || c1 === `
`))
      return advance(L2), { type: "OP", value: "{", start, end: L2.b };
    if (c3 === "}")
      return advance(L2), { type: "OP", value: "}", start, end: L2.b };
    if (c3 === "!" && (c1 === " " || c1 === "\t"))
      return advance(L2), { type: "OP", value: "!", start, end: L2.b };
  }
  if (c3 === '"')
    return advance(L2), { type: "DQUOTE", value: '"', start, end: L2.b };
  if (c3 === "'") {
    let si = L2.i;
    advance(L2);
    while (L2.i < L2.len && L2.src[L2.i] !== "'")
      advance(L2);
    if (L2.i < L2.len)
      advance(L2);
    return {
      type: "SQUOTE",
      value: L2.src.slice(si, L2.i),
      start,
      end: L2.b
    };
  }
  if (c3 === "$") {
    if (c1 === "(" && c22 === "(")
      return advance(L2), advance(L2), advance(L2), { type: "DOLLAR_DPAREN", value: "$((", start, end: L2.b };
    if (c1 === "(")
      return advance(L2), advance(L2), { type: "DOLLAR_PAREN", value: "$(", start, end: L2.b };
    if (c1 === "{")
      return advance(L2), advance(L2), { type: "DOLLAR_BRACE", value: "${", start, end: L2.b };
    if (c1 === "'") {
      let si = L2.i;
      advance(L2), advance(L2);
      while (L2.i < L2.len && L2.src[L2.i] !== "'") {
        if (L2.src[L2.i] === "\\" && L2.i + 1 < L2.len)
          advance(L2);
        advance(L2);
      }
      if (L2.i < L2.len)
        advance(L2);
      return {
        type: "ANSI_C",
        value: L2.src.slice(si, L2.i),
        start,
        end: L2.b
      };
    }
    return advance(L2), { type: "DOLLAR", value: "$", start, end: L2.b };
  }
  if (c3 === "`")
    return advance(L2), { type: "BACKTICK", value: "`", start, end: L2.b };
  if (isDigit2(c3)) {
    let j4 = L2.i;
    while (j4 < L2.len && isDigit2(L2.src[j4]))
      j4++;
    let after = j4 < L2.len ? L2.src[j4] : "";
    if (after === ">" || after === "<") {
      let si = L2.i;
      while (L2.i < j4)
        advance(L2);
      return {
        type: "WORD",
        value: L2.src.slice(si, L2.i),
        start,
        end: L2.b
      };
    }
  }
  if (isWordStart(c3) || c3 === "{" || c3 === "}") {
    let si = L2.i;
    while (L2.i < L2.len) {
      let ch2 = L2.src[L2.i];
      if (ch2 === "\\") {
        if (L2.i + 1 >= L2.len)
          break;
        if (L2.src[L2.i + 1] === `
`) {
          advance(L2), advance(L2);
          continue;
        }
        advance(L2), advance(L2);
        continue;
      }
      if (!isWordChar(ch2) && ch2 !== "{" && ch2 !== "}")
        break;
      advance(L2);
    }
    if (L2.i > si) {
      let v2 = L2.src.slice(si, L2.i);
      if (/^-?\d+$/.test(v2))
        return { type: "NUMBER", value: v2, start, end: L2.b };
      return { type: "WORD", value: v2, start, end: L2.b };
    }
  }
  return advance(L2), { type: "WORD", value: c3, start, end: L2.b };
}
function parseSource(source, timeoutMs) {
  let L2 = makeLexer(source), srcBytes = byteLengthUtf8(source), P2 = {
    L: L2,
    src: source,
    srcBytes,
    isAscii: srcBytes === source.length,
    nodeCount: 0,
    deadline: performance.now() + (timeoutMs ?? 50),
    aborted: !1,
    inBacktick: 0,
    stopToken: null
  };
  try {
    let program = parseProgram(P2);
    if (P2.aborted)
      return null;
    return program;
  } catch {
    return null;
  }
}
function byteLengthUtf8(s2) {
  let b = 0;
  for (let i5 = 0;i5 < s2.length; i5++) {
    let c3 = s2.charCodeAt(i5);
    if (c3 < 128)
      b++;
    else if (c3 < 2048)
      b += 2;
    else if (c3 >= 55296 && c3 <= 56319)
      b += 4, i5++;
    else
      b += 3;
  }
  return b;
}
function checkBudget(P2) {
  if (P2.nodeCount++, P2.nodeCount > 50000)
    throw P2.aborted = !0, Error("budget");
  if ((P2.nodeCount & 127) === 0 && performance.now() > P2.deadline)
    throw P2.aborted = !0, Error("timeout");
}
function mk(P2, type, start, end, children) {
  return checkBudget(P2), {
    type,
    text: sliceBytes(P2, start, end),
    startIndex: start,
    endIndex: end,
    children
  };
}
function sliceBytes(P2, startByte, endByte) {
  if (P2.isAscii)
    return P2.src.slice(startByte, endByte);
  let L2 = P2.L;
  if (!L2.byteTable)
    byteAt(L2, 0);
  let t2 = L2.byteTable, lo = 0, hi = P2.src.length;
  while (lo < hi) {
    let m4 = lo + hi >>> 1;
    if (t2[m4] < startByte)
      lo = m4 + 1;
    else
      hi = m4;
  }
  let sc = lo;
  lo = sc, hi = P2.src.length;
  while (lo < hi) {
    let m4 = lo + hi >>> 1;
    if (t2[m4] < endByte)
      lo = m4 + 1;
    else
      hi = m4;
  }
  return P2.src.slice(sc, lo);
}
function leaf(P2, type, tok) {
  return mk(P2, type, tok.start, tok.end, []);
}
function parseProgram(P2) {
  let children = [];
  skipBlanks(P2.L);
  while (!0) {
    let save = saveLex(P2.L);
    if (nextToken(P2.L, "cmd").type === "NEWLINE") {
      skipBlanks(P2.L);
      continue;
    }
    restoreLex(P2.L, save);
    break;
  }
  let progStart = P2.L.b;
  while (P2.L.i < P2.L.len) {
    let save = saveLex(P2.L), t2 = nextToken(P2.L, "cmd");
    if (t2.type === "EOF")
      break;
    if (t2.type === "NEWLINE")
      continue;
    if (t2.type === "COMMENT") {
      children.push(leaf(P2, "comment", t2));
      continue;
    }
    restoreLex(P2.L, save);
    let stmts = parseStatements(P2, null);
    for (let s2 of stmts)
      children.push(s2);
    if (stmts.length === 0) {
      let errTok = nextToken(P2.L, "cmd");
      if (errTok.type === "EOF")
        break;
      if (errTok.type === "OP" && errTok.value === ";;" && children.length > 0)
        continue;
      children.push(mk(P2, "ERROR", errTok.start, errTok.end, []));
    }
  }
  let progEnd = children.length > 0 ? P2.srcBytes : progStart;
  return mk(P2, "program", progStart, progEnd, children);
}
function saveLex(L2) {
  return L2.b * 65536 + L2.i;
}
function restoreLex(L2, s2) {
  L2.i = s2 & 65535, L2.b = s2 >>> 16;
}
function parseStatements(P2, terminator) {
  let out = [];
  while (!0) {
    skipBlanks(P2.L);
    let save = saveLex(P2.L), t2 = nextToken(P2.L, "cmd");
    if (t2.type === "EOF") {
      restoreLex(P2.L, save);
      break;
    }
    if (t2.type === "NEWLINE") {
      if (P2.L.heredocs.length > 0)
        scanHeredocBodies(P2);
      continue;
    }
    if (t2.type === "COMMENT") {
      out.push(leaf(P2, "comment", t2));
      continue;
    }
    if (terminator && t2.type === "OP" && t2.value === terminator) {
      restoreLex(P2.L, save);
      break;
    }
    if (t2.type === "OP" && (t2.value === ")" || t2.value === "}" || t2.value === ";;" || t2.value === ";&" || t2.value === ";;&" || t2.value === "))" || t2.value === "]]" || t2.value === "]")) {
      restoreLex(P2.L, save);
      break;
    }
    if (t2.type === "BACKTICK" && P2.inBacktick > 0) {
      restoreLex(P2.L, save);
      break;
    }
    if (t2.type === "WORD" && (t2.value === "then" || t2.value === "elif" || t2.value === "else" || t2.value === "fi" || t2.value === "do" || t2.value === "done" || t2.value === "esac")) {
      restoreLex(P2.L, save);
      break;
    }
    restoreLex(P2.L, save);
    let stmt = parseAndOr(P2);
    if (!stmt)
      break;
    out.push(stmt), skipBlanks(P2.L);
    let save2 = saveLex(P2.L), sep13 = nextToken(P2.L, "cmd");
    if (sep13.type === "OP" && (sep13.value === ";" || sep13.value === "&")) {
      let save3 = saveLex(P2.L), after = nextToken(P2.L, "cmd");
      if (restoreLex(P2.L, save3), out.push(leaf(P2, sep13.value, sep13)), after.type === "EOF" || after.type === "OP" && (after.value === ")" || after.value === "}" || after.value === ";;" || after.value === ";&" || after.value === ";;&") || after.type === "WORD" && (after.value === "then" || after.value === "elif" || after.value === "else" || after.value === "fi" || after.value === "do" || after.value === "done" || after.value === "esac"))
        continue;
    } else if (sep13.type === "NEWLINE") {
      if (P2.L.heredocs.length > 0)
        scanHeredocBodies(P2);
      continue;
    } else
      restoreLex(P2.L, save2);
  }
  return out;
}
