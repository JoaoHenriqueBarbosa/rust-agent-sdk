// function: suggestionForExactCommand3
function suggestionForExactCommand3(command12) {
  let heredocPrefix = extractPrefixBeforeHeredoc(command12);
  if (heredocPrefix)
    return suggestionForPrefix(BashTool.name, heredocPrefix);
  if (command12.includes(`
`)) {
    let firstLine = command12.split(`
`)[0].trim();
    if (firstLine)
      return suggestionForPrefix(BashTool.name, firstLine);
  }
  let prefix = getSimpleCommandPrefix(command12);
  if (prefix)
    return suggestionForPrefix(BashTool.name, prefix);
  return suggestionForExactCommand(BashTool.name, command12);
}
