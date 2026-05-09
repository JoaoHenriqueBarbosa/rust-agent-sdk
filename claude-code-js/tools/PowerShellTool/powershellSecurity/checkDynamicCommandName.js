// function: checkDynamicCommandName
function checkDynamicCommandName(parsed) {
  for (let cmd of getAllCommands2(parsed)) {
    if (cmd.elementType !== "CommandAst")
      continue;
    let nameElementType = cmd.elementTypes?.[0];
    if (nameElementType !== void 0 && nameElementType !== "StringConstant")
      return {
        behavior: "ask",
        message: "Command name is a dynamic expression which cannot be statically validated"
      };
  }
  return { behavior: "passthrough" };
}
