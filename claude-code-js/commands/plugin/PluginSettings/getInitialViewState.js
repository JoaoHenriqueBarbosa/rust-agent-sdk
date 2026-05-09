// function: getInitialViewState
function getInitialViewState(parsedCommand) {
  switch (parsedCommand.type) {
    case "help":
      return {
        type: "help"
      };
    case "validate":
      return {
        type: "validate",
        path: parsedCommand.path
      };
    case "install":
      if (parsedCommand.marketplace)
        return {
          type: "browse-marketplace",
          targetMarketplace: parsedCommand.marketplace,
          targetPlugin: parsedCommand.plugin
        };
      if (parsedCommand.plugin)
        return {
          type: "discover-plugins",
          targetPlugin: parsedCommand.plugin
        };
      return {
        type: "discover-plugins"
      };
    case "manage":
      return {
        type: "manage-plugins"
      };
    case "uninstall":
      return {
        type: "manage-plugins",
        targetPlugin: parsedCommand.plugin,
        action: "uninstall"
      };
    case "enable":
      return {
        type: "manage-plugins",
        targetPlugin: parsedCommand.plugin,
        action: "enable"
      };
    case "disable":
      return {
        type: "manage-plugins",
        targetPlugin: parsedCommand.plugin,
        action: "disable"
      };
    case "marketplace":
      if (parsedCommand.action === "list")
        return {
          type: "marketplace-list"
        };
      if (parsedCommand.action === "add")
        return {
          type: "add-marketplace",
          initialValue: parsedCommand.target
        };
      if (parsedCommand.action === "remove")
        return {
          type: "manage-marketplaces",
          targetMarketplace: parsedCommand.target,
          action: "remove"
        };
      if (parsedCommand.action === "update")
        return {
          type: "manage-marketplaces",
          targetMarketplace: parsedCommand.target,
          action: "update"
        };
      return {
        type: "marketplace-menu"
      };
    case "menu":
    default:
      return {
        type: "discover-plugins"
      };
  }
}
