// Original: src/tools/TodoWriteTool/TodoWriteTool.ts
var inputSchema9, outputSchema6, TodoWriteTool;
var init_TodoWriteTool = __esm(() => {
  init_v4();
  init_state();
  init_Tool();
  init_tasks();
  init_types19();
  init_constants3();
  inputSchema9 = lazySchema(() => exports_external.strictObject({
    todos: TodoListSchema().describe("The updated todo list")
  })), outputSchema6 = lazySchema(() => exports_external.object({
    oldTodos: TodoListSchema().describe("The todo list before the update"),
    newTodos: TodoListSchema().describe("The todo list after the update"),
    verificationNudgeNeeded: exports_external.boolean().optional()
  })), TodoWriteTool = buildTool({
    name: TODO_WRITE_TOOL_NAME,
    searchHint: "manage the session task checklist",
    maxResultSizeChars: 1e5,
    strict: !0,
    async description() {
      return DESCRIPTION10;
    },
    async prompt() {
      return PROMPT5;
    },
    get inputSchema() {
      return inputSchema9();
    },
    get outputSchema() {
      return outputSchema6();
    },
    userFacingName() {
      return "";
    },
    shouldDefer: !0,
    isEnabled() {
      return !isTodoV2Enabled();
    },
    toAutoClassifierInput(input) {
      return `${input.todos.length} items`;
    },
    async checkPermissions(input) {
      return { behavior: "allow", updatedInput: input };
    },
    renderToolUseMessage() {
      return null;
    },
    async call({ todos }, context6) {
      let appState = context6.getAppState(), todoKey = context6.agentId ?? getSessionId(), oldTodos = appState.todos[todoKey] ?? [], newTodos = todos.every((_) => _.status === "completed") ? [] : todos, verificationNudgeNeeded = !1;
      return context6.setAppState((prev) => ({
        ...prev,
        todos: {
          ...prev.todos,
          [todoKey]: newTodos
        }
      })), {
        data: {
          oldTodos,
          newTodos: todos,
          verificationNudgeNeeded: !1
        }
      };
    },
    mapToolResultToToolResultBlockParam({ verificationNudgeNeeded }, toolUseID) {
      let nudge = verificationNudgeNeeded ? `

NOTE: You just closed out 3+ tasks and none of them was a verification step. Before writing your final summary, spawn the verification agent (subagent_type="${VERIFICATION_AGENT_TYPE}"). You cannot self-assign PARTIAL by listing caveats in your summary \u2014 only the verifier issues a verdict.` : "";
      return {
        tool_use_id: toolUseID,
        type: "tool_result",
        content: "Todos have been modified successfully. Ensure that you continue to use the todo list to track your progress. Please proceed with the current tasks if applicable" + nudge
      };
    }
  });
});
