// function: parseWord
function parseWord(P2, _ctx) {
  skipBlanks(P2.L);
  let parts = [];
  while (P2.L.i < P2.L.len) {
    let c3 = peek2(P2.L);
    if (c3 === " " || c3 === "\t" || c3 === `
` || c3 === "\r" || c3 === "" || c3 === "|" || c3 === "&" || c3 === ";" || c3 === "(" || c3 === ")")
      break;
    if (c3 === "<" || c3 === ">") {
      if (peek2(P2.L, 1) === "(") {
        let ps = parseProcessSub(P2);
        if (ps)
          parts.push(ps);
        continue;
      }
      break;
    }
    if (c3 === '"') {
      parts.push(parseDoubleQuoted(P2));
      continue;
    }
    if (c3 === "'") {
      let tok = nextToken(P2.L, "arg");
      parts.push(leaf(P2, "raw_string", tok));
      continue;
    }
    if (c3 === "$") {
      let c1 = peek2(P2.L, 1);
      if (c1 === "'") {
        let tok = nextToken(P2.L, "arg");
        parts.push(leaf(P2, "ansi_c_string", tok));
        continue;
      }
      if (c1 === '"') {
        let dTok = {
          type: "DOLLAR",
          value: "$",
          start: P2.L.b,
          end: P2.L.b + 1
        };
        advance(P2.L), parts.push(leaf(P2, "$", dTok)), parts.push(parseDoubleQuoted(P2));
        continue;
      }
      if (c1 === "`") {
        advance(P2.L);
        continue;
      }
      let exp = parseDollarLike(P2);
      if (exp)
        parts.push(exp);
      continue;
    }
    if (c3 === "`") {
      if (P2.inBacktick > 0)
        break;
      let bt = parseBacktick(P2);
      if (bt)
        parts.push(bt);
      continue;
    }
    if (c3 === "{") {
      let be = tryParseBraceExpr(P2);
      if (be) {
        parts.push(be);
        continue;
      }
      let nc = peek2(P2.L, 1);
      if (nc === ";" || nc === "|" || nc === "&" || nc === `
` || nc === "" || nc === ")" || nc === " " || nc === "\t") {
        let bStart = P2.L.b;
        advance(P2.L), parts.push(mk(P2, "word", bStart, P2.L.b, []));
        continue;
      }
      let cat = tryParseBraceLikeCat(P2);
      if (cat) {
        for (let p4 of cat)
          parts.push(p4);
        continue;
      }
    }
    if (c3 === "}") {
      let bStart = P2.L.b;
      advance(P2.L), parts.push(mk(P2, "word", bStart, P2.L.b, []));
      continue;
    }
    if (c3 === "[" || c3 === "]") {
      let bStart = P2.L.b;
      advance(P2.L), parts.push(mk(P2, "word", bStart, P2.L.b, []));
      continue;
    }
    let frag = parseBareWord(P2);
    if (!frag)
      break;
    if (frag.type === "word" && /^-?(0x)?[0-9]+#$/.test(frag.text) && peek2(P2.L) === "$" && (peek2(P2.L, 1) === "{" || peek2(P2.L, 1) === "(")) {
      let exp = parseDollarLike(P2);
      if (exp) {
        parts.push(mk(P2, "number", frag.startIndex, exp.endIndex, [exp]));
        continue;
      }
    }
    parts.push(frag);
  }
  if (parts.length === 0)
    return null;
  if (parts.length === 1)
    return parts[0];
  let first = parts[0], last2 = parts[parts.length - 1];
  return mk(P2, "concatenation", first.startIndex, last2.endIndex, parts);
}
function parseBareWord(P2) {
  let start = P2.L.b, startI = P2.L.i;
  while (P2.L.i < P2.L.len) {
    let c3 = peek2(P2.L);
    if (c3 === "\\") {
      if (P2.L.i + 1 >= P2.L.len)
        break;
      let nx = P2.L.src[P2.L.i + 1];
      if (nx === `
` || nx === "\r" && P2.L.src[P2.L.i + 2] === `
`)
        break;
      advance(P2.L), advance(P2.L);
      continue;
    }
    if (c3 === " " || c3 === "\t" || c3 === `
` || c3 === "\r" || c3 === "" || c3 === "|" || c3 === "&" || c3 === ";" || c3 === "(" || c3 === ")" || c3 === "<" || c3 === ">" || c3 === '"' || c3 === "'" || c3 === "$" || c3 === "`" || c3 === "{" || c3 === "}" || c3 === "[" || c3 === "]")
      break;
    advance(P2.L);
  }
  if (P2.L.b === start)
    return null;
  let text2 = P2.src.slice(startI, P2.L.i), type = /^-?\d+$/.test(text2) ? "number" : "word";
  return mk(P2, type, start, P2.L.b, []);
}
function tryParseBraceExpr(P2) {
  let save = saveLex(P2.L);
  if (peek2(P2.L) !== "{")
    return null;
  let oStart = P2.L.b;
  advance(P2.L);
  let oEnd = P2.L.b, p1Start = P2.L.b;
  while (isDigit2(peek2(P2.L)) || isIdentStart(peek2(P2.L)))
    advance(P2.L);
  let p1End = P2.L.b;
  if (p1End === p1Start || peek2(P2.L) !== "." || peek2(P2.L, 1) !== ".")
    return restoreLex(P2.L, save), null;
  let dotStart = P2.L.b;
  advance(P2.L), advance(P2.L);
  let dotEnd = P2.L.b, p2Start = P2.L.b;
  while (isDigit2(peek2(P2.L)) || isIdentStart(peek2(P2.L)))
    advance(P2.L);
  let p2End = P2.L.b;
  if (p2End === p2Start || peek2(P2.L) !== "}")
    return restoreLex(P2.L, save), null;
  let cStart = P2.L.b;
  advance(P2.L);
  let cEnd = P2.L.b, p1Text = sliceBytes(P2, p1Start, p1End), p2Text = sliceBytes(P2, p2Start, p2End), p1IsNum = /^\d+$/.test(p1Text), p2IsNum = /^\d+$/.test(p2Text);
  if (p1IsNum !== p2IsNum)
    return restoreLex(P2.L, save), null;
  if (!p1IsNum && (p1Text.length !== 1 || p2Text.length !== 1))
    return restoreLex(P2.L, save), null;
  let p1Type = p1IsNum ? "number" : "word", p2Type = p2IsNum ? "number" : "word";
  return mk(P2, "brace_expression", oStart, cEnd, [
    mk(P2, "{", oStart, oEnd, []),
    mk(P2, p1Type, p1Start, p1End, []),
    mk(P2, "..", dotStart, dotEnd, []),
    mk(P2, p2Type, p2Start, p2End, []),
    mk(P2, "}", cStart, cEnd, [])
  ]);
}
function tryParseBraceLikeCat(P2) {
  if (peek2(P2.L) !== "{")
    return null;
  let oStart = P2.L.b;
  advance(P2.L);
  let oEnd = P2.L.b, inner = [mk(P2, "word", oStart, oEnd, [])];
  while (P2.L.i < P2.L.len) {
    let bc = peek2(P2.L);
    if (bc === "}" || bc === `
` || bc === ";" || bc === "|" || bc === "&" || bc === " " || bc === "\t" || bc === "<" || bc === ">" || bc === "(" || bc === ")")
      break;
    if (bc === "[" || bc === "]") {
      let bStart = P2.L.b;
      advance(P2.L), inner.push(mk(P2, "word", bStart, P2.L.b, []));
      continue;
    }
    let midStart = P2.L.b;
    while (P2.L.i < P2.L.len) {
      let mc = peek2(P2.L);
      if (mc === "}" || mc === `
` || mc === ";" || mc === "|" || mc === "&" || mc === " " || mc === "\t" || mc === "<" || mc === ">" || mc === "(" || mc === ")" || mc === "[" || mc === "]")
        break;
      advance(P2.L);
    }
    let midEnd = P2.L.b;
    if (midEnd > midStart) {
      let midText = sliceBytes(P2, midStart, midEnd), midType = /^-?\d+$/.test(midText) ? "number" : "word";
      inner.push(mk(P2, midType, midStart, midEnd, []));
    } else
      break;
  }
  if (peek2(P2.L) === "}") {
    let cStart = P2.L.b;
    advance(P2.L), inner.push(mk(P2, "word", cStart, P2.L.b, []));
  }
