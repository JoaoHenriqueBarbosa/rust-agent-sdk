// function: getServerCommandArray
function getServerCommandArray(config10) {
  if (config10.type !== void 0 && config10.type !== "stdio")
    return null;
  let stdioConfig = config10;
  return [stdioConfig.command, ...stdioConfig.args ?? []];
}
