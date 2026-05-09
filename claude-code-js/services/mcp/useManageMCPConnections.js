// Original: src/services/mcp/useManageMCPConnections.ts
function getErrorKey(error44) {
  let plugin = "plugin" in error44 ? error44.plugin : "no-plugin";
  return `${error44.type}:${error44.source}:${plugin}`;
}
function addErrorsToAppState(setAppState, newErrors) {
  if (newErrors.length === 0)
    return;
  setAppState((prevState) => {
    let existingKeys = new Set(prevState.plugins.errors.map((e) => getErrorKey(e))), uniqueNewErrors = newErrors.filter((error44) => !existingKeys.has(getErrorKey(error44)));
    if (uniqueNewErrors.length === 0)
      return prevState;
    return {
      ...prevState,
      plugins: {
        ...prevState.plugins,
        errors: [...prevState.plugins.errors, ...uniqueNewErrors]
      }
    };
  });
}
function useManageMCPConnections(dynamicMcpConfig, isStrictMcpConfig = !1) {
  let store = useAppStateStore(), _authVersion = useAppState((s2) => s2.authVersion), _pluginReconnectKey = useAppState((s2) => s2.mcp.pluginReconnectKey), setAppState = useSetAppState(), reconnectTimersRef = import_react124.useRef(/* @__PURE__ */ new Map), channelWarnedKindsRef = import_react124.useRef(/* @__PURE__ */ new Set), channelPermCallbacksRef = import_react124.useRef(null);
  if (channelPermCallbacksRef.current === null)
    channelPermCallbacksRef.current = createChannelPermissionCallbacks();
  import_react124.useEffect(() => {
    {
      let callbacks = channelPermCallbacksRef.current;
      if (!callbacks)
        return;
      if (!isChannelPermissionRelayEnabled())
        return;
      return setAppState((prev) => {
        if (prev.channelPermissionCallbacks === callbacks)
          return prev;
        return { ...prev, channelPermissionCallbacks: callbacks };
      }), () => {
        setAppState((prev) => {
          if (prev.channelPermissionCallbacks === void 0)
            return prev;
          return { ...prev, channelPermissionCallbacks: void 0 };
        });
      };
    }
  }, [setAppState]);
  let { addNotification } = useNotifications(), MCP_BATCH_FLUSH_MS = 16, pendingUpdatesRef = import_react124.useRef([]), flushTimerRef = import_react124.useRef(null), flushPendingUpdates = import_react124.useCallback(() => {
    flushTimerRef.current = null;
    let updates = pendingUpdatesRef.current;
    if (updates.length === 0)
      return;
    pendingUpdatesRef.current = [], setAppState((prevState) => {
      let mcp = prevState.mcp;
      for (let update2 of updates) {
        let {
          tools: rawTools,
          commands: rawCmds,
          resources: rawRes,
          ...client15
        } = update2, tools = client15.type === "disabled" || client15.type === "failed" ? rawTools ?? [] : rawTools, commands7 = client15.type === "disabled" || client15.type === "failed" ? rawCmds ?? [] : rawCmds, resources = client15.type === "disabled" || client15.type === "failed" ? rawRes ?? [] : rawRes, prefix = getMcpPrefix(client15.name), updatedClients = mcp.clients.findIndex((c3) => c3.name === client15.name) === -1 ? [...mcp.clients, client15] : mcp.clients.map((c3) => c3.name === client15.name ? client15 : c3), updatedTools = tools === void 0 ? mcp.tools : [...reject_default(mcp.tools, (t2) => t2.name?.startsWith(prefix)), ...tools], updatedCommands = commands7 === void 0 ? mcp.commands : [
          ...reject_default(mcp.commands, (c3) => commandBelongsToServer(c3, client15.name)),
          ...commands7
        ], updatedResources = resources === void 0 ? mcp.resources : {
          ...mcp.resources,
          ...resources.length > 0 ? { [client15.name]: resources } : omit_default(mcp.resources, client15.name)
        };
        mcp = {
          ...mcp,
          clients: updatedClients,
          tools: updatedTools,
          commands: updatedCommands,
          resources: updatedResources
        };
      }
      return { ...prevState, mcp };
    });
  }, [setAppState]), updateServer = import_react124.useCallback((update2) => {
    if (pendingUpdatesRef.current.push(update2), flushTimerRef.current === null)
      flushTimerRef.current = setTimeout(flushPendingUpdates, MCP_BATCH_FLUSH_MS);
  }, [flushPendingUpdates]), onConnectionAttempt = import_react124.useCallback(({
    client: client15,
    tools,
    commands: commands7,
    resources
  }) => {
    switch (updateServer({ ...client15, tools, commands: commands7, resources }), client15.type) {
      case "connected": {
        registerElicitationHandler(client15.client, client15.name, setAppState), client15.client.onclose = () => {
          let configType = client15.config.type ?? "stdio";
          if (clearServerCache(client15.name, client15.config).catch(() => {
            logForDebugging(`Failed to invalidate the server cache: ${client15.name}`);
          }), isMcpServerDisabled(client15.name)) {
            logMCPDebug(client15.name, "Server is disabled, skipping automatic reconnection");
            return;
          }
          if (configType !== "stdio" && configType !== "sdk") {
            let transportType = getTransportDisplayName(configType);
            logMCPDebug(client15.name, `${transportType} transport closed/disconnected, attempting automatic reconnection`);
            let existingTimer = reconnectTimersRef.current.get(client15.name);
            if (existingTimer)
              clearTimeout(existingTimer), reconnectTimersRef.current.delete(client15.name);
            (async () => {
              for (let attempt = 1;attempt <= MAX_RECONNECT_ATTEMPTS; attempt++) {
                if (isMcpServerDisabled(client15.name)) {
                  logMCPDebug(client15.name, "Server disabled during reconnection, stopping retry"), reconnectTimersRef.current.delete(client15.name);
                  return;
                }
                updateServer({
                  ...client15,
                  type: "pending",
                  reconnectAttempt: attempt,
                  maxReconnectAttempts: MAX_RECONNECT_ATTEMPTS
                });
                let reconnectStartTime = Date.now();
                try {
                  let result = await reconnectMcpServerImpl(client15.name, client15.config), elapsed = Date.now() - reconnectStartTime;
                  if (result.client.type === "connected") {
                    logMCPDebug(client15.name, `${transportType} reconnection successful after ${elapsed}ms (attempt ${attempt})`), reconnectTimersRef.current.delete(client15.name), onConnectionAttempt(result);
                    return;
                  }
                  if (logMCPDebug(client15.name, `${transportType} reconnection attempt ${attempt} completed with status: ${result.client.type}`), attempt === MAX_RECONNECT_ATTEMPTS) {
                    logMCPDebug(client15.name, `Max reconnection attempts (${MAX_RECONNECT_ATTEMPTS}) reached, giving up`), reconnectTimersRef.current.delete(client15.name), onConnectionAttempt(result);
                    return;
                  }
                } catch (error44) {
                  let elapsed = Date.now() - reconnectStartTime;
                  if (logMCPError(client15.name, `${transportType} reconnection attempt ${attempt} failed after ${elapsed}ms: ${error44}`), attempt === MAX_RECONNECT_ATTEMPTS) {
                    logMCPDebug(client15.name, `Max reconnection attempts (${MAX_RECONNECT_ATTEMPTS}) reached, giving up`), reconnectTimersRef.current.delete(client15.name), updateServer({ ...client15, type: "failed" });
                    return;
                  }
                }
                let backoffMs = Math.min(INITIAL_BACKOFF_MS * Math.pow(2, attempt - 1), MAX_BACKOFF_MS);
                logMCPDebug(client15.name, `Scheduling reconnection attempt ${attempt + 1} in ${backoffMs}ms`), await new Promise((resolve42) => {
                  let timer = setTimeout(resolve42, backoffMs);
                  reconnectTimersRef.current.set(client15.name, timer);
                });
              }
            })();
          } else
            updateServer({ ...client15, type: "failed" });
        };
        {
          let gate = gateChannelServer(client15.name, client15.capabilities, client15.config.pluginSource), entry = findChannelEntry(client15.name, getAllowedChannels()), pluginId = entry?.kind === "plugin" ? `${entry.name}@${entry.marketplace}` : void 0;
          if (gate.action === "register" || gate.kind !== "capability")
            logEvent("tengu_mcp_channel_gate", {
              registered: gate.action === "register",
              skip_kind: gate.action === "skip" ? gate.kind : void 0,
              entry_kind: entry?.kind,
              is_dev: entry?.dev ?? !1,
              plugin: pluginId
            });
          switch (gate.action) {
            case "register":
              if (logMCPDebug(client15.name, "Channel notifications registered"), client15.client.setNotificationHandler(ChannelMessageNotificationSchema(), async (notification) => {
                let { content, meta } = notification.params;
                logMCPDebug(client15.name, `notifications/claude/channel: ${content.slice(0, 80)}`), logEvent("tengu_mcp_channel_message", {
                  content_length: content.length,
                  meta_key_count: Object.keys(meta ?? {}).length,
                  entry_kind: entry?.kind,
                  is_dev: entry?.dev ?? !1,
                  plugin: pluginId
                }), enqueue({
                  mode: "prompt",
                  value: wrapChannelMessage(client15.name, content, meta),
                  priority: "next",
                  isMeta: !0,
                  origin: { kind: "channel", server: client15.name },
                  skipSlashCommands: !0
                });
              }), client15.capabilities?.experimental?.["claude/channel/permission"] !== void 0)
                client15.client.setNotificationHandler(ChannelPermissionNotificationSchema(), async (notification) => {
                  let { request_id, behavior } = notification.params, resolved = channelPermCallbacksRef.current?.resolve(request_id, behavior, client15.name) ?? !1;
                  logMCPDebug(client15.name, `notifications/claude/channel/permission: ${request_id} \u2192 ${behavior} (${resolved ? "matched pending" : "no pending entry \u2014 stale or unknown ID"})`);
                });
              break;
            case "skip":
              if (client15.client.removeNotificationHandler("notifications/claude/channel"), client15.client.removeNotificationHandler(CHANNEL_PERMISSION_METHOD), logMCPDebug(client15.name, `Channel notifications skipped: ${gate.reason}`), gate.kind !== "capability" && gate.kind !== "session" && !channelWarnedKindsRef.current.has(gate.kind) && (gate.kind === "marketplace" || gate.kind === "allowlist" || entry !== void 0)) {
                channelWarnedKindsRef.current.add(gate.kind);
                let text2 = gate.kind === "disabled" ? "Channels are not currently available" : gate.kind === "auth" ? "Channels require claude.ai authentication \xB7 run /login" : gate.kind === "policy" ? "Channels are not enabled for your org \xB7 have an administrator set channelsEnabled: true in managed settings" : gate.reason;
                addNotification({
                  key: `channels-blocked-${gate.kind}`,
                  priority: "high",
                  text: text2,
                  color: "warning",
                  timeoutMs: 12000
                });
              }
              break;
          }
        }
        if (client15.capabilities?.tools?.listChanged)
          client15.client.setNotificationHandler(ToolListChangedNotificationSchema, async () => {
            logMCPDebug(client15.name, "Received tools/list_changed notification, refreshing tools");
            try {
              let previousToolsPromise = fetchToolsForClient.cache.get(client15.name);
              fetchToolsForClient.cache.delete(client15.name);
              let newTools = await fetchToolsForClient(client15), newCount = newTools.length;
              if (previousToolsPromise)
                previousToolsPromise.then((previousTools) => {
                  logEvent("tengu_mcp_list_changed", {
                    type: "tools",
                    previousCount: previousTools.length,
                    newCount
                  });
                }, () => {
                  logEvent("tengu_mcp_list_changed", {
                    type: "tools",
                    newCount
                  });
                });
              else
                logEvent("tengu_mcp_list_changed", {
                  type: "tools",
                  newCount
                });
              updateServer({ ...client15, tools: newTools });
            } catch (error44) {
              logMCPError(client15.name, `Failed to refresh tools after list_changed notification: ${errorMessage(error44)}`);
            }
          });
        if (client15.capabilities?.prompts?.listChanged)
          client15.client.setNotificationHandler(PromptListChangedNotificationSchema, async () => {
            logMCPDebug(client15.name, "Received prompts/list_changed notification, refreshing prompts"), logEvent("tengu_mcp_list_changed", {
              type: "prompts"
            });
            try {
              fetchCommandsForClient.cache.delete(client15.name);
              let [mcpPrompts, mcpSkills] = await Promise.all([
                fetchCommandsForClient(client15),
                Promise.resolve([])
              ]);
              updateServer({
                ...client15,
                commands: [...mcpPrompts, ...mcpSkills]
              }), clearSkillIndexCache?.();
            } catch (error44) {
              logMCPError(client15.name, `Failed to refresh prompts after list_changed notification: ${errorMessage(error44)}`);
            }
          });
        if (client15.capabilities?.resources?.listChanged)
          client15.client.setNotificationHandler(ResourceListChangedNotificationSchema, async () => {
            logMCPDebug(client15.name, "Received resources/list_changed notification, refreshing resources"), logEvent("tengu_mcp_list_changed", {
              type: "resources"
            });
            try {
              fetchResourcesForClient.cache.delete(client15.name);
              let newResources = await fetchResourcesForClient(client15);
              updateServer({ ...client15, resources: newResources });
            } catch (error44) {
              logMCPError(client15.name, `Failed to refresh resources after list_changed notification: ${errorMessage(error44)}`);
            }
          });
        break;
      }
      case "needs-auth":
      case "failed":
      case "pending":
      case "disabled":
        break;
    }
  }, [updateServer]), sessionId = getSessionId();
  import_react124.useEffect(() => {
    async function initializeServersAsPending() {
      let { servers: existingConfigs, errors: mcpErrors } = isStrictMcpConfig ? { servers: {}, errors: [] } : await getClaudeCodeMcpConfigs(dynamicMcpConfig), configs = { ...existingConfigs, ...dynamicMcpConfig };
      addErrorsToAppState(setAppState, mcpErrors), setAppState((prevState) => {
        let { stale, ...mcpWithoutStale } = excludeStalePluginClients(prevState.mcp, configs);
        for (let s2 of stale) {
          let timer = reconnectTimersRef.current.get(s2.name);
          if (timer)
            clearTimeout(timer), reconnectTimersRef.current.delete(s2.name);
          if (s2.type === "connected")
            s2.client.onclose = void 0, clearServerCache(s2.name, s2.config).catch(() => {});
        }
        let existingServerNames = new Set(mcpWithoutStale.clients.map((c3) => c3.name)), newClients = Object.entries(configs).filter(([name3]) => !existingServerNames.has(name3)).map(([name3, config11]) => ({
          name: name3,
          type: isMcpServerDisabled(name3) ? "disabled" : "pending",
          config: config11
        }));
        if (newClients.length === 0 && stale.length === 0)
          return prevState;
        return {
          ...prevState,
          mcp: {
            ...prevState.mcp,
            ...mcpWithoutStale,
            clients: [...mcpWithoutStale.clients, ...newClients]
          }
        };
      });
    }
    initializeServersAsPending().catch((error44) => {
      logMCPError("useManageMCPConnections", `Failed to initialize servers as pending: ${errorMessage(error44)}`);
    });
  }, [
    isStrictMcpConfig,
    dynamicMcpConfig,
    setAppState,
    sessionId,
    _pluginReconnectKey
  ]), import_react124.useEffect(() => {
    let cancelled = !1;
    async function loadAndConnectMcpConfigs() {
      let claudeaiPromise;
      if (isStrictMcpConfig || doesEnterpriseMcpConfigExist())
        claudeaiPromise = Promise.resolve({});
      else
        clearClaudeAIMcpConfigsCache(), claudeaiPromise = fetchClaudeAIMcpConfigsIfEligible();
      let { servers: claudeCodeConfigs, errors: mcpErrors } = isStrictMcpConfig ? { servers: {}, errors: [] } : await getClaudeCodeMcpConfigs(dynamicMcpConfig, claudeaiPromise);
      if (cancelled)
        return;
      addErrorsToAppState(setAppState, mcpErrors);
      let configs = { ...claudeCodeConfigs, ...dynamicMcpConfig }, enabledConfigs = Object.fromEntries(Object.entries(configs).filter(([name3]) => !isMcpServerDisabled(name3)));
      getMcpToolsCommandsAndResources(onConnectionAttempt, enabledConfigs).catch((error44) => {
        logMCPError("useManageMcpConnections", `Failed to get MCP resources: ${errorMessage(error44)}`);
      });
      let claudeaiConfigs = {};
      if (!isStrictMcpConfig) {
        if (claudeaiConfigs = filterMcpServersByPolicy(await claudeaiPromise).allowed, cancelled)
          return;
        if (Object.keys(claudeaiConfigs).length > 0) {
          let { servers: dedupedClaudeAi } = dedupClaudeAiMcpServers(claudeaiConfigs, configs);
          claudeaiConfigs = dedupedClaudeAi;
        }
        if (Object.keys(claudeaiConfigs).length > 0) {
          setAppState((prevState) => {
            let existingServerNames = new Set(prevState.mcp.clients.map((c3) => c3.name)), newClients = Object.entries(claudeaiConfigs).filter(([name3]) => !existingServerNames.has(name3)).map(([name3, config11]) => ({
              name: name3,
              type: isMcpServerDisabled(name3) ? "disabled" : "pending",
              config: config11
            }));
            if (newClients.length === 0)
              return prevState;
            return {
              ...prevState,
              mcp: {
                ...prevState.mcp,
                clients: [...prevState.mcp.clients, ...newClients]
              }
            };
          });
          let enabledClaudeaiConfigs = Object.fromEntries(Object.entries(claudeaiConfigs).filter(([name3]) => !isMcpServerDisabled(name3)));
          getMcpToolsCommandsAndResources(onConnectionAttempt, enabledClaudeaiConfigs).catch((error44) => {
            logMCPError("useManageMcpConnections", `Failed to get claude.ai MCP resources: ${errorMessage(error44)}`);
          });
        }
      }
      let allConfigs = { ...configs, ...claudeaiConfigs }, counts = {
        enterprise: 0,
        global: 0,
        project: 0,
        user: 0,
        plugin: 0,
        claudeai: 0
      }, stdioCommands = [];
      for (let [name3, serverConfig] of Object.entries(allConfigs))
        if (serverConfig.scope === "enterprise")
          counts.enterprise++;
        else if (serverConfig.scope === "user")
          counts.global++;
        else if (serverConfig.scope === "project")
          counts.project++;
        else if (serverConfig.scope === "local")
          counts.user++;
        else if (serverConfig.scope === "dynamic")
          counts.plugin++;
        else if (serverConfig.scope === "claudeai")
          counts.claudeai++;
      logEvent("tengu_mcp_servers", {
        ...counts
      });
    }
    return loadAndConnectMcpConfigs(), () => {
      cancelled = !0;
    };
  }, [
    isStrictMcpConfig,
    dynamicMcpConfig,
    onConnectionAttempt,
    setAppState,
    _authVersion,
    sessionId,
    _pluginReconnectKey
  ]), import_react124.useEffect(() => {
    let timers = reconnectTimersRef.current;
    return () => {
      for (let timer of timers.values())
        clearTimeout(timer);
      if (timers.clear(), flushTimerRef.current !== null)
        clearTimeout(flushTimerRef.current), flushTimerRef.current = null, flushPendingUpdates();
    };
  }, [flushPendingUpdates]);
  let reconnectMcpServer = import_react124.useCallback(async (serverName) => {
    let client15 = store.getState().mcp.clients.find((c3) => c3.name === serverName);
    if (!client15)
      throw Error(`MCP server ${serverName} not found`);
    let existingTimer = reconnectTimersRef.current.get(serverName);
    if (existingTimer)
      clearTimeout(existingTimer), reconnectTimersRef.current.delete(serverName);
    let result = await reconnectMcpServerImpl(serverName, client15.config);
    return onConnectionAttempt(result), result;
  }, [store, onConnectionAttempt]), toggleMcpServer = import_react124.useCallback(async (serverName) => {
    let client15 = store.getState().mcp.clients.find((c3) => c3.name === serverName);
    if (!client15)
      throw Error(`MCP server ${serverName} not found`);
    if (client15.type !== "disabled") {
      let existingTimer = reconnectTimersRef.current.get(serverName);
      if (existingTimer)
        clearTimeout(existingTimer), reconnectTimersRef.current.delete(serverName);
      if (setMcpServerEnabled(serverName, !1), client15.type === "connected")
        await clearServerCache(serverName, client15.config);
      updateServer({
        name: serverName,
        type: "disabled",
        config: client15.config
      });
    } else {
      setMcpServerEnabled(serverName, !0), updateServer({
        name: serverName,
        type: "pending",
        config: client15.config
      });
      let result = await reconnectMcpServerImpl(serverName, client15.config);
      onConnectionAttempt(result);
    }
  }, [store, updateServer, onConnectionAttempt]);
  return { reconnectMcpServer, toggleMcpServer };
}
function getTransportDisplayName(type) {
  switch (type) {
    case "http":
      return "HTTP";
    case "ws":
    case "ws-ide":
      return "WebSocket";
    default:
      return "SSE";
  }
}
var import_react124, clearSkillIndexCache = null, MAX_RECONNECT_ATTEMPTS = 5, INITIAL_BACKOFF_MS = 1000, MAX_BACKOFF_MS = 30000;
var init_useManageMCPConnections = __esm(() => {
  init_state();
  init_client20();
  init_types();
  init_omit();
  init_reject2();
  init_config8();
  init_debug();
  init_state();
  init_notifications();
  init_AppState();
  init_errors();
  init_log3();
  init_messageQueueManager();
  init_channelNotification();
  init_channelPermissions();
  init_claudeai();
  init_elicitationHandler();
  init_mcpStringUtils();
  init_utils7();
  import_react124 = __toESM(require_react_development(), 1);
});
