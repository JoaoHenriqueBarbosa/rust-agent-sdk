// function: parseUnset
function parseUnset(P2, kwTok) {
  let kw = leaf(P2, "unset", kwTok), kids = [kw];
  while (!0) {
    skipBlanks(P2.L);
    let c3 = peek2(P2.L);
    if (c3 === "" || c3 === `
` || c3 === ";" || c3 === "&" || c3 === "|" || c3 === ")" || c3 === "<" || c3 === ">")
      break;
    let arg = parseWord(P2, "arg");
    if (!arg)
      break;
    if (arg.type === "word")
      if (arg.text.startsWith("-"))
        kids.push(arg);
      else
        kids.push(mk(P2, "variable_name", arg.startIndex, arg.endIndex, []));
    else
      kids.push(arg);
  }
  let last2 = kids[kids.length - 1];
  return mk(P2, "unset_command", kw.startIndex, last2.endIndex, kids);
}
