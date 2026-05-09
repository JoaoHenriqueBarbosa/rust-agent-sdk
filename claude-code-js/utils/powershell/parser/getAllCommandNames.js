// function: getAllCommandNames
function getAllCommandNames(parsed) {
  let names = [];
  for (let statement of parsed.statements) {
    for (let cmd of statement.commands)
      names.push(cmd.name.toLowerCase());
    if (statement.nestedCommands)
      for (let cmd of statement.nestedCommands)
        names.push(cmd.name.toLowerCase());
  }
  return names;
}
