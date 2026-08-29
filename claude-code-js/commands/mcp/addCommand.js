// Original: src/commands/mcp/addCommand.ts
function registerMcpAddCommand(mcp2) {
  mcp2.command("add <name> <commandOrUrl> [args...]").description(`Add an MCP server to Claude Code.

Examples:
  # Add HTTP server:
  claude mcp add --transport http sentry https://mcp.sentry.dev/mcp

  # Add HTTP server with headers:
  claude mcp add --transport http corridor https://app.corridor.dev/api/mcp --header "Authorization: Bearer ..."

  # Add stdio server with environment variables:
  claude mcp add -e API_KEY=xxx my-server -- npx my-mcp-server

  # Add stdio server with subprocess flags:
  claude mcp add my-server -- my-command --some-flag arg1`).option("-s, --scope <scope>", "Configuration scope (local, user, or project)", "local").option("-t, --transport <transport>", "Transport type (stdio, sse, http). Defaults to stdio if not specified.").option("-e, --env <env...>", "Set environment variables (e.g. -e KEY=value)").option("-H, --header <header...>", 'Set WebSocket headers (e.g. -H "X-Api-Key: abc123" -H "X-Custom: value")').option("--client-id <clientId>", "OAuth client ID for HTTP/SSE servers").option("--client-secret", "Prompt for OAuth client secret (or set MCP_CLIENT_SECRET env var)").option("--callback-port <port>", "Fixed port for OAuth callback (for servers requiring pre-registered redirect URIs)").helpOption("-h, --help", "Display help for command").addOption(new Option("--xaa", "Enable XAA (SEP-990) for this server. Requires 'claude mcp xaa setup' first. Also requires --client-id and --client-secret (for the MCP server's AS).").hideHelp(!isXaaEnabled())).action(async (name3, commandOrUrl, args, options2) => {
    let actualCommand = commandOrUrl, actualArgs = args;
    if (!name3)
      cliError(`Error: Server name is required.
Usage: claude mcp add <name> <command> [args...]`);
    else if (!actualCommand)
      cliError(`Error: Command is required when server name is provided.
Usage: claude mcp add <name> <command> [args...]`);
    try {
      let scope = ensureConfigScope(options2.scope), transport = ensureTransport(options2.transport);
      if (options2.xaa && !isXaaEnabled())
        cliError("Error: --xaa requires CLAUDE_CODE_ENABLE_XAA=1 in your environment");
      let xaa = Boolean(options2.xaa);
      if (xaa) {
        let missing = [];
        if (!options2.clientId)
          missing.push("--client-id");
        if (!options2.clientSecret)
          missing.push("--client-secret");
        if (!getXaaIdpSettings())
          missing.push("'claude mcp xaa setup' (settings.xaaIdp not configured)");
        if (missing.length)
          cliError(`Error: --xaa requires: ${missing.join(", ")}`);
      }
      let transportExplicit = options2.transport !== void 0, looksLikeUrl = actualCommand.startsWith("http://") || actualCommand.startsWith("https://") || actualCommand.startsWith("localhost") || actualCommand.endsWith("/sse") || actualCommand.endsWith("/mcp");
      if (logEvent("tengu_mcp_add", {
        type: transport,
        scope,
        source: "command",
        transport,
        transportExplicit,
        looksLikeUrl
      }), transport === "sse") {
        if (!actualCommand)
          cliError("Error: URL is required for SSE transport.");
        let headers = options2.header ? parseHeaders(options2.header) : void 0, callbackPort = options2.callbackPort ? parseInt(options2.callbackPort, 10) : void 0, oauth = options2.clientId || callbackPort || xaa ? {
          ...options2.clientId ? { clientId: options2.clientId } : {},
          ...callbackPort ? { callbackPort } : {},
          ...xaa ? { xaa: !0 } : {}
        } : void 0, clientSecret = options2.clientSecret && options2.clientId ? await readClientSecret() : void 0, serverConfig = {
          type: "sse",
          url: actualCommand,
          headers,
          oauth
        };
        if (await addMcpConfig(name3, serverConfig, scope), clientSecret)
          saveMcpClientSecret(name3, serverConfig, clientSecret);
        if (process.stdout.write(`Added SSE MCP server ${name3} with URL: ${actualCommand} to ${scope} config
`), headers)
          process.stdout.write(`Headers: ${jsonStringify(headers, null, 2)}
`);
      } else if (transport === "http") {
        if (!actualCommand)
          cliError("Error: URL is required for HTTP transport.");
        let headers = options2.header ? parseHeaders(options2.header) : void 0, callbackPort = options2.callbackPort ? parseInt(options2.callbackPort, 10) : void 0, oauth = options2.clientId || callbackPort || xaa ? {
          ...options2.clientId ? { clientId: options2.clientId } : {},
          ...callbackPort ? { callbackPort } : {},
          ...xaa ? { xaa: !0 } : {}
        } : void 0, clientSecret = options2.clientSecret && options2.clientId ? await readClientSecret() : void 0, serverConfig = {
          type: "http",
          url: actualCommand,
          headers,
          oauth
        };
        if (await addMcpConfig(name3, serverConfig, scope), clientSecret)
          saveMcpClientSecret(name3, serverConfig, clientSecret);
        if (process.stdout.write(`Added HTTP MCP server ${name3} with URL: ${actualCommand} to ${scope} config
`), headers)
          process.stdout.write(`Headers: ${jsonStringify(headers, null, 2)}
`);
      } else {
        if (options2.clientId || options2.clientSecret || options2.callbackPort || options2.xaa)
          process.stderr.write(`Warning: --client-id, --client-secret, --callback-port, and --xaa are only supported for HTTP/SSE transports and will be ignored for stdio.
`);
        if (!transportExplicit && looksLikeUrl)
          process.stderr.write(`
Warning: The command "${actualCommand}" looks like a URL, but is being interpreted as a stdio server as --transport was not specified.
`), process.stderr.write(`If this is an HTTP server, use: claude mcp add --transport http ${name3} ${actualCommand}
`), process.stderr.write(`If this is an SSE server, use: claude mcp add --transport sse ${name3} ${actualCommand}
`);
        let env5 = parseEnvVars(options2.env);
        await addMcpConfig(name3, { type: "stdio", command: actualCommand, args: actualArgs, env: env5 }, scope), process.stdout.write(`Added stdio MCP server ${name3} with command: ${actualCommand} ${actualArgs.join(" ")} to ${scope} config
`);
      }
      cliOk(`File modified: ${describeMcpConfigFilePath(scope)}`);
    } catch (error44) {
      cliError(error44.message);
    }
  });
}
var init_addCommand = __esm(() => {
  init_esm35();
  init_auth17();
  init_config8();
  init_utils7();
  init_xaaIdpLogin();
  init_envUtils();
  init_slowOperations();
});
