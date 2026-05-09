// function: buildMarketplaceAction
function buildMarketplaceAction(name3) {
  let {
    editableSources,
    isInPolicy
  } = getExtraMarketplaceSourceInfo(name3);
  if (editableSources.length > 0)
    return {
      kind: "remove-extra-marketplace",
      name: name3,
      sources: editableSources
    };
  if (isInPolicy)
    return {
      kind: "managed-only",
      name: name3
    };
  return {
    kind: "navigate",
    tab: "marketplaces",
    viewState: {
      type: "manage-marketplaces",
      targetMarketplace: name3,
      action: "remove"
    }
  };
}
