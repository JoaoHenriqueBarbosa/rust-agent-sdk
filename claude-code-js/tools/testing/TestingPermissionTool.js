// Original: src/tools/testing/TestingPermissionTool.tsx
var NAME = "TestingPermission", inputSchema23, TestingPermissionTool;
var init_TestingPermissionTool = __esm(() => {
  init_v4();
  init_Tool();
  inputSchema23 = lazySchema(() => exports_external.strictObject({})), TestingPermissionTool = buildTool({
    name: NAME,
    maxResultSizeChars: 1e5,
    async description() {
      return "Test tool that always asks for permission";
    },
    async prompt() {
      return "Test tool that always asks for permission before executing. Used for end-to-end testing.";
    },
    get inputSchema() {
      return inputSchema23();
    },
    userFacingName() {
      return "TestingPermission";
    },
    isEnabled() {
      return !1;
    },
    isConcurrencySafe() {
      return !0;
    },
    isReadOnly() {
      return !0;
    },
    async checkPermissions() {
      return {
        behavior: "ask",
        message: "Run test?"
      };
    },
    renderToolUseMessage() {
      return null;
    },
    renderToolUseProgressMessage() {
      return null;
    },
    renderToolUseQueuedMessage() {
      return null;
    },
    renderToolUseRejectedMessage() {
      return null;
    },
    renderToolResultMessage() {
      return null;
    },
    renderToolUseErrorMessage() {
      return null;
    },
    async call() {
      return {
        data: `${NAME} executed successfully`
      };
    },
    mapToolResultToToolResultBlockParam(result, toolUseID) {
      return {
        type: "tool_result",
        content: String(result),
        tool_use_id: toolUseID
      };
    }
  });
});
