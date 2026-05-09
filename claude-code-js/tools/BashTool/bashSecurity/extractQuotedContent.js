// function: extractQuotedContent
function extractQuotedContent(command12, isJq = !1) {
  let withDoubleQuotes = "", fullyUnquoted = "", unquotedKeepQuoteChars = "", inSingleQuote = !1, inDoubleQuote = !1, escaped = !1;
  for (let i5 = 0;i5 < command12.length; i5++) {
    let char = command12[i5];
    if (escaped) {
      if (escaped = !1, !inSingleQuote)
        withDoubleQuotes += char;
      if (!inSingleQuote && !inDoubleQuote)
        fullyUnquoted += char;
      if (!inSingleQuote && !inDoubleQuote)
        unquotedKeepQuoteChars += char;
      continue;
    }
    if (char === "\\" && !inSingleQuote) {
      if (escaped = !0, !inSingleQuote)
        withDoubleQuotes += char;
      if (!inSingleQuote && !inDoubleQuote)
        fullyUnquoted += char;
      if (!inSingleQuote && !inDoubleQuote)
        unquotedKeepQuoteChars += char;
      continue;
    }
    if (char === "'" && !inDoubleQuote) {
      inSingleQuote = !inSingleQuote, unquotedKeepQuoteChars += char;
      continue;
    }
    if (char === '"' && !inSingleQuote) {
      if (inDoubleQuote = !inDoubleQuote, unquotedKeepQuoteChars += char, !isJq)
        continue;
    }
    if (!inSingleQuote)
      withDoubleQuotes += char;
    if (!inSingleQuote && !inDoubleQuote)
      fullyUnquoted += char;
    if (!inSingleQuote && !inDoubleQuote)
      unquotedKeepQuoteChars += char;
  }
  return { withDoubleQuotes, fullyUnquoted, unquotedKeepQuoteChars };
}
