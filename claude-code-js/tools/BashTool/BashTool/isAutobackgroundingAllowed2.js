// function: isAutobackgroundingAllowed2
function isAutobackgroundingAllowed2(command12) {
  let parts = splitCommand_DEPRECATED(command12);
  if (parts.length === 0)
    return !0;
  let baseCommand = parts[0]?.trim();
  if (!baseCommand)
    return !0;
  return !DISALLOWED_AUTO_BACKGROUND_COMMANDS2.includes(baseCommand);
}
