// function: filterManagedDisabledPlugins
function filterManagedDisabledPlugins(plugins) {
  return plugins.filter((plugin) => {
    let marketplace = plugin.source.split("@")[1] || "local";
    return !isPluginBlockedByPolicy(`${plugin.name}@${marketplace}`);
  });
}
