// Original: src/commands/plugin/PluginErrors.tsx
function formatErrorMessage(error44) {
  switch (error44.type) {
    case "path-not-found":
      return `${error44.component} path not found: ${error44.path}`;
    case "git-auth-failed":
      return `Git ${error44.authType.toUpperCase()} authentication failed for ${error44.gitUrl}`;
    case "git-timeout":
      return `Git ${error44.operation} timed out for ${error44.gitUrl}`;
    case "network-error":
      return `Network error accessing ${error44.url}${error44.details ? `: ${error44.details}` : ""}`;
    case "manifest-parse-error":
      return `Failed to parse manifest at ${error44.manifestPath}: ${error44.parseError}`;
    case "manifest-validation-error":
      return `Invalid manifest at ${error44.manifestPath}: ${error44.validationErrors.join(", ")}`;
    case "plugin-not-found":
      return `Plugin "${error44.pluginId}" not found in marketplace "${error44.marketplace}"`;
    case "marketplace-not-found":
      return `Marketplace "${error44.marketplace}" not found`;
    case "marketplace-load-failed":
      return `Failed to load marketplace "${error44.marketplace}": ${error44.reason}`;
    case "mcp-config-invalid":
      return `Invalid MCP server config for "${error44.serverName}": ${error44.validationError}`;
    case "mcp-server-suppressed-duplicate": {
      let dup = error44.duplicateOf.startsWith("plugin:") ? `server provided by plugin "${error44.duplicateOf.split(":")[1] ?? "?"}"` : `already-configured "${error44.duplicateOf}"`;
      return `MCP server "${error44.serverName}" skipped \u2014 same command/URL as ${dup}`;
    }
    case "hook-load-failed":
      return `Failed to load hooks from ${error44.hookPath}: ${error44.reason}`;
    case "component-load-failed":
      return `Failed to load ${error44.component} from ${error44.path}: ${error44.reason}`;
    case "mcpb-download-failed":
      return `Failed to download MCPB from ${error44.url}: ${error44.reason}`;
    case "mcpb-extract-failed":
      return `Failed to extract MCPB ${error44.mcpbPath}: ${error44.reason}`;
    case "mcpb-invalid-manifest":
      return `MCPB manifest invalid at ${error44.mcpbPath}: ${error44.validationError}`;
    case "marketplace-blocked-by-policy":
      return error44.blockedByBlocklist ? `Marketplace "${error44.marketplace}" is blocked by enterprise policy` : `Marketplace "${error44.marketplace}" is not in the allowed marketplace list`;
    case "dependency-unsatisfied":
      return error44.reason === "not-enabled" ? `Dependency "${error44.dependency}" is disabled` : `Dependency "${error44.dependency}" is not installed`;
    case "lsp-config-invalid":
      return `Invalid LSP server config for "${error44.serverName}": ${error44.validationError}`;
    case "lsp-server-start-failed":
      return `LSP server "${error44.serverName}" failed to start: ${error44.reason}`;
    case "lsp-server-crashed":
      return error44.signal ? `LSP server "${error44.serverName}" crashed with signal ${error44.signal}` : `LSP server "${error44.serverName}" crashed with exit code ${error44.exitCode ?? "unknown"}`;
    case "lsp-request-timeout":
      return `LSP server "${error44.serverName}" timed out on ${error44.method} after ${error44.timeoutMs}ms`;
    case "lsp-request-failed":
      return `LSP server "${error44.serverName}" ${error44.method} failed: ${error44.error}`;
    case "plugin-cache-miss":
      return `Plugin "${error44.plugin}" not cached at ${error44.installPath}`;
    case "generic-error":
      return error44.error;
  }
  return getPluginErrorMessage(error44);
}
function getErrorGuidance(error44) {
  switch (error44.type) {
    case "path-not-found":
      return "Check that the path in your manifest or marketplace config is correct";
    case "git-auth-failed":
      return error44.authType === "ssh" ? "Configure SSH keys or use HTTPS URL instead" : "Configure credentials or use SSH URL instead";
    case "git-timeout":
    case "network-error":
      return "Check your internet connection and try again";
    case "manifest-parse-error":
      return "Check manifest file syntax in the plugin directory";
    case "manifest-validation-error":
      return "Check manifest file follows the required schema";
    case "plugin-not-found":
      return `Plugin may not exist in marketplace "${error44.marketplace}"`;
    case "marketplace-not-found":
      return error44.availableMarketplaces.length > 0 ? `Available marketplaces: ${error44.availableMarketplaces.join(", ")}` : "Add the marketplace first using /plugin marketplace add";
    case "mcp-config-invalid":
      return "Check MCP server configuration in .mcp.json or manifest";
    case "mcp-server-suppressed-duplicate": {
      if (error44.duplicateOf.startsWith("plugin:"))
        return `Disable plugin "${error44.duplicateOf.split(":")[1] ?? "the other plugin"}" if you want this plugin's version instead`;
      return `Remove "${error44.duplicateOf}" from your MCP config if you want the plugin's version instead`;
    }
    case "hook-load-failed":
      return "Check hooks.json file syntax and structure";
    case "component-load-failed":
      return `Check ${error44.component} directory structure and file permissions`;
    case "mcpb-download-failed":
      return "Check your internet connection and URL accessibility";
    case "mcpb-extract-failed":
      return "Verify the MCPB file is valid and not corrupted";
    case "mcpb-invalid-manifest":
      return "Contact the plugin author about the invalid manifest";
    case "marketplace-blocked-by-policy":
      if (error44.blockedByBlocklist)
        return "This marketplace source is explicitly blocked by your administrator";
      return error44.allowedSources.length > 0 ? `Allowed sources: ${error44.allowedSources.join(", ")}` : "Contact your administrator to configure allowed marketplace sources";
    case "dependency-unsatisfied":
      return error44.reason === "not-enabled" ? `Enable "${error44.dependency}" or uninstall "${error44.plugin}"` : `Install "${error44.dependency}" or uninstall "${error44.plugin}"`;
    case "lsp-config-invalid":
      return "Check LSP server configuration in the plugin manifest";
    case "lsp-server-start-failed":
    case "lsp-server-crashed":
    case "lsp-request-timeout":
    case "lsp-request-failed":
      return "Check LSP server logs with --debug for details";
    case "plugin-cache-miss":
      return "Run /plugins to refresh the plugin cache";
    case "marketplace-load-failed":
    case "generic-error":
      return null;
  }
  let _exhaustive = error44;
  return null;
}
var init_PluginErrors = () => {};
