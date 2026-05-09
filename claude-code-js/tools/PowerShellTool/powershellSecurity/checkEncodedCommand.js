// function: checkEncodedCommand
function checkEncodedCommand(parsed) {
  for (let cmd of getAllCommands2(parsed))
    if (isPowerShellExecutable(cmd.name)) {
      if (psExeHasParamAbbreviation(cmd, "-encodedcommand", "-e"))
        return {
          behavior: "ask",
          message: "Command uses encoded parameters which obscure intent"
        };
    }
  return { behavior: "passthrough" };
}
