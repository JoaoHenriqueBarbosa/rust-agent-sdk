// Original: src/remote/sdkMessageAdapter.ts
function convertAssistantMessage(msg) {
  return {
    type: "assistant",
    message: msg.message,
    uuid: msg.uuid,
    requestId: void 0,
    timestamp: (/* @__PURE__ */ new Date()).toISOString(),
    error: msg.error
  };
}
function convertStreamEvent(msg) {
  return {
    type: "stream_event",
    event: msg.event
  };
}
function convertResultMessage(msg) {
  let isError3 = msg.subtype !== "success";
  return {
    type: "system",
    subtype: "informational",
    content: isError3 ? msg.errors?.join(", ") || "Unknown error" : "Session completed successfully",
    level: isError3 ? "warning" : "info",
    uuid: msg.uuid,
    timestamp: (/* @__PURE__ */ new Date()).toISOString()
  };
}
function convertInitMessage(msg) {
  return {
    type: "system",
    subtype: "informational",
    content: `Remote session initialized (model: ${msg.model})`,
    level: "info",
    uuid: msg.uuid,
    timestamp: (/* @__PURE__ */ new Date()).toISOString()
  };
}
function convertStatusMessage(msg) {
  if (!msg.status)
    return null;
  return {
    type: "system",
    subtype: "informational",
    content: msg.status === "compacting" ? "Compacting conversation\u2026" : `Status: ${msg.status}`,
    level: "info",
    uuid: msg.uuid,
    timestamp: (/* @__PURE__ */ new Date()).toISOString()
  };
}
function convertToolProgressMessage(msg) {
  return {
    type: "system",
    subtype: "informational",
    content: `Tool ${msg.tool_name} running for ${msg.elapsed_time_seconds}s\u2026`,
    level: "info",
    uuid: msg.uuid,
    timestamp: (/* @__PURE__ */ new Date()).toISOString(),
    toolUseID: msg.tool_use_id
  };
}
function convertCompactBoundaryMessage(msg) {
  return {
    type: "system",
    subtype: "compact_boundary",
    content: "Conversation compacted",
    level: "info",
    uuid: msg.uuid,
    timestamp: (/* @__PURE__ */ new Date()).toISOString(),
    compactMetadata: fromSDKCompactMetadata(msg.compact_metadata)
  };
}
function convertSDKMessage(msg, opts) {
  switch (msg.type) {
    case "assistant":
      return { type: "message", message: convertAssistantMessage(msg) };
    case "user": {
      let content = msg.message?.content, isToolResult2 = Array.isArray(content) && content.some((b) => b.type === "tool_result");
      if (opts?.convertToolResults && isToolResult2)
        return {
          type: "message",
          message: createUserMessage({
            content,
            toolUseResult: msg.tool_use_result,
            uuid: msg.uuid,
            timestamp: msg.timestamp
          })
        };
      if (opts?.convertUserTextMessages && !isToolResult2) {
        if (typeof content === "string" || Array.isArray(content))
          return {
            type: "message",
            message: createUserMessage({
              content,
              toolUseResult: msg.tool_use_result,
              uuid: msg.uuid,
              timestamp: msg.timestamp
            })
          };
      }
      return { type: "ignored" };
    }
    case "stream_event":
      return { type: "stream_event", event: convertStreamEvent(msg) };
    case "result":
      if (msg.subtype !== "success")
        return { type: "message", message: convertResultMessage(msg) };
      return { type: "ignored" };
    case "system":
      if (msg.subtype === "init")
        return { type: "message", message: convertInitMessage(msg) };
      if (msg.subtype === "status") {
        let statusMsg = convertStatusMessage(msg);
        return statusMsg ? { type: "message", message: statusMsg } : { type: "ignored" };
      }
      if (msg.subtype === "compact_boundary")
        return {
          type: "message",
          message: convertCompactBoundaryMessage(msg)
        };
      return logForDebugging(`[sdkMessageAdapter] Ignoring system message subtype: ${msg.subtype}`), { type: "ignored" };
    case "tool_progress":
      return { type: "message", message: convertToolProgressMessage(msg) };
    case "auth_status":
      return logForDebugging("[sdkMessageAdapter] Ignoring auth_status message"), { type: "ignored" };
    case "tool_use_summary":
      return logForDebugging("[sdkMessageAdapter] Ignoring tool_use_summary message"), { type: "ignored" };
    case "rate_limit_event":
      return logForDebugging("[sdkMessageAdapter] Ignoring rate_limit_event message"), { type: "ignored" };
    default:
      return logForDebugging(`[sdkMessageAdapter] Unknown message type: ${msg.type}`), { type: "ignored" };
  }
}
function isSessionEndMessage(msg) {
  return msg.type === "result";
}
var init_sdkMessageAdapter = __esm(() => {
  init_debug();
  init_mappers();
  init_messages3();
});
