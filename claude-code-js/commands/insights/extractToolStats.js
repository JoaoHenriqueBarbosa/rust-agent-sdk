// function: extractToolStats
function extractToolStats(log3) {
  let toolCounts = {}, languages = {}, gitCommits = 0, gitPushes = 0, inputTokens = 0, outputTokens = 0, userInterruptions = 0, userResponseTimes = [], toolErrors = 0, toolErrorCategories = {}, usesTaskAgent = !1, linesAdded = 0, linesRemoved = 0, filesModified = /* @__PURE__ */ new Set, messageHours = [], userMessageTimestamps = [], usesMcp = !1, usesWebSearch = !1, usesWebFetch = !1, lastAssistantTimestamp = null;
  for (let msg of log3.messages) {
    let msgTimestamp = msg.timestamp;
    if (msg.type === "assistant" && msg.message) {
      if (msgTimestamp)
        lastAssistantTimestamp = msgTimestamp;
      let usage = msg.message.usage;
      if (usage)
        inputTokens += usage.input_tokens || 0, outputTokens += usage.output_tokens || 0;
      let content = msg.message.content;
      if (Array.isArray(content)) {
        for (let block2 of content)
          if (block2.type === "tool_use" && "name" in block2) {
            let toolName = block2.name;
            if (toolCounts[toolName] = (toolCounts[toolName] || 0) + 1, toolName === AGENT_TOOL_NAME || toolName === LEGACY_AGENT_TOOL_NAME)
              usesTaskAgent = !0;
            if (toolName.startsWith("mcp__"))
              usesMcp = !0;
            if (toolName === "WebSearch")
              usesWebSearch = !0;
            if (toolName === "WebFetch")
              usesWebFetch = !0;
            let input = block2.input;
            if (input) {
              let filePath = input.file_path || "";
              if (filePath) {
                let lang = getLanguageFromPath(filePath);
                if (lang)
                  languages[lang] = (languages[lang] || 0) + 1;
                if (toolName === "Edit" || toolName === "Write")
                  filesModified.add(filePath);
              }
              if (toolName === "Edit") {
                let oldString = input.old_string || "", newString = input.new_string || "";
                for (let change of diffLines(oldString, newString)) {
                  if (change.added)
                    linesAdded += change.count || 0;
                  if (change.removed)
                    linesRemoved += change.count || 0;
                }
              }
              if (toolName === "Write") {
                let writeContent = input.content || "";
                if (writeContent)
                  linesAdded += countCharInString(writeContent, `
`) + 1;
              }
              let command19 = input.command || "";
              if (command19.includes("git commit"))
                gitCommits++;
              if (command19.includes("git push"))
                gitPushes++;
            }
          }
      }
    }
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
      if (isHumanMessage) {
        if (msgTimestamp)
          try {
            let hour = new Date(msgTimestamp).getHours();
            messageHours.push(hour), userMessageTimestamps.push(msgTimestamp);
          } catch {}
        if (lastAssistantTimestamp && msgTimestamp) {
          let assistantTime = new Date(lastAssistantTimestamp).getTime(), responseTimeSec = (new Date(msgTimestamp).getTime() - assistantTime) / 1000;
          if (responseTimeSec > 2 && responseTimeSec < 3600)
            userResponseTimes.push(responseTimeSec);
        }
      }
      if (Array.isArray(content)) {
        for (let block2 of content)
          if (block2.type === "tool_result" && "content" in block2) {
            if (block2.is_error) {
              toolErrors++;
              let resultContent = block2.content, category = "Other";
              if (typeof resultContent === "string") {
                let lowerContent = resultContent.toLowerCase();
                if (lowerContent.includes("exit code"))
                  category = "Command Failed";
                else if (lowerContent.includes("rejected") || lowerContent.includes("doesn't want"))
                  category = "User Rejected";
                else if (lowerContent.includes("string to replace not found") || lowerContent.includes("no changes"))
                  category = "Edit Failed";
                else if (lowerContent.includes("modified since read"))
                  category = "File Changed";
                else if (lowerContent.includes("exceeds maximum") || lowerContent.includes("too large"))
                  category = "File Too Large";
                else if (lowerContent.includes("file not found") || lowerContent.includes("does not exist"))
                  category = "File Not Found";
              }
              toolErrorCategories[category] = (toolErrorCategories[category] || 0) + 1;
            }
          }
      }
      if (typeof content === "string") {
        if (content.includes("[Request interrupted by user"))
          userInterruptions++;
      } else if (Array.isArray(content)) {
        for (let block2 of content)
          if (block2.type === "text" && "text" in block2 && block2.text.includes("[Request interrupted by user")) {
            userInterruptions++;
            break;
          }
      }
    }
  }
  return {
    toolCounts,
    languages,
    gitCommits,
    gitPushes,
    inputTokens,
    outputTokens,
    userInterruptions,
    userResponseTimes,
    toolErrors,
    toolErrorCategories,
    usesTaskAgent,
    usesMcp,
    usesWebSearch,
    usesWebFetch,
    linesAdded,
    linesRemoved,
    filesModified,
    messageHours,
    userMessageTimestamps
  };
}
