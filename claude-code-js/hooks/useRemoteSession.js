// Original: src/hooks/useRemoteSession.ts
class BoundedUUIDSet {
  cap;
  set = /* @__PURE__ */ new Set;
  ring = [];
  idx = 0;
  constructor(cap) {
    this.cap = cap;
    this.ring = Array(cap).fill("");
  }
  has(id) {
    return this.set.has(id);
  }
  add(id) {
    let old = this.ring[this.idx];
    if (old)
      this.set.delete(old);
    this.ring[this.idx] = id, this.set.add(id), this.idx = (this.idx + 1) % this.cap;
  }
}
function useRemoteSession({
  config: config11,
  setMessages,
  setIsLoading,
  onInit,
  setToolUseConfirmQueue,
  tools,
  setStreamingToolUses,
  setStreamMode,
  setInProgressToolUseIDs
}) {
  let isRemoteMode = !!config11, setAppState = useSetAppState(), setConnStatus = import_react258.useCallback((s2) => setAppState((prev) => prev.remoteConnectionStatus === s2 ? prev : { ...prev, remoteConnectionStatus: s2 }), [setAppState]), runningTaskIdsRef = import_react258.useRef(/* @__PURE__ */ new Set), writeTaskCount = import_react258.useCallback(() => {
    let n6 = runningTaskIdsRef.current.size;
    setAppState((prev) => prev.remoteBackgroundTaskCount === n6 ? prev : { ...prev, remoteBackgroundTaskCount: n6 });
  }, [setAppState]), responseTimeoutRef = import_react258.useRef(null), isCompactingRef = import_react258.useRef(!1), managerRef = import_react258.useRef(null), hasUpdatedTitleRef = import_react258.useRef(!1), sentUUIDsRef = import_react258.useRef(new BoundedUUIDSet(50)), toolsRef = import_react258.useRef(tools);
  import_react258.useEffect(() => {
    toolsRef.current = tools;
  }, [tools]), import_react258.useEffect(() => {
    if (!config11)
      return;
    logForDebugging(`[useRemoteSession] Initializing for session ${config11.sessionId}`);
    let manager7 = new RemoteSessionManager(config11, {
      onMessage: (sdkMessage) => {
        let parts = [`type=${sdkMessage.type}`];
        if ("subtype" in sdkMessage)
          parts.push(`subtype=${sdkMessage.subtype}`);
        if (sdkMessage.type === "user") {
          let c3 = sdkMessage.message?.content;
          parts.push(`content=${Array.isArray(c3) ? c3.map((b) => b.type).join(",") : typeof c3}`);
        }
        if (logForDebugging(`[useRemoteSession] Received ${parts.join(" ")}`), responseTimeoutRef.current)
          clearTimeout(responseTimeoutRef.current), responseTimeoutRef.current = null;
        if (sdkMessage.type === "user" && sdkMessage.uuid && sentUUIDsRef.current.has(sdkMessage.uuid)) {
          logForDebugging(`[useRemoteSession] Dropping echoed user message ${sdkMessage.uuid}`);
          return;
        }
        if (sdkMessage.type === "system" && sdkMessage.subtype === "init" && onInit)
          logForDebugging(`[useRemoteSession] Init received with ${sdkMessage.slash_commands.length} slash commands`), onInit(sdkMessage.slash_commands);
        if (sdkMessage.type === "system") {
          if (sdkMessage.subtype === "task_started") {
            runningTaskIdsRef.current.add(sdkMessage.task_id), writeTaskCount();
            return;
          }
          if (sdkMessage.subtype === "task_notification") {
            runningTaskIdsRef.current.delete(sdkMessage.task_id), writeTaskCount();
            return;
          }
          if (sdkMessage.subtype === "task_progress")
            return;
          if (sdkMessage.subtype === "status") {
            let wasCompacting = isCompactingRef.current;
            if (isCompactingRef.current = sdkMessage.status === "compacting", wasCompacting && isCompactingRef.current)
              return;
          }
          if (sdkMessage.subtype === "compact_boundary")
            isCompactingRef.current = !1;
        }
        if (isSessionEndMessage(sdkMessage))
          isCompactingRef.current = !1, setIsLoading(!1);
        if (setInProgressToolUseIDs && sdkMessage.type === "user") {
          let content = sdkMessage.message?.content;
          if (Array.isArray(content)) {
            let resultIds = [];
            for (let block2 of content)
              if (block2.type === "tool_result")
                resultIds.push(block2.tool_use_id);
            if (resultIds.length > 0)
              setInProgressToolUseIDs((prev) => {
                let next2 = new Set(prev);
                for (let id of resultIds)
                  next2.delete(id);
                return next2.size === prev.size ? prev : next2;
              });
          }
        }
        let converted = convertSDKMessage(sdkMessage, config11.viewerOnly ? { convertToolResults: !0, convertUserTextMessages: !0 } : void 0);
        if (converted.type === "message") {
          if (setStreamingToolUses?.((prev) => prev.length > 0 ? [] : prev), setInProgressToolUseIDs && converted.message.type === "assistant") {
            let toolUseIds = converted.message.message.content.filter((block2) => block2.type === "tool_use").map((block2) => block2.id);
            if (toolUseIds.length > 0)
              setInProgressToolUseIDs((prev) => {
                let next2 = new Set(prev);
                for (let id of toolUseIds)
                  next2.add(id);
                return next2;
              });
          }
          setMessages((prev) => [...prev, converted.message]);
        } else if (converted.type === "stream_event")
          if (setStreamingToolUses && setStreamMode)
            handleMessageFromStream(converted.event, (message) => setMessages((prev) => [...prev, message]), () => {}, setStreamMode, setStreamingToolUses);
          else
            logForDebugging("[useRemoteSession] Stream event received but streaming callbacks not provided");
      },
      onPermissionRequest: (request2, requestId) => {
        logForDebugging(`[useRemoteSession] Permission request for tool: ${request2.tool_name}`);
        let tool = findToolByName(toolsRef.current, request2.tool_name) ?? createToolStub(request2.tool_name), syntheticMessage = createSyntheticAssistantMessage(request2, requestId), permissionResult = {
          behavior: "ask",
          message: request2.description ?? `${request2.tool_name} requires permission`,
          suggestions: request2.permission_suggestions,
          blockedPath: request2.blocked_path
        }, toolUseConfirm = {
          assistantMessage: syntheticMessage,
          tool,
          description: request2.description ?? `${request2.tool_name} requires permission`,
          input: request2.input,
          toolUseContext: {},
          toolUseID: request2.tool_use_id,
          permissionResult,
          permissionPromptStartTimeMs: Date.now(),
          onUserInteraction() {},
          onAbort() {
            let response7 = {
              behavior: "deny",
              message: "User aborted"
            };
            manager7.respondToPermissionRequest(requestId, response7), setToolUseConfirmQueue((queue2) => queue2.filter((item) => item.toolUseID !== request2.tool_use_id));
          },
          onAllow(updatedInput, _permissionUpdates, _feedback) {
            let response7 = {
              behavior: "allow",
              updatedInput
            };
            manager7.respondToPermissionRequest(requestId, response7), setToolUseConfirmQueue((queue2) => queue2.filter((item) => item.toolUseID !== request2.tool_use_id)), setIsLoading(!0);
          },
          onReject(feedback2) {
            let response7 = {
              behavior: "deny",
              message: feedback2 ?? "User denied permission"
            };
            manager7.respondToPermissionRequest(requestId, response7), setToolUseConfirmQueue((queue2) => queue2.filter((item) => item.toolUseID !== request2.tool_use_id));
          },
          async recheckPermission() {}
        };
        setToolUseConfirmQueue((queue2) => [...queue2, toolUseConfirm]), setIsLoading(!1);
      },
      onPermissionCancelled: (requestId, toolUseId) => {
        logForDebugging(`[useRemoteSession] Permission request cancelled: ${requestId}`);
        let idToRemove = toolUseId ?? requestId;
        setToolUseConfirmQueue((queue2) => queue2.filter((item) => item.toolUseID !== idToRemove)), setIsLoading(!0);
      },
      onConnected: () => {
        logForDebugging("[useRemoteSession] Connected"), setConnStatus("connected");
      },
      onReconnecting: () => {
        logForDebugging("[useRemoteSession] Reconnecting"), setConnStatus("reconnecting"), runningTaskIdsRef.current.clear(), writeTaskCount(), setInProgressToolUseIDs?.((prev) => prev.size > 0 ? /* @__PURE__ */ new Set : prev);
      },
      onDisconnected: () => {
        logForDebugging("[useRemoteSession] Disconnected"), setConnStatus("disconnected"), setIsLoading(!1), runningTaskIdsRef.current.clear(), writeTaskCount(), setInProgressToolUseIDs?.((prev) => prev.size > 0 ? /* @__PURE__ */ new Set : prev);
      },
      onError: (error44) => {
        logForDebugging(`[useRemoteSession] Error: ${error44.message}`);
      }
    });
    return managerRef.current = manager7, manager7.connect(), () => {
      if (logForDebugging("[useRemoteSession] Cleanup - disconnecting"), responseTimeoutRef.current)
        clearTimeout(responseTimeoutRef.current), responseTimeoutRef.current = null;
      manager7.disconnect(), managerRef.current = null;
    };
  }, [
    config11,
    setMessages,
    setIsLoading,
    onInit,
    setToolUseConfirmQueue,
    setStreamingToolUses,
    setStreamMode,
    setInProgressToolUseIDs,
    setConnStatus,
    writeTaskCount
  ]);
  let sendMessage3 = import_react258.useCallback(async (content, opts) => {
    let manager7 = managerRef.current;
    if (!manager7)
      return logForDebugging("[useRemoteSession] Cannot send - no manager"), !1;
    if (responseTimeoutRef.current)
      clearTimeout(responseTimeoutRef.current);
    if (setIsLoading(!0), opts?.uuid)
      sentUUIDsRef.current.add(opts.uuid);
    let success2 = await manager7.sendMessage(content, opts);
    if (!success2)
      return setIsLoading(!1), !1;
    if (!hasUpdatedTitleRef.current && config11 && !config11.hasInitialPrompt && !config11.viewerOnly) {
      hasUpdatedTitleRef.current = !0;
      let sessionId = config11.sessionId, description = typeof content === "string" ? content : extractTextContent(content, " ");
      if (description)
        generateSessionTitle(description, new AbortController().signal).then((title) => {
          updateSessionTitle(sessionId, title ?? truncateToWidth(description, 75));
        });
    }
    if (!config11?.viewerOnly) {
      let timeoutMs = isCompactingRef.current ? COMPACTION_TIMEOUT_MS : RESPONSE_TIMEOUT_MS;
      responseTimeoutRef.current = setTimeout((setMessages2, manager8) => {
        logForDebugging("[useRemoteSession] Response timeout - attempting reconnect");
        let warningMessage = createSystemMessage("Remote session may be unresponsive. Attempting to reconnect\u2026", "warning");
        setMessages2((prev) => [...prev, warningMessage]), manager8.reconnect();
      }, timeoutMs, setMessages, manager7);
    }
    return success2;
  }, [config11, setIsLoading, setMessages]), cancelRequest = import_react258.useCallback(() => {
    if (responseTimeoutRef.current)
      clearTimeout(responseTimeoutRef.current), responseTimeoutRef.current = null;
    if (!config11?.viewerOnly)
      managerRef.current?.cancelSession();
    setIsLoading(!1);
  }, [config11, setIsLoading]), disconnect2 = import_react258.useCallback(() => {
    if (responseTimeoutRef.current)
      clearTimeout(responseTimeoutRef.current), responseTimeoutRef.current = null;
    managerRef.current?.disconnect(), managerRef.current = null;
  }, []);
  return import_react258.useMemo(() => ({ isRemoteMode, sendMessage: sendMessage3, cancelRequest, disconnect: disconnect2 }), [isRemoteMode, sendMessage3, cancelRequest, disconnect2]);
}
var import_react258, RESPONSE_TIMEOUT_MS = 60000, COMPACTION_TIMEOUT_MS = 180000;
var init_useRemoteSession = __esm(() => {
  init_RemoteSessionManager();
  init_remotePermissionBridge();
  init_sdkMessageAdapter();
  init_AppState();
  init_Tool();
  init_debug();
  init_format();
  init_messages3();
  init_sessionTitle();
  init_api2();
  import_react258 = __toESM(require_react_development(), 1);
});
