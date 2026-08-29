// Original: src/cli/handlers/plugins.ts
var exports_plugins = {};
__export(exports_plugins, {
  pluginValidateHandler: () => pluginValidateHandler,
  pluginUpdateHandler: () => pluginUpdateHandler,
  pluginUninstallHandler: () => pluginUninstallHandler,
  pluginListHandler: () => pluginListHandler,
  pluginInstallHandler: () => pluginInstallHandler,
  pluginEnableHandler: () => pluginEnableHandler,
  pluginDisableHandler: () => pluginDisableHandler,
  marketplaceUpdateHandler: () => marketplaceUpdateHandler,
  marketplaceRemoveHandler: () => marketplaceRemoveHandler,
  marketplaceListHandler: () => marketplaceListHandler,
  marketplaceAddHandler: () => marketplaceAddHandler,
  handleMarketplaceError: () => handleMarketplaceError,
  VALID_UPDATE_SCOPES: () => VALID_UPDATE_SCOPES,
  VALID_INSTALLABLE_SCOPES: () => VALID_INSTALLABLE_SCOPES
});
import { basename as basename55, dirname as dirname66 } from "path";
function handleMarketplaceError(error44, action2) {
  logError2(error44), cliError(`${figures_default.cross} Failed to ${action2}: ${errorMessage(error44)}`);
}
function printValidationResult(result) {
  if (result.errors.length > 0)
    console.log(`${figures_default.cross} Found ${result.errors.length} ${plural(result.errors.length, "error")}:
`), result.errors.forEach((error44) => {
      console.log(`  ${figures_default.pointer} ${error44.path}: ${error44.message}`);
    }), console.log("");
  if (result.warnings.length > 0)
    console.log(`${figures_default.warning} Found ${result.warnings.length} ${plural(result.warnings.length, "warning")}:
`), result.warnings.forEach((warning) => {
      console.log(`  ${figures_default.pointer} ${warning.path}: ${warning.message}`);
    }), console.log("");
}
async function pluginValidateHandler(manifestPath, options2) {
  if (options2.cowork)
    setUseCoworkPlugins(!0);
  try {
    let result = await validateManifest3(manifestPath);
    console.log(`Validating ${result.fileType} manifest: ${result.filePath}
`), printValidationResult(result);
    let contentResults = [];
    if (result.fileType === "plugin") {
      let manifestDir = dirname66(result.filePath);
      if (basename55(manifestDir) === ".claude-plugin") {
        contentResults = await validatePluginContents(dirname66(manifestDir));
        for (let r4 of contentResults)
          console.log(`Validating ${r4.fileType}: ${r4.filePath}
`), printValidationResult(r4);
      }
    }
    let allSuccess = result.success && contentResults.every((r4) => r4.success), hasWarnings = result.warnings.length > 0 || contentResults.some((r4) => r4.warnings.length > 0);
    if (allSuccess)
      cliOk(hasWarnings ? `${figures_default.tick} Validation passed with warnings` : `${figures_default.tick} Validation passed`);
    else
      console.log(`${figures_default.cross} Validation failed`), process.exit(1);
  } catch (error44) {
    logError2(error44), console.error(`${figures_default.cross} Unexpected error during validation: ${errorMessage(error44)}`), process.exit(2);
  }
}
async function pluginListHandler(options2) {
  if (options2.cowork)
    setUseCoworkPlugins(!0);
  logEvent("tengu_plugin_list_command", {});
  let installedData = loadInstalledPluginsV2(), { getPluginEditableScopes: getPluginEditableScopes2 } = await Promise.resolve().then(() => (init_pluginStartupCheck(), exports_pluginStartupCheck)), enabledPlugins = getPluginEditableScopes2(), pluginIds = Object.keys(installedData.plugins), {
    enabled: loadedEnabled,
    disabled: loadedDisabled,
    errors: loadErrors
  } = await loadAllPlugins(), allLoadedPlugins = [...loadedEnabled, ...loadedDisabled], inlinePlugins = allLoadedPlugins.filter((p4) => p4.source.endsWith("@inline")), inlineLoadErrors = loadErrors.filter((e) => e.source.endsWith("@inline") || e.source.startsWith("inline["));
  if (options2.json) {
    let loadedPluginMap = new Map(allLoadedPlugins.map((p4) => [p4.source, p4])), plugins = [];
    for (let pluginId of pluginIds.sort()) {
      let installations = installedData.plugins[pluginId];
      if (!installations || installations.length === 0)
        continue;
      let pluginName = parsePluginIdentifier(pluginId).name, pluginErrors = loadErrors.filter((e) => e.source === pluginId || ("plugin" in e) && e.plugin === pluginName).map(getPluginErrorMessage);
      for (let installation of installations) {
        let loadedPlugin = loadedPluginMap.get(pluginId), mcpServers;
        if (loadedPlugin) {
          let servers = loadedPlugin.mcpServers || await loadPluginMcpServers(loadedPlugin);
          if (servers && Object.keys(servers).length > 0)
            mcpServers = servers;
        }
        plugins.push({
          id: pluginId,
          version: installation.version || "unknown",
          scope: installation.scope,
          enabled: enabledPlugins.has(pluginId),
          installPath: installation.installPath,
          installedAt: installation.installedAt,
          lastUpdated: installation.lastUpdated,
          projectPath: installation.projectPath,
          mcpServers,
          errors: pluginErrors.length > 0 ? pluginErrors : void 0
        });
      }
    }
    for (let p4 of inlinePlugins) {
      let servers = p4.mcpServers || await loadPluginMcpServers(p4), pErrors = inlineLoadErrors.filter((e) => e.source === p4.source || ("plugin" in e) && e.plugin === p4.name).map(getPluginErrorMessage);
      plugins.push({
        id: p4.source,
        version: p4.manifest.version ?? "unknown",
        scope: "session",
        enabled: p4.enabled !== !1,
        installPath: p4.path,
        mcpServers: servers && Object.keys(servers).length > 0 ? servers : void 0,
        errors: pErrors.length > 0 ? pErrors : void 0
      });
    }
    for (let e of inlineLoadErrors.filter((e2) => e2.source.startsWith("inline[")))
      plugins.push({
        id: e.source,
        version: "unknown",
        scope: "session",
        enabled: !1,
        installPath: "path" in e ? e.path : "",
        errors: [getPluginErrorMessage(e)]
      });
    if (options2.available) {
      let available = [];
      try {
        let [config11, installCounts] = await Promise.all([
          loadKnownMarketplacesConfig(),
          getInstallCounts()
        ]), { marketplaces } = await loadMarketplacesWithGracefulDegradation(config11);
        for (let {
          name: marketplaceName,
          data: marketplace
        } of marketplaces)
          if (marketplace)
            for (let entry of marketplace.plugins) {
              let pluginId = createPluginId(entry.name, marketplaceName);
              if (!isPluginInstalled(pluginId))
                available.push({
                  pluginId,
                  name: entry.name,
                  description: entry.description,
                  marketplaceName,
                  version: entry.version,
                  source: entry.source,
                  installCount: installCounts?.get(pluginId)
                });
            }
      } catch {}
      cliOk(jsonStringify({ installed: plugins, available }, null, 2));
    } else
      cliOk(jsonStringify(plugins, null, 2));
  }
  if (pluginIds.length === 0 && inlinePlugins.length === 0) {
    if (inlineLoadErrors.length === 0)
      cliOk("No plugins installed. Use `claude plugin install` to install a plugin.");
  }
  if (pluginIds.length > 0)
    console.log(`Installed plugins:
`);
  for (let pluginId of pluginIds.sort()) {
    let installations = installedData.plugins[pluginId];
    if (!installations || installations.length === 0)
      continue;
    let pluginName = parsePluginIdentifier(pluginId).name, pluginErrors = loadErrors.filter((e) => e.source === pluginId || ("plugin" in e) && e.plugin === pluginName);
    for (let installation of installations) {
      let isEnabled2 = enabledPlugins.has(pluginId), status2 = pluginErrors.length > 0 ? `${figures_default.cross} failed to load` : isEnabled2 ? `${figures_default.tick} enabled` : `${figures_default.cross} disabled`, version6 = installation.version || "unknown", scope = installation.scope;
      console.log(`  ${figures_default.pointer} ${pluginId}`), console.log(`    Version: ${version6}`), console.log(`    Scope: ${scope}`), console.log(`    Status: ${status2}`);
      for (let error44 of pluginErrors)
        console.log(`    Error: ${getPluginErrorMessage(error44)}`);
      console.log("");
    }
  }
  if (inlinePlugins.length > 0 || inlineLoadErrors.length > 0) {
    console.log(`Session-only plugins (--plugin-dir):
`);
    for (let p4 of inlinePlugins) {
      let pErrors = inlineLoadErrors.filter((e) => e.source === p4.source || ("plugin" in e) && e.plugin === p4.name), status2 = pErrors.length > 0 ? `${figures_default.cross} loaded with errors` : `${figures_default.tick} loaded`;
      console.log(`  ${figures_default.pointer} ${p4.source}`), console.log(`    Version: ${p4.manifest.version ?? "unknown"}`), console.log(`    Path: ${p4.path}`), console.log(`    Status: ${status2}`);
      for (let e of pErrors)
        console.log(`    Error: ${getPluginErrorMessage(e)}`);
      console.log("");
    }
    for (let e of inlineLoadErrors.filter((e2) => e2.source.startsWith("inline[")))
      console.log(`  ${figures_default.pointer} ${e.source}: ${figures_default.cross} ${getPluginErrorMessage(e)}
`);
  }
  cliOk();
}
async function marketplaceAddHandler(source, options2) {
  if (options2.cowork)
    setUseCoworkPlugins(!0);
  try {
    let parsed = await parseMarketplaceInput(source);
    if (!parsed)
      cliError(`${figures_default.cross} Invalid marketplace source format. Try: owner/repo, https://..., or ./path`);
    if ("error" in parsed)
      cliError(`${figures_default.cross} ${parsed.error}`);
    let scope = options2.scope ?? "user";
    if (scope !== "user" && scope !== "project" && scope !== "local")
      cliError(`${figures_default.cross} Invalid scope '${scope}'. Use: user, project, or local`);
    let settingSource = scopeToSettingSource(scope), marketplaceSource = parsed;
    if (options2.sparse && options2.sparse.length > 0)
      if (marketplaceSource.source === "github" || marketplaceSource.source === "git")
        marketplaceSource = {
          ...marketplaceSource,
          sparsePaths: options2.sparse
        };
      else
        cliError(`${figures_default.cross} --sparse is only supported for github and git marketplace sources (got: ${marketplaceSource.source})`);
    console.log("Adding marketplace...");
    let { name: name3, alreadyMaterialized, resolvedSource } = await addMarketplaceSource(marketplaceSource, (message) => {
      console.log(message);
    });
    saveMarketplaceToSettings(name3, { source: resolvedSource }, settingSource), clearAllCaches();
    let sourceType = marketplaceSource.source;
    if (marketplaceSource.source === "github")
      sourceType = marketplaceSource.repo;
    logEvent("tengu_marketplace_added", {
      source_type: sourceType
    }), cliOk(alreadyMaterialized ? `${figures_default.tick} Marketplace '${name3}' already on disk \u2014 declared in ${scope} settings` : `${figures_default.tick} Successfully added marketplace: ${name3} (declared in ${scope} settings)`);
  } catch (error44) {
    handleMarketplaceError(error44, "add marketplace");
  }
}
async function marketplaceListHandler(options2) {
  if (options2.cowork)
    setUseCoworkPlugins(!0);
  try {
    let config11 = await loadKnownMarketplacesConfig(), names = Object.keys(config11);
    if (options2.json) {
      let marketplaces = names.sort().map((name3) => {
        let marketplace = config11[name3], source = marketplace?.source;
        return {
          name: name3,
          source: source?.source,
          ...source?.source === "github" && { repo: source.repo },
          ...source?.source === "git" && { url: source.url },
          ...source?.source === "url" && { url: source.url },
          ...source?.source === "directory" && { path: source.path },
          ...source?.source === "file" && { path: source.path },
          installLocation: marketplace?.installLocation
        };
      });
      cliOk(jsonStringify(marketplaces, null, 2));
    }
    if (names.length === 0)
      cliOk("No marketplaces configured");
    console.log(`Configured marketplaces:
`), names.forEach((name3) => {
      let marketplace = config11[name3];
      if (console.log(`  ${figures_default.pointer} ${name3}`), marketplace?.source) {
        let src = marketplace.source;
        if (src.source === "github")
          console.log(`    Source: GitHub (${src.repo})`);
        else if (src.source === "git")
          console.log(`    Source: Git (${src.url})`);
        else if (src.source === "url")
          console.log(`    Source: URL (${src.url})`);
        else if (src.source === "directory")
          console.log(`    Source: Directory (${src.path})`);
        else if (src.source === "file")
          console.log(`    Source: File (${src.path})`);
      }
      console.log("");
    }), cliOk();
  } catch (error44) {
    handleMarketplaceError(error44, "list marketplaces");
  }
}
async function marketplaceRemoveHandler(name3, options2) {
  if (options2.cowork)
    setUseCoworkPlugins(!0);
  try {
    await removeMarketplaceSource(name3), clearAllCaches(), logEvent("tengu_marketplace_removed", {
      marketplace_name: name3
    }), cliOk(`${figures_default.tick} Successfully removed marketplace: ${name3}`);
  } catch (error44) {
    handleMarketplaceError(error44, "remove marketplace");
  }
}
async function marketplaceUpdateHandler(name3, options2) {
  if (options2.cowork)
    setUseCoworkPlugins(!0);
  try {
    if (name3)
      console.log(`Updating marketplace: ${name3}...`), await refreshMarketplace(name3, (message) => {
        console.log(message);
      }), clearAllCaches(), logEvent("tengu_marketplace_updated", {
        marketplace_name: name3
      }), cliOk(`${figures_default.tick} Successfully updated marketplace: ${name3}`);
    else {
      let config11 = await loadKnownMarketplacesConfig(), marketplaceNames = Object.keys(config11);
      if (marketplaceNames.length === 0)
        cliOk("No marketplaces configured");
      console.log(`Updating ${marketplaceNames.length} marketplace(s)...`), await refreshAllMarketplaces(), clearAllCaches(), logEvent("tengu_marketplace_updated_all", {
        count: marketplaceNames.length
      }), cliOk(`${figures_default.tick} Successfully updated ${marketplaceNames.length} marketplace(s)`);
    }
  } catch (error44) {
    handleMarketplaceError(error44, "update marketplace(s)");
  }
}
async function pluginInstallHandler(plugin2, options2) {
  if (options2.cowork)
    setUseCoworkPlugins(!0);
  let scope = options2.scope || "user";
  if (options2.cowork && scope !== "user")
    cliError("--cowork can only be used with user scope");
  if (!VALID_INSTALLABLE_SCOPES.includes(scope))
    cliError(`Invalid scope: ${scope}. Must be one of: ${VALID_INSTALLABLE_SCOPES.join(", ")}.`);
  let { name: name3, marketplace } = parsePluginIdentifier(plugin2);
  logEvent("tengu_plugin_install_command", {
    _PROTO_plugin_name: name3,
    ...marketplace && {
      _PROTO_marketplace_name: marketplace
    },
    scope
  }), await installPlugin(plugin2, scope);
}
async function pluginUninstallHandler(plugin2, options2) {
  if (options2.cowork)
    setUseCoworkPlugins(!0);
  let scope = options2.scope || "user";
  if (options2.cowork && scope !== "user")
    cliError("--cowork can only be used with user scope");
  if (!VALID_INSTALLABLE_SCOPES.includes(scope))
    cliError(`Invalid scope: ${scope}. Must be one of: ${VALID_INSTALLABLE_SCOPES.join(", ")}.`);
  let { name: name3, marketplace } = parsePluginIdentifier(plugin2);
  logEvent("tengu_plugin_uninstall_command", {
    _PROTO_plugin_name: name3,
    ...marketplace && {
      _PROTO_marketplace_name: marketplace
    },
    scope
  }), await uninstallPlugin(plugin2, scope, options2.keepData);
}
async function pluginEnableHandler(plugin2, options2) {
  if (options2.cowork)
    setUseCoworkPlugins(!0);
  let scope;
  if (options2.scope) {
    if (!VALID_INSTALLABLE_SCOPES.includes(options2.scope))
      cliError(`Invalid scope "${options2.scope}". Valid scopes: ${VALID_INSTALLABLE_SCOPES.join(", ")}`);
    scope = options2.scope;
  }
  if (options2.cowork && scope !== void 0 && scope !== "user")
    cliError("--cowork can only be used with user scope");
  if (options2.cowork && scope === void 0)
    scope = "user";
  let { name: name3, marketplace } = parsePluginIdentifier(plugin2);
  logEvent("tengu_plugin_enable_command", {
    _PROTO_plugin_name: name3,
    ...marketplace && {
      _PROTO_marketplace_name: marketplace
    },
    scope: scope ?? "auto"
  }), await enablePlugin(plugin2, scope);
}
async function pluginDisableHandler(plugin2, options2) {
  if (options2.all && plugin2)
    cliError("Cannot use --all with a specific plugin");
  if (!options2.all && !plugin2)
    cliError("Please specify a plugin name or use --all to disable all plugins");
  if (options2.cowork)
    setUseCoworkPlugins(!0);
  if (options2.all) {
    if (options2.scope)
      cliError("Cannot use --scope with --all");
    logEvent("tengu_plugin_disable_command", {}), await disableAllPlugins();
    return;
  }
  let scope;
  if (options2.scope) {
    if (!VALID_INSTALLABLE_SCOPES.includes(options2.scope))
      cliError(`Invalid scope "${options2.scope}". Valid scopes: ${VALID_INSTALLABLE_SCOPES.join(", ")}`);
    scope = options2.scope;
  }
  if (options2.cowork && scope !== void 0 && scope !== "user")
    cliError("--cowork can only be used with user scope");
  if (options2.cowork && scope === void 0)
    scope = "user";
  let { name: name3, marketplace } = parsePluginIdentifier(plugin2);
  logEvent("tengu_plugin_disable_command", {
    _PROTO_plugin_name: name3,
    ...marketplace && {
      _PROTO_marketplace_name: marketplace
    },
    scope: scope ?? "auto"
  }), await disablePlugin(plugin2, scope);
}
async function pluginUpdateHandler(plugin2, options2) {
  if (options2.cowork)
    setUseCoworkPlugins(!0);
  let { name: name3, marketplace } = parsePluginIdentifier(plugin2);
  logEvent("tengu_plugin_update_command", {
    _PROTO_plugin_name: name3,
    ...marketplace && {
      _PROTO_marketplace_name: marketplace
    }
  });
  let scope = "user";
  if (options2.scope) {
    if (!VALID_UPDATE_SCOPES.includes(options2.scope))
      cliError(`Invalid scope "${options2.scope}". Valid scopes: ${VALID_UPDATE_SCOPES.join(", ")}`);
    scope = options2.scope;
  }
  if (options2.cowork && scope !== "user")
    cliError("--cowork can only be used with user scope");
  await updatePluginCli(plugin2, scope);
}
var init_plugins = __esm(() => {
  init_figures();
  init_state();
  init_pluginCliCommands();
  init_errors();
  init_log3();
  init_cacheUtils();
  init_installCounts();
  init_installedPluginsManager();
  init_marketplaceHelpers();
  init_marketplaceManager();
  init_mcpPluginIntegration();
  init_parseMarketplaceInput();
  init_pluginIdentifier();
  init_pluginLoader();
  init_validatePlugin();
  init_slowOperations();
});
