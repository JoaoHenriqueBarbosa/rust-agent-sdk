// Original: src/utils/collapseReadSearch.ts
function getFilePathFromToolInput(toolInput) {
  let input = toolInput;
  return input?.file_path ?? input?.path;
}
function isMemorySearch(toolInput) {
  let input = toolInput;
  if (!input)
    return !1;
  if (input.path) {
    if (isAutoManagedMemoryFile(input.path) || isMemoryDirectory(input.path))
      return !0;
  }
  if (input.glob && isAutoManagedMemoryPattern(input.glob))
    return !0;
  if (input.command && isShellCommandTargetingMemory(input.command))
    return !0;
  return !1;
}
function isMemoryWriteOrEdit(toolName, toolInput) {
  if (toolName !== FILE_WRITE_TOOL_NAME && toolName !== FILE_EDIT_TOOL_NAME)
    return !1;
  let filePath = getFilePathFromToolInput(toolInput);
  return filePath !== void 0 && isAutoManagedMemoryFile(filePath);
}
function commandAsHint(command12) {
  let cleaned = "$ " + command12.split(`
`).map((l3) => l3.replace(/\s+/g, " ").trim()).filter((l3) => l3 !== "").join(`
`);
  return cleaned.length > MAX_HINT_CHARS ? cleaned.slice(0, MAX_HINT_CHARS - 1) + "\u2026" : cleaned;
}
function getToolSearchOrReadInfo(toolName, toolInput, tools) {
  if (toolName === REPL_TOOL_NAME)
    return {
      isCollapsible: !0,
      isSearch: !1,
      isRead: !1,
      isList: !1,
      isREPL: !0,
      isMemoryWrite: !1,
      isAbsorbedSilently: !0
    };
  if (isMemoryWriteOrEdit(toolName, toolInput))
    return {
      isCollapsible: !0,
      isSearch: !1,
      isRead: !1,
      isList: !1,
      isREPL: !1,
      isMemoryWrite: !0,
      isAbsorbedSilently: !1
    };
  if (isFullscreenEnvEnabled() && toolName === TOOL_SEARCH_TOOL_NAME)
    return {
      isCollapsible: !0,
      isSearch: !1,
      isRead: !1,
      isList: !1,
      isREPL: !1,
      isMemoryWrite: !1,
      isAbsorbedSilently: !0
    };
  let tool = findToolByName(tools, toolName) ?? findToolByName(getReplPrimitiveTools(), toolName);
  if (!tool?.isSearchOrReadCommand)
    return {
      isCollapsible: !1,
      isSearch: !1,
      isRead: !1,
      isList: !1,
      isREPL: !1,
      isMemoryWrite: !1,
      isAbsorbedSilently: !1
    };
  let result = tool.isSearchOrReadCommand(toolInput), isList = result.isList ?? !1, isCollapsible = result.isSearch || result.isRead || isList;
  return {
    isCollapsible: isCollapsible || (isFullscreenEnvEnabled() ? toolName === BASH_TOOL_NAME : !1),
    isSearch: result.isSearch,
    isRead: result.isRead,
    isList,
    isREPL: !1,
    isMemoryWrite: !1,
    isAbsorbedSilently: !1,
    ...tool.isMcp && { mcpServerName: tool.mcpInfo?.serverName },
    isBash: isFullscreenEnvEnabled() ? !isCollapsible && toolName === BASH_TOOL_NAME : void 0
  };
}
function getSearchOrReadFromContent(content, tools) {
  if (content?.type === "tool_use" && content.name) {
    let info = getToolSearchOrReadInfo(content.name, content.input, tools);
    if (info.isCollapsible || info.isREPL)
      return {
        isSearch: info.isSearch,
        isRead: info.isRead,
        isList: info.isList,
        isREPL: info.isREPL,
        isMemoryWrite: info.isMemoryWrite,
        isAbsorbedSilently: info.isAbsorbedSilently,
        mcpServerName: info.mcpServerName,
        isBash: info.isBash
      };
  }
  return null;
}
function isToolSearchOrRead(toolName, toolInput, tools) {
  return getToolSearchOrReadInfo(toolName, toolInput, tools).isCollapsible;
}
function getCollapsibleToolInfo(msg, tools) {
  if (msg.type === "assistant") {
    let content = msg.message.content[0], info = getSearchOrReadFromContent(content, tools);
    if (info && content?.type === "tool_use")
      return { name: content.name, input: content.input, ...info };
  }
  if (msg.type === "grouped_tool_use") {
    let firstContent = msg.messages[0]?.message.content[0], info = getSearchOrReadFromContent(firstContent ? { type: "tool_use", name: msg.toolName, input: firstContent.input } : void 0, tools);
    if (info && firstContent?.type === "tool_use")
      return { name: msg.toolName, input: firstContent.input, ...info };
  }
  return null;
}
function isTextBreaker(msg) {
  if (msg.type === "assistant") {
    let content = msg.message.content[0];
    if (content?.type === "text" && content.text.trim().length > 0)
      return !0;
  }
  return !1;
}
function isNonCollapsibleToolUse(msg, tools) {
  if (msg.type === "assistant") {
    let content = msg.message.content[0];
    if (content?.type === "tool_use" && !isToolSearchOrRead(content.name, content.input, tools))
      return !0;
  }
  if (msg.type === "grouped_tool_use") {
    let firstContent = msg.messages[0]?.message.content[0];
    if (firstContent?.type === "tool_use" && !isToolSearchOrRead(msg.toolName, firstContent.input, tools))
      return !0;
  }
  return !1;
}
function isPreToolHookSummary(msg) {
  return msg.type === "system" && msg.subtype === "stop_hook_summary" && msg.hookLabel === "PreToolUse";
}
function shouldSkipMessage(msg) {
  if (msg.type === "assistant") {
    let content = msg.message.content[0];
    if (content?.type === "thinking" || content?.type === "redacted_thinking")
      return !0;
  }
  if (msg.type === "attachment")
    return !0;
  if (msg.type === "system")
    return !0;
  return !1;
}
function isCollapsibleToolUse(msg, tools) {
  if (msg.type === "assistant") {
    let content = msg.message.content[0];
    return content?.type === "tool_use" && isToolSearchOrRead(content.name, content.input, tools);
  }
  if (msg.type === "grouped_tool_use") {
    let firstContent = msg.messages[0]?.message.content[0];
    return firstContent?.type === "tool_use" && isToolSearchOrRead(msg.toolName, firstContent.input, tools);
  }
  return !1;
}
function isCollapsibleToolResult(msg, collapsibleToolUseIds) {
  if (msg.type === "user") {
    let toolResults = msg.message.content.filter((c3) => c3.type === "tool_result");
    return toolResults.length > 0 && toolResults.every((r4) => collapsibleToolUseIds.has(r4.tool_use_id));
  }
  return !1;
}
function getToolUseIdsFromMessage(msg) {
  if (msg.type === "assistant") {
    let content = msg.message.content[0];
    if (content?.type === "tool_use")
      return [content.id];
  }
  if (msg.type === "grouped_tool_use")
    return msg.messages.map((m4) => {
      let content = m4.message.content[0];
      return content.type === "tool_use" ? content.id : "";
    }).filter(Boolean);
  return [];
}
function getToolUseIdsFromCollapsedGroup(message) {
  let ids = [];
  for (let msg of message.messages)
    ids.push(...getToolUseIdsFromMessage(msg));
  return ids;
}
function hasAnyToolInProgress(message, inProgressToolUseIDs) {
  return getToolUseIdsFromCollapsedGroup(message).some((id) => inProgressToolUseIDs.has(id));
}
function getDisplayMessageFromCollapsed(message) {
  let firstMsg = message.displayMessage;
  if (firstMsg.type === "grouped_tool_use")
    return firstMsg.displayMessage;
  return firstMsg;
}
function countToolUses2(msg) {
  if (msg.type === "grouped_tool_use")
    return msg.messages.length;
  return 1;
}
function getFilePathsFromReadMessage(msg) {
  let paths2 = [];
  if (msg.type === "assistant") {
    let content = msg.message.content[0];
    if (content?.type === "tool_use") {
      let input = content.input;
      if (input?.file_path)
        paths2.push(input.file_path);
    }
  } else if (msg.type === "grouped_tool_use")
    for (let m4 of msg.messages) {
      let content = m4.message.content[0];
      if (content?.type === "tool_use") {
        let input = content.input;
        if (input?.file_path)
          paths2.push(input.file_path);
      }
    }
  return paths2;
}
function scanBashResultForGitOps(msg, group) {
  if (msg.type !== "user")
    return;
  let out = msg.toolUseResult;
  if (!out?.stdout && !out?.stderr)
    return;
  let combined = (out.stdout ?? "") + `
` + (out.stderr ?? "");
  for (let c3 of msg.message.content) {
    if (c3.type !== "tool_result")
      continue;
    let command12 = group.bashCommands?.get(c3.tool_use_id);
    if (!command12)
      continue;
    let { commit, push: push2, branch, pr } = detectGitOperation(command12, combined);
    if (commit)
      group.commits?.push(commit);
    if (push2)
      group.pushes?.push(push2);
    if (branch)
      group.branches?.push(branch);
    if (pr)
      group.prs?.push(pr);
    if (commit || push2 || branch || pr)
      group.gitOpBashCount = (group.gitOpBashCount ?? 0) + 1;
  }
}
function createEmptyGroup() {
  let group = {
    messages: [],
    searchCount: 0,
    readFilePaths: /* @__PURE__ */ new Set,
    readOperationCount: 0,
    listCount: 0,
    toolUseIds: /* @__PURE__ */ new Set,
    memorySearchCount: 0,
    memoryReadFilePaths: /* @__PURE__ */ new Set,
    memoryWriteCount: 0,
    nonMemSearchArgs: [],
    latestDisplayHint: void 0,
    hookTotalMs: 0,
    hookCount: 0,
    hookInfos: []
  };
  if (group.mcpCallCount = 0, group.mcpServerNames = /* @__PURE__ */ new Set, isFullscreenEnvEnabled())
    group.bashCount = 0, group.bashCommands = /* @__PURE__ */ new Map, group.commits = [], group.pushes = [], group.branches = [], group.prs = [], group.gitOpBashCount = 0;
  return group;
}
function createCollapsedGroup(group) {
  let firstMsg = group.messages[0], totalReadCount = group.readFilePaths.size > 0 ? group.readFilePaths.size : group.readOperationCount, toolMemoryReadCount = group.memoryReadFilePaths.size, memoryReadCount = toolMemoryReadCount + (group.relevantMemories?.length ?? 0), teamMemReadPaths = void 0, nonMemReadFilePaths = [...group.readFilePaths].filter((p4) => !group.memoryReadFilePaths.has(p4) && !((void 0)?.has(p4) ?? !1)), teamMemSearchCount = 0, teamMemReadCount = 0, teamMemWriteCount = 0, result = {
    type: "collapsed_read_search",
    searchCount: Math.max(0, group.searchCount - group.memorySearchCount - 0),
    readCount: Math.max(0, totalReadCount - toolMemoryReadCount - 0),
    listCount: group.listCount,
    replCount: 0,
    memorySearchCount: group.memorySearchCount,
    memoryReadCount,
    memoryWriteCount: group.memoryWriteCount,
    readFilePaths: nonMemReadFilePaths,
    searchArgs: group.nonMemSearchArgs,
    latestDisplayHint: group.latestDisplayHint,
    messages: group.messages,
    displayMessage: firstMsg,
    uuid: `collapsed-${firstMsg.uuid}`,
    timestamp: firstMsg.timestamp
  };
  if ((group.mcpCallCount ?? 0) > 0)
    result.mcpCallCount = group.mcpCallCount, result.mcpServerNames = [...group.mcpServerNames ?? []];
  if (isFullscreenEnvEnabled()) {
    if ((group.bashCount ?? 0) > 0)
      result.bashCount = group.bashCount, result.gitOpBashCount = group.gitOpBashCount;
    if ((group.commits?.length ?? 0) > 0)
      result.commits = group.commits;
    if ((group.pushes?.length ?? 0) > 0)
      result.pushes = group.pushes;
    if ((group.branches?.length ?? 0) > 0)
      result.branches = group.branches;
    if ((group.prs?.length ?? 0) > 0)
      result.prs = group.prs;
  }
  if (group.hookCount > 0)
    result.hookTotalMs = group.hookTotalMs, result.hookCount = group.hookCount, result.hookInfos = group.hookInfos;
  if (group.relevantMemories && group.relevantMemories.length > 0)
    result.relevantMemories = group.relevantMemories;
  return result;
}
function collapseReadSearchGroups(messages, tools) {
  let result = [], currentGroup = createEmptyGroup(), deferredSkippable = [];
  function flushGroup() {
    if (currentGroup.messages.length === 0)
      return;
    result.push(createCollapsedGroup(currentGroup));
    for (let deferred of deferredSkippable)
      result.push(deferred);
    deferredSkippable = [], currentGroup = createEmptyGroup();
  }
  for (let msg of messages)
    if (isCollapsibleToolUse(msg, tools)) {
      let toolInfo = getCollapsibleToolInfo(msg, tools);
      if (toolInfo.isMemoryWrite) {
        let count3 = countToolUses2(msg);
        currentGroup.memoryWriteCount += count3;
      } else if (toolInfo.isAbsorbedSilently)
        ;
      else if (toolInfo.mcpServerName) {
        let count3 = countToolUses2(msg);
        currentGroup.mcpCallCount = (currentGroup.mcpCallCount ?? 0) + count3, currentGroup.mcpServerNames?.add(toolInfo.mcpServerName);
        let input = toolInfo.input;
        if (input?.query)
          currentGroup.latestDisplayHint = `"${input.query}"`;
      } else if (isFullscreenEnvEnabled() && toolInfo.isBash) {
        let count3 = countToolUses2(msg);
        currentGroup.bashCount = (currentGroup.bashCount ?? 0) + count3;
        let input = toolInfo.input;
        if (input?.command) {
          currentGroup.latestDisplayHint = extractBashCommentLabel(input.command) ?? commandAsHint(input.command);
          for (let id of getToolUseIdsFromMessage(msg))
            currentGroup.bashCommands?.set(id, input.command);
        }
      } else if (toolInfo.isList) {
        currentGroup.listCount += countToolUses2(msg);
        let input = toolInfo.input;
        if (input?.command)
          currentGroup.latestDisplayHint = commandAsHint(input.command);
      } else if (toolInfo.isSearch) {
        let count3 = countToolUses2(msg);
        if (currentGroup.searchCount += count3, isMemorySearch(toolInfo.input))
          currentGroup.memorySearchCount += count3;
        else {
          let input = toolInfo.input;
          if (input?.pattern)
            currentGroup.nonMemSearchArgs.push(input.pattern), currentGroup.latestDisplayHint = `"${input.pattern}"`;
        }
      } else {
        let filePaths = getFilePathsFromReadMessage(msg);
        for (let filePath of filePaths)
          if (currentGroup.readFilePaths.add(filePath), isAutoManagedMemoryFile(filePath))
            currentGroup.memoryReadFilePaths.add(filePath);
          else
            currentGroup.latestDisplayHint = getDisplayPath(filePath);
        if (filePaths.length === 0) {
          currentGroup.readOperationCount += countToolUses2(msg);
          let input = toolInfo.input;
          if (input?.command)
            currentGroup.latestDisplayHint = commandAsHint(input.command);
        }
      }
      for (let id of getToolUseIdsFromMessage(msg))
        currentGroup.toolUseIds.add(id);
      currentGroup.messages.push(msg);
    } else if (isCollapsibleToolResult(msg, currentGroup.toolUseIds)) {
      if (currentGroup.messages.push(msg), isFullscreenEnvEnabled() && currentGroup.bashCommands?.size)
        scanBashResultForGitOps(msg, currentGroup);
    } else if (currentGroup.messages.length > 0 && isPreToolHookSummary(msg))
      currentGroup.hookCount += msg.hookCount, currentGroup.hookTotalMs += msg.totalDurationMs ?? msg.hookInfos.reduce((sum, h4) => sum + (h4.durationMs ?? 0), 0), currentGroup.hookInfos.push(...msg.hookInfos);
    else if (currentGroup.messages.length > 0 && msg.type === "attachment" && msg.attachment.type === "relevant_memories")
      currentGroup.relevantMemories ??= [], currentGroup.relevantMemories.push(...msg.attachment.memories);
    else if (shouldSkipMessage(msg))
      if (currentGroup.messages.length > 0 && !(msg.type === "attachment" && msg.attachment.type === "nested_memory"))
        deferredSkippable.push(msg);
      else
        result.push(msg);
    else if (isTextBreaker(msg))
      flushGroup(), result.push(msg);
    else if (isNonCollapsibleToolUse(msg, tools))
      flushGroup(), result.push(msg);
    else
      flushGroup(), result.push(msg);
  return flushGroup(), result;
}
function getSearchReadSummaryText(searchCount, readCount, isActive, replCount = 0, memoryCounts, listCount = 0) {
  let parts = [];
  if (memoryCounts) {
    let { memorySearchCount, memoryReadCount, memoryWriteCount } = memoryCounts;
    if (memoryReadCount > 0) {
      let verb = isActive ? parts.length === 0 ? "Recalling" : "recalling" : parts.length === 0 ? "Recalled" : "recalled";
      parts.push(`${verb} ${memoryReadCount} ${memoryReadCount === 1 ? "memory" : "memories"}`);
    }
    if (memorySearchCount > 0) {
      let verb = isActive ? parts.length === 0 ? "Searching" : "searching" : parts.length === 0 ? "Searched" : "searched";
      parts.push(`${verb} memories`);
    }
    if (memoryWriteCount > 0) {
      let verb = isActive ? parts.length === 0 ? "Writing" : "writing" : parts.length === 0 ? "Wrote" : "wrote";
      parts.push(`${verb} ${memoryWriteCount} ${memoryWriteCount === 1 ? "memory" : "memories"}`);
    }
  }
  if (searchCount > 0) {
    let searchVerb = isActive ? parts.length === 0 ? "Searching for" : "searching for" : parts.length === 0 ? "Searched for" : "searched for";
    parts.push(`${searchVerb} ${searchCount} ${searchCount === 1 ? "pattern" : "patterns"}`);
  }
  if (readCount > 0) {
    let readVerb = isActive ? parts.length === 0 ? "Reading" : "reading" : parts.length === 0 ? "Read" : "read";
    parts.push(`${readVerb} ${readCount} ${readCount === 1 ? "file" : "files"}`);
  }
  if (listCount > 0) {
    let listVerb = isActive ? parts.length === 0 ? "Listing" : "listing" : parts.length === 0 ? "Listed" : "listed";
    parts.push(`${listVerb} ${listCount} ${listCount === 1 ? "directory" : "directories"}`);
  }
  if (replCount > 0) {
    let replVerb = isActive ? "REPL'ing" : "REPL'd";
    parts.push(`${replVerb} ${replCount} ${replCount === 1 ? "time" : "times"}`);
  }
  let text2 = parts.join(", ");
  return isActive ? `${text2}\u2026` : text2;
}
function summarizeRecentActivities(activities) {
  if (activities.length === 0)
    return;
  let searchCount = 0, readCount = 0;
  for (let i5 = activities.length - 1;i5 >= 0; i5--) {
    let activity = activities[i5];
    if (activity.isSearch)
      searchCount++;
    else if (activity.isRead)
      readCount++;
    else
      break;
  }
  if (searchCount + readCount >= 2)
    return getSearchReadSummaryText(searchCount, readCount, !0);
  for (let i5 = activities.length - 1;i5 >= 0; i5--)
    if (activities[i5]?.activityDescription)
      return activities[i5].activityDescription;
  return;
}
var MAX_HINT_CHARS = 300;
var init_collapseReadSearch = __esm(() => {
  init_Tool();
  init_prompt4();
  init_constants9();
  init_primitiveTools();
  init_gitOperationTracking();
  init_prompt8();
  init_file();
  init_fullscreen();
  init_memoryFileDetection();
});
