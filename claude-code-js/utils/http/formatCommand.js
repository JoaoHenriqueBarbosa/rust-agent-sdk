// function: formatCommand
function formatCommand(commandName) {
  if (isWindows)
    return `${commandName}.exe`;
  else
    return commandName;
}
