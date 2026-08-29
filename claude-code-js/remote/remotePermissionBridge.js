// Original: src/remote/remotePermissionBridge.ts
import { randomUUID as randomUUID35 } from "crypto";
function createSyntheticAssistantMessage(request2, requestId) {
  return {
    type: "assistant",
    uuid: randomUUID35(),
    message: {
      id: `remote-${requestId}`,
      type: "message",
      role: "assistant",
      content: [
        {
          type: "tool_use",
          id: request2.tool_use_id,
          name: request2.tool_name,
          input: request2.input
        }
      ],
      model: "",
      stop_reason: null,
      stop_sequence: null,
      container: null,
      context_management: null,
      usage: {
        input_tokens: 0,
        output_tokens: 0,
        cache_creation_input_tokens: 0,
        cache_read_input_tokens: 0
      }
    },
    requestId: void 0,
    timestamp: (/* @__PURE__ */ new Date()).toISOString()
  };
}
function createToolStub(toolName) {
  return {
    name: toolName,
    inputSchema: {},
    isEnabled: () => !0,
    userFacingName: () => toolName,
    renderToolUseMessage: (input) => {
      let entries2 = Object.entries(input);
      if (entries2.length === 0)
        return "";
      return entries2.slice(0, 3).map(([key3, value]) => {
        let valueStr = typeof value === "string" ? value : jsonStringify(value);
        return `${key3}: ${valueStr}`;
      }).join(", ");
    },
    call: async () => ({ data: "" }),
    description: async () => "",
    prompt: () => "",
    isReadOnly: () => !1,
    isMcp: !1,
    needsPermissions: () => !0
  };
}
var init_remotePermissionBridge = __esm(() => {
  init_slowOperations();
});
