// Original: src/plugins/builtinPlugins.ts
function isBuiltinPluginId(pluginId) {
  return pluginId.endsWith(`@${BUILTIN_MARKETPLACE_NAME}`);
}
function getBuiltinPluginDefinition(name3) {
  return BUILTIN_PLUGINS.get(name3);
}
function getBuiltinPlugins() {
  let settings = getSettings_DEPRECATED(), enabled2 = [], disabled = [];
  for (let [name3, definition] of BUILTIN_PLUGINS) {
    if (definition.isAvailable && !definition.isAvailable())
      continue;
    let pluginId = `${name3}@${BUILTIN_MARKETPLACE_NAME}`, userSetting = settings?.enabledPlugins?.[pluginId], isEnabled = userSetting !== void 0 ? userSetting === !0 : definition.defaultEnabled ?? !0, plugin = {
      name: name3,
      manifest: {
        name: name3,
        description: definition.description,
        version: definition.version
      },
      path: BUILTIN_MARKETPLACE_NAME,
      source: pluginId,
      repository: pluginId,
      enabled: isEnabled,
      isBuiltin: !0,
      hooksConfig: definition.hooks,
      mcpServers: definition.mcpServers
    };
    if (isEnabled)
      enabled2.push(plugin);
    else
      disabled.push(plugin);
  }
  return { enabled: enabled2, disabled };
}
function getBuiltinPluginSkillCommands() {
  let { enabled: enabled2 } = getBuiltinPlugins(), commands7 = [];
  for (let plugin of enabled2) {
    let definition = BUILTIN_PLUGINS.get(plugin.name);
    if (!definition?.skills)
      continue;
    for (let skill of definition.skills)
      commands7.push(skillDefinitionToCommand(skill));
  }
  return commands7;
}
function skillDefinitionToCommand(definition) {
  return {
    type: "prompt",
    name: definition.name,
    description: definition.description,
    hasUserSpecifiedDescription: !0,
    allowedTools: definition.allowedTools ?? [],
    argumentHint: definition.argumentHint,
    whenToUse: definition.whenToUse,
    model: definition.model,
    disableModelInvocation: definition.disableModelInvocation ?? !1,
    userInvocable: definition.userInvocable ?? !0,
    contentLength: 0,
    source: "bundled",
    loadedFrom: "bundled",
    hooks: definition.hooks,
    context: definition.context,
    agent: definition.agent,
    isEnabled: definition.isEnabled ?? (() => !0),
    isHidden: !(definition.userInvocable ?? !0),
    progressMessage: "running",
    getPromptForCommand: definition.getPromptForCommand
  };
}
var BUILTIN_PLUGINS, BUILTIN_MARKETPLACE_NAME = "builtin";
var init_builtinPlugins = __esm(() => {
  init_settings2();
  BUILTIN_PLUGINS = /* @__PURE__ */ new Map;
});
