// function: parseSimpleCommand
function parseSimpleCommand(P2) {
  let start = P2.L.b, assignments = [], preRedirects = [];
  while (!0) {
    skipBlanks(P2.L);
    let a2 = tryParseAssignment(P2);
    if (a2) {
      assignments.push(a2);
      continue;
    }
    let r4 = tryParseRedirect(P2);
    if (r4) {
      preRedirects.push(r4);
      continue;
    }
    break;
  }
  skipBlanks(P2.L);
  let save = saveLex(P2.L), nameTok = nextToken(P2.L, "cmd");
  if (nameTok.type === "EOF" || nameTok.type === "NEWLINE" || nameTok.type === "COMMENT" || nameTok.type === "OP" && nameTok.value !== "{" && nameTok.value !== "[" && nameTok.value !== "[[" || nameTok.type === "WORD" && SHELL_KEYWORDS.has(nameTok.value) && nameTok.value !== "in") {
    if (restoreLex(P2.L, save), assignments.length === 1 && preRedirects.length === 0)
      return assignments[0];
    if (preRedirects.length > 0 && assignments.length === 0) {
      let last2 = preRedirects[preRedirects.length - 1];
      return mk(P2, "redirected_statement", preRedirects[0].startIndex, last2.endIndex, preRedirects);
    }
    if (assignments.length > 1 && preRedirects.length === 0) {
      let last2 = assignments[assignments.length - 1];
      return mk(P2, "variable_assignments", assignments[0].startIndex, last2.endIndex, assignments);
    }
    if (assignments.length > 0 || preRedirects.length > 0) {
      let all3 = [...assignments, ...preRedirects], last2 = all3[all3.length - 1];
      return mk(P2, "command", start, last2.endIndex, all3);
    }
    return null;
  }
  restoreLex(P2.L, save);
  let fnSave = saveLex(P2.L), nm = parseWord(P2, "cmd");
  if (nm && nm.type === "word") {
    if (skipBlanks(P2.L), peek2(P2.L) === "(" && peek2(P2.L, 1) === ")") {
      let oTok = nextToken(P2.L, "cmd"), cTok = nextToken(P2.L, "cmd"), oParen = leaf(P2, "(", oTok), cParen = leaf(P2, ")", cTok);
      skipBlanks(P2.L), skipNewlines(P2);
      let body = parseCommand2(P2);
      if (body) {
        let bodyKids = [body];
        if (body.type === "redirected_statement" && body.children.length >= 2 && body.children[0].type === "compound_statement")
          bodyKids = body.children;
        let last2 = bodyKids[bodyKids.length - 1];
        return mk(P2, "function_definition", nm.startIndex, last2.endIndex, [
          nm,
          oParen,
          cParen,
          ...bodyKids
        ]);
      }
    }
  }
  restoreLex(P2.L, fnSave);
  let nameArg = parseWord(P2, "cmd");
  if (!nameArg) {
    if (assignments.length === 1)
      return assignments[0];
    return null;
  }
  let cmdName = mk(P2, "command_name", nameArg.startIndex, nameArg.endIndex, [
    nameArg
  ]), args = [], redirects = [], heredocRedirect = null;
  while (!0) {
    skipBlanks(P2.L);
    let r4 = tryParseRedirect(P2, !0);
    if (r4) {
      if (r4.type === "heredoc_redirect")
        heredocRedirect = r4;
      else if (r4.type === "herestring_redirect")
        args.push(r4);
      else
        redirects.push(r4);
      continue;
    }
    if (redirects.length > 0)
      break;
    if (P2.stopToken === "]" && peek2(P2.L) === "]")
      break;
    let save2 = saveLex(P2.L), pk = nextToken(P2.L, "arg");
    if (pk.type === "EOF" || pk.type === "NEWLINE" || pk.type === "COMMENT" || pk.type === "OP" && (pk.value === "|" || pk.value === "|&" || pk.value === "&&" || pk.value === "||" || pk.value === ";" || pk.value === ";;" || pk.value === ";&" || pk.value === ";;&" || pk.value === "&" || pk.value === ")" || pk.value === "}" || pk.value === "))")) {
      restoreLex(P2.L, save2);
      break;
    }
    restoreLex(P2.L, save2);
    let arg = parseWord(P2, "arg");
    if (!arg) {
      if (peek2(P2.L) === "(") {
        let oTok = nextToken(P2.L, "cmd"), open5 = leaf(P2, "(", oTok), body = parseStatements(P2, ")"), cTok = nextToken(P2.L, "cmd"), close = cTok.type === "OP" && cTok.value === ")" ? leaf(P2, ")", cTok) : mk(P2, ")", open5.endIndex, open5.endIndex, []);
        args.push(mk(P2, "subshell", open5.startIndex, close.endIndex, [
          open5,
          ...body,
          close
        ]));
        continue;
      }
      break;
    }
    if (arg.type === "word" && arg.text === "=") {
      args.push(mk(P2, "ERROR", arg.startIndex, arg.endIndex, [arg]));
      continue;
    }
    if ((arg.type === "word" || arg.type === "concatenation") && peek2(P2.L) === "(" && P2.L.b === arg.endIndex) {
      args.push(mk(P2, "ERROR", arg.startIndex, arg.endIndex, [arg]));
      continue;
    }
    args.push(arg);
  }
  let cmdChildren = [...assignments, ...preRedirects, cmdName, ...args], cmdEnd = cmdChildren.length > 0 ? cmdChildren[cmdChildren.length - 1].endIndex : cmdName.endIndex, cmdStart = cmdChildren[0].startIndex, cmd = mk(P2, "command", cmdStart, cmdEnd, cmdChildren);
  if (heredocRedirect) {
    scanHeredocBodies(P2);
    let hd = P2.L.heredocs.shift();
    if (hd && heredocRedirect.children.length >= 2) {
      let bodyNode = mk(P2, "heredoc_body", hd.bodyStart, hd.bodyEnd, hd.quoted ? [] : parseHeredocBodyContent(P2, hd.bodyStart, hd.bodyEnd)), endNode = mk(P2, "heredoc_end", hd.endStart, hd.endEnd, []);
      heredocRedirect.children.push(bodyNode, endNode), heredocRedirect.endIndex = hd.endEnd, heredocRedirect.text = sliceBytes(P2, heredocRedirect.startIndex, hd.endEnd);
    }
    let allR = [...preRedirects, heredocRedirect, ...redirects], rStart = preRedirects.length > 0 ? Math.min(cmd.startIndex, preRedirects[0].startIndex) : cmd.startIndex;
    return mk(P2, "redirected_statement", rStart, heredocRedirect.endIndex, [
      cmd,
      ...allR
    ]);
  }
  if (redirects.length > 0) {
    let last2 = redirects[redirects.length - 1];
    return mk(P2, "redirected_statement", cmd.startIndex, last2.endIndex, [
      cmd,
      ...redirects
    ]);
  }
  return cmd;
}
