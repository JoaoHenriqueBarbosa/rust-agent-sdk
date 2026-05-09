// function: normalizeMessagesForAPI
function normalizeMessagesForAPI(messages, tools = []) {
  let availableToolNames = new Set(tools.map((t2) => t2.name)), reorderedMessages = reorderAttachmentsForAPI(messages).filter((m4) => !((m4.type === "user" || m4.type === "assistant") && m4.isVirtual)), errorToBlockTypes = {
    [getPdfTooLargeErrorMessage()]: /* @__PURE__ */ new Set(["document"]),
    [getPdfPasswordProtectedErrorMessage()]: /* @__PURE__ */ new Set(["document"]),
    [getPdfInvalidErrorMessage()]: /* @__PURE__ */ new Set(["document"]),
    [getImageTooLargeErrorMessage()]: /* @__PURE__ */ new Set(["image"]),
    [getRequestTooLargeErrorMessage()]: /* @__PURE__ */ new Set(["document", "image"])
  }, stripTargets = /* @__PURE__ */ new Map;
  for (let i5 = 0;i5 < reorderedMessages.length; i5++) {
    let msg = reorderedMessages[i5];
    if (!isSyntheticApiErrorMessage(msg))
      continue;
    let errorText = Array.isArray(msg.message.content) && msg.message.content[0]?.type === "text" ? msg.message.content[0].text : void 0;
    if (!errorText)
      continue;
    let blockTypesToStrip = errorToBlockTypes[errorText];
    if (!blockTypesToStrip)
      continue;
    for (let j4 = i5 - 1;j4 >= 0; j4--) {
      let candidate = reorderedMessages[j4];
      if (candidate.type === "user" && candidate.isMeta) {
        let existing = stripTargets.get(candidate.uuid);
        if (existing)
          for (let t2 of blockTypesToStrip)
            existing.add(t2);
        else
          stripTargets.set(candidate.uuid, new Set(blockTypesToStrip));
        break;
      }
      if (isSyntheticApiErrorMessage(candidate))
        continue;
      break;
    }
  }
  let result = [];
  reorderedMessages.filter((_) => {
    if (_.type === "progress" || _.type === "system" && !isSystemLocalCommandMessage(_) || isSyntheticApiErrorMessage(_))
      return !1;
    return !0;
  }).forEach((message) => {
    switch (message.type) {
      case "system": {
        let userMsg = createUserMessage({
          content: message.content,
          uuid: message.uuid,
          timestamp: message.timestamp
        }), lastMessage = last_default(result);
        if (lastMessage?.type === "user") {
          result[result.length - 1] = mergeUserMessages(lastMessage, userMsg);
          return;
        }
        result.push(userMsg);
        return;
      }
      case "user": {
        let normalizedMessage = message;
        if (!isToolSearchEnabledOptimistic())
          normalizedMessage = stripToolReferenceBlocksFromUserMessage(message);
        else
          normalizedMessage = stripUnavailableToolReferencesFromUserMessage(message, availableToolNames);
        let typesToStrip = stripTargets.get(normalizedMessage.uuid);
        if (typesToStrip && normalizedMessage.isMeta) {
          let content = normalizedMessage.message.content;
          if (Array.isArray(content)) {
            let filtered = content.filter((block2) => !typesToStrip.has(block2.type));
            if (filtered.length === 0)
              return;
            if (filtered.length < content.length)
              normalizedMessage = {
                ...normalizedMessage,
                message: {
                  ...normalizedMessage.message,
                  content: filtered
                }
              };
          }
        }
        {
          let contentAfterStrip = normalizedMessage.message.content;
          if (Array.isArray(contentAfterStrip) && !contentAfterStrip.some((b) => b.type === "text" && b.text.startsWith(TOOL_REFERENCE_TURN_BOUNDARY)) && contentHasToolReference(contentAfterStrip))
            normalizedMessage = {
              ...normalizedMessage,
              message: {
                ...normalizedMessage.message,
                content: [
                  ...contentAfterStrip,
                  { type: "text", text: TOOL_REFERENCE_TURN_BOUNDARY }
                ]
              }
            };
        }
        let lastMessage = last_default(result);
        if (lastMessage?.type === "user") {
          result[result.length - 1] = mergeUserMessages(lastMessage, normalizedMessage);
          return;
        }
        result.push(normalizedMessage);
        return;
      }
      case "assistant": {
        let toolSearchEnabled = isToolSearchEnabledOptimistic(), normalizedMessage = {
          ...message,
          message: {
            ...message.message,
            content: message.message.content.map((block2) => {
              if (block2.type === "tool_use") {
                let tool = tools.find((t2) => toolMatchesName(t2, block2.name)), normalizedInput = tool ? normalizeToolInputForAPI(tool, block2.input) : block2.input, canonicalName = tool?.name ?? block2.name;
                if (toolSearchEnabled)
                  return {
                    ...block2,
                    name: canonicalName,
                    input: normalizedInput
                  };
                return {
                  type: "tool_use",
                  id: block2.id,
                  name: canonicalName,
                  input: normalizedInput
                };
              }
              return block2;
            })
          }
        };
        for (let i5 = result.length - 1;i5 >= 0; i5--) {
          let msg = result[i5];
          if (msg.type !== "assistant" && !isToolResultMessage(msg))
            break;
          if (msg.type === "assistant") {
            if (msg.message.id === normalizedMessage.message.id) {
              result[i5] = mergeAssistantMessages(msg, normalizedMessage);
              return;
            }
            continue;
          }
        }
        result.push(normalizedMessage);
        return;
      }
      case "attachment": {
        let attachmentMessage = normalizeAttachmentForAPI(message.attachment), lastMessage = last_default(result);
        if (lastMessage?.type === "user") {
          result[result.length - 1] = attachmentMessage.reduce((p4, c3) => mergeUserMessagesAndToolResults(p4, c3), lastMessage);
          return;
        }
        result.push(...attachmentMessage);
        return;
      }
    }
  });
  let withFilteredOrphans = filterOrphanedThinkingOnlyMessages(result), withFilteredThinking = filterTrailingThinkingFromLastAssistant(withFilteredOrphans), withFilteredWhitespace = filterWhitespaceOnlyAssistantMessages(withFilteredThinking), smooshed = ensureNonEmptyAssistantContent(withFilteredWhitespace), sanitized = sanitizeErrorToolResultContent(smooshed);
  return validateImagesForAPI(sanitized), sanitized;
}
