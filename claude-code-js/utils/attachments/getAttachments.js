// function: getAttachments
async function getAttachments(input, toolUseContext, ideSelection, queuedCommands, messages, querySource, options2) {
  if (isEnvTruthy(process.env.CLAUDE_CODE_DISABLE_ATTACHMENTS) || isEnvTruthy(process.env.CLAUDE_CODE_SIMPLE))
    return getQueuedCommandAttachments(queuedCommands);
  let abortController = createAbortController(), timeoutId = setTimeout((ac) => ac.abort(), 1000, abortController), context6 = { ...toolUseContext, abortController }, isMainThread = !toolUseContext.agentId, userInputAttachments = input ? [
    maybe("at_mentioned_files", () => processAtMentionedFiles(input, context6)),
    maybe("mcp_resources", () => processMcpResourceAttachments(input, context6)),
    maybe("agent_mentions", () => Promise.resolve(processAgentMentions(input, toolUseContext.options.agentDefinitions.activeAgents))),
    ...[]
  ] : [], userAttachmentResults = await Promise.all(userInputAttachments), allThreadAttachments = [
    maybe("queued_commands", () => getQueuedCommandAttachments(queuedCommands)),
    maybe("date_change", () => Promise.resolve(getDateChangeAttachments(messages))),
    maybe("ultrathink_effort", () => Promise.resolve(getUltrathinkEffortAttachment(input))),
    maybe("deferred_tools_delta", () => Promise.resolve(getDeferredToolsDeltaAttachment(toolUseContext.options.tools, toolUseContext.options.mainLoopModel, messages, {
      callSite: isMainThread ? "attachments_main" : "attachments_subagent",
      querySource
    }))),
    maybe("agent_listing_delta", () => Promise.resolve(getAgentListingDeltaAttachment(toolUseContext, messages))),
    maybe("mcp_instructions_delta", () => Promise.resolve(getMcpInstructionsDeltaAttachment(toolUseContext.options.mcpClients, toolUseContext.options.tools, toolUseContext.options.mainLoopModel, messages))),
    maybe("changed_files", () => getChangedFiles(context6)),
    maybe("nested_memory", () => getNestedMemoryAttachments(context6)),
    maybe("dynamic_skill", () => getDynamicSkillAttachments(context6)),
    maybe("skill_listing", () => getSkillListingAttachments(context6)),
    maybe("plan_mode", () => getPlanModeAttachments(messages, toolUseContext)),
    maybe("plan_mode_exit", () => getPlanModeExitAttachment(toolUseContext)),
    ...[],
    maybe("todo_reminders", () => isTodoV2Enabled() ? getTaskReminderAttachments(messages, toolUseContext) : getTodoReminderAttachments(messages, toolUseContext)),
    ...isAgentSwarmsEnabled() ? [
      ...querySource === "session_memory" ? [] : [
        maybe("teammate_mailbox", async () => getTeammateMailboxAttachments(toolUseContext))
      ],
      maybe("team_context", async () => getTeamContextAttachment(messages ?? []))
    ] : [],
    maybe("agent_pending_messages", async () => getAgentPendingMessageAttachments(toolUseContext)),
    maybe("critical_system_reminder", () => Promise.resolve(getCriticalSystemReminderAttachment(toolUseContext))),
    ...[],
    ...[]
  ], mainThreadAttachments = isMainThread ? [
    maybe("ide_selection", async () => getSelectedLinesFromIDE(ideSelection, toolUseContext)),
    maybe("ide_opened_file", async () => getOpenedFileFromIDE(ideSelection, toolUseContext)),
    maybe("output_style", async () => Promise.resolve(getOutputStyleAttachment())),
    maybe("diagnostics", async () => getDiagnosticAttachments(toolUseContext)),
    maybe("lsp_diagnostics", async () => getLSPDiagnosticAttachments(toolUseContext)),
    maybe("unified_tasks", async () => getUnifiedTaskAttachments(toolUseContext)),
    maybe("async_hook_responses", async () => getAsyncHookResponseAttachments()),
    maybe("token_usage", async () => Promise.resolve(getTokenUsageAttachment(messages ?? [], toolUseContext.options.mainLoopModel))),
    maybe("budget_usd", async () => Promise.resolve(getMaxBudgetUsdAttachment(toolUseContext.options.maxBudgetUsd))),
    maybe("output_token_usage", async () => Promise.resolve(getOutputTokenUsageAttachment())),
    maybe("verify_plan_reminder", async () => getVerifyPlanReminderAttachment(messages, toolUseContext))
  ] : [], [threadAttachmentResults, mainThreadAttachmentResults] = await Promise.all([
    Promise.all(allThreadAttachments),
    Promise.all(mainThreadAttachments)
  ]);
  return clearTimeout(timeoutId), [
    ...userAttachmentResults.flat(),
    ...threadAttachmentResults.flat(),
    ...mainThreadAttachmentResults.flat()
  ].filter((a2) => a2 !== void 0 && a2 !== null);
}
