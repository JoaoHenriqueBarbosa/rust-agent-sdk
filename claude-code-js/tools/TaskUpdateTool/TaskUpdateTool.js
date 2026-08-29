// Original: src/tools/TaskUpdateTool/TaskUpdateTool.ts
var inputSchema33, outputSchema27, TaskUpdateTool;
var init_TaskUpdateTool = __esm(() => {
  init_v4();
  init_Tool();
  init_agentSwarmsEnabled();
  init_hooks5();
  init_tasks();
  init_teammate();
  init_teammateMailbox();
  init_constants3();
  inputSchema33 = lazySchema(() => {
    let TaskUpdateStatusSchema = TaskStatusSchema2().or(exports_external.literal("deleted"));
    return exports_external.strictObject({
      taskId: exports_external.string().describe("The ID of the task to update"),
      subject: exports_external.string().optional().describe("New subject for the task"),
      description: exports_external.string().optional().describe("New description for the task"),
      activeForm: exports_external.string().optional().describe('Present continuous form shown in spinner when in_progress (e.g., "Running tests")'),
      status: TaskUpdateStatusSchema.optional().describe("New status for the task"),
      addBlocks: exports_external.array(exports_external.string()).optional().describe("Task IDs that this task blocks"),
      addBlockedBy: exports_external.array(exports_external.string()).optional().describe("Task IDs that block this task"),
      owner: exports_external.string().optional().describe("New owner for the task"),
      metadata: exports_external.record(exports_external.string(), exports_external.unknown()).optional().describe("Metadata keys to merge into the task. Set a key to null to delete it.")
    });
  }), outputSchema27 = lazySchema(() => exports_external.object({
    success: exports_external.boolean(),
    taskId: exports_external.string(),
    updatedFields: exports_external.array(exports_external.string()),
    error: exports_external.string().optional(),
    statusChange: exports_external.object({
      from: exports_external.string(),
      to: exports_external.string()
    }).optional(),
    verificationNudgeNeeded: exports_external.boolean().optional()
  })), TaskUpdateTool = buildTool({
    name: TASK_UPDATE_TOOL_NAME,
    searchHint: "update a task",
    maxResultSizeChars: 1e5,
    async description() {
      return DESCRIPTION16;
    },
    async prompt() {
      return PROMPT8;
    },
    get inputSchema() {
      return inputSchema33();
    },
    get outputSchema() {
      return outputSchema27();
    },
    userFacingName() {
      return "TaskUpdate";
    },
    shouldDefer: !0,
    isEnabled() {
      return isTodoV2Enabled();
    },
    isConcurrencySafe() {
      return !0;
    },
    toAutoClassifierInput(input) {
      let parts = [input.taskId];
      if (input.status)
        parts.push(input.status);
      if (input.subject)
        parts.push(input.subject);
      return parts.join(" ");
    },
    renderToolUseMessage() {
      return null;
    },
    async call({
      taskId,
      subject,
      description,
      activeForm,
      status,
      owner,
      addBlocks,
      addBlockedBy,
      metadata
    }, context6) {
      let taskListId = getTaskListId();
      context6.setAppState((prev) => {
        if (prev.expandedView === "tasks")
          return prev;
        return { ...prev, expandedView: "tasks" };
      });
      let existingTask = await getTask(taskListId, taskId);
      if (!existingTask)
        return {
          data: {
            success: !1,
            taskId,
            updatedFields: [],
            error: "Task not found"
          }
        };
      let updatedFields = [], updates = {};
      if (subject !== void 0 && subject !== existingTask.subject)
        updates.subject = subject, updatedFields.push("subject");
      if (description !== void 0 && description !== existingTask.description)
        updates.description = description, updatedFields.push("description");
      if (activeForm !== void 0 && activeForm !== existingTask.activeForm)
        updates.activeForm = activeForm, updatedFields.push("activeForm");
      if (owner !== void 0 && owner !== existingTask.owner)
        updates.owner = owner, updatedFields.push("owner");
      if (isAgentSwarmsEnabled() && status === "in_progress" && owner === void 0 && !existingTask.owner) {
        let agentName = getAgentName();
        if (agentName)
          updates.owner = agentName, updatedFields.push("owner");
      }
      if (metadata !== void 0) {
        let merged = { ...existingTask.metadata ?? {} };
        for (let [key3, value] of Object.entries(metadata))
          if (value === null)
            delete merged[key3];
          else
            merged[key3] = value;
        updates.metadata = merged, updatedFields.push("metadata");
      }
      if (status !== void 0) {
        if (status === "deleted") {
          let deleted = await deleteTask(taskListId, taskId);
          return {
            data: {
              success: deleted,
              taskId,
              updatedFields: deleted ? ["deleted"] : [],
              error: deleted ? void 0 : "Failed to delete task",
              statusChange: deleted ? { from: existingTask.status, to: "deleted" } : void 0
            }
          };
        }
        if (status !== existingTask.status) {
          if (status === "completed") {
            let blockingErrors = [], generator = executeTaskCompletedHooks(taskId, existingTask.subject, existingTask.description, getAgentName(), getTeamName(), void 0, context6?.abortController?.signal, void 0, context6);
            for await (let result of generator)
              if (result.blockingError)
                blockingErrors.push(getTaskCompletedHookMessage(result.blockingError));
            if (blockingErrors.length > 0)
              return {
                data: {
                  success: !1,
                  taskId,
                  updatedFields: [],
                  error: blockingErrors.join(`
`)
                }
              };
          }
          updates.status = status, updatedFields.push("status");
        }
      }
      if (Object.keys(updates).length > 0)
        await updateTask(taskListId, taskId, updates);
      if (updates.owner && isAgentSwarmsEnabled()) {
        let senderName = getAgentName() || "team-lead", senderColor = getTeammateColor(), assignmentMessage = JSON.stringify({
          type: "task_assignment",
          taskId,
          subject: existingTask.subject,
          description: existingTask.description,
          assignedBy: senderName,
          timestamp: (/* @__PURE__ */ new Date()).toISOString()
        });
        await writeToMailbox(updates.owner, {
          from: senderName,
          text: assignmentMessage,
          timestamp: (/* @__PURE__ */ new Date()).toISOString(),
          color: senderColor
        }, taskListId);
      }
      if (addBlocks && addBlocks.length > 0) {
        let newBlocks = addBlocks.filter((id) => !existingTask.blocks.includes(id));
        for (let blockId of newBlocks)
          await blockTask(taskListId, taskId, blockId);
        if (newBlocks.length > 0)
          updatedFields.push("blocks");
      }
      if (addBlockedBy && addBlockedBy.length > 0) {
        let newBlockedBy = addBlockedBy.filter((id) => !existingTask.blockedBy.includes(id));
        for (let blockerId of newBlockedBy)
          await blockTask(taskListId, blockerId, taskId);
        if (newBlockedBy.length > 0)
          updatedFields.push("blockedBy");
      }
      let verificationNudgeNeeded = !1;
      return {
        data: {
          success: !0,
          taskId,
          updatedFields,
          statusChange: updates.status !== void 0 ? { from: existingTask.status, to: updates.status } : void 0,
          verificationNudgeNeeded
        }
      };
    },
    mapToolResultToToolResultBlockParam(content, toolUseID) {
      let {
        success: success2,
        taskId,
        updatedFields,
        error: error44,
        statusChange,
        verificationNudgeNeeded
      } = content;
      if (!success2)
        return {
          tool_use_id: toolUseID,
          type: "tool_result",
          content: error44 || `Task #${taskId} not found`
        };
      let resultContent = `Updated task #${taskId} ${updatedFields.join(", ")}`;
      if (statusChange?.to === "completed" && getAgentId() && isAgentSwarmsEnabled())
        resultContent += `

Task completed. Call TaskList now to find your next available task or see if your work unblocked others.`;
      if (verificationNudgeNeeded)
        resultContent += `

NOTE: You just closed out 3+ tasks and none of them was a verification step. Before writing your final summary, spawn the verification agent (subagent_type="${VERIFICATION_AGENT_TYPE}"). You cannot self-assign PARTIAL by listing caveats in your summary \u2014 only the verifier issues a verdict.`;
      return {
        tool_use_id: toolUseID,
        type: "tool_result",
        content: resultContent
      };
    }
  });
});
