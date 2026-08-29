// Original: src/hooks/useDirectConnect.ts
function useDirectConnect({
  config: config11,
  setMessages,
  setIsLoading,
  setToolUseConfirmQueue,
  tools
}) {
  let isRemoteMode = !!config11, managerRef = import_react259.useRef(null), hasReceivedInitRef = import_react259.useRef(!1), isConnectedRef = import_react259.useRef(!1), toolsRef = import_react259.useRef(tools);
  import_react259.useEffect(() => {
    toolsRef.current = tools;
  }, [tools]), import_react259.useEffect(() => {
    if (!config11)
      return;
    hasReceivedInitRef.current = !1, logForDebugging(`[useDirectConnect] Connecting to ${config11.wsUrl}`);
    let manager7 = new DirectConnectSessionManager(config11, {
      onMessage: (sdkMessage) => {
        if (isSessionEndMessage(sdkMessage))
          setIsLoading(!1);
        if (sdkMessage.type === "system" && sdkMessage.subtype === "init") {
          if (hasReceivedInitRef.current)
            return;
          hasReceivedInitRef.current = !0;
        }
        let converted = convertSDKMessage(sdkMessage, {
          convertToolResults: !0
        });
        if (converted.type === "message")
          setMessages((prev) => [...prev, converted.message]);
      },
      onPermissionRequest: (request2, requestId) => {
        logForDebugging(`[useDirectConnect] Permission request for tool: ${request2.tool_name}`);
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
      onConnected: () => {
        logForDebugging("[useDirectConnect] Connected"), isConnectedRef.current = !0;
      },
      onDisconnected: () => {
        if (logForDebugging("[useDirectConnect] Disconnected"), !isConnectedRef.current)
          process.stderr.write(`
Failed to connect to server at ${config11.wsUrl}
`);
        else
          process.stderr.write(`
Server disconnected.
`);
        isConnectedRef.current = !1, gracefulShutdown(1), setIsLoading(!1);
      },
      onError: (error44) => {
        logForDebugging(`[useDirectConnect] Error: ${error44.message}`);
      }
    });
    return managerRef.current = manager7, manager7.connect(), () => {
      logForDebugging("[useDirectConnect] Cleanup - disconnecting"), manager7.disconnect(), managerRef.current = null;
    };
  }, [config11, setMessages, setIsLoading, setToolUseConfirmQueue]);
  let sendMessage3 = import_react259.useCallback(async (content) => {
    let manager7 = managerRef.current;
    if (!manager7)
      return !1;
    return setIsLoading(!0), manager7.sendMessage(content);
  }, [setIsLoading]), cancelRequest = import_react259.useCallback(() => {
    managerRef.current?.sendInterrupt(), setIsLoading(!1);
  }, [setIsLoading]), disconnect2 = import_react259.useCallback(() => {
    managerRef.current?.disconnect(), managerRef.current = null, isConnectedRef.current = !1;
  }, []);
  return import_react259.useMemo(() => ({ isRemoteMode, sendMessage: sendMessage3, cancelRequest, disconnect: disconnect2 }), [isRemoteMode, sendMessage3, cancelRequest, disconnect2]);
}
var import_react259;
var init_useDirectConnect = __esm(() => {
  init_remotePermissionBridge();
  init_sdkMessageAdapter();
  init_directConnectManager();
  init_Tool();
  init_debug();
  init_gracefulShutdown();
  import_react259 = __toESM(require_react_development(), 1);
});
