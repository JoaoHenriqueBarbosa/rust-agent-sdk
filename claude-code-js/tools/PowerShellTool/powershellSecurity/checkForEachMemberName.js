// function: checkForEachMemberName
function checkForEachMemberName(parsed) {
  for (let cmd of getAllCommands2(parsed)) {
    let lower = cmd.name.toLowerCase();
    if ((COMMON_ALIASES[lower]?.toLowerCase() ?? lower) !== "foreach-object")
      continue;
    if (psExeHasParamAbbreviation(cmd, "-membername", "-m"))
      return {
        behavior: "ask",
        message: "ForEach-Object -MemberName invokes methods by string name which cannot be validated"
      };
    for (let i5 = 0;i5 < cmd.args.length; i5++) {
      let argType = cmd.elementTypes?.[i5 + 1], arg = cmd.args[i5];
      if (argType === "StringConstant" && arg && !arg.startsWith("-"))
        return {
          behavior: "ask",
          message: "ForEach-Object with positional string argument binds to -MemberName and invokes methods by name"
        };
    }
  }
  return { behavior: "passthrough" };
}
