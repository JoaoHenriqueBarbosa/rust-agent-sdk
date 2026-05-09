// function: normalizeAttachmentForAPI
function normalizeAttachmentForAPI(attachment) {
  if (isAgentSwarmsEnabled()) {
    if (attachment.type === "teammate_mailbox")
      return [
        createUserMessage({
          content: getTeammateMailbox().formatTeammateMessages(attachment.messages),
          isMeta: !0
        })
      ];
    if (attachment.type === "team_context")
      return [
        createUserMessage({
          content: `<system-reminder>
# Team Coordination

You are a teammate in team "${attachment.teamName}".

**Your Identity:**
- Name: ${attachment.agentName}

**Team Resources:**
- Team config: ${attachment.teamConfigPath}
- Task list: ${attachment.taskListPath}

**Team Leader:** The team lead's name is "team-lead". Send updates and completion notifications to them.

Read the team config to discover your teammates' names. Check the task list periodically. Create new tasks when work should be divided. Mark tasks resolved when complete.

**IMPORTANT:** Always refer to teammates by their NAME (e.g., "team-lead", "analyzer", "researcher"), never by UUID. When messaging, use the name directly:

\`\`\`json
{
  "to": "team-lead",
  "message": "Your message here",
  "summary": "Brief 5-10 word preview"
}
\`\`\`
</system-reminder>`,
          isMeta: !0
        })
      ];
  }
  switch (attachment.type) {
    case "directory":
      return wrapMessagesInSystemReminder([
        createToolUseMessage(BashTool.name, {
          command: `ls ${quote([attachment.path])}`,
          description: `Lists files in ${attachment.path}`
        }),
        createToolResultMessage(BashTool, {
          stdout: attachment.content,
          stderr: "",
          interrupted: !1
        })
      ]);
    case "edited_text_file":
      return wrapMessagesInSystemReminder([
        createUserMessage({
          content: `Note: ${attachment.filename} was modified, either by the user or by a linter. This change was intentional, so make sure to take it into account as you proceed (ie. don't revert it unless the user asks you to). Don't tell the user this, since they are already aware. Here are the relevant changes (shown with line numbers):
${attachment.snippet}`,
          isMeta: !0
        })
      ]);
    case "file": {
      let fileContent = attachment.content;
      switch (fileContent.type) {
        case "image":
          return wrapMessagesInSystemReminder([
            createToolUseMessage(FileReadTool.name, {
              file_path: attachment.filename
            }),
            createToolResultMessage(FileReadTool, fileContent)
          ]);
        case "text":
          return wrapMessagesInSystemReminder([
            createToolUseMessage(FileReadTool.name, {
              file_path: attachment.filename
            }),
            createToolResultMessage(FileReadTool, fileContent),
            ...attachment.truncated ? [
              createUserMessage({
                content: `Note: The file ${attachment.filename} was too large and has been truncated to the first ${MAX_LINES_TO_READ} lines. Don't tell the user about this truncation. Use ${FileReadTool.name} to read more of the file if you need.`,
                isMeta: !0
              })
            ] : []
          ]);
        case "notebook":
          return wrapMessagesInSystemReminder([
            createToolUseMessage(FileReadTool.name, {
              file_path: attachment.filename
            }),
            createToolResultMessage(FileReadTool, fileContent)
          ]);
        case "pdf":
          return wrapMessagesInSystemReminder([
            createToolUseMessage(FileReadTool.name, {
              file_path: attachment.filename
            }),
            createToolResultMessage(FileReadTool, fileContent)
          ]);
      }
      break;
    }
    case "compact_file_reference":
      return wrapMessagesInSystemReminder([
        createUserMessage({
          content: `Note: ${attachment.filename} was read before the last conversation was summarized, but the contents are too large to include. Use ${FileReadTool.name} tool if you need to access it.`,
          isMeta: !0
        })
      ]);
    case "pdf_reference":
      return wrapMessagesInSystemReminder([
        createUserMessage({
          content: `PDF file: ${attachment.filename} (${attachment.pageCount} pages, ${formatFileSize(attachment.fileSize)}). This PDF is too large to read all at once. You MUST use the ${FILE_READ_TOOL_NAME} tool with the pages parameter to read specific page ranges (e.g., pages: "1-5"). Do NOT call ${FILE_READ_TOOL_NAME} without the pages parameter or it will fail. Start by reading the first few pages to understand the structure, then read more as needed. Maximum 20 pages per request.`,
          isMeta: !0
        })
      ]);
    case "selected_lines_in_ide": {
      let content = attachment.content.length > 2000 ? attachment.content.substring(0, 2000) + `
... (truncated)` : attachment.content;
      return wrapMessagesInSystemReminder([
        createUserMessage({
          content: `The user selected the lines ${attachment.lineStart} to ${attachment.lineEnd} from ${attachment.filename}:
${content}

This may or may not be related to the current task.`,
          isMeta: !0
        })
      ]);
    }
    case "opened_file_in_ide":
      return wrapMessagesInSystemReminder([
        createUserMessage({
          content: `The user opened the file ${attachment.filename} in the IDE. This may or may not be related to the current task.`,
          isMeta: !0
        })
      ]);
    case "plan_file_reference":
      return wrapMessagesInSystemReminder([
        createUserMessage({
          content: `A plan file exists from plan mode at: ${attachment.planFilePath}

Plan contents:

${attachment.planContent}

If this plan is relevant to the current work and not already complete, continue working on it.`,
          isMeta: !0
        })
      ]);
    case "invoked_skills": {
      if (attachment.skills.length === 0)
        return [];
      let skillsContent = attachment.skills.map((skill) => `### Skill: ${skill.name}
Path: ${skill.path}

${skill.content}`).join(`

---

`);
      return wrapMessagesInSystemReminder([
        createUserMessage({
          content: `The following skills were invoked in this session. Continue to follow these guidelines:

${skillsContent}`,
          isMeta: !0
        })
      ]);
    }
    case "todo_reminder": {
      let todoItems = attachment.content.map((todo, index) => `${index + 1}. [${todo.status}] ${todo.content}`).join(`
`), message = `The TodoWrite tool hasn't been used recently. If you're working on tasks that would benefit from tracking progress, consider using the TodoWrite tool to track progress. Also consider cleaning up the todo list if has become stale and no longer matches what you are working on. Only use it if it's relevant to the current work. This is just a gentle reminder - ignore if not applicable. Make sure that you NEVER mention this reminder to the user
`;
      if (todoItems.length > 0)
        message += `

Here are the existing contents of your todo list:

[${todoItems}]`;
      return wrapMessagesInSystemReminder([
        createUserMessage({
          content: message,
          isMeta: !0
        })
      ]);
    }
    case "task_reminder": {
      if (!isTodoV2Enabled())
        return [];
      let taskItems = attachment.content.map((task) => `#${task.id}. [${task.status}] ${task.subject}`).join(`
`), message = `The task tools haven't been used recently. If you're working on tasks that would benefit from tracking progress, consider using ${TASK_CREATE_TOOL_NAME} to add new tasks and ${TASK_UPDATE_TOOL_NAME} to update task status (set to in_progress when starting, completed when done). Also consider cleaning up the task list if it has become stale. Only use these if relevant to the current work. This is just a gentle reminder - ignore if not applicable. Make sure that you NEVER mention this reminder to the user
`;
      if (taskItems.length > 0)
        message += `

Here are the existing tasks:

${taskItems}`;
      return wrapMessagesInSystemReminder([
        createUserMessage({
          content: message,
          isMeta: !0
        })
      ]);
    }
    case "nested_memory":
      return wrapMessagesInSystemReminder([
        createUserMessage({
          content: `Contents of ${attachment.content.path}:

${attachment.content.content}`,
          isMeta: !0
        })
      ]);
    case "relevant_memories":
      return wrapMessagesInSystemReminder(attachment.memories.map((m4) => {
        let header = m4.header ?? memoryHeader(m4.path, m4.mtimeMs);
        return createUserMessage({
          content: `${header}

${m4.content}`,
          isMeta: !0
        });
      }));
    case "dynamic_skill":
      return [];
    case "skill_listing": {
      if (!attachment.content)
        return [];
      return wrapMessagesInSystemReminder([
        createUserMessage({
          content: `The following skills are available for use with the Skill tool:

${attachment.content}`,
          isMeta: !0
        })
      ]);
    }
    case "queued_command": {
      let origin2 = attachment.origin ?? (attachment.commandMode === "task-notification" ? { kind: "task-notification" } : void 0), metaProp = origin2 !== void 0 || attachment.isMeta ? { isMeta: !0 } : {};
      if (Array.isArray(attachment.prompt)) {
        let textContent2 = attachment.prompt.filter((block2) => block2.type === "text").map((block2) => block2.text).join(`
`), imageBlocks = attachment.prompt.filter((block2) => block2.type === "image"), content = [
          {
            type: "text",
            text: wrapCommandText(textContent2, origin2)
          },
          ...imageBlocks
        ];
        return wrapMessagesInSystemReminder([
          createUserMessage({
            content,
            ...metaProp,
            origin: origin2,
            uuid: attachment.source_uuid
          })
        ]);
      }
      return wrapMessagesInSystemReminder([
        createUserMessage({
          content: wrapCommandText(String(attachment.prompt), origin2),
          ...metaProp,
          origin: origin2,
          uuid: attachment.source_uuid
        })
      ]);
    }
    case "output_style": {
      let outputStyle = OUTPUT_STYLE_CONFIG[attachment.style];
      if (!outputStyle)
        return [];
      return wrapMessagesInSystemReminder([
        createUserMessage({
          content: `${outputStyle.name} output style is active. Remember to follow the specific guidelines for this style.`,
          isMeta: !0
        })
      ]);
    }
    case "diagnostics": {
      if (attachment.files.length === 0)
        return [];
      let diagnosticSummary = DiagnosticTrackingService.formatDiagnosticsSummary(attachment.files);
      return wrapMessagesInSystemReminder([
        createUserMessage({
          content: `<new-diagnostics>The following new diagnostic issues were detected:

${diagnosticSummary}</new-diagnostics>`,
          isMeta: !0
        })
      ]);
    }
    case "plan_mode":
      return getPlanModeInstructions(attachment);
    case "plan_mode_reentry": {
      let content = `## Re-entering Plan Mode

You are returning to plan mode after having previously exited it. A plan file exists at ${attachment.planFilePath} from your previous planning session.

**Before proceeding with any new planning, you should:**
1. Read the existing plan file to understand what was previously planned
2. Evaluate the user's current request against that plan
3. Decide how to proceed:
   - **Different task**: If the user's request is for a different task\u2014even if it's similar or related\u2014start fresh by overwriting the existing plan
   - **Same task, continuing**: If this is explicitly a continuation or refinement of the exact same task, modify the existing plan while cleaning up outdated or irrelevant sections
4. Continue on with the plan process and most importantly you should always edit the plan file one way or the other before calling ${ExitPlanModeV2Tool.name}

Treat this as a fresh planning session. Do not assume the existing plan is relevant without evaluating it first.`;
      return wrapMessagesInSystemReminder([
        createUserMessage({ content, isMeta: !0 })
      ]);
    }
    case "plan_mode_exit": {
      let content = `## Exited Plan Mode

You have exited plan mode. You can now make edits, run tools, and take actions.${attachment.planExists ? ` The plan file is located at ${attachment.planFilePath} if you need to reference it.` : ""}`;
      return wrapMessagesInSystemReminder([
        createUserMessage({ content, isMeta: !0 })
      ]);
    }
    case "auto_mode":
      return getAutoModeInstructions(attachment);
    case "auto_mode_exit":
      return wrapMessagesInSystemReminder([
        createUserMessage({ content: `## Exited Auto Mode

You have exited auto mode. The user may now want to interact more directly. You should ask clarifying questions when the approach is ambiguous rather than making assumptions.`, isMeta: !0 })
      ]);
    case "critical_system_reminder":
      return wrapMessagesInSystemReminder([
        createUserMessage({ content: attachment.content, isMeta: !0 })
      ]);
    case "mcp_resource": {
      let content = attachment.content;
      if (!content || !content.contents || content.contents.length === 0)
        return wrapMessagesInSystemReminder([
          createUserMessage({
            content: `<mcp-resource server="${attachment.server}" uri="${attachment.uri}">(No content)</mcp-resource>`,
            isMeta: !0
          })
        ]);
      let transformedBlocks = [];
      for (let item of content.contents)
        if (item && typeof item === "object") {
          if ("text" in item && typeof item.text === "string")
            transformedBlocks.push({
              type: "text",
              text: "Full contents of resource:"
            }, {
              type: "text",
              text: item.text
            }, {
              type: "text",
              text: "Do NOT read this resource again unless you think it may have changed, since you already have the full contents."
            });
          else if ("blob" in item) {
            let mimeType = "mimeType" in item ? String(item.mimeType) : "application/octet-stream";
            transformedBlocks.push({
              type: "text",
              text: `[Binary content: ${mimeType}]`
            });
          }
        }
      if (transformedBlocks.length > 0)
        return wrapMessagesInSystemReminder([
          createUserMessage({
            content: transformedBlocks,
            isMeta: !0
          })
        ]);
      else
        return logMCPDebug(attachment.server, `No displayable content found in MCP resource ${attachment.uri}.`), wrapMessagesInSystemReminder([
          createUserMessage({
            content: `<mcp-resource server="${attachment.server}" uri="${attachment.uri}">(No displayable content)</mcp-resource>`,
            isMeta: !0
          })
        ]);
    }
    case "agent_mention":
      return wrapMessagesInSystemReminder([
        createUserMessage({
          content: `The user has expressed a desire to invoke the agent "${attachment.agentType}". Please invoke the agent appropriately, passing in the required context to it. `,
          isMeta: !0
        })
      ]);
    case "task_status": {
      let displayStatus = attachment.status === "killed" ? "stopped" : attachment.status;
      if (attachment.status === "killed")
        return [
          createUserMessage({
            content: wrapInSystemReminder(`Task "${attachment.description}" (${attachment.taskId}) was stopped by the user.`),
            isMeta: !0
          })
        ];
      if (attachment.status === "running") {
        let parts = [
          `Background agent "${attachment.description}" (${attachment.taskId}) is still running.`
        ];
        if (attachment.deltaSummary)
          parts.push(`Progress: ${attachment.deltaSummary}`);
        if (attachment.outputFilePath)
          parts.push(`Do NOT spawn a duplicate. You will be notified when it completes. You can read partial output at ${attachment.outputFilePath} or send it a message with ${SEND_MESSAGE_TOOL_NAME}.`);
        else
          parts.push(`Do NOT spawn a duplicate. You will be notified when it completes. You can check its progress with the ${TASK_OUTPUT_TOOL_NAME} tool or send it a message with ${SEND_MESSAGE_TOOL_NAME}.`);
        return [
          createUserMessage({
            content: wrapInSystemReminder(parts.join(" ")),
            isMeta: !0
          })
        ];
      }
      let messageParts = [
        `Task ${attachment.taskId}`,
        `(type: ${attachment.taskType})`,
        `(status: ${displayStatus})`,
        `(description: ${attachment.description})`
      ];
      if (attachment.deltaSummary)
        messageParts.push(`Delta: ${attachment.deltaSummary}`);
      if (attachment.outputFilePath)
        messageParts.push(`Read the output file to retrieve the result: ${attachment.outputFilePath}`);
      else
        messageParts.push(`You can check its output using the ${TASK_OUTPUT_TOOL_NAME} tool.`);
      return [
        createUserMessage({
          content: wrapInSystemReminder(messageParts.join(" ")),
          isMeta: !0
        })
      ];
    }
    case "async_hook_response": {
      let response7 = attachment.response, messages = [];
      if (response7.systemMessage)
        messages.push(createUserMessage({
          content: response7.systemMessage,
          isMeta: !0
        }));
      if (response7.hookSpecificOutput && "additionalContext" in response7.hookSpecificOutput && response7.hookSpecificOutput.additionalContext)
        messages.push(createUserMessage({
          content: response7.hookSpecificOutput.additionalContext,
          isMeta: !0
        }));
      return wrapMessagesInSystemReminder(messages);
    }
    case "token_usage":
      return [
        createUserMessage({
          content: wrapInSystemReminder(`Token usage: ${attachment.used}/${attachment.total}; ${attachment.remaining} remaining`),
          isMeta: !0
        })
      ];
    case "budget_usd":
      return [
        createUserMessage({
          content: wrapInSystemReminder(`USD budget: $${attachment.used}/$${attachment.total}; $${attachment.remaining} remaining`),
          isMeta: !0
        })
      ];
    case "output_token_usage": {
      let turnText = attachment.budget !== null ? `${formatNumber(attachment.turn)} / ${formatNumber(attachment.budget)}` : formatNumber(attachment.turn);
      return [
        createUserMessage({
          content: wrapInSystemReminder(`Output tokens \u2014 turn: ${turnText} \xB7 session: ${formatNumber(attachment.session)}`),
          isMeta: !0
        })
      ];
    }
    case "hook_blocking_error":
      return [
        createUserMessage({
          content: wrapInSystemReminder(`${attachment.hookName} hook blocking error from command: "${attachment.blockingError.command}": ${attachment.blockingError.blockingError}`),
          isMeta: !0
        })
      ];
    case "hook_success":
      if (attachment.hookEvent !== "SessionStart" && attachment.hookEvent !== "UserPromptSubmit")
        return [];
      if (attachment.content === "")
        return [];
      return [
        createUserMessage({
          content: wrapInSystemReminder(`${attachment.hookName} hook success: ${attachment.content}`),
          isMeta: !0
        })
      ];
    case "hook_additional_context": {
      if (attachment.content.length === 0)
        return [];
      return [
        createUserMessage({
          content: wrapInSystemReminder(`${attachment.hookName} hook additional context: ${attachment.content.join(`
`)}`),
          isMeta: !0
        })
      ];
    }
    case "hook_stopped_continuation":
      return [
        createUserMessage({
          content: wrapInSystemReminder(`${attachment.hookName} hook stopped continuation: ${attachment.message}`),
          isMeta: !0
        })
      ];
    case "compaction_reminder":
      return wrapMessagesInSystemReminder([
        createUserMessage({
          content: "Auto-compact is enabled. When the context window is nearly full, older messages will be automatically summarized so you can continue working seamlessly. There is no need to stop or rush \u2014 you have unlimited context through automatic compaction.",
          isMeta: !0
        })
      ]);
    case "context_efficiency":
      return [];
    case "date_change":
      return wrapMessagesInSystemReminder([
        createUserMessage({
          content: `The date has changed. Today's date is now ${attachment.newDate}. DO NOT mention this to the user explicitly because they are already aware.`,
          isMeta: !0
        })
      ]);
    case "ultrathink_effort":
      return wrapMessagesInSystemReminder([
        createUserMessage({
          content: `The user has requested reasoning effort level: ${attachment.level}. Apply this to the current turn.`,
          isMeta: !0
        })
      ]);
    case "deferred_tools_delta": {
      let parts = [];
      if (attachment.addedLines.length > 0)
        parts.push(`The following deferred tools are now available via ToolSearch:
${attachment.addedLines.join(`
`)}`);
      if (attachment.removedNames.length > 0)
        parts.push(`The following deferred tools are no longer available (their MCP server disconnected). Do not search for them \u2014 ToolSearch will return no match:
${attachment.removedNames.join(`
`)}`);
      return wrapMessagesInSystemReminder([
        createUserMessage({ content: parts.join(`

`), isMeta: !0 })
      ]);
    }
    case "agent_listing_delta": {
      let parts = [];
      if (attachment.addedLines.length > 0) {
        let header = attachment.isInitial ? "Available agent types for the Agent tool:" : "New agent types are now available for the Agent tool:";
        parts.push(`${header}
${attachment.addedLines.join(`
`)}`);
      }
      if (attachment.removedTypes.length > 0)
        parts.push(`The following agent types are no longer available:
${attachment.removedTypes.map((t2) => `- ${t2}`).join(`
`)}`);
      if (attachment.isInitial && attachment.showConcurrencyNote)
        parts.push("Launch multiple agents concurrently whenever possible, to maximize performance; to do that, use a single message with multiple tool uses.");
      return wrapMessagesInSystemReminder([
        createUserMessage({ content: parts.join(`

`), isMeta: !0 })
      ]);
    }
    case "mcp_instructions_delta": {
      let parts = [];
      if (attachment.addedBlocks.length > 0)
        parts.push(`# MCP Server Instructions

The following MCP servers have provided instructions for how to use their tools and resources:

${attachment.addedBlocks.join(`

`)}`);
      if (attachment.removedNames.length > 0)
        parts.push(`The following MCP servers have disconnected. Their instructions above no longer apply:
${attachment.removedNames.join(`
`)}`);
      return wrapMessagesInSystemReminder([
        createUserMessage({ content: parts.join(`

`), isMeta: !0 })
      ]);
    }
    case "companion_intro":
      return [];
    case "verify_plan_reminder": {
      let content = `You have completed implementing the plan. Please call the "${process.env.CLAUDE_CODE_VERIFY_PLAN === "true" ? "VerifyPlanExecution" : ""}" tool directly (NOT the ${AGENT_TOOL_NAME} tool or an agent) to verify that all plan items were completed correctly.`;
      return wrapMessagesInSystemReminder([
        createUserMessage({ content, isMeta: !0 })
      ]);
    }
    case "already_read_file":
    case "command_permissions":
    case "edited_image_file":
    case "hook_cancelled":
    case "hook_error_during_execution":
    case "hook_non_blocking_error":
    case "hook_system_message":
    case "structured_output":
    case "hook_permission_decision":
      return [];
  }
  if ([
    "autocheckpointing",
    "background_task_status",
    "todo",
    "task_progress",
    "ultramemory"
  ].includes(attachment.type))
    return [];
  return logAntError("normalizeAttachmentForAPI", Error(`Unknown attachment type: ${attachment.type}`)), [];
}
