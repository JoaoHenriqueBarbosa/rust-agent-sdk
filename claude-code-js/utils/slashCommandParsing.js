// Original: src/utils/slashCommandParsing.ts
function parseSlashCommand(input) {
  let trimmedInput = input.trim();
  if (!trimmedInput.startsWith("/"))
    return null;
  let words = trimmedInput.slice(1).split(" ");
  if (!words[0])
    return null;
  let commandName = words[0], isMcp = !1, argsStartIndex = 1;
  if (words.length > 1 && words[1] === "(MCP)")
    commandName = commandName + " (MCP)", isMcp = !0, argsStartIndex = 2;
  let args = words.slice(argsStartIndex).join(" ");
  return {
    commandName,
    args,
    isMcp
  };
}
