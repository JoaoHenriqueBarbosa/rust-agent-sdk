// function: stripHtmlCommentsFromTokens
function stripHtmlCommentsFromTokens(tokens) {
  let result = "", stripped = !1, commentSpan = /<!--[\s\S]*?-->/g;
  for (let token of tokens) {
    if (token.type === "html") {
      let trimmed = token.raw.trimStart();
      if (trimmed.startsWith("<!--") && trimmed.includes("-->")) {
        let residue = token.raw.replace(commentSpan, "");
        if (stripped = !0, residue.trim().length > 0)
          result += residue;
        continue;
      }
    }
    result += token.raw;
  }
  return { content: result, stripped };
}
