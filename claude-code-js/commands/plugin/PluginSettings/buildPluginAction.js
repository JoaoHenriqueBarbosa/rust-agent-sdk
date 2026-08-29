// function: buildPluginAction
function buildPluginAction(pluginName) {
  return {
    kind: "navigate",
    tab: "installed",
    viewState: {
      type: "manage-plugins",
      targetPlugin: pluginName,
      action: "uninstall"
    }
  };
}
