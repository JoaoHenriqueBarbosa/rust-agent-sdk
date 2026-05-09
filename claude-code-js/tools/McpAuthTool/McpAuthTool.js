// Original: src/tools/McpAuthTool/McpAuthTool.ts
function getConfigUrl(config10) {
  if ("url" in config10)
    return config10.url;
  return;
}
function createMcpAuthTool(serverName, config10) {
  let url3 = getConfigUrl(config10), transport = config10.type ?? "stdio", location = url3 ? `${transport} at ${url3}` : transport, description = `The \`${serverName}\` MCP server (${location}) is installed but requires authentication. ` + "Call this tool to start the OAuth flow \u2014 you'll receive an authorization URL to share with the user. " + "Once the user completes authorization in their browser, the server's real tools will become available automatically.";
  return {
    name: buildMcpToolName(serverName, "authenticate"),
    isMcp: !0,
    mcpInfo: { serverName, toolName: "authenticate" },
    isEnabled: () => !0,
    isConcurrencySafe: () => !1,
    isReadOnly: () => !1,
    toAutoClassifierInput: () => serverName,
    userFacingName: () => `${serverName} - authenticate (MCP)`,
    maxResultSizeChars: 1e4,
    renderToolUseMessage: () => `Authenticate ${serverName} MCP server`,
    async description() {
      return description;
    },
    async prompt() {
      return description;
    },
    get inputSchema() {
      return inputSchema5();
    },
    async checkPermissions(input) {
      return { behavior: "allow", updatedInput: input };
    },
    async call(_input, context3) {
      if (config10.type === "claudeai-proxy")
        return {
          data: {
            status: "unsupported",
            message: `This is a claude.ai MCP connector. Ask the user to run /mcp and select "${serverName}" to authenticate.`
          }
        };
      if (config10.type !== "sse" && config10.type !== "http")
        return {
          data: {
            status: "unsupported",
            message: `Server "${serverName}" uses ${transport} transport which does not support OAuth from this tool. Ask the user to run /mcp and authenticate manually.`
          }
        };
      let sseOrHttpConfig = config10, resolveAuthUrl, authUrlPromise = new Promise((resolve24) => {
        resolveAuthUrl = resolve24;
      }), controller = new AbortController, { setAppState } = context3, oauthPromise = performMCPOAuthFlow(serverName, sseOrHttpConfig, (u5) => resolveAuthUrl?.(u5), controller.signal, { skipBrowserOpen: !0 });
      oauthPromise.then(async () => {
        clearMcpAuthCache();
        let result = await reconnectMcpServerImpl(serverName, config10), prefix = getMcpPrefix(serverName);
        setAppState((prev) => ({
          ...prev,
          mcp: {
            ...prev.mcp,
            clients: prev.mcp.clients.map((c3) => c3.name === serverName ? result.client : c3),
            tools: [
              ...reject_default(prev.mcp.tools, (t2) => t2.name?.startsWith(prefix)),
              ...result.tools
            ],
            commands: [
              ...reject_default(prev.mcp.commands, (c3) => c3.name?.startsWith(prefix)),
              ...result.commands
            ],
            resources: result.resources ? { ...prev.mcp.resources, [serverName]: result.resources } : prev.mcp.resources
          }
        })), logMCPDebug(serverName, `OAuth complete, reconnected with ${result.tools.length} tool(s)`);
      }).catch((err2) => {
        logMCPError(serverName, `OAuth flow failed after tool-triggered start: ${errorMessage(err2)}`);
      });
      try {
        let authUrl = await Promise.race([
          authUrlPromise,
          oauthPromise.then(() => null)
        ]);
        if (authUrl)
          return {
            data: {
              status: "auth_url",
              authUrl,
              message: `Ask the user to open this URL in their browser to authorize the ${serverName} MCP server:

${authUrl}

Once they complete the flow, the server's tools will become available automatically.`
            }
          };
        return {
          data: {
            status: "auth_url",
            message: `Authentication completed silently for ${serverName}. The server's tools should now be available.`
          }
        };
      } catch (err2) {
        return {
          data: {
            status: "error",
            message: `Failed to start OAuth flow for ${serverName}: ${errorMessage(err2)}. Ask the user to run /mcp and authenticate manually.`
          }
        };
      }
    },
    mapToolResultToToolResultBlockParam(data, toolUseID) {
      return {
        tool_use_id: toolUseID,
        type: "tool_result",
        content: data.message
      };
    }
  };
}
var inputSchema5;
var init_McpAuthTool = __esm(() => {
  init_reject2();
  init_v4();
  init_auth17();
  init_client20();
  init_mcpStringUtils();
  init_errors();
  init_log3();
  inputSchema5 = lazySchema(() => exports_external.object({}));
});
