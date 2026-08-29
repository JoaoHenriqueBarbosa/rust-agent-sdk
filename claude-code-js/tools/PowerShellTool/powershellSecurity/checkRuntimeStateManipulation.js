// function: checkRuntimeStateManipulation
function checkRuntimeStateManipulation(parsed) {
  for (let cmd of getAllCommands2(parsed)) {
    let raw = cmd.name.toLowerCase(), lower = raw.includes("\\") ? raw.slice(raw.lastIndexOf("\\") + 1) : raw;
    if (RUNTIME_STATE_CMDLETS.has(lower))
      return {
        behavior: "ask",
        message: "Command creates or modifies an alias or variable that can affect future command resolution"
      };
  }
  return { behavior: "passthrough" };
}
