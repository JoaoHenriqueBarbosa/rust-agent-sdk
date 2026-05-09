// Original: src/hooks/useSSHSession.ts
import { randomUUID as randomUUID36 } from "crypto";
function useSSHSession({
  session: session2,
  setMessages,
  setIsLoading,
  setToolUseConfirmQueue,
  tools
}) {
  let isRemoteMode = !!session2, managerRef = import_react260.useRef(null), hasReceivedInitRef = import_react260.useRef(!1), isConnectedRef = import_react260.useRef(!1), toolsRef = import_react260.useRef(tools);
  import_react260.useEffect(() => {
    toolsRef.current = tools;
  }, [tools]), import_react260.useEffect(() => {
    if (!session2)
      return;
    hasReceivedInitRef.current = !1, logForDebugging("[useSSHSession] wiring SSH session manager");
    let manager7 = session2.createManager({
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
        logForDebugging(`[useSSHSession] permission request: ${request2.tool_name}`);
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
            manager7.respondToPermissionRequest(requestId, {
              behavior: "deny",
              message: "User aborted"
            }), setToolUseConfirmQueue((q4) => q4.filter((i5) => i5.toolUseID !== request2.tool_use_id));
          },
          onAllow(updatedInput) {
            manager7.respondToPermissionRequest(requestId, {
              behavior: "allow",
              updatedInput
            }), setToolUseConfirmQueue((q4) => q4.filter((i5) => i5.toolUseID !== request2.tool_use_id)), setIsLoading(!0);
          },
          onReject(feedback2) {
            manager7.respondToPermissionRequest(requestId, {
              behavior: "deny",
              message: feedback2 ?? "User denied permission"
            }), setToolUseConfirmQueue((q4) => q4.filter((i5) => i5.toolUseID !== request2.tool_use_id));
          },
          async recheckPermission() {}
        };
        setToolUseConfirmQueue((q4) => [...q4, toolUseConfirm]), setIsLoading(!1);
      },
      onConnected: () => {
        logForDebugging("[useSSHSession] connected"), isConnectedRef.current = !0;
      },
      onReconnecting: (attempt, max2) => {
        logForDebugging(`[useSSHSession] ssh dropped, reconnecting (${attempt}/${max2})`), isConnectedRef.current = !1, setIsLoading(!1);
        let msg = {
          type: "system",
          subtype: "informational",
          content: `SSH connection dropped \u2014 reconnecting (attempt ${attempt}/${max2})...`,
          timestamp: (/* @__PURE__ */ new Date()).toISOString(),
          uuid: randomUUID36(),
          level: "warning"
        };
        setMessages((prev) => [...prev, msg]);
      },
      onDisconnected: () => {
        logForDebugging("[useSSHSession] ssh process exited (giving up)");
        let stderr = session2.getStderrTail().trim(), connected = isConnectedRef.current, exitCode = session2.proc.exitCode;
        isConnectedRef.current = !1, setIsLoading(!1);
        let msg = connected ? "Remote session ended." : "SSH session failed before connecting.";
        if (stderr && (!connected || exitCode !== 0))
          msg += `
Remote stderr (exit ${exitCode ?? "signal " + session2.proc.signalCode}):
${stderr}`;
        gracefulShutdown(1, "other", { finalMessage: msg });
      },
      onError: (error44) => {
        logForDebugging(`[useSSHSession] error: ${error44.message}`);
      }
    });
    return managerRef.current = manager7, manager7.connect(), () => {
      logForDebugging("[useSSHSession] cleanup"), manager7.disconnect(), session2.proxy.stop(), managerRef.current = null;
    };
  }, [session2, setMessages, setIsLoading, setToolUseConfirmQueue]);
  let sendMessage3 = import_react260.useCallback(async (content) => {
    let m4 = managerRef.current;
    if (!m4)
      return !1;
    return setIsLoading(!0), m4.sendMessage(content);
  }, [setIsLoading]), cancelRequest = import_react260.useCallback(() => {
    managerRef.current?.sendInterrupt(), setIsLoading(!1);
  }, [setIsLoading]), disconnect2 = import_react260.useCallback(() => {
    managerRef.current?.disconnect(), managerRef.current = null, isConnectedRef.current = !1;
  }, []);
  return import_react260.useMemo(() => ({ isRemoteMode, sendMessage: sendMessage3, cancelRequest, disconnect: disconnect2 }), [isRemoteMode, sendMessage3, cancelRequest, disconnect2]);
}
var import_react260;
var init_useSSHSession = __esm(() => {
  init_remotePermissionBridge();
  init_sdkMessageAdapter();
  init_Tool();
  init_debug();
  init_gracefulShutdown();
  import_react260 = __toESM(require_react_development(), 1);
});