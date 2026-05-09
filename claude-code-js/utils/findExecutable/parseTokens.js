// function: parseTokens
function parseTokens(str) {
  let tokens = Object.create(null), tokensRE = /([^\s,;=]+)\s*(?:=\s*([^,;]+))?/g, match;
  while (match = tokensRE.exec(str))
    tokens[match[1]] = match[2];
  return tokens;
}
