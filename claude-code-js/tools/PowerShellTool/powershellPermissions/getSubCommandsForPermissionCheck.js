// function: getSubCommandsForPermissionCheck
async function getSubCommandsForPermissionCheck(parsed, originalCommand) {
  if (!parsed.valid)
    return [
      {
        text: originalCommand,
        element: {
          name: await extractCommandName(originalCommand),
          nameType: "unknown",
          elementType: "CommandAst",
          args: [],
          text: originalCommand
        },
        statement: null,
        isSafeOutput: !1
      }
    ];
  let subCommands = [];
  for (let statement of parsed.statements) {
    for (let cmd of statement.commands) {
      if (cmd.elementType !== "CommandAst")
        continue;
      subCommands.push({
        text: cmd.text,
        element: cmd,
        statement,
        isSafeOutput: cmd.nameType !== "application" && isSafeOutputCommand(cmd.name) && cmd.args.length === 0
      });
    }
    if (statement.nestedCommands)
      for (let cmd of statement.nestedCommands)
        subCommands.push({
          text: cmd.text,
          element: cmd,
          statement,
          isSafeOutput: cmd.nameType !== "application" && isSafeOutputCommand(cmd.name) && cmd.args.length === 0
        });
  }
  if (subCommands.length > 0)
    return subCommands;
  return [
    {
      text: originalCommand,
      element: {
        name: await extractCommandName(originalCommand),
        nameType: "unknown",
        elementType: "CommandAst",
        args: [],
        text: originalCommand
      },
      statement: null,
      isSafeOutput: !1
    }
  ];
}
