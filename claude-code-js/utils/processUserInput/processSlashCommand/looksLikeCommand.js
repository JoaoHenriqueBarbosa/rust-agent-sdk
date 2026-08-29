// function: looksLikeCommand
function looksLikeCommand(commandName) {
  return !/[^a-zA-Z0-9:\-_]/.test(commandName);
}
