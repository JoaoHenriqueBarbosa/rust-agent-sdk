// function: outputLink
function outputLink(cap, link22, raw, lexer2, rules) {
  let href = link22.href, title = link22.title || null, text2 = cap[1].replace(rules.other.outputLinkReplace, "$1");
  lexer2.state.inLink = !0;
  let token = {
    type: cap[0].charAt(0) === "!" ? "image" : "link",
    raw,
    href,
    title,
    text: text2,
    tokens: lexer2.inlineTokens(text2)
  };
  return lexer2.state.inLink = !1, token;
}
