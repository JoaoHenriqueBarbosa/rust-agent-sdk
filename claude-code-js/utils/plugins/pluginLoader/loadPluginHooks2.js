// function: loadPluginHooks2
async function loadPluginHooks2(hooksConfigPath, pluginName) {
  if (!await pathExists(hooksConfigPath))
    throw Error(`Hooks file not found at ${hooksConfigPath} for plugin ${pluginName}. If the manifest declares hooks, the file must exist.`);
  let content = await readFile35(hooksConfigPath, { encoding: "utf-8" }), rawHooksConfig = jsonParse(content);
  return PluginHooksSchema().parse(rawHooksConfig).hooks;
}
