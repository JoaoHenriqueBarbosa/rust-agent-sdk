// function: extractCommandName
async function extractCommandName(command12) {
  let trimmed = command12.trim();
  if (!trimmed)
    return "";
  let parsed = await parsePowerShellCommandCached(trimmed);
  return getAllCommandNames(parsed)[0] ?? "";
}
