// function: getMarketplaceDeclaringSource
function getMarketplaceDeclaringSource(name3) {
  let editableSources = ["localSettings", "projectSettings", "userSettings"];
  for (let source of editableSources)
    if (getSettingsForSource(source)?.extraKnownMarketplaces?.[name3])
      return source;
  return null;
}
