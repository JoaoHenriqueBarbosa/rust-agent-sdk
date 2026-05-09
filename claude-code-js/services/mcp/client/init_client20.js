// var: init_client20
var init_client20 = __esm(() => {
  init_client19();
  init_sse();
  init_stdio4();
  init_streamableHttp();
  init_types();
  init_mapValues();
  init_memoize();
  init_zipObject();
  init_p_map();
  init_state();
  init_oauth();
  init_Tool();
  init_ListMcpResourcesTool();
  init_MCPTool();
  init_McpAuthTool();
  init_ReadMcpResourceTool();
  init_abortController();
  init_auth14();
  init_cleanupRegistry();
  init_codeIndexing();
  init_debug();
  init_envUtils();
  init_errors();
  init_http6();
  init_ide();
  init_imageResizer();
  init_log3();
  init_mcpOutputStorage();
  init_mcpValidation();
  init_mcpWebSocketTransport();
  init_memoize2();
  init_mtls();
  init_proxy();
  init_sessionIngressAuth();
  init_subprocessEnv();
  init_toolResultStorage();
  init_elicitationHandler();
  init_mcpStringUtils();
  init_utils7();
  init_auth16();
  init_classifyForCollapse();
  init_macOsKeychainHelpers();
  init_auth17();
  init_claudeai();
  init_config8();
  init_headersHelper();
  init_common3();
  init_envUtils();
  init_slowOperations();
  McpAuthError = class McpAuthError extends Error {
    serverName;
    constructor(serverName, message) {
      super(message);
      this.name = "McpAuthError", this.serverName = serverName;
    }
  };
  McpSessionExpiredError = class McpSessionExpiredError extends Error {
    constructor(serverName) {
      super(`MCP server "${serverName}" session expired`);
      this.name = "McpSessionExpiredError";
    }
  };
  McpToolCallError_I_VERIFIED_THIS_IS_NOT_CODE_OR_FILEPATHS = class McpToolCallError_I_VERIFIED_THIS_IS_NOT_CODE_OR_FILEPATHS extends TelemetrySafeError_I_VERIFIED_THIS_IS_NOT_CODE_OR_FILEPATHS {
    mcpMeta;
    constructor(message, telemetryMessage, mcpMeta) {
      super(message, telemetryMessage);
      this.mcpMeta = mcpMeta;
      this.name = "McpToolCallError";
    }
  };
  writeChain = Promise.resolve();
  IMAGE_MIME_TYPES = /* @__PURE__ */ new Set([
    "image/jpeg",
    "image/png",
    "image/gif",
    "image/webp"
  ]);
  ALLOWED_IDE_TOOLS = ["mcp__ide__executeCode", "mcp__ide__getDiagnostics"];
  connectToServer = memoize_default(async (name3, serverRef, serverStats) => {
    let connectStartTime = Date.now(), inProcessServer;
    try {
      let transport, sessionIngressToken = getSessionIngressAuthToken();
      if (serverRef.type === "sse") {
        let authProvider = new ClaudeAuthProvider(name3, serverRef), combinedHeaders = await getMcpServerHeaders(name3, serverRef), transportOptions = {
          authProvider,
          fetch: wrapFetchWithTimeout(wrapFetchWithStepUpDetection(createFetchWithInit(), authProvider)),
          requestInit: {
            headers: {
              "User-Agent": getMCPUserAgent(),
              ...combinedHeaders
            }
          }
        };
        transportOptions.eventSourceInit = {
          fetch: async (url3, init2) => {
            let authHeaders = {}, tokens = await authProvider.tokens();
            if (tokens)
              authHeaders.Authorization = `Bearer ${tokens.access_token}`;
            let proxyOptions = getProxyFetchOptions();
            return fetch(url3, {
              ...init2,
              ...proxyOptions,
              headers: {
                "User-Agent": getMCPUserAgent(),
                ...authHeaders,
                ...init2?.headers,
                ...combinedHeaders,
                Accept: "text/event-stream"
              }
            });
          }
        }, transport = new SSEClientTransport(new URL(serverRef.url), transportOptions), logMCPDebug(name3, "SSE transport initialized, awaiting connection");
      } else if (serverRef.type === "sse-ide") {
        logMCPDebug(name3, `Setting up SSE-IDE transport to ${serverRef.url}`);
        let proxyOptions = getProxyFetchOptions(), transportOptions = proxyOptions.dispatcher ? {
          eventSourceInit: {
            fetch: async (url3, init2) => {
              return fetch(url3, {
                ...init2,
                ...proxyOptions,
                headers: {
                  "User-Agent": getMCPUserAgent(),
                  ...init2?.headers
                }
              });
            }
          }
        } : {};
        transport = new SSEClientTransport(new URL(serverRef.url), Object.keys(transportOptions).length > 0 ? transportOptions : void 0);
      } else if (serverRef.type === "ws-ide") {
        let tlsOptions = getWebSocketTLSOptions(), wsHeaders = {
          "User-Agent": getMCPUserAgent(),
          ...serverRef.authToken && {
            "X-Claude-Code-Ide-Authorization": serverRef.authToken
          }
        }, wsClient;
        if (typeof Bun < "u")
          wsClient = new globalThis.WebSocket(serverRef.url, {
            protocols: ["mcp"],
            headers: wsHeaders,
            proxy: getWebSocketProxyUrl(serverRef.url),
            tls: tlsOptions || void 0
          });
        else
          wsClient = await createNodeWsClient(serverRef.url, {
            headers: wsHeaders,
            agent: getWebSocketProxyAgent(serverRef.url),
            ...tlsOptions || {}
          });
        transport = new WebSocketTransport(wsClient);
      } else if (serverRef.type === "ws") {
        logMCPDebug(name3, `Initializing WebSocket transport to ${serverRef.url}`);
        let combinedHeaders = await getMcpServerHeaders(name3, serverRef), tlsOptions = getWebSocketTLSOptions(), wsHeaders = {
          "User-Agent": getMCPUserAgent(),
          ...sessionIngressToken && {
            Authorization: `Bearer ${sessionIngressToken}`
          },
          ...combinedHeaders
        }, wsHeadersForLogging = mapValues_default(wsHeaders, (value, key2) => key2.toLowerCase() === "authorization" ? "[REDACTED]" : value);
        logMCPDebug(name3, `WebSocket transport options: ${jsonStringify({
          url: serverRef.url,
          headers: wsHeadersForLogging,
          hasSessionAuth: !!sessionIngressToken
        })}`);
        let wsClient;
        if (typeof Bun < "u")
          wsClient = new globalThis.WebSocket(serverRef.url, {
            protocols: ["mcp"],
            headers: wsHeaders,
            proxy: getWebSocketProxyUrl(serverRef.url),
            tls: tlsOptions || void 0
          });
        else
          wsClient = await createNodeWsClient(serverRef.url, {
            headers: wsHeaders,
            agent: getWebSocketProxyAgent(serverRef.url),
            ...tlsOptions || {}
          });
        transport = new WebSocketTransport(wsClient);
      } else if (serverRef.type === "http") {
        logMCPDebug(name3, `Initializing HTTP transport to ${serverRef.url}`), logMCPDebug(name3, `Node version: ${process.version}, Platform: ${process.platform}`), logMCPDebug(name3, `Environment: ${jsonStringify({
          NODE_OPTIONS: process.env.NODE_OPTIONS || "not set",
          UV_THREADPOOL_SIZE: process.env.UV_THREADPOOL_SIZE || "default",
          HTTP_PROXY: process.env.HTTP_PROXY || "not set",
          HTTPS_PROXY: process.env.HTTPS_PROXY || "not set",
          NO_PROXY: process.env.NO_PROXY || "not set"
        })}`);
        let authProvider = new ClaudeAuthProvider(name3, serverRef), combinedHeaders = await getMcpServerHeaders(name3, serverRef), hasOAuthTokens = !!await authProvider.tokens(), proxyOptions = getProxyFetchOptions();
        logMCPDebug(name3, `Proxy options: ${proxyOptions.dispatcher ? "custom dispatcher" : "default"}`);
        let transportOptions = {
          authProvider,
          fetch: wrapFetchWithTimeout(wrapFetchWithStepUpDetection(createFetchWithInit(), authProvider)),
          requestInit: {
            ...proxyOptions,
            headers: {
              "User-Agent": getMCPUserAgent(),
              ...sessionIngressToken && !hasOAuthTokens && {
                Authorization: `Bearer ${sessionIngressToken}`
              },
              ...combinedHeaders
            }
          }
        }, headersForLogging = transportOptions.requestInit?.headers ? mapValues_default(transportOptions.requestInit.headers, (value, key2) => key2.toLowerCase() === "authorization" ? "[REDACTED]" : value) : void 0;
        logMCPDebug(name3, `HTTP transport options: ${jsonStringify({
          url: serverRef.url,
          headers: headersForLogging,
          hasAuthProvider: !!authProvider,
          timeoutMs: MCP_REQUEST_TIMEOUT_MS
        })}`), transport = new StreamableHTTPClientTransport(new URL(serverRef.url), transportOptions), logMCPDebug(name3, "HTTP transport created successfully");
      } else if (serverRef.type === "sdk")
        throw Error("SDK servers should be handled in print.ts");
      else if (serverRef.type === "claudeai-proxy") {
        if (logMCPDebug(name3, `Initializing claude.ai proxy transport for server ${serverRef.id}`), !getClaudeAIOAuthTokens())
          throw Error("No claude.ai OAuth token found");
        let oauthConfig = getOauthConfig(), proxyUrl = `${oauthConfig.MCP_PROXY_URL}${oauthConfig.MCP_PROXY_PATH.replace("{server_id}", serverRef.id)}`;
        logMCPDebug(name3, `Using claude.ai proxy at ${proxyUrl}`);
        let fetchWithAuth = createClaudeAiProxyFetch(globalThis.fetch), proxyOptions = getProxyFetchOptions(), transportOptions = {
          fetch: wrapFetchWithTimeout(fetchWithAuth),
          requestInit: {
            ...proxyOptions,
            headers: {
              "User-Agent": getMCPUserAgent(),
              "X-Mcp-Client-Session-Id": getSessionId()
            }
          }
        };
        transport = new StreamableHTTPClientTransport(new URL(proxyUrl), transportOptions), logMCPDebug(name3, "claude.ai proxy transport created successfully");
      } else if ((serverRef.type === "stdio" || !serverRef.type) && isClaudeInChromeMCPServer(name3)) {
        let { createChromeContext } = await Promise.resolve().then(() => (init_mcpServer(), exports_mcpServer)), { createClaudeForChromeMcpServer: createClaudeForChromeMcpServer2 } = await Promise.resolve().then(() => (init_claude_for_chrome_mcp(), exports_claude_for_chrome_mcp)), { createLinkedTransportPair: createLinkedTransportPair2 } = await Promise.resolve().then(() => exports_InProcessTransport), context3 = createChromeContext(serverRef.env);
        inProcessServer = createClaudeForChromeMcpServer2(context3);
        let [clientTransport, serverTransport] = createLinkedTransportPair2();
        await inProcessServer.connect(serverTransport), transport = clientTransport, logMCPDebug(name3, "In-process Chrome MCP server started");
      } else if (serverRef.type === "stdio" || !serverRef.type) {
        let finalCommand = process.env.CLAUDE_CODE_SHELL_PREFIX || serverRef.command, finalArgs = process.env.CLAUDE_CODE_SHELL_PREFIX ? [[serverRef.command, ...serverRef.args].join(" ")] : serverRef.args;
        transport = new StdioClientTransport({
          command: finalCommand,
          args: finalArgs,
          env: {
            ...subprocessEnv(),
            ...serverRef.env
          },
          stderr: "pipe"
        });
      } else
        throw Error(`Unsupported server type: ${serverRef.type}`);
      let stderrHandler, stderrOutput = "";
      if (serverRef.type === "stdio" || !serverRef.type) {
        let stdioTransport = transport;
        if (stdioTransport.stderr)
          stderrHandler = (data) => {
            if (stderrOutput.length < 67108864)
              try {
                stderrOutput += data.toString();
              } catch {}
          }, stdioTransport.stderr.on("data", stderrHandler);
      }
      let client15 = new Client5({
        name: "claude-code",
        title: "Claude Code",
        version: "2.1.90",
        description: "Anthropic's agentic coding tool",
        websiteUrl: PRODUCT_URL
      }, {
        capabilities: {
          roots: {},
          elicitation: {}
        }
      });
      if (serverRef.type === "http")
        logMCPDebug(name3, "Client created, setting up request handler");
      if (client15.setRequestHandler(ListRootsRequestSchema, async () => {
        return logMCPDebug(name3, "Received ListRoots request from server"), {
          roots: [
            {
              uri: `file://${getOriginalCwd()}`
            }
          ]
        };
      }), logMCPDebug(name3, `Starting connection with timeout of ${getConnectionTimeoutMs()}ms`), serverRef.type === "http") {
        logMCPDebug(name3, `Testing basic HTTP connectivity to ${serverRef.url}`);
        try {
          let testUrl = new URL(serverRef.url);
          if (logMCPDebug(name3, `Parsed URL: host=${testUrl.hostname}, port=${testUrl.port || "default"}, protocol=${testUrl.protocol}`), testUrl.hostname === "127.0.0.1" || testUrl.hostname === "localhost")
            logMCPDebug(name3, `Using loopback address: ${testUrl.hostname}`);
        } catch (urlError) {
          logMCPDebug(name3, `Failed to parse URL: ${urlError}`);
        }
      }
      let connectPromise = client15.connect(transport), timeoutPromise = new Promise((_, reject2) => {
        let timeoutId = setTimeout(() => {
          let elapsed = Date.now() - connectStartTime;
          if (logMCPDebug(name3, `Connection timeout triggered after ${elapsed}ms (limit: ${getConnectionTimeoutMs()}ms)`), inProcessServer)
            inProcessServer.close().catch(() => {});
          transport.close().catch(() => {}), reject2(new TelemetrySafeError_I_VERIFIED_THIS_IS_NOT_CODE_OR_FILEPATHS(`MCP server "${name3}" connection timed out after ${getConnectionTimeoutMs()}ms`, "MCP connection timeout"));
        }, getConnectionTimeoutMs());
        connectPromise.then(() => {
          clearTimeout(timeoutId);
        }, (_error) => {
          clearTimeout(timeoutId);
        });
      });
      try {
        if (await Promise.race([connectPromise, timeoutPromise]), stderrOutput)
          logMCPError(name3, `Server stderr: ${stderrOutput}`), stderrOutput = "";
        let elapsed = Date.now() - connectStartTime;
        logMCPDebug(name3, `Successfully connected (transport: ${serverRef.type || "stdio"}) in ${elapsed}ms`);
      } catch (error44) {
        let elapsed = Date.now() - connectStartTime;
        if (serverRef.type === "sse" && error44 instanceof Error) {
          if (logMCPDebug(name3, `SSE Connection failed after ${elapsed}ms: ${jsonStringify({
            url: serverRef.url,
            error: error44.message,
            errorType: error44.constructor.name,
            stack: error44.stack
          })}`), logMCPError(name3, error44), error44 instanceof UnauthorizedError)
            return handleRemoteAuthFailure(name3, serverRef, "sse");
        } else if (serverRef.type === "http" && error44 instanceof Error) {
          let errorObj = error44;
          if (logMCPDebug(name3, `HTTP Connection failed after ${elapsed}ms: ${error44.message} (code: ${errorObj.code || "none"}, errno: ${errorObj.errno || "none"})`), logMCPError(name3, error44), error44 instanceof UnauthorizedError)
            return handleRemoteAuthFailure(name3, serverRef, "http");
        } else if (serverRef.type === "claudeai-proxy" && error44 instanceof Error) {
          if (logMCPDebug(name3, `claude.ai proxy connection failed after ${elapsed}ms: ${error44.message}`), logMCPError(name3, error44), error44.code === 401)
            return handleRemoteAuthFailure(name3, serverRef, "claudeai-proxy");
        } else if (serverRef.type === "sse-ide" || serverRef.type === "ws-ide")
          logEvent("tengu_mcp_ide_server_connection_failed", {
            connectionDurationMs: elapsed
          });
        if (inProcessServer)
          inProcessServer.close().catch(() => {});
        if (transport.close().catch(() => {}), stderrOutput)
          logMCPError(name3, `Server stderr: ${stderrOutput}`);
        throw error44;
      }
      let capabilities = client15.getServerCapabilities(), serverVersion = client15.getServerVersion(), rawInstructions = client15.getInstructions(), instructions = rawInstructions;
      if (rawInstructions && rawInstructions.length > MAX_MCP_DESCRIPTION_LENGTH)
        instructions = rawInstructions.slice(0, MAX_MCP_DESCRIPTION_LENGTH) + "\u2026 [truncated]", logMCPDebug(name3, `Server instructions truncated from ${rawInstructions.length} to ${MAX_MCP_DESCRIPTION_LENGTH} chars`);
      if (logMCPDebug(name3, `Connection established with capabilities: ${jsonStringify({
        hasTools: !!capabilities?.tools,
        hasPrompts: !!capabilities?.prompts,
        hasResources: !!capabilities?.resources,
        hasResourceSubscribe: !!capabilities?.resources?.subscribe,
        serverVersion: serverVersion || "unknown"
      })}`), logForDebugging(`[MCP] Server "${name3}" connected with subscribe=${!!capabilities?.resources?.subscribe}`), client15.setRequestHandler(ElicitRequestSchema, async (request2) => {
        return logMCPDebug(name3, `Elicitation request received during initialization: ${jsonStringify(request2)}`), { action: "cancel" };
      }), serverRef.type === "sse-ide" || serverRef.type === "ws-ide") {
        let ideConnectionDurationMs = Date.now() - connectStartTime;
        logEvent("tengu_mcp_ide_server_connection_succeeded", {
          connectionDurationMs: ideConnectionDurationMs,
          serverVersion
        });
        try {
          maybeNotifyIDEConnected(client15);
        } catch (error44) {
          logMCPError(name3, `Failed to send ide_connected notification: ${error44}`);
        }
      }
      let connectionStartTime = Date.now(), hasErrorOccurred = !1, originalOnerror = client15.onerror, originalOnclose = client15.onclose, consecutiveConnectionErrors = 0, MAX_ERRORS_BEFORE_RECONNECT = 3, hasTriggeredClose = !1, closeTransportAndRejectPending = (reason) => {
        if (hasTriggeredClose)
          return;
        hasTriggeredClose = !0, logMCPDebug(name3, `Closing transport (${reason})`), client15.close().catch((e) => {
          logMCPDebug(name3, `Error during close: ${errorMessage(e)}`);
        });
      }, isTerminalConnectionError = (msg) => {
        return msg.includes("ECONNRESET") || msg.includes("ETIMEDOUT") || msg.includes("EPIPE") || msg.includes("EHOSTUNREACH") || msg.includes("ECONNREFUSED") || msg.includes("Body Timeout Error") || msg.includes("terminated") || msg.includes("SSE stream disconnected") || msg.includes("Failed to reconnect SSE stream");
      };
      client15.onerror = (error44) => {
        let uptime = Date.now() - connectionStartTime;
        hasErrorOccurred = !0;
        let transportType = serverRef.type || "stdio";
        if (logMCPDebug(name3, `${transportType.toUpperCase()} connection dropped after ${Math.floor(uptime / 1000)}s uptime`), error44.message)
          if (error44.message.includes("ECONNRESET"))
            logMCPDebug(name3, "Connection reset - server may have crashed or restarted");
          else if (error44.message.includes("ETIMEDOUT"))
            logMCPDebug(name3, "Connection timeout - network issue or server unresponsive");
          else if (error44.message.includes("ECONNREFUSED"))
            logMCPDebug(name3, "Connection refused - server may be down");
          else if (error44.message.includes("EPIPE"))
            logMCPDebug(name3, "Broken pipe - server closed connection unexpectedly");
          else if (error44.message.includes("EHOSTUNREACH"))
            logMCPDebug(name3, "Host unreachable - network connectivity issue");
          else if (error44.message.includes("ESRCH"))
            logMCPDebug(name3, "Process not found - stdio server process terminated");
          else if (error44.message.includes("spawn"))
            logMCPDebug(name3, "Failed to spawn process - check command and permissions");
          else
            logMCPDebug(name3, `Connection error: ${error44.message}`);
        if ((transportType === "http" || transportType === "claudeai-proxy") && isMcpSessionExpiredError(error44)) {
          if (logMCPDebug(name3, "MCP session expired (server returned 404 with session-not-found), triggering reconnection"), closeTransportAndRejectPending("session expired"), originalOnerror)
            originalOnerror(error44);
          return;
        }
        if (transportType === "sse" || transportType === "http" || transportType === "claudeai-proxy") {
          if (error44.message.includes("Maximum reconnection attempts")) {
            if (closeTransportAndRejectPending("SSE reconnection exhausted"), originalOnerror)
              originalOnerror(error44);
            return;
          }
          if (isTerminalConnectionError(error44.message)) {
            if (consecutiveConnectionErrors++, logMCPDebug(name3, `Terminal connection error ${consecutiveConnectionErrors}/${MAX_ERRORS_BEFORE_RECONNECT}`), consecutiveConnectionErrors >= MAX_ERRORS_BEFORE_RECONNECT)
              consecutiveConnectionErrors = 0, closeTransportAndRejectPending("max consecutive terminal errors");
          } else
            consecutiveConnectionErrors = 0;
        }
        if (originalOnerror)
          originalOnerror(error44);
      }, client15.onclose = () => {
        let uptime = Date.now() - connectionStartTime, transportType = serverRef.type ?? "unknown";
        logMCPDebug(name3, `${transportType.toUpperCase()} connection closed after ${Math.floor(uptime / 1000)}s (${hasErrorOccurred ? "with errors" : "cleanly"})`);
        let key2 = getServerCacheKey(name3, serverRef);
        if (fetchToolsForClient.cache.delete(name3), fetchResourcesForClient.cache.delete(name3), fetchCommandsForClient.cache.delete(name3), connectToServer.cache.delete(key2), logMCPDebug(name3, "Cleared connection cache for reconnection"), originalOnclose)
          originalOnclose();
      };
      let cleanup = async () => {
        if (inProcessServer) {
          try {
            await inProcessServer.close();
          } catch (error44) {
            logMCPDebug(name3, `Error closing in-process server: ${error44}`);
          }
          try {
            await client15.close();
          } catch (error44) {
            logMCPDebug(name3, `Error closing client: ${error44}`);
          }
          return;
        }
        if (stderrHandler && (serverRef.type === "stdio" || !serverRef.type))
          transport.stderr?.off("data", stderrHandler);
        if (serverRef.type === "stdio")
          try {
            let childPid = transport.pid;
            if (childPid) {
              logMCPDebug(name3, "Sending SIGINT to MCP server process");
              try {
                process.kill(childPid, "SIGINT");
              } catch (error44) {
                logMCPDebug(name3, `Error sending SIGINT: ${error44}`);
                return;
              }
              await new Promise(async (resolve25) => {
                let resolved = !1, checkInterval = setInterval(() => {
                  try {
                    process.kill(childPid, 0);
                  } catch {
                    if (!resolved)
                      resolved = !0, clearInterval(checkInterval), clearTimeout(failsafeTimeout), logMCPDebug(name3, "MCP server process exited cleanly"), resolve25();
                  }
                }, 50), failsafeTimeout = setTimeout(() => {
                  if (!resolved)
                    resolved = !0, clearInterval(checkInterval), logMCPDebug(name3, "Cleanup timeout reached, stopping process monitoring"), resolve25();
                }, 600);
                try {
                  if (await sleep3(100), !resolved) {
                    try {
                      process.kill(childPid, 0), logMCPDebug(name3, "SIGINT failed, sending SIGTERM to MCP server process");
                      try {
                        process.kill(childPid, "SIGTERM");
                      } catch (termError) {
                        logMCPDebug(name3, `Error sending SIGTERM: ${termError}`), resolved = !0, clearInterval(checkInterval), clearTimeout(failsafeTimeout), resolve25();
                        return;
                      }
                    } catch {
                      resolved = !0, clearInterval(checkInterval), clearTimeout(failsafeTimeout), resolve25();
                      return;
                    }
                    if (await sleep3(400), !resolved)
                      try {
                        process.kill(childPid, 0), logMCPDebug(name3, "SIGTERM failed, sending SIGKILL to MCP server process");
                        try {
                          process.kill(childPid, "SIGKILL");
                        } catch (killError) {
                          logMCPDebug(name3, `Error sending SIGKILL: ${killError}`);
                        }
                      } catch {
                        resolved = !0, clearInterval(checkInterval), clearTimeout(failsafeTimeout), resolve25();
                      }
                  }
                  if (!resolved)
                    resolved = !0, clearInterval(checkInterval), clearTimeout(failsafeTimeout), resolve25();
                } catch {
                  if (!resolved)
                    resolved = !0, clearInterval(checkInterval), clearTimeout(failsafeTimeout), resolve25();
                }
              });
            }
          } catch (processError) {
            logMCPDebug(name3, `Error terminating process: ${processError}`);
          }
        try {
          await client15.close();
        } catch (error44) {
          logMCPDebug(name3, `Error closing client: ${error44}`);
        }
      }, cleanupUnregister = registerCleanup(cleanup), wrappedCleanup = async () => {
        cleanupUnregister?.(), await cleanup();
      }, connectionDurationMs = Date.now() - connectStartTime;
      return logEvent("tengu_mcp_server_connection_succeeded", {
        connectionDurationMs,
        transportType: serverRef.type ?? "stdio",
        totalServers: serverStats?.totalServers,
        stdioCount: serverStats?.stdioCount,
        sseCount: serverStats?.sseCount,
        httpCount: serverStats?.httpCount,
        sseIdeCount: serverStats?.sseIdeCount,
        wsIdeCount: serverStats?.wsIdeCount,
        ...mcpBaseUrlAnalytics(serverRef)
      }), {
        name: name3,
        client: client15,
        type: "connected",
        capabilities: capabilities ?? {},
        serverInfo: serverVersion,
        instructions,
        config: serverRef,
        cleanup: wrappedCleanup
      };
    } catch (error44) {
      let connectionDurationMs = Date.now() - connectStartTime;
      if (logEvent("tengu_mcp_server_connection_failed", {
        connectionDurationMs,
        totalServers: serverStats?.totalServers || 1,
        stdioCount: serverStats?.stdioCount || (serverRef.type === "stdio" ? 1 : 0),
        sseCount: serverStats?.sseCount || (serverRef.type === "sse" ? 1 : 0),
        httpCount: serverStats?.httpCount || (serverRef.type === "http" ? 1 : 0),
        sseIdeCount: serverStats?.sseIdeCount || (serverRef.type === "sse-ide" ? 1 : 0),
        wsIdeCount: serverStats?.wsIdeCount || (serverRef.type === "ws-ide" ? 1 : 0),
        transportType: serverRef.type ?? "stdio",
        ...mcpBaseUrlAnalytics(serverRef)
      }), logMCPDebug(name3, `Connection failed after ${connectionDurationMs}ms: ${errorMessage(error44)}`), logMCPError(name3, `Connection failed: ${errorMessage(error44)}`), inProcessServer)
        inProcessServer.close().catch(() => {});
      return {
        name: name3,
        type: "failed",
        config: serverRef,
        error: errorMessage(error44)
      };
    }
  }, getServerCacheKey);
  fetchToolsForClient = memoizeWithLRU(async (client15) => {
    if (client15.type !== "connected")
      return [];
    try {
      if (!client15.capabilities?.tools)
        return [];
      let result = await client15.client.request({ method: "tools/list" }, ListToolsResultSchema), toolsToProcess = recursivelySanitizeUnicode(result.tools), skipPrefix = client15.config.type === "sdk" && isEnvTruthy(process.env.CLAUDE_AGENT_SDK_MCP_NO_PREFIX);
      return toolsToProcess.map((tool) => {
        let fullyQualifiedName = buildMcpToolName(client15.name, tool.name);
        return {
          ...MCPTool,
          name: skipPrefix ? tool.name : fullyQualifiedName,
          mcpInfo: { serverName: client15.name, toolName: tool.name },
          isMcp: !0,
          searchHint: typeof tool._meta?.["anthropic/searchHint"] === "string" ? tool._meta["anthropic/searchHint"].replace(/\s+/g, " ").trim() || void 0 : void 0,
          alwaysLoad: tool._meta?.["anthropic/alwaysLoad"] === !0,
          async description() {
            return tool.description ?? "";
          },
          async prompt() {
            let desc = tool.description ?? "";
            return desc.length > MAX_MCP_DESCRIPTION_LENGTH ? desc.slice(0, MAX_MCP_DESCRIPTION_LENGTH) + "\u2026 [truncated]" : desc;
          },
          isConcurrencySafe() {
            return tool.annotations?.readOnlyHint ?? !1;
          },
          isReadOnly() {
            return tool.annotations?.readOnlyHint ?? !1;
          },
          toAutoClassifierInput(input) {
            return mcpToolInputToAutoClassifierInput(input, tool.name);
          },
          isDestructive() {
            return tool.annotations?.destructiveHint ?? !1;
          },
          isOpenWorld() {
            return tool.annotations?.openWorldHint ?? !1;
          },
          isSearchOrReadCommand() {
            return classifyMcpToolForCollapse(client15.name, tool.name);
          },
          inputJSONSchema: tool.inputSchema,
          async checkPermissions() {
            return {
              behavior: "passthrough",
              message: "MCPTool requires permission.",
              suggestions: [
                {
                  type: "addRules",
                  rules: [
                    {
                      toolName: fullyQualifiedName,
                      ruleContent: void 0
                    }
                  ],
                  behavior: "allow",
                  destination: "localSettings"
                }
              ]
            };
          },
          async call(args, context3, _canUseTool, parentMessage, onProgress) {
            let toolUseId = extractToolUseId(parentMessage), meta = toolUseId ? { "claudecode/toolUseId": toolUseId } : {};
            if (onProgress && toolUseId)
              onProgress({
                toolUseID: toolUseId,
                data: {
                  type: "mcp_progress",
                  status: "started",
                  serverName: client15.name,
                  toolName: tool.name
                }
              });
            let startTime = Date.now(), MAX_SESSION_RETRIES = 1;
            for (let attempt = 0;; attempt++)
              try {
                let connectedClient = await ensureConnectedClient(client15), mcpResult = await callMCPToolWithUrlElicitationRetry({
                  client: connectedClient,
                  clientConnection: client15,
                  tool: tool.name,
                  args,
                  meta,
                  signal: context3.abortController.signal,
                  setAppState: context3.setAppState,
                  onProgress: onProgress && toolUseId ? (progressData) => {
                    onProgress({
                      toolUseID: toolUseId,
                      data: progressData
                    });
                  } : void 0,
                  handleElicitation: context3.handleElicitation
                });
                if (onProgress && toolUseId)
                  onProgress({
                    toolUseID: toolUseId,
                    data: {
                      type: "mcp_progress",
                      status: "completed",
                      serverName: client15.name,
                      toolName: tool.name,
                      elapsedTimeMs: Date.now() - startTime
                    }
                  });
                return {
                  data: mcpResult.content,
                  ...(mcpResult._meta || mcpResult.structuredContent) && {
                    mcpMeta: {
                      ...mcpResult._meta && {
                        _meta: mcpResult._meta
                      },
                      ...mcpResult.structuredContent && {
                        structuredContent: mcpResult.structuredContent
                      }
                    }
                  }
                };
              } catch (error44) {
                if (error44 instanceof McpSessionExpiredError && attempt < MAX_SESSION_RETRIES) {
                  logMCPDebug(client15.name, `Retrying tool '${tool.name}' after session recovery`);
                  continue;
                }
                if (onProgress && toolUseId)
                  onProgress({
                    toolUseID: toolUseId,
                    data: {
                      type: "mcp_progress",
                      status: "failed",
                      serverName: client15.name,
                      toolName: tool.name,
                      elapsedTimeMs: Date.now() - startTime
                    }
                  });
                if (error44 instanceof Error && !(error44 instanceof TelemetrySafeError_I_VERIFIED_THIS_IS_NOT_CODE_OR_FILEPATHS)) {
                  let name3 = error44.constructor.name;
                  if (name3 === "Error")
                    throw new TelemetrySafeError_I_VERIFIED_THIS_IS_NOT_CODE_OR_FILEPATHS(error44.message, error44.message.slice(0, 200));
                  if (name3 === "McpError" && "code" in error44 && typeof error44.code === "number")
                    throw new TelemetrySafeError_I_VERIFIED_THIS_IS_NOT_CODE_OR_FILEPATHS(error44.message, `McpError ${error44.code}`);
                }
                throw error44;
              }
          },
          userFacingName() {
            let displayName = tool.annotations?.title || tool.name;
            return `${client15.name} - ${displayName} (MCP)`;
          },
          ...isClaudeInChromeMCPServer(client15.name) && (client15.config.type === "stdio" || !client15.config.type) ? claudeInChromeToolRendering().getClaudeInChromeMCPToolOverrides(tool.name) : {}
        };
      }).filter(isIncludedMcpTool);
    } catch (error44) {
      return logMCPError(client15.name, `Failed to fetch tools: ${errorMessage(error44)}`), [];
    }
  }, (client15) => client15.name, MCP_FETCH_CACHE_SIZE), fetchResourcesForClient = memoizeWithLRU(async (client15) => {
    if (client15.type !== "connected")
      return [];
    try {
      if (!client15.capabilities?.resources)
        return [];
      let result = await client15.client.request({ method: "resources/list" }, ListResourcesResultSchema);
      if (!result.resources)
        return [];
      return result.resources.map((resource) => ({
        ...resource,
        server: client15.name
      }));
    } catch (error44) {
      return logMCPError(client15.name, `Failed to fetch resources: ${errorMessage(error44)}`), [];
    }
  }, (client15) => client15.name, MCP_FETCH_CACHE_SIZE), fetchCommandsForClient = memoizeWithLRU(async (client15) => {
    if (client15.type !== "connected")
      return [];
    try {
      if (!client15.capabilities?.prompts)
        return [];
      let result = await client15.client.request({ method: "prompts/list" }, ListPromptsResultSchema);
      if (!result.prompts)
        return [];
      return recursivelySanitizeUnicode(result.prompts).map((prompt) => {
        let argNames = Object.values(prompt.arguments ?? {}).map((k3) => k3.name);
        return {
          type: "prompt",
          name: "mcp__" + normalizeNameForMCP(client15.name) + "__" + prompt.name,
          description: prompt.description ?? "",
          hasUserSpecifiedDescription: !!prompt.description,
          contentLength: 0,
          isEnabled: () => !0,
          isHidden: !1,
          isMcp: !0,
          progressMessage: "running",
          userFacingName() {
            return `${client15.name}:${prompt.name} (MCP)`;
          },
          argNames,
          source: "mcp",
          async getPromptForCommand(args) {
            let argsArray = args.split(" ");
            try {
              let connectedClient = await ensureConnectedClient(client15), result2 = await connectedClient.client.getPrompt({
                name: prompt.name,
                arguments: zipObject_default(argNames, argsArray)
              });
              return (await Promise.all(result2.messages.map((message) => transformResultContent(message.content, connectedClient.name)))).flat();
            } catch (error44) {
              throw logMCPError(client15.name, `Error running command '${prompt.name}': ${errorMessage(error44)}`), error44;
            }
          }
        };
      });
    } catch (error44) {
      return logMCPError(client15.name, `Failed to fetch commands: ${errorMessage(error44)}`), [];
    }
  }, (client15) => client15.name, MCP_FETCH_CACHE_SIZE);
});
