// function: tryParseRedirect
function tryParseRedirect(P2, greedy = !1) {
  let save = saveLex(P2.L);
  skipBlanks(P2.L);
  let fd2 = null;
  if (isDigit2(peek2(P2.L))) {
    let startB = P2.L.b, j4 = P2.L.i;
    while (j4 < P2.L.len && isDigit2(P2.L.src[j4]))
      j4++;
    let after = j4 < P2.L.len ? P2.L.src[j4] : "";
    if (after === ">" || after === "<") {
      while (P2.L.i < j4)
        advance(P2.L);
      fd2 = mk(P2, "file_descriptor", startB, P2.L.b, []);
    }
  }
  let t2 = nextToken(P2.L, "arg");
  if (t2.type !== "OP")
    return restoreLex(P2.L, save), null;
  let v2 = t2.value;
  if (v2 === "<<<") {
    let op = leaf(P2, "<<<", t2);
    skipBlanks(P2.L);
    let target = parseWord(P2, "arg"), end = target ? target.endIndex : op.endIndex, kids = target ? [op, target] : [op];
    return mk(P2, "herestring_redirect", fd2 ? fd2.startIndex : op.startIndex, end, fd2 ? [fd2, ...kids] : kids);
  }
  if (v2 === "<<" || v2 === "<<-") {
    let op = leaf(P2, v2, t2);
    skipBlanks(P2.L);
    let dStart = P2.L.b, quoted = !1, delim = "", dc = peek2(P2.L);
    if (dc === "'" || dc === '"') {
      quoted = !0, advance(P2.L);
      while (P2.L.i < P2.L.len && peek2(P2.L) !== dc)
        delim += peek2(P2.L), advance(P2.L);
      if (P2.L.i < P2.L.len)
        advance(P2.L);
    } else if (dc === "\\") {
      if (quoted = !0, advance(P2.L), P2.L.i < P2.L.len && peek2(P2.L) !== `
`)
        delim += peek2(P2.L), advance(P2.L);
      while (P2.L.i < P2.L.len && isIdentChar(peek2(P2.L)))
        delim += peek2(P2.L), advance(P2.L);
    } else
      while (P2.L.i < P2.L.len && isHeredocDelimChar(peek2(P2.L)))
        delim += peek2(P2.L), advance(P2.L);
    let dEnd = P2.L.b, startNode = mk(P2, "heredoc_start", dStart, dEnd, []);
    P2.L.heredocs.push({
      delim,
      stripTabs: v2 === "<<-",
      quoted,
      bodyStart: 0,
      bodyEnd: 0,
      endStart: 0,
      endEnd: 0
    });
    let kids = fd2 ? [fd2, op, startNode] : [op, startNode], startIdx = fd2 ? fd2.startIndex : op.startIndex;
    while (!0) {
      skipBlanks(P2.L);
      let tc = peek2(P2.L);
      if (tc === `
` || tc === "" || P2.L.i >= P2.L.len)
        break;
      if (tc === ">" || tc === "<" || isDigit2(tc)) {
        let rSave = saveLex(P2.L), r4 = tryParseRedirect(P2);
        if (r4 && r4.type === "file_redirect") {
          kids.push(r4);
          continue;
        }
        restoreLex(P2.L, rSave);
      }
      if (tc === "|" && peek2(P2.L, 1) !== "|") {
        advance(P2.L), skipBlanks(P2.L);
        let pipeCmds = [];
        while (!0) {
          let cmd = parseCommand2(P2);
          if (!cmd)
            break;
          if (pipeCmds.push(cmd), skipBlanks(P2.L), peek2(P2.L) === "|" && peek2(P2.L, 1) !== "|") {
            let ps = P2.L.b;
            advance(P2.L), pipeCmds.push(mk(P2, "|", ps, P2.L.b, [])), skipBlanks(P2.L);
            continue;
          }
          break;
        }
        if (pipeCmds.length > 0) {
          let pl2 = pipeCmds[pipeCmds.length - 1];
          kids.push(mk(P2, "pipeline", pipeCmds[0].startIndex, pl2.endIndex, pipeCmds));
        }
        continue;
      }
      if (tc === "&" && peek2(P2.L, 1) === "&" || tc === "|" && peek2(P2.L, 1) === "|") {
        advance(P2.L), advance(P2.L), skipBlanks(P2.L);
        let rhs = parseCommand2(P2);
        if (rhs)
          kids.push(rhs);
        continue;
      }
      if (tc === "&" || tc === ";" || tc === "(" || tc === ")") {
        let eStart2 = P2.L.b;
        while (P2.L.i < P2.L.len && peek2(P2.L) !== `
`)
          advance(P2.L);
        kids.push(mk(P2, "ERROR", eStart2, P2.L.b, []));
        break;
      }
      let w2 = parseWord(P2, "arg");
      if (w2) {
        kids.push(w2);
        continue;
      }
      let eStart = P2.L.b;
      while (P2.L.i < P2.L.len && peek2(P2.L) !== `
`)
        advance(P2.L);
      if (P2.L.b > eStart)
        kids.push(mk(P2, "ERROR", eStart, P2.L.b, []));
      break;
    }
    return mk(P2, "heredoc_redirect", startIdx, P2.L.b, kids);
  }
  if (v2 === "<&-" || v2 === ">&-") {
    let op = leaf(P2, v2, t2), kids = [];
    if (fd2)
      kids.push(fd2);
    kids.push(op), skipBlanks(P2.L);
    let dSave = saveLex(P2.L), dest = isRedirectLiteralStart(P2) ? parseWord(P2, "arg") : null;
    if (dest)
      kids.push(dest);
    else
      restoreLex(P2.L, dSave);
    let startIdx = fd2 ? fd2.startIndex : op.startIndex, end = dest ? dest.endIndex : op.endIndex;
    return mk(P2, "file_redirect", startIdx, end, kids);
  }
  if (v2 === ">" || v2 === ">>" || v2 === ">&" || v2 === ">|" || v2 === "&>" || v2 === "&>>" || v2 === "<" || v2 === "<&") {
    let op = leaf(P2, v2, t2), kids = [];
    if (fd2)
      kids.push(fd2);
    kids.push(op);
    let end = op.endIndex, taken = 0;
    while (!0) {
      if (skipBlanks(P2.L), !isRedirectLiteralStart(P2))
        break;
      if (!greedy && taken >= 1)
        break;
      let tc = peek2(P2.L), tc1 = peek2(P2.L, 1), target = null;
      if ((tc === "<" || tc === ">") && tc1 === "(")
        target = parseProcessSub(P2);
      else
        target = parseWord(P2, "arg");
      if (!target)
        break;
      kids.push(target), end = target.endIndex, taken++;
    }
    let startIdx = fd2 ? fd2.startIndex : op.startIndex;
    return mk(P2, "file_redirect", startIdx, end, kids);
  }
  return restoreLex(P2.L, save), null;
}
