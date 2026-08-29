// Original: src/utils/plugins/lspRecommendation.ts
import { extname as extname13 } from "path";
function isOfficialMarketplace(name3) {
  return ALLOWED_OFFICIAL_MARKETPLACE_NAMES.has(name3.toLowerCase());
}
function extractLspInfoFromManifest(lspServers) {
  if (!lspServers)
    return null;
  if (typeof lspServers === "string")
    return logForDebugging("[lspRecommendation] Skipping string path lspServers (not readable from marketplace)"), null;
  if (Array.isArray(lspServers)) {
    for (let item of lspServers) {
      if (typeof item === "string")
        continue;
      let info = extractFromServerConfigRecord(item);
      if (info)
        return info;
    }
    return null;
  }
  return extractFromServerConfigRecord(lspServers);
}
function isRecord2(value) {
  return typeof value === "object" && value !== null;
}
function extractFromServerConfigRecord(serverConfigs) {
  let extensions20 = /* @__PURE__ */ new Set, command19 = null;
  for (let [_serverName, config11] of Object.entries(serverConfigs)) {
    if (!isRecord2(config11))
      continue;
    if (!command19 && typeof config11.command === "string")
      command19 = config11.command;
    let extMapping = config11.extensionToLanguage;
    if (isRecord2(extMapping))
      for (let ext of Object.keys(extMapping))
        extensions20.add(ext.toLowerCase());
  }
  if (!command19 || extensions20.size === 0)
    return null;
  return { extensions: extensions20, command: command19 };
}
async function getLspPluginsFromMarketplaces() {
  let result = /* @__PURE__ */ new Map;
  try {
    let config11 = await loadKnownMarketplacesConfig();
    for (let marketplaceName of Object.keys(config11))
      try {
        let marketplace = await getMarketplace(marketplaceName), isOfficial = isOfficialMarketplace(marketplaceName);
        for (let entry of marketplace.plugins) {
          if (!entry.lspServers)
            continue;
          let lspInfo = extractLspInfoFromManifest(entry.lspServers);
          if (!lspInfo)
            continue;
          let pluginId = `${entry.name}@${marketplaceName}`;
          result.set(pluginId, {
            entry,
            marketplaceName,
            extensions: lspInfo.extensions,
            command: lspInfo.command,
            isOfficial
          });
        }
      } catch (error44) {
        logForDebugging(`[lspRecommendation] Failed to load marketplace ${marketplaceName}: ${error44}`);
      }
  } catch (error44) {
    logForDebugging(`[lspRecommendation] Failed to load marketplaces config: ${error44}`);
  }
  return result;
}
async function getMatchingLspPlugins(filePath) {
  if (isLspRecommendationsDisabled())
    return logForDebugging("[lspRecommendation] Recommendations are disabled"), [];
  let ext = extname13(filePath).toLowerCase();
  if (!ext)
    return logForDebugging("[lspRecommendation] No file extension found"), [];
  logForDebugging(`[lspRecommendation] Looking for LSP plugins for ${ext}`);
  let allLspPlugins = await getLspPluginsFromMarketplaces(), neverPlugins = getGlobalConfig().lspRecommendationNeverPlugins ?? [], matchingPlugins = [];
  for (let [pluginId, info] of allLspPlugins) {
    if (!info.extensions.has(ext))
      continue;
    if (neverPlugins.includes(pluginId)) {
      logForDebugging(`[lspRecommendation] Skipping ${pluginId} (in never suggest list)`);
      continue;
    }
    if (isPluginInstalled(pluginId)) {
      logForDebugging(`[lspRecommendation] Skipping ${pluginId} (already installed)`);
      continue;
    }
    matchingPlugins.push({ info, pluginId });
  }
  let pluginsWithBinary = [];
  for (let { info, pluginId } of matchingPlugins)
    if (await isBinaryInstalled(info.command))
      pluginsWithBinary.push({ info, pluginId }), logForDebugging(`[lspRecommendation] Binary '${info.command}' found for ${pluginId}`);
    else
      logForDebugging(`[lspRecommendation] Skipping ${pluginId} (binary '${info.command}' not found)`);
  return pluginsWithBinary.sort((a2, b) => {
    if (a2.info.isOfficial && !b.info.isOfficial)
      return -1;
    if (!a2.info.isOfficial && b.info.isOfficial)
      return 1;
    return 0;
  }), pluginsWithBinary.map(({ info, pluginId }) => ({
    pluginId,
    pluginName: info.entry.name,
    marketplaceName: info.marketplaceName,
    description: info.entry.description,
    isOfficial: info.isOfficial,
    extensions: Array.from(info.extensions),
    command: info.command
  }));
}
function addToNeverSuggest(pluginId) {
  saveGlobalConfig((currentConfig) => {
    let current = currentConfig.lspRecommendationNeverPlugins ?? [];
    if (current.includes(pluginId))
      return currentConfig;
    return {
      ...currentConfig,
      lspRecommendationNeverPlugins: [...current, pluginId]
    };
  }), logForDebugging(`[lspRecommendation] Added ${pluginId} to never suggest`);
}
function incrementIgnoredCount() {
  saveGlobalConfig((currentConfig) => {
    let newCount = (currentConfig.lspRecommendationIgnoredCount ?? 0) + 1;
    return {
      ...currentConfig,
      lspRecommendationIgnoredCount: newCount
    };
  }), logForDebugging("[lspRecommendation] Incremented ignored count");
}
function isLspRecommendationsDisabled() {
  let config11 = getGlobalConfig();
  return config11.lspRecommendationDisabled === !0 || (config11.lspRecommendationIgnoredCount ?? 0) >= MAX_IGNORED_COUNT;
}
var MAX_IGNORED_COUNT = 5;
var init_lspRecommendation = __esm(() => {
  init_binaryCheck();
  init_config4();
  init_debug();
  init_installedPluginsManager();
  init_marketplaceManager();
  init_schemas3();
});
