// Original: src/services/plugins/pluginCliCommands.ts
function handlePluginCommandError(error44, command19, plugin2) {
  logError2(error44);
  let operation = plugin2 ? `${command19} plugin "${plugin2}"` : command19 === "disable-all" ? "disable all plugins" : `${command19} plugins`;
  console.error(`${figures_default.cross} Failed to ${operation}: ${errorMessage(error44)}`);
  let telemetryFields = plugin2 ? (() => {
    let { name: name3, marketplace } = parsePluginIdentifier(plugin2);
    return {
      _PROTO_plugin_name: name3,
      ...marketplace && {
        _PROTO_marketplace_name: marketplace
      },
      ...buildPluginTelemetryFields(name3, marketplace, getManagedPluginNames())
    };
  })() : {};
  logEvent("tengu_plugin_command_failed", {
    command: command19,
    error_category: classifyPluginCommandError(error44),
    ...telemetryFields
  }), process.exit(1);
}
async function installPlugin(plugin2, scope = "user") {
  try {
    console.log(`Installing plugin "${plugin2}"...`);
    let result = await installPluginOp(plugin2, scope);
    if (!result.success)
      throw Error(result.message);
    console.log(`${figures_default.tick} ${result.message}`);
    let { name: name3, marketplace } = parsePluginIdentifier(result.pluginId || plugin2);
    logEvent("tengu_plugin_installed_cli", {
      _PROTO_plugin_name: name3,
      ...marketplace && {
        _PROTO_marketplace_name: marketplace
      },
      scope: result.scope || scope,
      install_source: "cli-explicit",
      ...buildPluginTelemetryFields(name3, marketplace, getManagedPluginNames())
    }), process.exit(0);
  } catch (error44) {
    handlePluginCommandError(error44, "install", plugin2);
  }
}
async function uninstallPlugin(plugin2, scope = "user", keepData = !1) {
  try {
    let result = await uninstallPluginOp(plugin2, scope, !keepData);
    if (!result.success)
      throw Error(result.message);
    console.log(`${figures_default.tick} ${result.message}`);
    let { name: name3, marketplace } = parsePluginIdentifier(result.pluginId || plugin2);
    logEvent("tengu_plugin_uninstalled_cli", {
      _PROTO_plugin_name: name3,
      ...marketplace && {
        _PROTO_marketplace_name: marketplace
      },
      scope: result.scope || scope,
      ...buildPluginTelemetryFields(name3, marketplace, getManagedPluginNames())
    }), process.exit(0);
  } catch (error44) {
    handlePluginCommandError(error44, "uninstall", plugin2);
  }
}
async function enablePlugin(plugin2, scope) {
  try {
    let result = await enablePluginOp(plugin2, scope);
    if (!result.success)
      throw Error(result.message);
    console.log(`${figures_default.tick} ${result.message}`);
    let { name: name3, marketplace } = parsePluginIdentifier(result.pluginId || plugin2);
    logEvent("tengu_plugin_enabled_cli", {
      _PROTO_plugin_name: name3,
      ...marketplace && {
        _PROTO_marketplace_name: marketplace
      },
      scope: result.scope,
      ...buildPluginTelemetryFields(name3, marketplace, getManagedPluginNames())
    }), process.exit(0);
  } catch (error44) {
    handlePluginCommandError(error44, "enable", plugin2);
  }
}
async function disablePlugin(plugin2, scope) {
  try {
    let result = await disablePluginOp(plugin2, scope);
    if (!result.success)
      throw Error(result.message);
    console.log(`${figures_default.tick} ${result.message}`);
    let { name: name3, marketplace } = parsePluginIdentifier(result.pluginId || plugin2);
    logEvent("tengu_plugin_disabled_cli", {
      _PROTO_plugin_name: name3,
      ...marketplace && {
        _PROTO_marketplace_name: marketplace
      },
      scope: result.scope,
      ...buildPluginTelemetryFields(name3, marketplace, getManagedPluginNames())
    }), process.exit(0);
  } catch (error44) {
    handlePluginCommandError(error44, "disable", plugin2);
  }
}
async function disableAllPlugins() {
  try {
    let result = await disableAllPluginsOp();
    if (!result.success)
      throw Error(result.message);
    console.log(`${figures_default.tick} ${result.message}`), logEvent("tengu_plugin_disabled_all_cli", {}), process.exit(0);
  } catch (error44) {
    handlePluginCommandError(error44, "disable-all");
  }
}
async function updatePluginCli(plugin2, scope) {
  try {
    writeToStdout(`Checking for updates for plugin "${plugin2}" at ${scope} scope\u2026
`);
    let result = await updatePluginOp(plugin2, scope);
    if (!result.success)
      throw Error(result.message);
    if (writeToStdout(`${figures_default.tick} ${result.message}
`), !result.alreadyUpToDate) {
      let { name: name3, marketplace } = parsePluginIdentifier(result.pluginId || plugin2);
      logEvent("tengu_plugin_updated_cli", {
        _PROTO_plugin_name: name3,
        ...marketplace && {
          _PROTO_marketplace_name: marketplace
        },
        old_version: result.oldVersion || "unknown",
        new_version: result.newVersion || "unknown",
        ...buildPluginTelemetryFields(name3, marketplace, getManagedPluginNames())
      });
    }
    await gracefulShutdown(0);
  } catch (error44) {
    handlePluginCommandError(error44, "update", plugin2);
  }
}
var init_pluginCliCommands = __esm(() => {
  init_figures();
  init_errors();
  init_gracefulShutdown();
  init_log3();
  init_managedPlugins();
  init_pluginIdentifier();
  init_pluginTelemetry();
  init_pluginOperations();
});
