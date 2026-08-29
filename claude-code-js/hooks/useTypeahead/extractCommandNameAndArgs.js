// function: extractCommandNameAndArgs
function extractCommandNameAndArgs(value) {
  if (isCommandInput(value)) {
    let spaceIndex = value.indexOf(" ");
    if (spaceIndex === -1)
      return {
        commandName: value.slice(1),
        args: ""
      };
    return {
      commandName: value.slice(1, spaceIndex),
      args: value.slice(spaceIndex + 1)
    };
  }
  return null;
}
