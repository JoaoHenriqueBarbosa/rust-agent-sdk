// Original: src/commands/plugin/parseArgs.ts
function parsePluginArgs(args) {
  if (!args)
    return { type: "menu" };
  let parts = args.trim().split(/\s+/);
  switch (parts[0]?.toLowerCase()) {
    case "help":
    case "--help":
    case "-h":
      return { type: "help" };
    case "install":
    case "i": {
      let target = parts[1];
      if (!target)
        return { type: "install" };
      if (target.includes("@")) {
        let [plugin, marketplace] = target.split("@");
        return { type: "install", plugin, marketplace };
      }
      if (target.startsWith("http://") || target.startsWith("https://") || target.startsWith("file://") || target.includes("/") || target.includes("\\"))
        return { type: "install", marketplace: target };
      return { type: "install", plugin: target };
    }
    case "manage":
      return { type: "manage" };
    case "uninstall":
      return { type: "uninstall", plugin: parts[1] };
    case "enable":
      return { type: "enable", plugin: parts[1] };
    case "disable":
      return { type: "disable", plugin: parts[1] };
    case "validate":
      return { type: "validate", path: parts.slice(1).join(" ").trim() || void 0 };
    case "marketplace":
    case "market": {
      let action2 = parts[1]?.toLowerCase(), target = parts.slice(2).join(" ");
      switch (action2) {
        case "add":
          return { type: "marketplace", action: "add", target };
        case "remove":
        case "rm":
          return { type: "marketplace", action: "remove", target };
        case "update":
          return { type: "marketplace", action: "update", target };
        case "list":
          return { type: "marketplace", action: "list" };
        default:
          return { type: "marketplace" };
      }
    }
    default:
      return { type: "menu" };
  }
}
