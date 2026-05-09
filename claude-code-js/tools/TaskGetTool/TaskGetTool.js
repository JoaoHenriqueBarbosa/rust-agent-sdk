// Original: src/tools/TaskGetTool/TaskGetTool.ts
var inputSchema32, outputSchema26, TaskGetTool;
var init_TaskGetTool = __esm(() => {
  init_v4();
  init_Tool();
  init_tasks();
  inputSchema32 = lazySchema(() => exports_external.strictObject({
    taskId: exports_external.string().describe("The ID of the task to retrieve")
  })), outputSchema26 = lazySchema(() => exports_external.object({
    task: exports_external.object({
      id: exports_external.string(),
      subject: exports_external.string(),
      description: exports_external.string(),
      status: TaskStatusSchema2(),
      blocks: exports_external.array(exports_external.string()),
      blockedBy: exports_external.array(exports_external.string())
    }).nullable()
  })), TaskGetTool = buildTool({
    name: TASK_GET_TOOL_NAME,
    searchHint: "retrieve a task by ID",
    maxResultSizeChars: 1e5,
    async description() {
      return DESCRIPTION15;
    },
    async prompt() {
      return PROMPT7;
    },
    get inputSchema() {
      return inputSchema32();
    },
    get outputSchema() {
      return outputSchema26();
    },
    userFacingName() {
      return "TaskGet";
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
    toAutoClassifierInput(input) {
      return input.taskId;
    },
    renderToolUseMessage() {
      return null;
    },
    async call({ taskId }) {
      let taskListId = getTaskListId(), task = await getTask(taskListId, taskId);
      if (!task)
        return {
          data: {
            task: null
          }
        };
      return {
        data: {
          task: {
            id: task.id,
            subject: task.subject,
            description: task.description,
            status: task.status,
            blocks: task.blocks,
            blockedBy: task.blockedBy
          }
        }
      };
    },
    mapToolResultToToolResultBlockParam(content, toolUseID) {
      let { task } = content;
      if (!task)
        return {
          tool_use_id: toolUseID,
          type: "tool_result",
          content: "Task not found"
        };
      let lines2 = [
        `Task #${task.id}: ${task.subject}`,
        `Status: ${task.status}`,
        `Description: ${task.description}`
      ];
      if (task.blockedBy.length > 0)
        lines2.push(`Blocked by: ${task.blockedBy.map((id) => `#${id}`).join(", ")}`);
      if (task.blocks.length > 0)
        lines2.push(`Blocks: ${task.blocks.map((id) => `#${id}`).join(", ")}`);
      return {
        tool_use_id: toolUseID,
        type: "tool_result",
        content: lines2.join(`
`)
      };
    }
  });
});
