// Original: src/cli/handlers/mcp.tsx
var exports_mcp3 = {};
__export(exports_mcp3, {
  mcpServeHandler: () => mcpServeHandler,
  mcpResetChoicesHandler: () => mcpResetChoicesHandler,
  mcpRemoveHandler: () => mcpRemoveHandler,
  mcpListHandler: () => mcpListHandler,
  mcpGetHandler: () => mcpGetHandler,
  mcpAddJsonHandler: () => mcpAddJsonHandler,
  mcpAddFromDesktopHandler: () => mcpAddFromDesktopHandler
});
import { stat as stat47 } from "fs/promises";
import { cwd as cwd3 } from "process";
async function checkMcpServerHealth(name3, server) {
  try {
    let result = await connectToServer(name3, server);
    if (result.type === "connected")
      return "\u2713 Connected";
    else if (result.type === "needs-auth")
      return "! Needs authentication";
    else
      return "\u2717 Failed to connect";
  } catch (_error) {
    return "\u2717 Connection error";
  }
}
async function mcpServeHandler({
  debug,
  verbose
}) {
  let providedCwd = cwd3();
  logEvent("tengu_mcp_start", {});
  try {
    await stat47(providedCwd);
  } catch (error44) {
    if (isFsInaccessible(error44))
      cliError(`Error: Directory ${providedCwd} does not exist`);
    throw error44;
  }
  try {
    let {
      setup: setup2
    } = await Promise.resolve().then(() => (init_setup3(), exports_setup));
    await setup2(providedCwd, "default", !1, !1, void 0, !1);
    let {
      startMCPServer: startMCPServer2
    } = await Promise.resolve().then(() => (init_mcp4(), exports_mcp2));
    await startMCPServer2(providedCwd, debug ?? !1, verbose ?? !1);
  } catch (error44) {
    cliError(`Error: Failed to start MCP server: ${error44}`);
  }
}
async function mcpRemoveHandler(name3, options2) {
  let serverBeforeRemoval = getMcpConfigByName(name3), cleanupSecureStorage = () => {
    if (serverBeforeRemoval && (serverBeforeRemoval.type === "sse" || serverBeforeRemoval.type === "http"))
      clearServerTokensFromLocalStorage(name3, serverBeforeRemoval), clearMcpClientConfig(name3, serverBeforeRemoval);
  };
  try {
    if (options2.scope) {
      let scope = ensureConfigScope(options2.scope);
      logEvent("tengu_mcp_delete", {
        name: name3,
        scope
      }), await removeMcpConfig(name3, scope), cleanupSecureStorage(), process.stdout.write(`Removed MCP server ${name3} from ${scope} config
`), cliOk(`File modified: ${describeMcpConfigFilePath(scope)}`);
    }
    let projectConfig = getCurrentProjectConfig(), globalConfig2 = getGlobalConfig(), {
      servers: projectServers
    } = getMcpConfigsByScope("project"), mcpJsonExists = !!projectServers[name3], scopes = [];
    if (projectConfig.mcpServers?.[name3])
      scopes.push("local");
    if (mcpJsonExists)
      scopes.push("project");
    if (globalConfig2.mcpServers?.[name3])
      scopes.push("user");
    if (scopes.length === 0)
      cliError(`No MCP server found with name: "${name3}"`);
    else if (scopes.length === 1) {
      let scope = scopes[0];
      logEvent("tengu_mcp_delete", {
        name: name3,
        scope
      }), await removeMcpConfig(name3, scope), cleanupSecureStorage(), process.stdout.write(`Removed MCP server "${name3}" from ${scope} config
`), cliOk(`File modified: ${describeMcpConfigFilePath(scope)}`);
    } else
      process.stderr.write(`MCP server "${name3}" exists in multiple scopes:
`), scopes.forEach((scope) => {
        process.stderr.write(`  - ${getScopeLabel(scope)} (${describeMcpConfigFilePath(scope)})
`);
      }), process.stderr.write(`
To remove from a specific scope, use:
`), scopes.forEach((scope) => {
        process.stderr.write(`  claude mcp remove "${name3}" -s ${scope}
`);
      }), cliError();
  } catch (error44) {
    cliError(error44.message);
  }
}
async function mcpListHandler() {
  logEvent("tengu_mcp_list", {});
  let {
    servers: configs
  } = await getAllMcpConfigs();
  if (Object.keys(configs).length === 0)
    console.log("No MCP servers configured. Use `claude mcp add` to add a server.");
  else {
    console.log(`Checking MCP server health...
`);
    let entries2 = Object.entries(configs), results = await pMap(entries2, async ([name3, server]) => ({
      name: name3,
      server,
      status: await checkMcpServerHealth(name3, server)
    }), {
      concurrency: getMcpServerConnectionBatchSize()
    });
    for (let {
      name: name3,
      server,
      status: status2
    } of results)
      if (server.type === "sse")
        console.log(`${name3}: ${server.url} (SSE) - ${status2}`);
      else if (server.type === "http")
        console.log(`${name3}: ${server.url} (HTTP) - ${status2}`);
      else if (server.type === "claudeai-proxy")
        console.log(`${name3}: ${server.url} - ${status2}`);
      else if (!server.type || server.type === "stdio") {
        let args = Array.isArray(server.args) ? server.args : [];
        console.log(`${name3}: ${server.command} ${args.join(" ")} - ${status2}`);
      }
  }
  await gracefulShutdown(0);
}
async function mcpGetHandler(name3) {
  logEvent("tengu_mcp_get", {
    name: name3
  });
  let server = getMcpConfigByName(name3);
  if (!server)
    cliError(`No MCP server found with name: ${name3}`);
  console.log(`${name3}:`), console.log(`  Scope: ${getScopeLabel(server.scope)}`);
  let status2 = await checkMcpServerHealth(name3, server);
  if (console.log(`  Status: ${status2}`), server.type === "sse") {
    if (console.log("  Type: sse"), console.log(`  URL: ${server.url}`), server.headers) {
      console.log("  Headers:");
      for (let [key3, value] of Object.entries(server.headers))
        console.log(`    ${key3}: ${value}`);
    }
    if (server.oauth?.clientId || server.oauth?.callbackPort) {
      let parts = [];
      if (server.oauth.clientId) {
        if (parts.push("client_id configured"), getMcpClientConfig(name3, server)?.clientSecret)
          parts.push("client_secret configured");
      }
      if (server.oauth.callbackPort)
        parts.push(`callback_port ${server.oauth.callbackPort}`);
      console.log(`  OAuth: ${parts.join(", ")}`);
    }
  } else if (server.type === "http") {
    if (console.log("  Type: http"), console.log(`  URL: ${server.url}`), server.headers) {
      console.log("  Headers:");
      for (let [key3, value] of Object.entries(server.headers))
        console.log(`    ${key3}: ${value}`);
    }
    if (server.oauth?.clientId || server.oauth?.callbackPort) {
      let parts = [];
      if (server.oauth.clientId) {
        if (parts.push("client_id configured"), getMcpClientConfig(name3, server)?.clientSecret)
          parts.push("client_secret configured");
      }
      if (server.oauth.callbackPort)
        parts.push(`callback_port ${server.oauth.callbackPort}`);
      console.log(`  OAuth: ${parts.join(", ")}`);
    }
  } else if (server.type === "stdio") {
    console.log("  Type: stdio"), console.log(`  Command: ${server.command}`);
    let args = Array.isArray(server.args) ? server.args : [];
    if (console.log(`  Args: ${args.join(" ")}`), server.env) {
      console.log("  Environment:");
      for (let [key3, value] of Object.entries(server.env))
        console.log(`    ${key3}=${value}`);
    }
  }
  console.log(`
To remove this server, run: claude mcp remove "${name3}" -s ${server.scope}`), await gracefulShutdown(0);
}
async function mcpAddJsonHandler(name3, json2, options2) {
  try {
    let scope = ensureConfigScope(options2.scope), parsedJson = safeParseJSON(json2), clientSecret = options2.clientSecret && parsedJson && typeof parsedJson === "object" && "type" in parsedJson && (parsedJson.type === "sse" || parsedJson.type === "http") && "url" in parsedJson && typeof parsedJson.url === "string" && "oauth" in parsedJson && parsedJson.oauth && typeof parsedJson.oauth === "object" && "clientId" in parsedJson.oauth ? await readClientSecret() : void 0;
    await addMcpConfig(name3, parsedJson, scope);
    let transportType = parsedJson && typeof parsedJson === "object" && "type" in parsedJson ? String(parsedJson.type || "stdio") : "stdio";
    if (clientSecret && parsedJson && typeof parsedJson === "object" && "type" in parsedJson && (parsedJson.type === "sse" || parsedJson.type === "http") && "url" in parsedJson && typeof parsedJson.url === "string")
      saveMcpClientSecret(name3, {
        type: parsedJson.type,
        url: parsedJson.url
      }, clientSecret);
    logEvent("tengu_mcp_add", {
      scope,
      source: "json",
      type: transportType
    }), cliOk(`Added ${transportType} MCP server ${name3} to ${scope} config`);
  } catch (error44) {
    cliError(error44.message);
  }
}
async function mcpAddFromDesktopHandler(options2) {
  try {
    let scope = ensureConfigScope(options2.scope), platform7 = getPlatform();
    logEvent("tengu_mcp_add", {
      scope,
      platform: platform7,
      source: "desktop"
    });
    let {
      readClaudeDesktopMcpServers: readClaudeDesktopMcpServers2
    } = await Promise.resolve().then(() => (init_claudeDesktop(), exports_claudeDesktop)), servers = await readClaudeDesktopMcpServers2();
    if (Object.keys(servers).length === 0)
      cliOk("No MCP servers found in Claude Desktop configuration or configuration file does not exist.");
    let {
      unmount
    } = await render(/* @__PURE__ */ jsx_dev_runtime482.jsxDEV(AppStateProvider, {
      children: /* @__PURE__ */ jsx_dev_runtime482.jsxDEV(KeybindingSetup, {
        children: /* @__PURE__ */ jsx_dev_runtime482.jsxDEV(MCPServerDesktopImportDialog, {
          servers,
          scope,
          onDone: () => {
            unmount();
          }
        }, void 0, !1, void 0, this)
      }, void 0, !1, void 0, this)
    }, void 0, !1, void 0, this), {
      exitOnCtrlC: !0
    });
  } catch (error44) {
    cliError(error44.message);
  }
}
async function mcpResetChoicesHandler() {
  logEvent("tengu_mcp_reset_mcpjson_choices", {}), saveCurrentProjectConfig((current) => ({
    ...current,
    enabledMcpjsonServers: [],
    disabledMcpjsonServers: [],
    enableAllProjectMcpServers: !1
  })), cliOk(`All project-scoped (.mcp.json) server approvals and rejections have been reset.
You will be prompted for approval next time you start Claude Code.`);
}
var jsx_dev_runtime482;
var init_mcp5 = __esm(() => {
  init_p_map();
  init_MCPServerDesktopImportDialog();
  init_ink2();
  init_KeybindingProviderSetup();
  init_auth17();
  init_client20();
  init_config8();
  init_utils7();
  init_AppState();
  init_config4();
  init_errors();
  init_gracefulShutdown();
  init_json();
  init_platform();
  jsx_dev_runtime482 = __toESM(require_react_jsx_dev_runtime_development(), 1);
});
