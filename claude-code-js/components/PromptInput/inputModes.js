// Original: src/components/PromptInput/inputModes.ts
function prependModeCharacterToInput(input, mode) {
  switch (mode) {
    case "bash":
      return `!${input}`;
    default:
      return input;
  }
}
function getModeFromInput(input) {
  if (input.startsWith("!"))
    return "bash";
  return "prompt";
}
function getValueFromInput(input) {
  if (getModeFromInput(input) === "prompt")
    return input;
  return input.slice(1);
}
function isInputModeCharacter(input) {
  return input === "!";
}
