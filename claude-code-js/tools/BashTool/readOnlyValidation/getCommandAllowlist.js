// function: getCommandAllowlist
function getCommandAllowlist() {
  let allowlist = COMMAND_ALLOWLIST;
  if (getPlatform() === "windows") {
    let { xargs: _, ...rest } = allowlist;
    allowlist = rest;
  }
  return allowlist;
}
