// function: findCurrentIDE
async function findCurrentIDE(availableIDEs, dynamicMcpConfig) {
  let currentConfig = dynamicMcpConfig?.ide;
  if (!currentConfig || currentConfig.type !== "sse-ide" && currentConfig.type !== "ws-ide")
    return null;
  for (let ide of availableIDEs)
    if (ide.url === currentConfig.url)
      return ide;
  return null;
}
