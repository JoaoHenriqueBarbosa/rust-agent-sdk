// function: parseHeredocBodyContent
function parseHeredocBodyContent(P2, start, end) {
  let saved = saveLex(P2.L);
  restoreLexToByte(P2, start);
  let out = [], contentStart = P2.L.b, sawExpansion = !1;
  while (P2.L.b < end) {
    let c3 = peek2(P2.L);
    if (c3 === "\\") {
      let nxt = peek2(P2.L, 1);
      if (nxt === "$" || nxt === "`" || nxt === "\\") {
        advance(P2.L), advance(P2.L);
        continue;
      }
      advance(P2.L);
      continue;
    }
    if (c3 === "$" || c3 === "`") {
      let preB = P2.L.b, exp = parseDollarLike(P2);
      if (exp && (exp.type === "simple_expansion" || exp.type === "expansion" || exp.type === "command_substitution" || exp.type === "arithmetic_expansion")) {
        if (sawExpansion && preB > contentStart)
          out.push(mk(P2, "heredoc_content", contentStart, preB, []));
        out.push(exp), contentStart = P2.L.b, sawExpansion = !0;
      }
      continue;
    }
    advance(P2.L);
  }
  if (sawExpansion)
    out.push(mk(P2, "heredoc_content", contentStart, end, []));
  return restoreLex(P2.L, saved), out;
}
