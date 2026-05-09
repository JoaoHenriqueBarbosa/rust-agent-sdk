// function: getPluginNameFromError
function getPluginNameFromError(error44) {
  if ("pluginId" in error44 && error44.pluginId)
    return error44.pluginId;
  if ("plugin" in error44 && error44.plugin)
    return error44.plugin;
  if (error44.source.includes("@"))
    return error44.source.split("@")[0];
  return;
}
