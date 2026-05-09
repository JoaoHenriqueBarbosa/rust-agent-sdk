// Original: src/utils/agenticSessionSearch.ts
function extractMessageText(message) {
  if (message.type !== "user" && message.type !== "assistant")
    return "";
  let content = "message" in message ? message.message?.content : void 0;
  if (!content)
    return "";
  if (typeof content === "string")
    return content;
  if (Array.isArray(content))
    return content.map((block2) => {
      if (typeof block2 === "string")
        return block2;
      if ("text" in block2 && typeof block2.text === "string")
        return block2.text;
      return "";
    }).filter(Boolean).join(" ");
  return "";
}
function extractTranscript(messages) {
  if (messages.length === 0)
    return "";
  let text2 = (messages.length <= MAX_MESSAGES_TO_SCAN ? messages : [
    ...messages.slice(0, MAX_MESSAGES_TO_SCAN / 2),
    ...messages.slice(-MAX_MESSAGES_TO_SCAN / 2)
  ]).map(extractMessageText).filter(Boolean).join(" ").replace(/\s+/g, " ").trim();
  return text2.length > MAX_TRANSCRIPT_CHARS ? text2.slice(0, MAX_TRANSCRIPT_CHARS) + "\u2026" : text2;
}
function logContainsQuery(log3, queryLower) {
  if (getLogDisplayTitle(log3).toLowerCase().includes(queryLower))
    return !0;
  if (log3.customTitle?.toLowerCase().includes(queryLower))
    return !0;
  if (log3.tag?.toLowerCase().includes(queryLower))
    return !0;
  if (log3.gitBranch?.toLowerCase().includes(queryLower))
    return !0;
  if (log3.summary?.toLowerCase().includes(queryLower))
    return !0;
  if (log3.firstPrompt?.toLowerCase().includes(queryLower))
    return !0;
  if (log3.messages && log3.messages.length > 0) {
    if (extractTranscript(log3.messages).toLowerCase().includes(queryLower))
      return !0;
  }
  return !1;
}
async function agenticSessionSearch(query3, logs2, signal) {
  if (!query3.trim() || logs2.length === 0)
    return [];
  let queryLower = query3.toLowerCase(), matchingLogs = logs2.filter((log3) => logContainsQuery(log3, queryLower)), logsToSearch;
  if (matchingLogs.length >= MAX_SESSIONS_TO_SEARCH)
    logsToSearch = matchingLogs.slice(0, MAX_SESSIONS_TO_SEARCH);
  else {
    let nonMatchingLogs = logs2.filter((log3) => !logContainsQuery(log3, queryLower)), remainingSlots = MAX_SESSIONS_TO_SEARCH - matchingLogs.length;
    logsToSearch = [
      ...matchingLogs,
      ...nonMatchingLogs.slice(0, remainingSlots)
    ];
  }
  logForDebugging(`Agentic search: ${logsToSearch.length}/${logs2.length} logs, query="${query3}", matching: ${matchingLogs.length}, with messages: ${count2(logsToSearch, (l3) => l3.messages?.length > 0)}`);
  let logsWithTranscriptsPromises = logsToSearch.map(async (log3) => {
    if (isLiteLog(log3))
      try {
        return await loadFullLog(log3);
      } catch (error44) {
        return logError2(error44), log3;
      }
    return log3;
  }), logsWithTranscripts = await Promise.all(logsWithTranscriptsPromises);
  logForDebugging(`Agentic search: loaded ${count2(logsWithTranscripts, (l3) => l3.messages?.length > 0)}/${logsToSearch.length} logs with transcripts`);
  let userMessage = `Sessions:
${logsWithTranscripts.map((log3, index) => {
    let parts = [`${index}:`], displayTitle = getLogDisplayTitle(log3);
    if (parts.push(displayTitle), log3.customTitle && log3.customTitle !== displayTitle)
      parts.push(`[custom title: ${log3.customTitle}]`);
    if (log3.tag)
      parts.push(`[tag: ${log3.tag}]`);
    if (log3.gitBranch)
      parts.push(`[branch: ${log3.gitBranch}]`);
    if (log3.summary)
      parts.push(`- Summary: ${log3.summary}`);
    if (log3.firstPrompt && log3.firstPrompt !== "No prompt")
      parts.push(`- First message: ${log3.firstPrompt.slice(0, 300)}`);
    if (log3.messages && log3.messages.length > 0) {
      let transcript = extractTranscript(log3.messages);
      if (transcript)
        parts.push(`- Transcript: ${transcript}`);
    }
    return parts.join(" ");
  }).join(`
`)}

Search query: "${query3}"

Find the sessions that are most relevant to this query.`;
  logForDebugging(`Agentic search prompt (first 500 chars): ${userMessage.slice(0, 500)}...`);
  try {
    let model = getSmallFastModel();
    logForDebugging(`Agentic search using model: ${model}`);
    let textContent2 = (await sideQuery({
      model,
      system: SESSION_SEARCH_SYSTEM_PROMPT,
      messages: [{ role: "user", content: userMessage }],
      signal,
      querySource: "session_search"
    })).content.find((block2) => block2.type === "text");
    if (!textContent2 || textContent2.type !== "text")
      return logForDebugging("No text content in agentic search response"), [];
    logForDebugging(`Agentic search response: ${textContent2.text}`);
    let jsonMatch = textContent2.text.match(/\{[\s\S]*\}/);
    if (!jsonMatch)
      return logForDebugging("Could not find JSON in agentic search response"), [];
    let relevantLogs = (jsonParse(jsonMatch[0]).relevant_indices || []).filter((index) => index >= 0 && index < logsWithTranscripts.length).map((index) => logsWithTranscripts[index]);
    return logForDebugging(`Agentic search found ${relevantLogs.length} relevant sessions`), relevantLogs;
  } catch (error44) {
    return logError2(error44), logForDebugging(`Agentic search error: ${error44}`), [];
  }
}
var MAX_TRANSCRIPT_CHARS = 2000, MAX_MESSAGES_TO_SCAN = 100, MAX_SESSIONS_TO_SEARCH = 100, SESSION_SEARCH_SYSTEM_PROMPT = `Your goal is to find relevant sessions based on a user's search query.

You will be given a list of sessions with their metadata and a search query. Identify which sessions are most relevant to the query.

Each session may include:
- Title (display name or custom title)
- Tag (user-assigned category, shown as [tag: name] - users tag sessions with /tag command to categorize them)
- Branch (git branch name, shown as [branch: name])
- Summary (AI-generated summary)
- First message (beginning of the conversation)
- Transcript (excerpt of conversation content)

IMPORTANT: Tags are user-assigned labels that indicate the session's topic or category. If the query matches a tag exactly or partially, those sessions should be highly prioritized.

For each session, consider (in order of priority):
1. Exact tag matches (highest priority - user explicitly categorized this session)
2. Partial tag matches or tag-related terms
3. Title matches (custom titles or first message content)
4. Branch name matches
5. Summary and transcript content matches
6. Semantic similarity and related concepts

CRITICAL: Be VERY inclusive in your matching. Include sessions that:
- Contain the query term anywhere in any field
- Are semantically related to the query (e.g., "testing" matches sessions about "tests", "unit tests", "QA", etc.)
- Discuss topics that could be related to the query
- Have transcripts that mention the concept even in passing

When in doubt, INCLUDE the session. It's better to return too many results than too few. The user can easily scan through results, but missing relevant sessions is frustrating.

Return sessions ordered by relevance (most relevant first). If truly no sessions have ANY connection to the query, return an empty array - but this should be rare.

Respond with ONLY the JSON object, no markdown formatting:
{"relevant_indices": [2, 5, 0]}`;
var init_agenticSessionSearch = __esm(() => {
  init_debug();
  init_log3();
  init_model();
  init_sessionStorage();
  init_sideQuery();
  init_slowOperations();
});
