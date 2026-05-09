// function: updateConfig
function updateConfig(newConfig) {
  config8 = structuredClone(newConfig), parentProxy = resolveParentProxy(newConfig.network.parentProxy), logForDebugging2("Sandbox configuration updated");
}
