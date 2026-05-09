// function: getCommandTypeForLogging2
function getCommandTypeForLogging2(command12) {
  let parts = splitCommand_DEPRECATED(command12);
  if (parts.length === 0)
    return "other";
  for (let part of parts) {
    let baseCommand = part.split(" ")[0] || "";
    if (COMMON_BACKGROUND_COMMANDS2.includes(baseCommand))
      return baseCommand;
  }
  return "other";
}
