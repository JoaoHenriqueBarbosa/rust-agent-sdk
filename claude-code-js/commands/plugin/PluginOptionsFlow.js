// Original: src/commands/plugin/PluginOptionsFlow.tsx
async function findPluginOptionsTarget(pluginId) {
  let {
    enabled: enabled2,
    disabled
  } = await loadAllPlugins();
  return [...enabled2, ...disabled].find((p4) => p4.repository === pluginId || p4.source === pluginId);
}
function PluginOptionsFlow({
  plugin,
  pluginId,
  onDone
}) {
  let [steps] = React74.useState(() => {
    let result = [], unconfigured = getUnconfiguredOptions(plugin);
    if (Object.keys(unconfigured).length > 0)
      result.push({
        key: "top-level",
        title: `Configure ${plugin.name}`,
        subtitle: "Plugin options",
        schema: unconfigured,
        load: () => loadPluginOptions(pluginId),
        save: (values3) => savePluginOptions(pluginId, values3, plugin.manifest.userConfig)
      });
    let channels = getUnconfiguredChannels(plugin);
    for (let channel of channels)
      result.push({
        key: `channel:${channel.server}`,
        title: `Configure ${channel.displayName}`,
        subtitle: `Plugin: ${plugin.name}`,
        schema: channel.configSchema,
        load: () => loadMcpServerUserConfig(pluginId, channel.server) ?? void 0,
        save: (values_0) => saveMcpServerUserConfig(pluginId, channel.server, values_0, channel.configSchema)
      });
    return result;
  }), [index, setIndex] = React74.useState(0), onDoneRef = React74.useRef(onDone);
  if (onDoneRef.current = onDone, React74.useEffect(() => {
    if (steps.length === 0)
      onDoneRef.current("skipped");
  }, [steps.length]), steps.length === 0)
    return null;
  let current = steps[index];
  function handleSave(values_1) {
    try {
      current.save(values_1);
    } catch (err2) {
      onDone("error", errorMessage(err2));
      return;
    }
    let next2 = index + 1;
    if (next2 < steps.length)
      setIndex(next2);
    else
      onDone("configured");
  }
  return /* @__PURE__ */ jsx_dev_runtime235.jsxDEV(PluginOptionsDialog, {
    title: current.title,
    subtitle: current.subtitle,
    configSchema: current.schema,
    initialValues: current.load(),
    onSave: handleSave,
    onCancel: () => onDone("skipped")
  }, current.key, !1, void 0, this);
}
var React74, jsx_dev_runtime235;
var init_PluginOptionsFlow = __esm(() => {
  init_errors();
  init_mcpbHandler();
  init_mcpPluginIntegration();
  init_pluginLoader();
  init_pluginOptionsStorage();
  init_PluginOptionsDialog();
  React74 = __toESM(require_react_development(), 1), jsx_dev_runtime235 = __toESM(require_react_jsx_dev_runtime_development(), 1);
});
