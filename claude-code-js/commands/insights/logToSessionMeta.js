// function: logToSessionMeta
function logToSessionMeta(log3) {
  let stats2 = extractToolStats(log3), sessionId = getSessionIdFromLog(log3) || "unknown", startTime = log3.created.toISOString(), durationMinutes = Math.round((log3.modified.getTime() - log3.created.getTime()) / 1000 / 60), userMessageCount = 0, assistantMessageCount = 0;
  for (let msg of log3.messages) {
    if (msg.type === "assistant")
      assistantMessageCount++;
    if (msg.type === "user" && msg.message) {
      let content = msg.message.content, isHumanMessage = !1;
      if (typeof content === "string" && content.trim())
        isHumanMessage = !0;
      else if (Array.isArray(content)) {
        for (let block2 of content)
          if (block2.type === "text" && "text" in block2) {
            isHumanMessage = !0;
            break;
          }
      }
      if (isHumanMessage)
        userMessageCount++;
    }
  }
  return {
    session_id: sessionId,
    project_path: log3.projectPath || "",
    start_time: startTime,
    duration_minutes: durationMinutes,
    user_message_count: userMessageCount,
    assistant_message_count: assistantMessageCount,
    tool_counts: stats2.toolCounts,
    languages: stats2.languages,
    git_commits: stats2.gitCommits,
    git_pushes: stats2.gitPushes,
    input_tokens: stats2.inputTokens,
    output_tokens: stats2.outputTokens,
    first_prompt: log3.firstPrompt || "",
    summary: log3.summary,
    user_interruptions: stats2.userInterruptions,
    user_response_times: stats2.userResponseTimes,
    tool_errors: stats2.toolErrors,
    tool_error_categories: stats2.toolErrorCategories,
    uses_task_agent: stats2.usesTaskAgent,
    uses_mcp: stats2.usesMcp,
    uses_web_search: stats2.usesWebSearch,
    uses_web_fetch: stats2.usesWebFetch,
    lines_added: stats2.linesAdded,
    lines_removed: stats2.linesRemoved,
    files_modified: stats2.filesModified.size,
    message_hours: stats2.messageHours,
    user_message_timestamps: stats2.userMessageTimestamps
  };
}
