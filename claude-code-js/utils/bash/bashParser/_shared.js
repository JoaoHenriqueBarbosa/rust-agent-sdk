// Shared module state and imports
// Original: src/utils/bash/bashParser.ts
      open5,
      ...body,
      close
    ]);
    return maybeRedirect(P2, node);
  }
  if (t2.type === "OP" && (t2.value === "[" || t2.value === "[[")) {
    let open5 = leaf(P2, t2.value, t2), closer = t2.value === "[" ? "]" : "]]", exprSave = saveLex(P2.L), expr = parseTestExpr(P2, closer);
    if (skipBlanks(P2.L), t2.value === "[" && peek2(P2.L) !== "]") {
      restoreLex(P2.L, exprSave);
      let prevStop = P2.stopToken;
      P2.stopToken = "]";
      let rstmt = parseCommand2(P2);
      if (P2.stopToken = prevStop, rstmt && rstmt.type === "redirected_statement")
        expr = rstmt;
      else
        restoreLex(P2.L, exprSave), expr = parseTestExpr(P2, closer);
      skipBlanks(P2.L);
    }
    let closeTok = nextToken(P2.L, "arg"), close;
    if (closeTok.value === closer)
      close = leaf(P2, closer, closeTok);
    else
      close = mk(P2, closer, open5.endIndex, open5.endIndex, []);
    let kids = expr ? [open5, expr, close] : [open5, close];
    return mk(P2, "test_command", open5.startIndex, close.endIndex, kids);
  }
  if (t2.type === "WORD") {
    if (t2.value === "if")
      return maybeRedirect(P2, parseIf(P2, t2), !0);
    if (t2.value === "while" || t2.value === "until")
      return maybeRedirect(P2, parseWhile(P2, t2), !0);
    if (t2.value === "for")
      return maybeRedirect(P2, parseFor(P2, t2), !0);
    if (t2.value === "select")
      return maybeRedirect(P2, parseFor(P2, t2), !0);
    if (t2.value === "case")
      return maybeRedirect(P2, parseCase(P2, t2), !0);
    if (t2.value === "function")
      return parseFunction(P2, t2);
    if (DECL_KEYWORDS.has(t2.value))
      return maybeRedirect(P2, parseDeclaration(P2, t2));
    if (t2.value === "unset" || t2.value === "unsetenv")
      return maybeRedirect(P2, parseUnset(P2, t2));
  }
  return restoreLex(P2.L, save), parseSimpleCommand(P2);
}
  let kids = val ? [lhs, opNode, val] : [lhs, opNode], end = val ? val.endIndex : opEnd;
  return mk(P2, "variable_assignment", startB, end, kids);
}
    return !1;
  if (P2.stopToken === "]" && c3 === "]")
    return !1;
  return !0;
}
  return inner;
}
  }
  if (peek2(P2.L) === "#") {
    let s2 = P2.L.b;
    advance(P2.L), out.push(mk(P2, "#", s2, P2.L.b, []));
  }
  let pc = peek2(P2.L);
  if ((pc === "!" || pc === "=" || pc === "~") && (isIdentStart(peek2(P2.L, 1)) || isDigit2(peek2(P2.L, 1)))) {
    let s2 = P2.L.b;
    advance(P2.L), out.push(mk(P2, pc, s2, P2.L.b, []));
  }
  if (skipBlanks(P2.L), isIdentStart(peek2(P2.L))) {
    let s2 = P2.L.b;
    while (isIdentChar(peek2(P2.L)))
      advance(P2.L);
    out.push(mk(P2, "variable_name", s2, P2.L.b, []));
  } else if (isDigit2(peek2(P2.L))) {
    let s2 = P2.L.b;
    while (isDigit2(peek2(P2.L)))
      advance(P2.L);
    out.push(mk(P2, "variable_name", s2, P2.L.b, []));
  } else if (SPECIAL_VARS.has(peek2(P2.L))) {
    let s2 = P2.L.b;
    advance(P2.L), out.push(mk(P2, "special_variable_name", s2, P2.L.b, []));
  }
  if (peek2(P2.L) === "[") {
    let varNode = out[out.length - 1], brOpen = P2.L.b;
    advance(P2.L);
    let brOpenNode = mk(P2, "[", brOpen, P2.L.b, []), idx = parseSubscriptIndexInline(P2);
    skipBlanks(P2.L);
    let brClose = P2.L.b;
    if (peek2(P2.L) === "]")
      advance(P2.L);
    let brCloseNode = mk(P2, "]", brClose, P2.L.b, []);
    if (varNode) {
      let kids = idx ? [varNode, brOpenNode, idx, brCloseNode] : [varNode, brOpenNode, brCloseNode];
      out[out.length - 1] = mk(P2, "subscript", varNode.startIndex, P2.L.b, kids);
    }
  }
  skipBlanks(P2.L);
  let tc = peek2(P2.L);
  if ((tc === "*" || tc === "@") && peek2(P2.L, 1) === "}") {
    let s2 = P2.L.b;
    return advance(P2.L), out.push(mk(P2, tc, s2, P2.L.b, [])), out;
  }
  if (tc === "@" && isIdentStart(peek2(P2.L, 1))) {
    let s2 = P2.L.b;
    advance(P2.L), out.push(mk(P2, "@", s2, P2.L.b, []));
    while (isIdentChar(peek2(P2.L)))
      advance(P2.L);
    return out;
  }
  let c3 = peek2(P2.L);
  if (c3 === ":") {
    let c1 = peek2(P2.L, 1);
    if (c1 === `
` || c1 === "}") {
      advance(P2.L);
      while (peek2(P2.L) === `
`)
        advance(P2.L);
      return out;
    }
    if (c1 !== "-" && c1 !== "=" && c1 !== "?" && c1 !== "+") {
      advance(P2.L), skipBlanks(P2.L);
      let offC = peek2(P2.L), off;
      if (offC === "-" && isDigit2(peek2(P2.L, 1))) {
        let ns = P2.L.b;
        advance(P2.L);
        while (isDigit2(peek2(P2.L)))
          advance(P2.L);
        off = mk(P2, "number", ns, P2.L.b, []);
      } else
        off = parseArithExpr(P2, ":}", "var");
      if (off)
        out.push(off);
      if (skipBlanks(P2.L), peek2(P2.L) === ":") {
        advance(P2.L), skipBlanks(P2.L);
        let lenC = peek2(P2.L), len;
        if (lenC === "-" && isDigit2(peek2(P2.L, 1))) {
          let ns = P2.L.b;
          advance(P2.L);
          while (isDigit2(peek2(P2.L)))
            advance(P2.L);
          len = mk(P2, "number", ns, P2.L.b, []);
        } else
          len = parseArithExpr(P2, "}", "var");
        if (len)
          out.push(len);
      }
      return out;
    }
  }
  if (c3 === ":" || c3 === "#" || c3 === "%" || c3 === "/" || c3 === "^" || c3 === "," || c3 === "-" || c3 === "=" || c3 === "?" || c3 === "+") {
    let s2 = P2.L.b, c1 = peek2(P2.L, 1), op = c3;
    if (c3 === ":" && (c1 === "-" || c1 === "=" || c1 === "?" || c1 === "+"))
      advance(P2.L), advance(P2.L), op = c3 + c1;
    else if ((c3 === "#" || c3 === "%" || c3 === "/" || c3 === "^" || c3 === ",") && c1 === c3)
      advance(P2.L), advance(P2.L), op = c3 + c3;
    else
      advance(P2.L);
    out.push(mk(P2, op, s2, P2.L.b, []));
    let isPattern = op === "#" || op === "##" || op === "%" || op === "%%" || op === "/" || op === "//" || op === "^" || op === "^^" || op === "," || op === ",,";
    if (op === "/" || op === "//") {
      let ac = peek2(P2.L);
      if (ac === "#" || ac === "%") {
        let aStart = P2.L.b;
        advance(P2.L), out.push(mk(P2, ac, aStart, P2.L.b, []));
      }
      if (peek2(P2.L) === '"') {
        out.push(parseDoubleQuoted(P2));
        let tail = parseExpansionRest(P2, "regex", !0);
        if (tail)
          out.push(tail);
      } else {
        let regex2 = parseExpansionRest(P2, "regex", !0);
        if (regex2)
          out.push(regex2);
      }
      if (peek2(P2.L) === "/") {
        let sepStart = P2.L.b;
        advance(P2.L), out.push(mk(P2, "/", sepStart, P2.L.b, []));
        let repl = parseExpansionRest(P2, "replword", !1);
        if (repl)
          if (repl.type === "concatenation" && repl.children.length === 2 && repl.children[0].type === "command_substitution")
            out.push(repl.children[0]), out.push(repl.children[1]);
          else
            out.push(repl);
      }
    } else if (op === "#" || op === "##" || op === "%" || op === "%%")
      for (let p4 of parseExpansionRegexSegmented(P2))
        out.push(p4);
    else {
      let rest = parseExpansionRest(P2, isPattern ? "regex" : "word", !1);
      if (rest)
        out.push(rest);
    }
  }
  return out;
}
    if (peek2(P2.L) === ")") {
      let cStart = P2.L.b;
      advance(P2.L), elems.push(mk(P2, ")", cStart, P2.L.b, []));
    }
    while (peek2(P2.L) === `
`)
      advance(P2.L);
    return mk(P2, "array", start, P2.L.b, elems);
  }
  if (nodeType === "regex") {
    let braceDepth2 = 0;
    while (P2.L.i < P2.L.len) {
      let c3 = peek2(P2.L);
      if (c3 === `
`)
        break;
      if (braceDepth2 === 0) {
        if (c3 === "}")
          break;
        if (stopAtSlash && c3 === "/")
          break;
      }
      if (c3 === "\\" && P2.L.i + 1 < P2.L.len) {
        advance(P2.L), advance(P2.L);
        continue;
      }
      if (c3 === '"' || c3 === "'") {
        advance(P2.L);
        while (P2.L.i < P2.L.len && peek2(P2.L) !== c3) {
          if (peek2(P2.L) === "\\" && P2.L.i + 1 < P2.L.len)
            advance(P2.L);
          advance(P2.L);
        }
        if (peek2(P2.L) === c3)
          advance(P2.L);
        continue;
      }
      if (c3 === "$") {
        let c1 = peek2(P2.L, 1);
        if (c1 === "{") {
          let d = 0;
          advance(P2.L), advance(P2.L), d++;
          while (P2.L.i < P2.L.len && d > 0) {
            let nc = peek2(P2.L);
            if (nc === "{")
              d++;
            else if (nc === "}")
              d--;
            advance(P2.L);
          }
          continue;
        }
        if (c1 === "(") {
          let d = 0;
          advance(P2.L), advance(P2.L), d++;
          while (P2.L.i < P2.L.len && d > 0) {
            let nc = peek2(P2.L);
            if (nc === "(")
              d++;
            else if (nc === ")")
              d--;
            advance(P2.L);
          }
          continue;
        }
      }
      if (c3 === "{")
        braceDepth2++;
      else if (c3 === "}" && braceDepth2 > 0)
        braceDepth2--;
      advance(P2.L);
    }
    let end = P2.L.b;
    while (peek2(P2.L) === `
`)
      advance(P2.L);
    if (end === start)
      return null;
    return mk(P2, "regex", start, end, []);
  }
  let parts = [], segStart = P2.L.b, braceDepth = 0, flushSeg = () => {
    if (P2.L.b > segStart)
      parts.push(mk(P2, "word", segStart, P2.L.b, []));
  };
  while (P2.L.i < P2.L.len) {
    let c3 = peek2(P2.L);
    if (c3 === `
`)
      break;
    if (braceDepth === 0) {
      if (c3 === "}")
        break;
      if (stopAtSlash && c3 === "/")
        break;
    }
    if (c3 === "\\" && P2.L.i + 1 < P2.L.len) {
      advance(P2.L), advance(P2.L);
      continue;
    }
    let c1 = peek2(P2.L, 1);
    if (c3 === "$") {
      if (c1 === "{" || c1 === "(" || c1 === "[") {
        flushSeg();
        let exp = parseDollarLike(P2);
        if (exp)
          parts.push(exp);
        segStart = P2.L.b;
        continue;
      }
      if (c1 === "'") {
        flushSeg();
        let aStart = P2.L.b;
        advance(P2.L), advance(P2.L);
        while (P2.L.i < P2.L.len && peek2(P2.L) !== "'") {
          if (peek2(P2.L) === "\\" && P2.L.i + 1 < P2.L.len)
            advance(P2.L);
          advance(P2.L);
        }
        if (peek2(P2.L) === "'")
          advance(P2.L);
        parts.push(mk(P2, "ansi_c_string", aStart, P2.L.b, [])), segStart = P2.L.b;
        continue;
      }
      if (isIdentStart(c1) || isDigit2(c1) || SPECIAL_VARS.has(c1)) {
        flushSeg();
        let exp = parseDollarLike(P2);
        if (exp)
          parts.push(exp);
        segStart = P2.L.b;
        continue;
      }
    }
    if (c3 === '"') {
      flushSeg(), parts.push(parseDoubleQuoted(P2)), segStart = P2.L.b;
      continue;
    }
    if (c3 === "'") {
      flushSeg();
      let rStart = P2.L.b;
      advance(P2.L);
      while (P2.L.i < P2.L.len && peek2(P2.L) !== "'")
        advance(P2.L);
      if (peek2(P2.L) === "'")
        advance(P2.L);
      parts.push(mk(P2, "raw_string", rStart, P2.L.b, [])), segStart = P2.L.b;
      continue;
    }
    if ((c3 === "<" || c3 === ">") && c1 === "(") {
      flushSeg();
      let ps = parseProcessSub(P2);
      if (ps)
        parts.push(ps);
      segStart = P2.L.b;
      continue;
    }
    if (c3 === "`") {
      flushSeg();
      let bt = parseBacktick(P2);
      if (bt)
        parts.push(bt);
      segStart = P2.L.b;
      continue;
    }
    if (c3 === "{")
      braceDepth++;
    else if (c3 === "}" && braceDepth > 0)
      braceDepth--;
    advance(P2.L);
  }
  flushSeg();
  while (peek2(P2.L) === `
`)
    advance(P2.L);
  if (parts.length > 1 && parts[0].type === "word" && /^[ \t]+$/.test(parts[0].text))
    parts.shift();
  if (parts.length === 0)
    return null;
  if (parts.length === 1)
    return parts[0];
  let last2 = parts[parts.length - 1];
  return mk(P2, "concatenation", parts[0].startIndex, last2.endIndex, parts);
}
    let last3 = kids2[kids2.length - 1];
    return mk(P2, "c_style_for_statement", forKw.startIndex, last3.endIndex, kids2);
  }
  let kids = [forKw], varTok = nextToken(P2.L, "arg");
  kids.push(mk(P2, "variable_name", varTok.start, varTok.end, [])), skipBlanks(P2.L);
  let save = saveLex(P2.L), inTok = nextToken(P2.L, "arg");
  if (inTok.type === "WORD" && inTok.value === "in") {
    kids.push(leaf(P2, "in", inTok));
    while (!0) {
      skipBlanks(P2.L);
      let c3 = peek2(P2.L);
      if (c3 === ";" || c3 === `
` || c3 === "")
        break;
      let w2 = parseWord(P2, "arg");
      if (!w2)
        break;
      kids.push(w2);
    }
  } else
    restoreLex(P2.L, save);
  let save2 = saveLex(P2.L), sep13 = nextToken(P2.L, "cmd");
  if (sep13.type === "OP" && sep13.value === ";")
    kids.push(leaf(P2, ";", sep13));
  else if (sep13.type !== "NEWLINE")
    restoreLex(P2.L, save2);
  let dg = parseDoGroup(P2);
  if (dg)
    kids.push(dg);
  let last2 = kids[kids.length - 1];
  return mk(P2, "for_statement", forKw.startIndex, last2.endIndex, kids);
}
  if (stop === ":}")
    return c3 === ":" || c3 === "}";
  return c3 === "" || c3 === `
`;
}
var MODULE, READY, SPECIAL_VARS, DECL_KEYWORDS, SHELL_KEYWORDS, ARITH_PREC, ARITH_RIGHT_ASSOC;

