// function: getAllRedirections
function getAllRedirections(parsed) {
  let redirections = [];
  for (let statement of parsed.statements) {
    for (let redir of statement.redirections)
      redirections.push(redir);
    if (statement.nestedCommands) {
      for (let cmd of statement.nestedCommands)
        if (cmd.redirections)
          for (let redir of cmd.redirections)
            redirections.push(redir);
    }
  }
  return redirections;
}
