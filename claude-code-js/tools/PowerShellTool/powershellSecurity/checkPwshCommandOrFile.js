// function: checkPwshCommandOrFile
function checkPwshCommandOrFile(parsed) {
  for (let cmd of getAllCommands2(parsed))
    if (isPowerShellExecutable(cmd.name))
      return {
        behavior: "ask",
        message: "Command spawns a nested PowerShell process which cannot be validated"
      };
  return { behavior: "passthrough" };
}
