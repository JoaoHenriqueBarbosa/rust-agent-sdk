// function: ensureToolResultPairing
function ensureToolResultPairing(messages) {
  let result = [], repaired = !1, allSeenToolUseIds = /* @__PURE__ */ new Set;
  for (let i5 = 0;i5 < messages.length; i5++) {
    let msg = messages[i5];
    if (msg.type !== "assistant") {
      if (msg.type === "user" && Array.isArray(msg.message.content) && result.at(-1)?.type !== "assistant") {
        let stripped = msg.message.content.filter((block2) => !(typeof block2 === "object" && ("type" in block2) && block2.type === "tool_result"));
        if (stripped.length !== msg.message.content.length) {
          repaired = !0;
          let content = stripped.length > 0 ? stripped : result.length === 0 ? [
            {
              type: "text",
              text: "[Orphaned tool result removed due to conversation resume]"
            }
          ] : null;
          if (content !== null)
            result.push({
              ...msg,
              message: { ...msg.message, content }
            });
          continue;
        }
      }
      result.push(msg);
      continue;
    }
    let serverResultIds = /* @__PURE__ */ new Set;
    for (let c3 of msg.message.content)
      if ("tool_use_id" in c3 && typeof c3.tool_use_id === "string")
        serverResultIds.add(c3.tool_use_id);
    let seenToolUseIds = /* @__PURE__ */ new Set, finalContent = msg.message.content.filter((block2) => {
      if (block2.type === "tool_use") {
        if (allSeenToolUseIds.has(block2.id))
          return repaired = !0, !1;
        allSeenToolUseIds.add(block2.id), seenToolUseIds.add(block2.id);
      }
      if ((block2.type === "server_tool_use" || block2.type === "mcp_tool_use") && !serverResultIds.has(block2.id))
        return repaired = !0, !1;
      return !0;
    }), assistantContentChanged = finalContent.length !== msg.message.content.length;
    if (finalContent.length === 0)
      finalContent.push({
        type: "text",
        text: "[Tool use interrupted]",
        citations: []
      });
    let assistantMsg = assistantContentChanged ? {
      ...msg,
      message: { ...msg.message, content: finalContent }
    } : msg;
    result.push(assistantMsg);
    let toolUseIds = [...seenToolUseIds], nextMsg = messages[i5 + 1], existingToolResultIds = /* @__PURE__ */ new Set, hasDuplicateToolResults = !1;
    if (nextMsg?.type === "user") {
      let content = nextMsg.message.content;
      if (Array.isArray(content)) {
        for (let block2 of content)
          if (typeof block2 === "object" && "type" in block2 && block2.type === "tool_result") {
            let trId = block2.tool_use_id;
            if (existingToolResultIds.has(trId))
              hasDuplicateToolResults = !0;
            existingToolResultIds.add(trId);
          }
      }
    }
    let toolUseIdSet = new Set(toolUseIds), missingIds = toolUseIds.filter((id) => !existingToolResultIds.has(id)), orphanedIds = [...existingToolResultIds].filter((id) => !toolUseIdSet.has(id));
    if (missingIds.length === 0 && orphanedIds.length === 0 && !hasDuplicateToolResults)
      continue;
    repaired = !0;
    let syntheticBlocks = missingIds.map((id) => ({
      type: "tool_result",
      tool_use_id: id,
      content: SYNTHETIC_TOOL_RESULT_PLACEHOLDER,
      is_error: !0
    }));
    if (nextMsg?.type === "user") {
      let content = Array.isArray(nextMsg.message.content) ? nextMsg.message.content : [{ type: "text", text: nextMsg.message.content }];
      if (orphanedIds.length > 0 || hasDuplicateToolResults) {
        let orphanedSet = new Set(orphanedIds), seenTrIds = /* @__PURE__ */ new Set;
        content = content.filter((block2) => {
          if (typeof block2 === "object" && "type" in block2 && block2.type === "tool_result") {
            let trId = block2.tool_use_id;
            if (orphanedSet.has(trId))
              return !1;
            if (seenTrIds.has(trId))
              return !1;
            seenTrIds.add(trId);
          }
          return !0;
        });
      }
      let patchedContent = [...syntheticBlocks, ...content];
      if (patchedContent.length > 0) {
        let patchedNext = {
          ...nextMsg,
          message: {
            ...nextMsg.message,
            content: patchedContent
          }
        };
        i5++, result.push(patchedNext);
      } else
        i5++, result.push(createUserMessage({
          content: NO_CONTENT_MESSAGE,
          isMeta: !0
        }));
    } else if (syntheticBlocks.length > 0)
      result.push(createUserMessage({
        content: syntheticBlocks,
        isMeta: !0
      }));
  }
  if (repaired) {
    let messageTypes = messages.map((m4, idx) => {
      if (m4.type === "assistant") {
        let toolUses = m4.message.content.filter((b) => b.type === "tool_use").map((b) => b.id), serverToolUses = m4.message.content.filter((b) => b.type === "server_tool_use" || b.type === "mcp_tool_use").map((b) => b.id), parts = [
          `id=${m4.message.id}`,
          `tool_uses=[${toolUses.join(",")}]`
        ];
        if (serverToolUses.length > 0)
          parts.push(`server_tool_uses=[${serverToolUses.join(",")}]`);
        return `[${idx}] assistant(${parts.join(", ")})`;
      }
      if (m4.type === "user" && Array.isArray(m4.message.content)) {
        let toolResults = m4.message.content.filter((b) => typeof b === "object" && ("type" in b) && b.type === "tool_result").map((b) => b.tool_use_id);
        if (toolResults.length > 0)
          return `[${idx}] user(tool_results=[${toolResults.join(",")}])`;
      }
      return `[${idx}] ${m4.type}`;
    });
    if (getStrictToolResultPairing())
      throw Error("ensureToolResultPairing: tool_use/tool_result pairing mismatch detected (strict mode). " + "Refusing to repair \u2014 would inject synthetic placeholders into model context. " + `Message structure: ${messageTypes.join("; ")}. See inc-4977.`);
    logEvent("tengu_tool_result_pairing_repaired", {
      messageCount: messages.length,
      repairedMessageCount: result.length,
      messageTypes: messageTypes.join("; ")
    }), logError2(Error(`ensureToolResultPairing: repaired missing tool_result blocks (${messages.length} -> ${result.length} messages). Message structure: ${messageTypes.join("; ")}`));
  }
  return result;
}
