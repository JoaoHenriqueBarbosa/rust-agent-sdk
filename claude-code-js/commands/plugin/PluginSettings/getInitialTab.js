// function: getInitialTab
function getInitialTab(viewState) {
  if (viewState.type === "manage-plugins")
    return "installed";
  if (viewState.type === "manage-marketplaces")
    return "marketplaces";
  return "discover";
}
