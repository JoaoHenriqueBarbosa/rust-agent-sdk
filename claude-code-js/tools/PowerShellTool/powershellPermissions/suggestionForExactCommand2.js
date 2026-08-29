// function: suggestionForExactCommand2
function suggestionForExactCommand2(command12) {
  if (command12.includes(`
`) || command12.includes("*"))
    return [];
  return suggestionForExactCommand(POWERSHELL_TOOL_NAME, command12);
}
