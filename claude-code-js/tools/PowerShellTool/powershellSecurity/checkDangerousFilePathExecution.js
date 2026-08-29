// function: checkDangerousFilePathExecution
function checkDangerousFilePathExecution(parsed) {
  for (let cmd of getAllCommands2(parsed)) {
    let lower = cmd.name.toLowerCase(), resolved = COMMON_ALIASES[lower]?.toLowerCase() ?? lower;
    if (!FILEPATH_EXECUTION_CMDLETS.has(resolved))
      continue;
    if (psExeHasParamAbbreviation(cmd, "-filepath", "-f") || psExeHasParamAbbreviation(cmd, "-literalpath", "-l"))
      return {
        behavior: "ask",
        message: `${cmd.name} -FilePath executes an arbitrary script file`
      };
    for (let i5 = 0;i5 < cmd.args.length; i5++) {
      let argType = cmd.elementTypes?.[i5 + 1], arg = cmd.args[i5];
      if (argType === "StringConstant" && arg && !arg.startsWith("-"))
        return {
          behavior: "ask",
          message: `${cmd.name} with positional string argument binds to -FilePath and executes a script file`
        };
    }
  }
  return { behavior: "passthrough" };
}
