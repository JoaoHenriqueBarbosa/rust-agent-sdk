// function: transformStatement
function transformStatement(raw) {
  let statementType = mapStatementType(raw.type), commands7 = [], redirections = [];
  if (raw.elements) {
    for (let elem of ensureArray(raw.elements))
      if (elem.type === "CommandAst") {
        commands7.push(transformCommandAst(elem));
        for (let redir of ensureArray(elem.redirections))
          redirections.push(transformRedirection(redir));
      } else {
        commands7.push(transformExpressionElement(elem));
        for (let redir of ensureArray(elem.redirections))
          redirections.push(transformRedirection(redir));
      }
    let seen = new Set(redirections.map((r4) => `${r4.operator}\x00${r4.target}`));
    for (let redir of ensureArray(raw.redirections)) {
      let r4 = transformRedirection(redir), key2 = `${r4.operator}\x00${r4.target}`;
      if (!seen.has(key2))
        seen.add(key2), redirections.push(r4);
    }
  } else {
    commands7.push({
      name: raw.text,
      nameType: "unknown",
      elementType: "CommandExpressionAst",
      args: [],
      text: raw.text
    });
    for (let redir of ensureArray(raw.redirections))
      redirections.push(transformRedirection(redir));
  }
  let nestedCommands, rawNested = ensureArray(raw.nestedCommands);
  if (rawNested.length > 0)
    nestedCommands = rawNested.map(transformCommandAst);
  let result = {
    statementType,
    commands: commands7,
    redirections,
    text: raw.text,
    nestedCommands
  };
  if (raw.securityPatterns)
    result.securityPatterns = raw.securityPatterns;
  return result;
}
