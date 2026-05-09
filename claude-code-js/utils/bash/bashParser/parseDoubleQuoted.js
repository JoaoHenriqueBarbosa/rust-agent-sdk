// function: parseDoubleQuoted
function parseDoubleQuoted(P2) {
  let qStart = P2.L.b;
  advance(P2.L);
  let qEnd = P2.L.b, parts = [mk(P2, '"', qStart, qEnd, [])], contentStart = P2.L.b, contentStartI = P2.L.i, flushContent = () => {
    if (P2.L.b > contentStart) {
      let txt = P2.src.slice(contentStartI, P2.L.i);
      if (!/^[ \t]+$/.test(txt))
        parts.push(mk(P2, "string_content", contentStart, P2.L.b, []));
    }
  };
  while (P2.L.i < P2.L.len) {
    let c3 = peek2(P2.L);
    if (c3 === '"')
      break;
    if (c3 === "\\" && P2.L.i + 1 < P2.L.len) {
      advance(P2.L), advance(P2.L);
      continue;
    }
    if (c3 === `
`) {
      flushContent(), advance(P2.L), contentStart = P2.L.b, contentStartI = P2.L.i;
      continue;
    }
    if (c3 === "$") {
      let c1 = peek2(P2.L, 1);
      if (c1 === "(" || c1 === "{" || isIdentStart(c1) || SPECIAL_VARS.has(c1) || isDigit2(c1)) {
        flushContent();
        let exp = parseDollarLike(P2);
        if (exp)
          parts.push(exp);
        contentStart = P2.L.b, contentStartI = P2.L.i;
        continue;
      }
      if (c1 !== '"' && c1 !== "") {
        flushContent();
        let dS = P2.L.b;
        advance(P2.L), parts.push(mk(P2, "$", dS, P2.L.b, [])), contentStart = P2.L.b, contentStartI = P2.L.i;
        continue;
      }
    }
    if (c3 === "`") {
      flushContent();
      let bt = parseBacktick(P2);
      if (bt)
        parts.push(bt);
      contentStart = P2.L.b, contentStartI = P2.L.i;
      continue;
    }
    advance(P2.L);
  }
  flushContent();
  let close;
  if (peek2(P2.L) === '"') {
    let cStart = P2.L.b;
    advance(P2.L), close = mk(P2, '"', cStart, P2.L.b, []);
  } else
    close = mk(P2, '"', P2.L.b, P2.L.b, []);
  return parts.push(close), mk(P2, "string", qStart, close.endIndex, parts);
}
function parseDollarLike(P2) {
  let c1 = peek2(P2.L, 1), dStart = P2.L.b;
  if (c1 === "(" && peek2(P2.L, 2) === "(") {
    advance(P2.L), advance(P2.L), advance(P2.L);
    let open5 = mk(P2, "$((", dStart, P2.L.b, []), exprs = parseArithCommaList(P2, "))", "var");
    skipBlanks(P2.L);
    let close;
    if (peek2(P2.L) === ")" && peek2(P2.L, 1) === ")") {
      let cStart = P2.L.b;
      advance(P2.L), advance(P2.L), close = mk(P2, "))", cStart, P2.L.b, []);
    } else
      close = mk(P2, "))", P2.L.b, P2.L.b, []);
    return mk(P2, "arithmetic_expansion", dStart, close.endIndex, [
      open5,
      ...exprs,
      close
    ]);
  }
  if (c1 === "[") {
    advance(P2.L), advance(P2.L);
    let open5 = mk(P2, "$[", dStart, P2.L.b, []), exprs = parseArithCommaList(P2, "]", "var");
    skipBlanks(P2.L);
    let close;
    if (peek2(P2.L) === "]") {
      let cStart = P2.L.b;
      advance(P2.L), close = mk(P2, "]", cStart, P2.L.b, []);
    } else
      close = mk(P2, "]", P2.L.b, P2.L.b, []);
    return mk(P2, "arithmetic_expansion", dStart, close.endIndex, [
      open5,
      ...exprs,
      close
    ]);
  }
  if (c1 === "(") {
    advance(P2.L), advance(P2.L);
    let open5 = mk(P2, "$(", dStart, P2.L.b, []), body = parseStatements(P2, ")");
    skipBlanks(P2.L);
    let close;
    if (peek2(P2.L) === ")") {
      let cStart = P2.L.b;
      advance(P2.L), close = mk(P2, ")", cStart, P2.L.b, []);
    } else
      close = mk(P2, ")", P2.L.b, P2.L.b, []);
    if (body.length === 1 && body[0].type === "redirected_statement" && body[0].children.length === 1 && body[0].children[0].type === "file_redirect")
      body = body[0].children;
    return mk(P2, "command_substitution", dStart, close.endIndex, [
      open5,
      ...body,
      close
    ]);
  }
  if (c1 === "{") {
    advance(P2.L), advance(P2.L);
    let open5 = mk(P2, "${", dStart, P2.L.b, []), inner = parseExpansionBody(P2), close;
    if (peek2(P2.L) === "}") {
      let cStart = P2.L.b;
      advance(P2.L), close = mk(P2, "}", cStart, P2.L.b, []);
    } else
      close = mk(P2, "}", P2.L.b, P2.L.b, []);
    return mk(P2, "expansion", dStart, close.endIndex, [open5, ...inner, close]);
  }
  advance(P2.L);
  let dEnd = P2.L.b, dollar = mk(P2, "$", dStart, dEnd, []), nc = peek2(P2.L);
  if (nc === "_" && !isIdentChar(peek2(P2.L, 1))) {
    let vStart = P2.L.b;
    advance(P2.L);
    let vn = mk(P2, "special_variable_name", vStart, P2.L.b, []);
    return mk(P2, "simple_expansion", dStart, P2.L.b, [dollar, vn]);
  }
  if (isIdentStart(nc)) {
    let vStart = P2.L.b;
    while (isIdentChar(peek2(P2.L)))
      advance(P2.L);
    let vn = mk(P2, "variable_name", vStart, P2.L.b, []);
    return mk(P2, "simple_expansion", dStart, P2.L.b, [dollar, vn]);
  }
  if (isDigit2(nc)) {
    let vStart = P2.L.b;
    advance(P2.L);
    let vn = mk(P2, "variable_name", vStart, P2.L.b, []);
    return mk(P2, "simple_expansion", dStart, P2.L.b, [dollar, vn]);
  }
  if (SPECIAL_VARS.has(nc)) {
    let vStart = P2.L.b;
    advance(P2.L);
    let vn = mk(P2, "special_variable_name", vStart, P2.L.b, []);
    return mk(P2, "simple_expansion", dStart, P2.L.b, [dollar, vn]);
  }
  return dollar;
}
