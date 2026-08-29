// Original: src/cli/structuredIO.ts
import { randomUUID as randomUUID43 } from "crypto";
function serializeDecisionReason(reason) {
  if (!reason)
    return;
  if (reason.type === "classifier")
    return reason.reason;
  switch (reason.type) {
    case "rule":
    case "mode":
    case "subcommandResults":
    case "permissionPromptTool":
      return;
    case "hook":
    case "asyncAgent":
    case "sandboxOverride":
    case "workingDir":
    case "safetyCheck":
    case "other":
      return reason.reason;
  }
}
function buildRequiresActionDetails(tool, input, toolUseID, requestId) {
  let description;
  try {
    description = tool.getActivityDescription?.(input) ?? tool.getToolUseSummary?.(input) ?? tool.userFacingName(input);
  } catch {
    description = tool.name;
  }
  return {
    tool_name: tool.name,
    action_description: description,
    tool_use_id: toolUseID,
    request_id: requestId,
    input
  };
}

class StructuredIO {
  input;
  replayUserMessages;
  structuredInput;
  pendingRequests = /* @__PURE__ */ new Map;
  restoredWorkerState = Promise.resolve(null);
  inputClosed = !1;
  unexpectedResponseCallback;
  resolvedToolUseIds = /* @__PURE__ */ new Set;
  prependedLines = [];
  onControlRequestSent;
  onControlRequestResolved;
  outbound = new Stream4;
  constructor(input, replayUserMessages) {
    this.input = input;
    this.replayUserMessages = replayUserMessages;
    this.input = input, this.structuredInput = this.read();
  }
  trackResolvedToolUseId(request2) {
    if (request2.request.subtype === "can_use_tool") {
      if (this.resolvedToolUseIds.add(request2.request.tool_use_id), this.resolvedToolUseIds.size > MAX_RESOLVED_TOOL_USE_IDS) {
        let first = this.resolvedToolUseIds.values().next().value;
        if (first !== void 0)
          this.resolvedToolUseIds.delete(first);
      }
    }
  }
  flushInternalEvents() {
    return Promise.resolve();
  }
  get internalEventsPending() {
    return 0;
  }
  prependUserMessage(content) {
    this.prependedLines.push(jsonStringify({
      type: "user",
      session_id: "",
      message: { role: "user", content },
      parent_tool_use_id: null
    }) + `
`);
  }
  async* read() {
    let content = "", splitAndProcess = async function* () {
      for (;; ) {
        if (this.prependedLines.length > 0)
          content = this.prependedLines.join("") + content, this.prependedLines = [];
        let newline2 = content.indexOf(`
`);
        if (newline2 === -1)
          break;
        let line = content.slice(0, newline2);
        content = content.slice(newline2 + 1);
        let message = await this.processLine(line);
        if (message)
          logForDiagnosticsNoPII("info", "cli_stdin_message_parsed", {
            type: message.type
          }), yield message;
      }
    }.bind(this);
    yield* splitAndProcess();
    for await (let block2 of this.input)
      content += block2, yield* splitAndProcess();
    if (content) {
      let message = await this.processLine(content);
      if (message)
        yield message;
    }
    this.inputClosed = !0;
    for (let request2 of this.pendingRequests.values())
      request2.reject(Error("Tool permission stream closed before response received"));
  }
  getPendingPermissionRequests() {
    return Array.from(this.pendingRequests.values()).map((entry) => entry.request).filter((pr) => pr.request.subtype === "can_use_tool");
  }
  setUnexpectedResponseCallback(callback) {
    this.unexpectedResponseCallback = callback;
  }
  injectControlResponse(response7) {
    let requestId = response7.response?.request_id;
    if (!requestId)
      return;
    let request2 = this.pendingRequests.get(requestId);
    if (!request2)
      return;
    if (this.trackResolvedToolUseId(request2.request), this.pendingRequests.delete(requestId), this.write({
      type: "control_cancel_request",
      request_id: requestId
    }), response7.response.subtype === "error")
      request2.reject(Error(response7.response.error));
    else {
      let result = response7.response.response;
      if (request2.schema)
        try {
          request2.resolve(request2.schema.parse(result));
        } catch (error44) {
          request2.reject(error44);
        }
      else
        request2.resolve({});
    }
  }
  setOnControlRequestSent(callback) {
    this.onControlRequestSent = callback;
  }
  setOnControlRequestResolved(callback) {
    this.onControlRequestResolved = callback;
  }
  async processLine(line) {
    if (!line)
      return;
    try {
      let message = normalizeControlMessageKeys(jsonParse(line));
      if (message.type === "keep_alive")
        return;
      if (message.type === "update_environment_variables") {
        let keys3 = Object.keys(message.variables);
        for (let [key3, value] of Object.entries(message.variables))
          process.env[key3] = value;
        logForDebugging(`[structuredIO] applied update_environment_variables: ${keys3.join(", ")}`);
        return;
      }
      if (message.type === "control_response") {
        let uuid8 = "uuid" in message && typeof message.uuid === "string" ? message.uuid : void 0;
        if (uuid8)
          notifyCommandLifecycle(uuid8, "completed");
        let request2 = this.pendingRequests.get(message.response.request_id);
        if (!request2) {
          let toolUseID = (message.response.subtype === "success" ? message.response.response : void 0)?.toolUseID;
          if (typeof toolUseID === "string" && this.resolvedToolUseIds.has(toolUseID)) {
            logForDebugging(`Ignoring duplicate control_response for already-resolved toolUseID=${toolUseID} request_id=${message.response.request_id}`);
            return;
          }
          if (this.unexpectedResponseCallback)
            await this.unexpectedResponseCallback(message);
          return;
        }
        if (this.trackResolvedToolUseId(request2.request), this.pendingRequests.delete(message.response.request_id), request2.request.request.subtype === "can_use_tool" && this.onControlRequestResolved)
          this.onControlRequestResolved(message.response.request_id);
        if (message.response.subtype === "error") {
          request2.reject(Error(message.response.error));
          return;
        }
        let result = message.response.response;
        if (request2.schema)
          try {
            request2.resolve(request2.schema.parse(result));
          } catch (error44) {
            request2.reject(error44);
          }
        else
          request2.resolve({});
        if (this.replayUserMessages)
          return message;
        return;
      }
      if (message.type !== "user" && message.type !== "control_request" && message.type !== "assistant" && message.type !== "system") {
        logForDebugging(`Ignoring unknown message type: ${message.type}`, {
          level: "warn"
        });
        return;
      }
      if (message.type === "control_request") {
        if (!message.request)
          exitWithMessage2("Error: Missing request on control_request");
        return message;
      }
      if (message.type === "assistant" || message.type === "system")
        return message;
      if (message.message.role !== "user")
        exitWithMessage2(`Error: Expected message role 'user', got '${message.message.role}'`);
      return message;
    } catch (error44) {
      console.error(`Error parsing streaming input line: ${line}: ${error44}`), process.exit(1);
    }
  }
  async write(message) {
    writeToStdout(ndjsonSafeStringify(message) + `
`);
  }
  async sendRequest(request2, schema5, signal, requestId = randomUUID43()) {
    let message = {
      type: "control_request",
      request_id: requestId,
      request: request2
    };
    if (this.inputClosed)
      throw Error("Stream closed");
    if (signal?.aborted)
      throw Error("Request aborted");
    if (this.outbound.enqueue(message), request2.subtype === "can_use_tool" && this.onControlRequestSent)
      this.onControlRequestSent(message);
    let aborted3 = () => {
      this.outbound.enqueue({
        type: "control_cancel_request",
        request_id: requestId
      });
      let request3 = this.pendingRequests.get(requestId);
      if (request3)
        this.trackResolvedToolUseId(request3.request), request3.reject(new AbortError);
    };
    if (signal)
      signal.addEventListener("abort", aborted3, {
        once: !0
      });
    try {
      return await new Promise((resolve47, reject2) => {
        this.pendingRequests.set(requestId, {
          request: {
            type: "control_request",
            request_id: requestId,
            request: request2
          },
          resolve: (result) => {
            resolve47(result);
          },
          reject: reject2,
          schema: schema5
        });
      });
    } finally {
      if (signal)
        signal.removeEventListener("abort", aborted3);
      this.pendingRequests.delete(requestId);
    }
  }
  createCanUseTool(onPermissionPrompt) {
    return async (tool, input, toolUseContext, assistantMessage, toolUseID, forceDecision) => {
      let mainPermissionResult = forceDecision ?? await hasPermissionsToUseTool(tool, input, toolUseContext, assistantMessage, toolUseID);
      if (mainPermissionResult.behavior === "allow" || mainPermissionResult.behavior === "deny")
        return mainPermissionResult;
      let hookAbortController = new AbortController, parentSignal = toolUseContext.abortController.signal, onParentAbort = () => hookAbortController.abort();
      parentSignal.addEventListener("abort", onParentAbort, { once: !0 });
      try {
        let hookPromise = executePermissionRequestHooksForSDK(tool.name, toolUseID, input, toolUseContext, mainPermissionResult.suggestions).then((decision) => ({ source: "hook", decision })), requestId = randomUUID43();
        onPermissionPrompt?.(buildRequiresActionDetails(tool, input, toolUseID, requestId));
        let sdkPromise = this.sendRequest({
          subtype: "can_use_tool",
          tool_name: tool.name,
          input,
          permission_suggestions: mainPermissionResult.suggestions,
          blocked_path: mainPermissionResult.blockedPath,
          decision_reason: serializeDecisionReason(mainPermissionResult.decisionReason),
          tool_use_id: toolUseID,
          agent_id: toolUseContext.agentId
        }, outputSchema33(), hookAbortController.signal, requestId).then((result) => ({ source: "sdk", result })), winner = await Promise.race([hookPromise, sdkPromise]);
        if (winner.source === "hook") {
          if (winner.decision)
            return sdkPromise.catch(() => {}), hookAbortController.abort(), winner.decision;
          let sdkResult = await sdkPromise;
          return permissionPromptToolResultToPermissionDecision(sdkResult.result, tool, input, toolUseContext);
        }
        return permissionPromptToolResultToPermissionDecision(winner.result, tool, input, toolUseContext);
      } catch (error44) {
        return permissionPromptToolResultToPermissionDecision({
          behavior: "deny",
          message: `Tool permission request failed: ${error44}`,
          toolUseID
        }, tool, input, toolUseContext);
      } finally {
        if (this.getPendingPermissionRequests().length === 0)
          notifySessionStateChanged("running");
        parentSignal.removeEventListener("abort", onParentAbort);
      }
    };
  }
  createHookCallback(callbackId, timeout2) {
    return {
      type: "callback",
      timeout: timeout2,
      callback: async (input, toolUseID, abort7) => {
        try {
          return await this.sendRequest({
            subtype: "hook_callback",
            callback_id: callbackId,
            input,
            tool_use_id: toolUseID || void 0
          }, hookJSONOutputSchema(), abort7);
        } catch (error44) {
          return console.error(`Error in hook callback ${callbackId}:`, error44), {};
        }
      }
    };
  }
  async handleElicitation(serverName, message, requestedSchema, signal, mode, url3, elicitationId) {
    try {
      return await this.sendRequest({
        subtype: "elicitation",
        mcp_server_name: serverName,
        message,
        mode,
        url: url3,
        elicitation_id: elicitationId,
        requested_schema: requestedSchema
      }, SDKControlElicitationResponseSchema(), signal);
    } catch {
      return { action: "cancel" };
    }
  }
  createSandboxAskCallback() {
    return async (hostPattern) => {
      try {
        return (await this.sendRequest({
          subtype: "can_use_tool",
          tool_name: SANDBOX_NETWORK_ACCESS_TOOL_NAME,
          input: { host: hostPattern.host },
          tool_use_id: randomUUID43(),
          description: `Allow network connection to ${hostPattern.host}?`
        }, outputSchema33())).behavior === "allow";
      } catch {
        return !1;
      }
    };
  }
  async sendMcpMessage(serverName, message) {
    return (await this.sendRequest({
      subtype: "mcp_message",
      server_name: serverName,
      message
    }, exports_external.object({
      mcp_response: exports_external.any()
    }))).mcp_response;
  }
}
function exitWithMessage2(message) {
  console.error(message), process.exit(1);
}
async function executePermissionRequestHooksForSDK(toolName, toolUseID, input, toolUseContext, suggestions) {
  let permissionMode = toolUseContext.getAppState().toolPermissionContext.mode, hookGenerator = executePermissionRequestHooks(toolName, toolUseID, input, toolUseContext, permissionMode, suggestions, toolUseContext.abortController.signal);
  for await (let hookResult of hookGenerator)
    if (hookResult.permissionRequestResult && (hookResult.permissionRequestResult.behavior === "allow" || hookResult.permissionRequestResult.behavior === "deny")) {
      let decision = hookResult.permissionRequestResult;
      if (decision.behavior === "allow") {
        let finalInput = decision.updatedInput || input, permissionUpdates = decision.updatedPermissions ?? [];
        if (permissionUpdates.length > 0) {
          persistPermissionUpdates(permissionUpdates);
          let currentAppState = toolUseContext.getAppState(), updatedContext = applyPermissionUpdates(currentAppState.toolPermissionContext, permissionUpdates);
          toolUseContext.setAppState((prev) => {
            if (prev.toolPermissionContext === updatedContext)
              return prev;
            return { ...prev, toolPermissionContext: updatedContext };
          });
        }
        return {
          behavior: "allow",
          updatedInput: finalInput,
          userModified: !1,
          decisionReason: {
            type: "hook",
            hookName: "PermissionRequest"
          }
        };
      } else
        return {
          behavior: "deny",
          message: decision.message || "Permission denied by PermissionRequest hook",
          decisionReason: {
            type: "hook",
            hookName: "PermissionRequest"
          }
        };
    }
  return;
}
var SANDBOX_NETWORK_ACCESS_TOOL_NAME = "SandboxNetworkAccess", MAX_RESOLVED_TOOL_USE_IDS = 1000;
var init_structuredIO = __esm(() => {
  init_controlSchemas();
  init_hooks4();
  init_debug();
  init_diagLogs();
  init_errors();
  init_PermissionPromptToolResultSchema();
  init_permissions2();
  init_slowOperations();
  init_v4();
  init_hooks5();
  init_PermissionUpdate();
  init_sessionState();
  init_slowOperations();
  init_stream9();
  init_ndjsonSafeStringify();
});
