// function: getExtraMarketplaceSourceInfo
function getExtraMarketplaceSourceInfo(name3) {
  let editableSources = [], sourcesToCheck = [{
    source: "userSettings",
    scope: "user"
  }, {
    source: "projectSettings",
    scope: "project"
  }, {
    source: "localSettings",
    scope: "local"
  }];
  for (let {
    source,
    scope
  } of sourcesToCheck)
    if (getSettingsForSource(source)?.extraKnownMarketplaces?.[name3])
      editableSources.push({
        source,
        scope
      });
  let policySettings = getSettingsForSource("policySettings"), isInPolicy = Boolean(policySettings?.extraKnownMarketplaces?.[name3]);
  return {
    editableSources,
    isInPolicy
  };
}
