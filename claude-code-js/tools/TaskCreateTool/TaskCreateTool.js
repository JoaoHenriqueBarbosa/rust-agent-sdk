// Original: src/tools/TaskCreateTool/TaskCreateTool.ts
var inputSchema31, outputSchema25, TaskCreateTool;
var init_TaskCreateTool = __esm(() => {
  init_v4();
  init_Tool();
  init_hooks5();
  init_tasks();
  init_teammate();
  init_prompt16();
  inputSchema31 = lazySchema(() => exports_external.strictObject({
    subject: exports_external.string().describe("A brief title for the task"),
    description: exports_external.string().describe("What needs to be done"),
    activeForm: exports_external.string().optional().describe('Present continuous form shown in spinner when in_progress (e.g., "Running tests")'),
    metadata: exports_external.record(exports_external.string(), exports_external.unknown()).optional().describe("Arbitrary metadata to attach to the task")
  })), outputSchema25 = lazySchema(() => exports_external.object({
    task: exports_external.object({
      id: exports_external.string(),
      subject: exports_external.string()
    })
  })), TaskCreateTool = buildTool({
    name: TASK_CREATE_TOOL_NAME,
    searchHint: "create a task in the task list",
    maxResultSizeChars: 1e5,
    async description() {
      return DESCRIPTION14;
    },
    async prompt() {
      return getPrompt4();
    },
    get inputSchema() {
      return inputSchema31();
    },
    get outputSchema() {
      return outputSchema25();
    },
    userFacingName() {
      return "TaskCreate";
    },
    shouldDefer: !0,
    isEnabled() {
      return isTodoV2Enabled();
    },
    isConcurrencySafe() {
      return !0;
    },
    toAutoClassifierInput(input) {
      return input.subject;
    },
    renderToolUseMessage() {
      return null;
    },
    async call({ subject, description, activeForm, metadata }, context6) {
      let taskId = await createTask(getTaskListId(), {
        subject,
        description,
        activeForm,
        status: "pending",
        owner: void 0,
        blocks: [],
        blockedBy: [],
        metadata
      }), blockingErrors = [], generator = executeTaskCreatedHooks(taskId, subject, description, getAgentName(), getTeamName(), void 0, context6?.abortController?.signal, void 0, context6);
      for await (let result of generator)
        if (result.blockingError)
          blockingErrors.push(getTaskCreatedHookMessage(result.blockingError));
      if (blockingErrors.length > 0)
        throw await deleteTask(getTaskListId(), taskId), Error(blockingErrors.join(`
`));
      return context6.setAppState((prev) => {
        if (prev.expandedView === "tasks")
          return prev;
        return { ...prev, expandedView: "tasks" };
      }), {
        data: {
          task: {
            id: taskId,
            subject
          }
        }
      };
    },
    mapToolResultToToolResultBlockParam(content, toolUseID) {
      let { task } = content;
      return {
        tool_use_id: toolUseID,
        type: "tool_result",
        content: `Task #${task.id} created successfully: ${task.subject}`
      };
    }
  });
});
