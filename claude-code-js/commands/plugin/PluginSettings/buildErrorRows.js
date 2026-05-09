// function: buildErrorRows
function buildErrorRows(failedMarketplaces, extraMarketplaceErrors, pluginLoadingErrors, otherErrors, brokenInstalledMarketplaces, transientErrors, pluginScopes) {
  let rows = [];
  for (let error44 of transientErrors) {
    let pluginName = "pluginId" in error44 ? error44.pluginId : ("plugin" in error44) ? error44.plugin : void 0;
    rows.push({
      label: pluginName ?? error44.source,
      message: formatErrorMessage(error44),
      guidance: "Restart to retry loading plugins",
      action: {
        kind: "none"
      }
    });
  }
  let shownMarketplaceNames = /* @__PURE__ */ new Set;
  for (let m4 of failedMarketplaces) {
    shownMarketplaceNames.add(m4.name);
    let action2 = buildMarketplaceAction(m4.name), sourceInfo = getExtraMarketplaceSourceInfo(m4.name), scope = sourceInfo.isInPolicy ? "managed" : sourceInfo.editableSources[0]?.scope;
    rows.push({
      label: m4.name,
      message: m4.error ?? "Installation failed",
      guidance: action2.kind === "managed-only" ? "Managed by your organization \u2014 contact your admin" : void 0,
      action: action2,
      scope
    });
  }
  for (let e of extraMarketplaceErrors) {
    let marketplace = "marketplace" in e ? e.marketplace : e.source;
    if (shownMarketplaceNames.has(marketplace))
      continue;
    shownMarketplaceNames.add(marketplace);
    let action2 = buildMarketplaceAction(marketplace), sourceInfo = getExtraMarketplaceSourceInfo(marketplace), scope = sourceInfo.isInPolicy ? "managed" : sourceInfo.editableSources[0]?.scope;
    rows.push({
      label: marketplace,
      message: formatErrorMessage(e),
      guidance: action2.kind === "managed-only" ? "Managed by your organization \u2014 contact your admin" : getErrorGuidance(e),
      action: action2,
      scope
    });
  }
  for (let m4 of brokenInstalledMarketplaces) {
    if (shownMarketplaceNames.has(m4.name))
      continue;
    shownMarketplaceNames.add(m4.name), rows.push({
      label: m4.name,
      message: m4.error,
      action: {
        kind: "remove-installed-marketplace",
        name: m4.name
      }
    });
  }
  let shownPluginNames = /* @__PURE__ */ new Set;
  for (let error44 of pluginLoadingErrors) {
    let pluginName = getPluginNameFromError(error44);
    if (pluginName && shownPluginNames.has(pluginName))
      continue;
    if (pluginName)
      shownPluginNames.add(pluginName);
    let marketplace = "marketplace" in error44 ? error44.marketplace : void 0, scope = pluginName ? pluginScopes.get(error44.source) ?? pluginScopes.get(pluginName) : void 0;
    rows.push({
      label: pluginName ? marketplace ? `${pluginName} @ ${marketplace}` : pluginName : error44.source,
      message: formatErrorMessage(error44),
      guidance: getErrorGuidance(error44),
      action: pluginName ? buildPluginAction(pluginName) : {
        kind: "none"
      },
      scope
    });
  }
  for (let error44 of otherErrors)
    rows.push({
      label: error44.source,
      message: formatErrorMessage(error44),
      guidance: getErrorGuidance(error44),
      action: {
        kind: "none"
      }
    });
  return rows;
}
