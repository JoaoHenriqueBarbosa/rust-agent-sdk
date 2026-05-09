// function: parseInputContext
function parseInputContext(input, cursorOffset) {
  let beforeCursor = input.slice(0, cursorOffset), varMatch = beforeCursor.match(/\$[a-zA-Z_][a-zA-Z0-9_]*$/);
  if (varMatch)
    return { prefix: varMatch[0], completionType: "variable" };
  let parseResult = tryParseShellCommand(beforeCursor);
  if (!parseResult.success) {
    let tokens = beforeCursor.split(/\s+/), prefix = tokens[tokens.length - 1] || "", completionType2 = tokens.length === 1 && !beforeCursor.includes(" ") ? "command" : getCompletionTypeFromPrefix(prefix);
    return { prefix, completionType: completionType2 };
  }
  let lastToken = findLastStringToken(parseResult.tokens);
  if (!lastToken) {
    let lastParsedToken = parseResult.tokens[parseResult.tokens.length - 1];
    return { prefix: "", completionType: lastParsedToken && isCommandOperator(lastParsedToken) ? "command" : "command" };
  }
  if (beforeCursor.endsWith(" "))
    return { prefix: "", completionType: "file" };
  let baseType = getCompletionTypeFromPrefix(lastToken.token);
  if (baseType === "variable" || baseType === "file")
    return { prefix: lastToken.token, completionType: baseType };
  let completionType = isNewCommandContext(parseResult.tokens, lastToken.index) ? "command" : "file";
  return { prefix: lastToken.token, completionType };
}
