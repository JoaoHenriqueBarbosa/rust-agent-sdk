// function: extractSearchToken
function extractSearchToken(completionToken) {
  if (completionToken.isQuoted)
    return completionToken.token.slice(2).replace(/"$/, "");
  else if (completionToken.token.startsWith("@"))
    return completionToken.token.substring(1);
  else
    return completionToken.token;
}
