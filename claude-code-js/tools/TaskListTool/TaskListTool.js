// Original: src/tools/TaskListTool/TaskListTool.ts
var inputSchema34, outputSchema28, TaskListTool;
var init_TaskListTool = __esm(() => {
  init_v4();
  init_Tool();
  init_tasks();
  init_prompt17();
  inputSchema34 = lazySchema(() => exports_external.strictObject({})), outputSchema28 = lazySchema(() => exports_external.object({
    tasks: exports_external.array(exports_external.object({
      id: exports_external.string(),
      subject: exports_external.string(),
      status: TaskStatusSchema2(),
      owner: exports_external.string().optional(),
      blockedBy: exports_external.array(exports_external.string())
    }))
  })), TaskListTool = buildTool({
    name: TASK_LIST_TOOL_NAME,
    searchHint: "list all tasks",
    maxResultSizeChars: 1e5,
    async description() {
      return DESCRIPTION17;
    },
    async prompt() {
      return getPrompt5();
    },
    get inputSchema() {
      return inputSchema34();
    },
    get outputSchema() {
      return outputSchema28();
    },
    userFacingName() {
      return "TaskList";
    },
    shouldDefer: !0,
    isEnabled() {
      return isTodoV2Enabled();
    },
    isConcurrencySafe() {
      return !0;
    },
    isReadOnly() {
      return !0;
    },
    renderToolUseMessage() {
      return null;
    },
    async call() {
      let taskListId = getTaskListId(), allTasks = (await listTasks(taskListId)).filter((t2) => !t2.metadata?._internal), resolvedTaskIds = new Set(allTasks.filter((t2) => t2.status === "completed").map((t2) => t2.id));
      return {
        data: {
          tasks: allTasks.map((task) => ({
            id: task.id,
            subject: task.subject,
            status: task.status,
            owner: task.owner,
            blockedBy: task.blockedBy.filter((id) => !resolvedTaskIds.has(id))
          }))
        }
      };
    },
    mapToolResultToToolResultBlockParam(content, toolUseID) {
      let { tasks } = content;
      if (tasks.length === 0)
        return {
          tool_use_id: toolUseID,
          type: "tool_result",
          content: "No tasks found"
        };
      let lines2 = tasks.map((task) => {
        let owner = task.owner ? ` (${task.owner})` : "", blocked = task.blockedBy.length > 0 ? ` [blocked by ${task.blockedBy.map((id) => `#${id}`).join(", ")}]` : "";
        return `#${task.id} [${task.status}] ${task.subject}${owner}${blocked}`;
      });
      return {
        tool_use_id: toolUseID,
        type: "tool_result",
        content: lines2.join(`
`)
      };
    }
  });
});
