// function: aggregateData
function aggregateData(sessions, facets) {
  let result = {
    total_sessions: sessions.length,
    sessions_with_facets: facets.size,
    date_range: { start: "", end: "" },
    total_messages: 0,
    total_duration_hours: 0,
    total_input_tokens: 0,
    total_output_tokens: 0,
    tool_counts: {},
    languages: {},
    git_commits: 0,
    git_pushes: 0,
    projects: {},
    goal_categories: {},
    outcomes: {},
    satisfaction: {},
    helpfulness: {},
    session_types: {},
    friction: {},
    success: {},
    session_summaries: [],
    total_interruptions: 0,
    total_tool_errors: 0,
    tool_error_categories: {},
    user_response_times: [],
    median_response_time: 0,
    avg_response_time: 0,
    sessions_using_task_agent: 0,
    sessions_using_mcp: 0,
    sessions_using_web_search: 0,
    sessions_using_web_fetch: 0,
    total_lines_added: 0,
    total_lines_removed: 0,
    total_files_modified: 0,
    days_active: 0,
    messages_per_day: 0,
    message_hours: [],
    multi_clauding: {
      overlap_events: 0,
      sessions_involved: 0,
      user_messages_during: 0
    }
  }, dates = [], allResponseTimes = [], allMessageHours = [];
  for (let session2 of sessions) {
    dates.push(session2.start_time), result.total_messages += session2.user_message_count, result.total_duration_hours += session2.duration_minutes / 60, result.total_input_tokens += session2.input_tokens, result.total_output_tokens += session2.output_tokens, result.git_commits += session2.git_commits, result.git_pushes += session2.git_pushes, result.total_interruptions += session2.user_interruptions, result.total_tool_errors += session2.tool_errors;
    for (let [cat, count4] of Object.entries(session2.tool_error_categories))
      result.tool_error_categories[cat] = (result.tool_error_categories[cat] || 0) + count4;
    if (allResponseTimes.push(...session2.user_response_times), session2.uses_task_agent)
      result.sessions_using_task_agent++;
    if (session2.uses_mcp)
      result.sessions_using_mcp++;
    if (session2.uses_web_search)
      result.sessions_using_web_search++;
    if (session2.uses_web_fetch)
      result.sessions_using_web_fetch++;
    result.total_lines_added += session2.lines_added, result.total_lines_removed += session2.lines_removed, result.total_files_modified += session2.files_modified, allMessageHours.push(...session2.message_hours);
    for (let [tool, count4] of Object.entries(session2.tool_counts))
      result.tool_counts[tool] = (result.tool_counts[tool] || 0) + count4;
    for (let [lang, count4] of Object.entries(session2.languages))
      result.languages[lang] = (result.languages[lang] || 0) + count4;
    if (session2.project_path)
      result.projects[session2.project_path] = (result.projects[session2.project_path] || 0) + 1;
    let sessionFacets = facets.get(session2.session_id);
    if (sessionFacets) {
      for (let [cat, count4] of safeEntries(sessionFacets.goal_categories))
        if (count4 > 0)
          result.goal_categories[cat] = (result.goal_categories[cat] || 0) + count4;
      result.outcomes[sessionFacets.outcome] = (result.outcomes[sessionFacets.outcome] || 0) + 1;
      for (let [level, count4] of safeEntries(sessionFacets.user_satisfaction_counts))
        if (count4 > 0)
          result.satisfaction[level] = (result.satisfaction[level] || 0) + count4;
      result.helpfulness[sessionFacets.claude_helpfulness] = (result.helpfulness[sessionFacets.claude_helpfulness] || 0) + 1, result.session_types[sessionFacets.session_type] = (result.session_types[sessionFacets.session_type] || 0) + 1;
      for (let [type, count4] of safeEntries(sessionFacets.friction_counts))
        if (count4 > 0)
          result.friction[type] = (result.friction[type] || 0) + count4;
      if (sessionFacets.primary_success !== "none")
        result.success[sessionFacets.primary_success] = (result.success[sessionFacets.primary_success] || 0) + 1;
    }
    if (result.session_summaries.length < 50)
      result.session_summaries.push({
        id: session2.session_id.slice(0, 8),
        date: session2.start_time.split("T")[0] || "",
        summary: session2.summary || session2.first_prompt.slice(0, 100),
        goal: sessionFacets?.underlying_goal
      });
  }
  if (dates.sort(), result.date_range.start = dates[0]?.split("T")[0] || "", result.date_range.end = dates[dates.length - 1]?.split("T")[0] || "", result.user_response_times = allResponseTimes, allResponseTimes.length > 0) {
    let sorted = [...allResponseTimes].sort((a2, b) => a2 - b);
    result.median_response_time = sorted[Math.floor(sorted.length / 2)] || 0, result.avg_response_time = allResponseTimes.reduce((a2, b) => a2 + b, 0) / allResponseTimes.length;
  }
  let uniqueDays = new Set(dates.map((d) => d.split("T")[0]));
  return result.days_active = uniqueDays.size, result.messages_per_day = result.days_active > 0 ? Math.round(result.total_messages / result.days_active * 10) / 10 : 0, result.message_hours = allMessageHours, result.multi_clauding = detectMultiClauding(sessions), result;
}
