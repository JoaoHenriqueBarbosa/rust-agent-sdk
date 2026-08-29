// function: assemblePluginLoadResult
async function assemblePluginLoadResult(marketplaceLoader) {
  let inlinePlugins = getInlinePlugins(), [marketplaceResult, sessionResult] = await Promise.all([
    marketplaceLoader(),
    inlinePlugins.length > 0 ? loadSessionOnlyPlugins(inlinePlugins) : Promise.resolve({ plugins: [], errors: [] })
  ]), builtinResult = getBuiltinPlugins(), { plugins: allPlugins, errors: mergeErrors } = mergePluginSources({
    session: sessionResult.plugins,
    marketplace: marketplaceResult.plugins,
    builtin: [...builtinResult.enabled, ...builtinResult.disabled],
    managedNames: getManagedPluginNames()
  }), allErrors = [
    ...marketplaceResult.errors,
    ...sessionResult.errors,
    ...mergeErrors
  ], { demoted, errors: depErrors } = verifyAndDemote(allPlugins);
  for (let p4 of allPlugins)
    if (demoted.has(p4.source))
      p4.enabled = !1;
  allErrors.push(...depErrors);
  let enabledPlugins = allPlugins.filter((p4) => p4.enabled);
  return logForDebugging(`Found ${allPlugins.length} plugins (${enabledPlugins.length} enabled, ${allPlugins.length - enabledPlugins.length} disabled)`), cachePluginSettings(enabledPlugins), {
    enabled: enabledPlugins,
    disabled: allPlugins.filter((p4) => !p4.enabled),
    errors: allErrors
  };
}
