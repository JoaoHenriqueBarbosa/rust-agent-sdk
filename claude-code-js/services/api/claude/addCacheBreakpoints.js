// function: addCacheBreakpoints
function addCacheBreakpoints(messages, enablePromptCaching, querySource, useCachedMC = !1, newCacheEdits, pinnedEdits, skipCacheWrite = !1) {
  logEvent("tengu_api_cache_breakpoints", {
    totalMessageCount: messages.length,
    cachingEnabled: enablePromptCaching,
    skipCacheWrite
  });
  let markerIndex = skipCacheWrite ? messages.length - 2 : messages.length - 1, result = messages.map((msg, index) => {
    let addCache = index === markerIndex;
    if (msg.type === "user")
      return userMessageToMessageParam(msg, addCache, enablePromptCaching, querySource);
    return assistantMessageToMessageParam(msg, addCache, enablePromptCaching, querySource);
  });
  if (!useCachedMC)
    return result;
  let seenDeleteRefs = /* @__PURE__ */ new Set, deduplicateEdits = (block2) => {
    let uniqueEdits = block2.edits.filter((edit2) => {
      if (seenDeleteRefs.has(edit2.cache_reference))
        return !1;
      return seenDeleteRefs.add(edit2.cache_reference), !0;
    });
    return { ...block2, edits: uniqueEdits };
  };
  for (let pinned of pinnedEdits ?? []) {
    let msg = result[pinned.userMessageIndex];
    if (msg && msg.role === "user") {
      if (!Array.isArray(msg.content))
        msg.content = [{ type: "text", text: msg.content }];
      let dedupedBlock = deduplicateEdits(pinned.block);
      if (dedupedBlock.edits.length > 0)
        insertBlockAfterToolResults(msg.content, dedupedBlock);
    }
  }
  if (newCacheEdits && result.length > 0) {
    let dedupedNewEdits = deduplicateEdits(newCacheEdits);
    if (dedupedNewEdits.edits.length > 0)
      for (let i5 = result.length - 1;i5 >= 0; i5--) {
        let msg = result[i5];
        if (msg && msg.role === "user") {
          if (!Array.isArray(msg.content))
            msg.content = [{ type: "text", text: msg.content }];
          insertBlockAfterToolResults(msg.content, dedupedNewEdits), pinCacheEdits(i5, newCacheEdits), logForDebugging(`Added cache_edits block with ${dedupedNewEdits.edits.length} deletion(s) to message[${i5}]: ${dedupedNewEdits.edits.map((e) => e.cache_reference).join(", ")}`);
          break;
        }
      }
  }
  if (enablePromptCaching) {
    let lastCCMsg = -1;
    for (let i5 = 0;i5 < result.length; i5++) {
      let msg = result[i5];
      if (Array.isArray(msg.content)) {
        for (let block2 of msg.content)
          if (block2 && typeof block2 === "object" && "cache_control" in block2)
            lastCCMsg = i5;
      }
    }
    if (lastCCMsg >= 0)
      for (let i5 = 0;i5 < lastCCMsg; i5++) {
        let msg = result[i5];
        if (msg.role !== "user" || !Array.isArray(msg.content))
          continue;
        let cloned = !1;
        for (let j4 = 0;j4 < msg.content.length; j4++) {
          let block2 = msg.content[j4];
          if (block2 && isToolResultBlock2(block2)) {
            if (!cloned)
              msg.content = [...msg.content], cloned = !0;
            msg.content[j4] = Object.assign({}, block2, {
              cache_reference: block2.tool_use_id
            });
          }
        }
      }
  }
  return result;
}
