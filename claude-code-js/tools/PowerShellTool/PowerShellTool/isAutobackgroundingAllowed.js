// function: isAutobackgroundingAllowed
function isAutobackgroundingAllowed(command12) {
  let firstWord = command12.trim().split(/\s+/)[0];
  if (!firstWord)
    return !0;
  let canonical = resolveToCanonical(firstWord);
  return !DISALLOWED_AUTO_BACKGROUND_COMMANDS.includes(canonical);
}
