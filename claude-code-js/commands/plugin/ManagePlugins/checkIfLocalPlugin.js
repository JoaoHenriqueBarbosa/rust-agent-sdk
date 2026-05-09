// function: checkIfLocalPlugin
async function checkIfLocalPlugin(pluginName, marketplaceName) {
  let entry = (await getMarketplace(marketplaceName))?.plugins.find((p4) => p4.name === pluginName);
  if (entry && typeof entry.source === "string")
    return `Local plugins cannot be updated remotely. To update, modify the source at: ${entry.source}`;
  return null;
}
