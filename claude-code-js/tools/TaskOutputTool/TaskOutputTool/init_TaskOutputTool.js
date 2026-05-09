// var: init_TaskOutputTool
var init_TaskOutputTool = __esm(() => {
  init_v4();
  init_FallbackToolUseErrorMessage();
  init_FallbackToolUseRejectedMessage();
  init_MessageResponse();
  init_ink2();
  init_useShortcutDisplay();
  init_Tool();
  init_errors();
  init_messages3();
  init_semanticBoolean();
  init_slowOperations();
  init_diskOutput();
  init_framework();
  init_outputFormatting();
  init_UI4();
  init_BashToolResultMessage();
  import_compiler_runtime119 = __toESM(require_react_compiler_runtime_development(), 1), jsx_dev_runtime141 = __toESM(require_react_jsx_dev_runtime_development(), 1), inputSchema20 = lazySchema(() => exports_external.strictObject({
    task_id: exports_external.string().describe("The task ID to get output from"),
    block: semanticBoolean(exports_external.boolean().default(!0)).describe("Whether to wait for completion"),
    timeout: exports_external.number().min(0).max(600000).default(30000).describe("Max wait time in ms")
  }));
  TaskOutputTool = buildTool({
    name: TASK_OUTPUT_TOOL_NAME,
    searchHint: "read output/logs from a background task",
    maxResultSizeChars: 1e5,
    shouldDefer: !0,
    aliases: ["AgentOutputTool", "BashOutputTool"],
    userFacingName() {
      return "Task Output";
    },
    get inputSchema() {
      return inputSchema20();
    },
    async description() {
      return "[Deprecated] \u2014 prefer Read on the task output file path";
    },
    isConcurrencySafe(_input) {
      return this.isReadOnly?.(_input) ?? !1;
    },
    isEnabled() {
      return !0;
    },
    isReadOnly(_input) {
      return !0;
    },
    toAutoClassifierInput(input) {
      return input.task_id;
    },
    async prompt() {
      return `DEPRECATED: Prefer using the Read tool on the task's output file path instead. Background tasks return their output file path in the tool result, and you receive a <task-notification> with the same path when the task completes \u2014 Read that file directly.

- Retrieves output from a running or completed task (background shell, agent, or remote session)
- Takes a task_id parameter identifying the task
- Returns the task output along with status information
- Use block=true (default) to wait for task completion
- Use block=false for non-blocking check of current status
- Task IDs can be found using the /tasks command
- Works with all task types: background shells, async agents, and remote sessions`;
    },
    async validateInput({
      task_id
    }, {
      getAppState
    }) {
      if (!task_id)
        return {
          result: !1,
          message: "Task ID is required",
          errorCode: 1
        };
      if (!getAppState().tasks?.[task_id])
        return {
          result: !1,
          message: `No task found with ID: ${task_id}`,
          errorCode: 2
        };
      return {
        result: !0
      };
    },
    async call(input, toolUseContext, _canUseTool, _parentMessage, onProgress) {
      let {
        task_id,
        block: block2,
        timeout
      } = input, task = toolUseContext.getAppState().tasks?.[task_id];
      if (!task)
        throw Error(`No task found with ID: ${task_id}`);
      if (!block2) {
        if (task.status !== "running" && task.status !== "pending")
          return updateTaskState(task_id, toolUseContext.setAppState, (t2) => ({
            ...t2,
            notified: !0
          })), {
            data: {
              retrieval_status: "success",
              task: await getTaskOutputData(task)
            }
          };
        return {
          data: {
            retrieval_status: "not_ready",
            task: await getTaskOutputData(task)
          }
        };
      }
      if (onProgress)
        onProgress({
          toolUseID: `task-output-waiting-${Date.now()}`,
          data: {
            type: "waiting_for_task",
            taskDescription: task.description,
            taskType: task.type
          }
        });
      let completedTask = await waitForTaskCompletion(task_id, toolUseContext.getAppState, timeout, toolUseContext.abortController);
      if (!completedTask)
        return {
          data: {
            retrieval_status: "timeout",
            task: null
          }
        };
      if (completedTask.status === "running" || completedTask.status === "pending")
        return {
          data: {
            retrieval_status: "timeout",
            task: await getTaskOutputData(completedTask)
          }
        };
      return updateTaskState(task_id, toolUseContext.setAppState, (t2) => ({
        ...t2,
        notified: !0
      })), {
        data: {
          retrieval_status: "success",
          task: await getTaskOutputData(completedTask)
        }
      };
    },
    mapToolResultToToolResultBlockParam(data, toolUseID) {
      let parts = [];
      if (parts.push(`<retrieval_status>${data.retrieval_status}</retrieval_status>`), data.task) {
        if (parts.push(`<task_id>${data.task.task_id}</task_id>`), parts.push(`<task_type>${data.task.task_type}</task_type>`), parts.push(`<status>${data.task.status}</status>`), data.task.exitCode !== void 0 && data.task.exitCode !== null)
          parts.push(`<exit_code>${data.task.exitCode}</exit_code>`);
        if (data.task.output?.trim()) {
          let {
            content
          } = formatTaskOutput(data.task.output, data.task.task_id);
          parts.push(`<output>
${content.trimEnd()}
</output>`);
        }
        if (data.task.error)
          parts.push(`<error>${data.task.error}</error>`);
      }
      return {
        tool_use_id: toolUseID,
        type: "tool_result",
        content: parts.join(`

`)
      };
    },
    renderToolUseMessage(input) {
      let {
        block: block2 = !0
      } = input;
      if (!block2)
        return "non-blocking";
      return "";
    },
    renderToolUseTag(input) {
      if (!input.task_id)
        return null;
      return /* @__PURE__ */ jsx_dev_runtime141.jsxDEV(ThemedText, {
        dimColor: !0,
        children: [
          " ",
          input.task_id
        ]
      }, void 0, !0, void 0, this);
    },
    renderToolUseProgressMessage(progressMessages) {
      let progressData = progressMessages[progressMessages.length - 1]?.data;
      return /* @__PURE__ */ jsx_dev_runtime141.jsxDEV(ThemedBox_default, {
        flexDirection: "column",
        children: [
          progressData?.taskDescription && /* @__PURE__ */ jsx_dev_runtime141.jsxDEV(ThemedText, {
            children: [
              "\xA0\xA0",
              progressData.taskDescription
            ]
          }, void 0, !0, void 0, this),
          /* @__PURE__ */ jsx_dev_runtime141.jsxDEV(ThemedText, {
            children: [
              "\xA0\xA0\xA0\xA0\xA0Waiting for task",
              " ",
              /* @__PURE__ */ jsx_dev_runtime141.jsxDEV(ThemedText, {
                dimColor: !0,
                children: "(esc to give additional instructions)"
              }, void 0, !1, void 0, this)
            ]
          }, void 0, !0, void 0, this)
        ]
      }, void 0, !0, void 0, this);
    },
    renderToolResultMessage(content, _, {
      verbose,
      theme
    }) {
      return /* @__PURE__ */ jsx_dev_runtime141.jsxDEV(TaskOutputResultDisplay, {
        content,
        verbose,
        theme
      }, void 0, !1, void 0, this);
    },
    renderToolUseRejectedMessage() {
      return /* @__PURE__ */ jsx_dev_runtime141.jsxDEV(FallbackToolUseRejectedMessage, {}, void 0, !1, void 0, this);
    },
    renderToolUseErrorMessage(result, {
      verbose
    }) {
      return /* @__PURE__ */ jsx_dev_runtime141.jsxDEV(FallbackToolUseErrorMessage, {
        result,
        verbose
      }, void 0, !1, void 0, this);
    }
  });
});
