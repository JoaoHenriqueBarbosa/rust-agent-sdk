// function: getAllCommands2
function getAllCommands2(parsed) {
  let commands7 = [];
  for (let statement of parsed.statements) {
    for (let cmd of statement.commands)
      commands7.push(cmd);
    if (statement.nestedCommands)
      for (let cmd of statement.nestedCommands)
        commands7.push(cmd);
  }
  return commands7;
}
