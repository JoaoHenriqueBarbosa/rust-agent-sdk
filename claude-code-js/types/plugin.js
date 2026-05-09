// Original: src/types/plugin.ts
function getPluginErrorMessage(error44) {
  switch (error44.type) {
    case "generic-error":
      return error44.error;
    case "path-not-found":
      return `Path not found: ${error44.path} (${error44.component})`;
    case "git-auth-failed":
      return `Git authentication failed (${error44.authType}): ${error44.gitUrl}`;
    case "git-timeout":
      return `Git ${error44.operation} timeout: ${error44.gitUrl}`;
    case "network-error":
      return `Network error: ${error44.url}${error44.details ? ` - ${error44.details}` : ""}`;
    case "manifest-parse-error":
      return `Manifest parse error: ${error44.parseError}`;
    case "manifest-validation-error":
      return `Manifest validation failed: ${error44.validationErrors.join(", ")}`;
    case "plugin-not-found":
      return `Plugin ${error44.pluginId} not found in marketplace ${error44.marketplace}`;
    case "marketplace-not-found":
      return `Marketplace ${error44.marketplace} not found`;
    case "marketplace-load-failed":
      return `Marketplace ${error44.marketplace} failed to load: ${error44.reason}`;
    case "mcp-config-invalid":
      return `MCP server ${error44.serverName} invalid: ${error44.validationError}`;
    case "mcp-server-suppressed-duplicate": {
      let dup = error44.duplicateOf.startsWith("plugin:") ? `server provided by plugin "${error44.duplicateOf.split(":")[1] ?? "?"}"` : `already-configured "${error44.duplicateOf}"`;
      return `MCP server "${error44.serverName}" skipped \u2014 same command/URL as ${dup}`;
    }
    case "hook-load-failed":
      return `Hook load failed: ${error44.reason}`;
    case "component-load-failed":
      return `${error44.component} load failed from ${error44.path}: ${error44.reason}`;
    case "mcpb-download-failed":
      return `Failed to download MCPB from ${error44.url}: ${error44.reason}`;
    case "mcpb-extract-failed":
      return `Failed to extract MCPB ${error44.mcpbPath}: ${error44.reason}`;
    case "mcpb-invalid-manifest":
      return `MCPB manifest invalid at ${error44.mcpbPath}: ${error44.validationError}`;
    case "lsp-config-invalid":
      return `Plugin "${error44.plugin}" has invalid LSP server config for "${error44.serverName}": ${error44.validationError}`;
    case "lsp-server-start-failed":
      return `Plugin "${error44.plugin}" failed to start LSP server "${error44.serverName}": ${error44.reason}`;
    case "lsp-server-crashed":
      if (error44.signal)
        return `Plugin "${error44.plugin}" LSP server "${error44.serverName}" crashed with signal ${error44.signal}`;
      return `Plugin "${error44.plugin}" LSP server "${error44.serverName}" crashed with exit code ${error44.exitCode ?? "unknown"}`;
    case "lsp-request-timeout":
      return `Plugin "${error44.plugin}" LSP server "${error44.serverName}" timed out on ${error44.method} request after ${error44.timeoutMs}ms`;
    case "lsp-request-failed":
      return `Plugin "${error44.plugin}" LSP server "${error44.serverName}" ${error44.method} request failed: ${error44.error}`;
    case "marketplace-blocked-by-policy":
      if (error44.blockedByBlocklist)
        return `Marketplace '${error44.marketplace}' is blocked by enterprise policy`;
      return `Marketplace '${error44.marketplace}' is not in the allowed marketplace list`;
    case "dependency-unsatisfied": {
      let hint = error44.reason === "not-enabled" ? "disabled \u2014 enable it or remove the dependency" : "not found in any configured marketplace";
      return `Dependency "${error44.dependency}" is ${hint}`;
    }
    case "plugin-cache-miss":
      return `Plugin "${error44.plugin}" not cached at ${error44.installPath} \u2014 run /plugins to refresh`;
  }
}
