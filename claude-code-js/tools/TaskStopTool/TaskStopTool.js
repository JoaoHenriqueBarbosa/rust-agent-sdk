// Original: src/tools/TaskStopTool/TaskStopTool.ts
var inputSchema18, outputSchema15, TaskStopTool;
var init_TaskStopTool = __esm(() => {
  init_v4();
  init_Tool();
  init_stopTask();
  init_slowOperations();
  init_UI14();
  inputSchema18 = lazySchema(() => exports_external.strictObject({
    task_id: exports_external.string().optional().describe("The ID of the background task to stop"),
    shell_id: exports_external.string().optional().describe("Deprecated: use task_id instead")
  })), outputSchema15 = lazySchema(() => exports_external.object({
    message: exports_external.string().describe("Status message about the operation"),
    task_id: exports_external.string().describe("The ID of the task that was stopped"),
    task_type: exports_external.string().describe("The type of the task that was stopped"),
    command: exports_external.string().optional().describe("The command or description of the stopped task")
  })), TaskStopTool = buildTool({
    name: TASK_STOP_TOOL_NAME,
    searchHint: "kill a running background task",
    aliases: ["KillShell"],
    maxResultSizeChars: 1e5,
    userFacingName: () => "Stop Task",
    get inputSchema() {
      return inputSchema18();
    },
    get outputSchema() {
      return outputSchema15();
    },
    shouldDefer: !0,
    isConcurrencySafe() {
      return !0;
    },
    toAutoClassifierInput(input) {
      return input.task_id ?? input.shell_id ?? "";
    },
    async validateInput({ task_id, shell_id }, { getAppState }) {
      let id = task_id ?? shell_id;
      if (!id)
        return {
          result: !1,
          message: "Missing required parameter: task_id",
          errorCode: 1
        };
      let task = getAppState().tasks?.[id];
      if (!task)
        return {
          result: !1,
          message: `No task found with ID: ${id}`,
          errorCode: 1
        };
      if (task.status !== "running")
        return {
          result: !1,
          message: `Task ${id} is not running (status: ${task.status})`,
          errorCode: 3
        };
      return { result: !0 };
    },
    async description() {
      return "Stop a running background task by ID";
    },
    async prompt() {
      return DESCRIPTION;
    },
    mapToolResultToToolResultBlockParam(output, toolUseID) {
      return {
        tool_use_id: toolUseID,
        type: "tool_result",
        content: jsonStringify(output)
      };
    },
    renderToolUseMessage: renderToolUseMessage15,
    renderToolResultMessage: renderToolResultMessage14,
    async call({ task_id, shell_id }, { getAppState, setAppState, abortController }) {
      let id = task_id ?? shell_id;
      if (!id)
        throw Error("Missing required parameter: task_id");
      let result = await stopTask(id, {
        getAppState,
        setAppState
      });
      return {
        data: {
          message: `Successfully stopped task: ${result.taskId} (${result.command})`,
          task_id: result.taskId,
          task_type: result.taskType,
          command: result.command
        }
      };
    }
  });
});
