// function: mergePluginSources
function mergePluginSources(sources) {
  let errors8 = [], managed = sources.managedNames, sessionPlugins = sources.session.filter((p4) => {
    if (managed?.has(p4.name))
      return logForDebugging(`Plugin "${p4.name}" from --plugin-dir is blocked by managed settings`, { level: "warn" }), errors8.push({
        type: "generic-error",
        source: p4.source,
        plugin: p4.name,
        error: `--plugin-dir copy of "${p4.name}" ignored: plugin is locked by managed settings`
      }), !1;
    return !0;
  }), sessionNames = new Set(sessionPlugins.map((p4) => p4.name)), marketplacePlugins = sources.marketplace.filter((p4) => {
    if (sessionNames.has(p4.name))
      return logForDebugging(`Plugin "${p4.name}" from --plugin-dir overrides installed version`), !1;
    return !0;
  });
  return {
    plugins: [...sessionPlugins, ...marketplacePlugins, ...sources.builtin],
    errors: errors8
  };
}
