// function: getCommandTypeForLogging
function getCommandTypeForLogging(command12) {
  let firstWord = command12.trim().split(/\s+/)[0] || "";
  for (let cmd of COMMON_BACKGROUND_COMMANDS)
    if (firstWord.toLowerCase() === cmd.toLowerCase())
      return cmd;
  return "other";
}
