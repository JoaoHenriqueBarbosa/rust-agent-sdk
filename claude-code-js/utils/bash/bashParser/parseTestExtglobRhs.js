// function: parseTestExtglobRhs
function parseTestExtglobRhs(P2) {
  skipBlanks(P2.L);
  let parts = [], segStart = P2.L.b, segStartI = P2.L.i, parenDepth = 0, flushSeg = () => {
    if (P2.L.i > segStartI) {
      let text2 = P2.src.slice(segStartI, P2.L.i), type = /^\d+$/.test(text2) ? "number" : "extglob_pattern";
      parts.push(mk(P2, type, segStart, P2.L.b, []));
    }
  };
  while (P2.L.i < P2.L.len) {
    let c3 = peek2(P2.L);
    if (c3 === "\\" && P2.L.i + 1 < P2.L.len) {
      advance(P2.L), advance(P2.L);
      continue;
    }
    if (c3 === `
`)
      break;
    if (parenDepth === 0) {
      if (c3 === "]" && peek2(P2.L, 1) === "]")
        break;
      if (c3 === " " || c3 === "\t") {
        let j4 = P2.L.i;
        while (j4 < P2.L.len && (P2.L.src[j4] === " " || P2.L.src[j4] === "\t"))
          j4++;
        let nc = P2.L.src[j4] ?? "", nc1 = P2.L.src[j4 + 1] ?? "";
        if (nc === "]" && nc1 === "]" || nc === "&" && nc1 === "&" || nc === "|" && nc1 === "|")
          break;
        advance(P2.L);
        continue;
      }
    }
    if (c3 === "$") {
      let c1 = peek2(P2.L, 1);
      if (c1 === "(" || c1 === "{" || isIdentStart(c1) || SPECIAL_VARS.has(c1)) {
        flushSeg();
        let exp = parseDollarLike(P2);
        if (exp)
          parts.push(exp);
        segStart = P2.L.b, segStartI = P2.L.i;
        continue;
      }
    }
    if (c3 === '"') {
      flushSeg(), parts.push(parseDoubleQuoted(P2)), segStart = P2.L.b, segStartI = P2.L.i;
      continue;
    }
    if (c3 === "'") {
      flushSeg();
      let tok = nextToken(P2.L, "arg");
      parts.push(leaf(P2, "raw_string", tok)), segStart = P2.L.b, segStartI = P2.L.i;
      continue;
    }
    if (c3 === "(")
      parenDepth++;
    else if (c3 === ")" && parenDepth > 0)
      parenDepth--;
    advance(P2.L);
  }
  return flushSeg(), parts;
}
function parseTestPrimary(P2, closer) {
  if (skipBlanks(P2.L), closer === "]" && peek2(P2.L) === "]")
    return null;
  if (closer === "]]" && peek2(P2.L) === "]" && peek2(P2.L, 1) === "]")
    return null;
  return parseWord(P2, "arg");
}
function parseArithExpr(P2, stop, mode = "var") {
  return parseArithTernary(P2, stop, mode);
}
function parseArithCommaList(P2, stop, mode = "var") {
  let out = [];
  while (!0) {
    let e = parseArithTernary(P2, stop, mode);
    if (e)
      out.push(e);
    if (skipBlanks(P2.L), peek2(P2.L) === "," && !isArithStop(P2, stop)) {
      advance(P2.L);
      continue;
    }
    break;
  }
  return out;
}
function parseArithTernary(P2, stop, mode) {
  let cond = parseArithBinary(P2, stop, 0, mode);
  if (!cond)
    return null;
  if (skipBlanks(P2.L), peek2(P2.L) === "?") {
    let qs = P2.L.b;
    advance(P2.L);
    let q4 = mk(P2, "?", qs, P2.L.b, []), t2 = parseArithBinary(P2, ":", 0, mode);
    skipBlanks(P2.L);
    let colon;
    if (peek2(P2.L) === ":") {
      let cs = P2.L.b;
      advance(P2.L), colon = mk(P2, ":", cs, P2.L.b, []);
    } else
      colon = mk(P2, ":", P2.L.b, P2.L.b, []);
    let f = parseArithTernary(P2, stop, mode), last2 = f ?? colon, kids = [cond, q4];
    if (t2)
      kids.push(t2);
    if (kids.push(colon), f)
      kids.push(f);
    return mk(P2, "ternary_expression", cond.startIndex, last2.endIndex, kids);
  }
  return cond;
}
function scanArithOp(P2) {
  let c3 = peek2(P2.L), c1 = peek2(P2.L, 1), c22 = peek2(P2.L, 2);
  if (c3 === "<" && c1 === "<" && c22 === "=")
    return ["<<=", 3];
  if (c3 === ">" && c1 === ">" && c22 === "=")
    return [">>=", 3];
  if (c3 === "*" && c1 === "*")
    return ["**", 2];
  if (c3 === "<" && c1 === "<")
    return ["<<", 2];
  if (c3 === ">" && c1 === ">")
    return [">>", 2];
  if (c3 === "=" && c1 === "=")
    return ["==", 2];
  if (c3 === "!" && c1 === "=")
    return ["!=", 2];
  if (c3 === "<" && c1 === "=")
    return ["<=", 2];
  if (c3 === ">" && c1 === "=")
    return [">=", 2];
  if (c3 === "&" && c1 === "&")
    return ["&&", 2];
  if (c3 === "|" && c1 === "|")
    return ["||", 2];
  if (c3 === "+" && c1 === "=")
    return ["+=", 2];
  if (c3 === "-" && c1 === "=")
    return ["-=", 2];
  if (c3 === "*" && c1 === "=")
    return ["*=", 2];
  if (c3 === "/" && c1 === "=")
    return ["/=", 2];
  if (c3 === "%" && c1 === "=")
    return ["%=", 2];
  if (c3 === "&" && c1 === "=")
    return ["&=", 2];
  if (c3 === "^" && c1 === "=")
    return ["^=", 2];
  if (c3 === "|" && c1 === "=")
    return ["|=", 2];
  if (c3 === "+" && c1 !== "+")
    return ["+", 1];
  if (c3 === "-" && c1 !== "-")
    return ["-", 1];
  if (c3 === "*")
    return ["*", 1];
  if (c3 === "/")
    return ["/", 1];
  if (c3 === "%")
    return ["%", 1];
  if (c3 === "<")
    return ["<", 1];
  if (c3 === ">")
    return [">", 1];
  if (c3 === "&")
    return ["&", 1];
  if (c3 === "|")
    return ["|", 1];
  if (c3 === "^")
    return ["^", 1];
  if (c3 === "=")
    return ["=", 1];
  return null;
}
function parseArithBinary(P2, stop, minPrec, mode) {
  let left = parseArithUnary(P2, stop, mode);
  if (!left)
    return null;
  while (!0) {
    if (skipBlanks(P2.L), isArithStop(P2, stop))
      break;
    if (peek2(P2.L) === ",")
      break;
    let opInfo = scanArithOp(P2);
    if (!opInfo)
      break;
    let [opText, opLen] = opInfo, prec = ARITH_PREC[opText];
    if (prec === void 0 || prec < minPrec)
      break;
    let os6 = P2.L.b;
    for (let k3 = 0;k3 < opLen; k3++)
      advance(P2.L);
    let op = mk(P2, opText, os6, P2.L.b, []), nextMin = ARITH_RIGHT_ASSOC.has(opText) ? prec : prec + 1, right = parseArithBinary(P2, stop, nextMin, mode);
    if (!right)
      break;
    left = mk(P2, "binary_expression", left.startIndex, right.endIndex, [
      left,
      op,
      right
    ]);
  }
  return left;
}
function parseArithUnary(P2, stop, mode) {
  if (skipBlanks(P2.L), isArithStop(P2, stop))
    return null;
  let c3 = peek2(P2.L), c1 = peek2(P2.L, 1);
  if (c3 === "+" && c1 === "+" || c3 === "-" && c1 === "-") {
    let s2 = P2.L.b;
    advance(P2.L), advance(P2.L);
    let op = mk(P2, c3 + c1, s2, P2.L.b, []), inner = parseArithUnary(P2, stop, mode);
    if (!inner)
      return op;
    return mk(P2, "unary_expression", op.startIndex, inner.endIndex, [op, inner]);
  }
  if (c3 === "-" || c3 === "+" || c3 === "!" || c3 === "~") {
    if (mode !== "var" && c3 === "-" && isDigit2(c1)) {
      let s3 = P2.L.b;
      advance(P2.L);
      while (isDigit2(peek2(P2.L)))
        advance(P2.L);
      return mk(P2, "number", s3, P2.L.b, []);
    }
    let s2 = P2.L.b;
    advance(P2.L);
    let op = mk(P2, c3, s2, P2.L.b, []), inner = parseArithUnary(P2, stop, mode);
    if (!inner)
      return op;
    return mk(P2, "unary_expression", op.startIndex, inner.endIndex, [op, inner]);
  }
  return parseArithPostfix(P2, stop, mode);
}
function parseArithPostfix(P2, stop, mode) {
  let prim = parseArithPrimary(P2, stop, mode);
  if (!prim)
    return null;
  let c3 = peek2(P2.L), c1 = peek2(P2.L, 1);
  if (c3 === "+" && c1 === "+" || c3 === "-" && c1 === "-") {
    let s2 = P2.L.b;
    advance(P2.L), advance(P2.L);
    let op = mk(P2, c3 + c1, s2, P2.L.b, []);
    return mk(P2, "postfix_expression", prim.startIndex, op.endIndex, [prim, op]);
  }
  return prim;
}
function parseArithPrimary(P2, stop, mode) {
  if (skipBlanks(P2.L), isArithStop(P2, stop))
    return null;
  let c3 = peek2(P2.L);
  if (c3 === "(") {
    let s2 = P2.L.b;
    advance(P2.L);
    let open5 = mk(P2, "(", s2, P2.L.b, []), inners = parseArithCommaList(P2, ")", mode);
    skipBlanks(P2.L);
    let close;
    if (peek2(P2.L) === ")") {
      let cs = P2.L.b;
      advance(P2.L), close = mk(P2, ")", cs, P2.L.b, []);
    } else
      close = mk(P2, ")", P2.L.b, P2.L.b, []);
    return mk(P2, "parenthesized_expression", open5.startIndex, close.endIndex, [
      open5,
      ...inners,
      close
    ]);
  }
  if (c3 === '"')
    return parseDoubleQuoted(P2);
  if (c3 === "$")
    return parseDollarLike(P2);
  if (isDigit2(c3)) {
    let s2 = P2.L.b;
    while (isDigit2(peek2(P2.L)))
      advance(P2.L);
    if (P2.L.b - s2 === 1 && c3 === "0" && (peek2(P2.L) === "x" || peek2(P2.L) === "X")) {
      advance(P2.L);
      while (isHexDigit(peek2(P2.L)))
        advance(P2.L);
    } else if (peek2(P2.L) === "#") {
      advance(P2.L);
      while (isBaseDigit(peek2(P2.L)))
        advance(P2.L);
    }
    return mk(P2, "number", s2, P2.L.b, []);
  }
  if (isIdentStart(c3)) {
    let s2 = P2.L.b;
    while (isIdentChar(peek2(P2.L)))
      advance(P2.L);
    let nc = peek2(P2.L);
    if (mode === "assign") {
      skipBlanks(P2.L);
      let ac = peek2(P2.L), ac1 = peek2(P2.L, 1);
      if (ac === "=" && ac1 !== "=") {
        let vn = mk(P2, "variable_name", s2, P2.L.b, []), es = P2.L.b;
        advance(P2.L);
        let eq2 = mk(P2, "=", es, P2.L.b, []), val = parseArithTernary(P2, stop, mode), end = val ? val.endIndex : eq2.endIndex;
        return mk(P2, "variable_assignment", s2, end, val ? [vn, eq2, val] : [vn, eq2]);
      }
    }
    if (nc === "[") {
      let vn = mk(P2, "variable_name", s2, P2.L.b, []), brS = P2.L.b;
      advance(P2.L);
      let brOpen = mk(P2, "[", brS, P2.L.b, []), idx = parseArithTernary(P2, "]", "var") ?? parseDollarLike(P2);
      skipBlanks(P2.L);
      let brClose;
      if (peek2(P2.L) === "]") {
        let cs = P2.L.b;
        advance(P2.L), brClose = mk(P2, "]", cs, P2.L.b, []);
      } else
        brClose = mk(P2, "]", P2.L.b, P2.L.b, []);
      let kids = idx ? [vn, brOpen, idx, brClose] : [vn, brOpen, brClose];
      return mk(P2, "subscript", s2, brClose.endIndex, kids);
    }
    return mk(P2, mode === "var" ? "variable_name" : "word", s2, P2.L.b, []);
  }
  return null;
}
function isArithStop(P2, stop) {
  let c3 = peek2(P2.L);
  if (stop === "))")
    return c3 === ")" && peek2(P2.L, 1) === ")";
  if (stop === ")")
    return c3 === ")";
  if (stop === ";")
    return c3 === ";";
  if (stop === ":")
    return c3 === ":";
  if (stop === "]")
    return c3 === "]";
  if (stop === "}")
    return c3 === "}";
