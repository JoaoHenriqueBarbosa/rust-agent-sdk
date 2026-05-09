// function: classifyCommandName
function classifyCommandName(name3) {
  if (/^[A-Za-z]+-[A-Za-z][A-Za-z0-9_]*$/.test(name3))
    return "cmdlet";
  if (/[.\\/]/.test(name3))
    return "application";
  return "unknown";
}
