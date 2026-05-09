// function: approximateMessageTokens
async function approximateMessageTokens(messages) {
  let microcompactResult = await microcompactMessages(messages), breakdown = {
    totalTokens: 0,
    toolCallTokens: 0,
    toolResultTokens: 0,
    attachmentTokens: 0,
    assistantMessageTokens: 0,
    userMessageTokens: 0,
    toolCallsByType: /* @__PURE__ */ new Map,
    toolResultsByType: /* @__PURE__ */ new Map,
    attachmentsByType: /* @__PURE__ */ new Map
  }, toolUseIdToName = /* @__PURE__ */ new Map;
  for (let msg of microcompactResult.messages)
    if (msg.type === "assistant") {
      for (let block2 of msg.message.content)
        if ("type" in block2 && block2.type === "tool_use") {
          let toolUseId = "id" in block2 ? block2.id : void 0, toolName = ("name" in block2 ? block2.name : void 0) || "unknown";
          if (toolUseId)
            toolUseIdToName.set(toolUseId, toolName);
        }
    }
  for (let msg of microcompactResult.messages)
    if (msg.type === "assistant")
      processAssistantMessage(msg, breakdown);
    else if (msg.type === "user")
      processUserMessage(msg, breakdown, toolUseIdToName);
    else if (msg.type === "attachment")
      processAttachment(msg, breakdown);
  let approximateMessageTokens2 = await countTokensWithFallback(normalizeMessagesForAPI(microcompactResult.messages).map((_) => {
    if (_.type === "assistant")
      return {
        role: "assistant",
        content: _.message.content
      };
    return _.message;
  }), []);
  return breakdown.totalTokens = approximateMessageTokens2 ?? 0, breakdown;
}
