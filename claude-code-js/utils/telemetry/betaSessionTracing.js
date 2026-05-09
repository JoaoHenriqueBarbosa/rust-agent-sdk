// Original: src/utils/telemetry/betaSessionTracing.ts
import { createHash as createHash12 } from "crypto";
function clearBetaTracingState() {
  seenHashes.clear(), lastReportedMessageHash.clear();
}
function isBetaTracingEnabled() {
  if (!(isEnvTruthy(process.env.ENABLE_BETA_TRACING_DETAILED) && Boolean(process.env.BETA_TRACING_ENDPOINT)))
    return !1;
  return getIsNonInteractiveSession();
}
function truncateContent(content, maxSize = MAX_CONTENT_SIZE) {
  if (content.length <= maxSize)
    return { content, truncated: !1 };
  return {
    content: content.slice(0, maxSize) + `

[TRUNCATED - Content exceeds 60KB limit]`,
    truncated: !0
  };
}
function shortHash(content) {
  return createHash12("sha256").update(content).digest("hex").slice(0, 12);
}
function hashSystemPrompt(systemPrompt) {
  return `sp_${shortHash(systemPrompt)}`;
}
function hashMessage(message) {
  let content = jsonStringify(message.message.content);
  return `msg_${shortHash(content)}`;
}
function extractSystemReminderContent(text2) {
  let match = text2.trim().match(SYSTEM_REMINDER_REGEX);
  return match && match[1] ? match[1].trim() : null;
}
function formatMessagesForContext(messages) {
  let contextParts = [], systemReminders = [];
  for (let message of messages) {
    let content = message.message.content;
    if (typeof content === "string") {
      let reminderContent = extractSystemReminderContent(content);
      if (reminderContent)
        systemReminders.push(reminderContent);
      else
        contextParts.push(`[USER]
${content}`);
    } else if (Array.isArray(content)) {
      for (let block2 of content)
        if (block2.type === "text") {
          let reminderContent = extractSystemReminderContent(block2.text);
          if (reminderContent)
            systemReminders.push(reminderContent);
          else
            contextParts.push(`[USER]
${block2.text}`);
        } else if (block2.type === "tool_result") {
          let resultContent = typeof block2.content === "string" ? block2.content : jsonStringify(block2.content), reminderContent = extractSystemReminderContent(resultContent);
          if (reminderContent)
            systemReminders.push(reminderContent);
          else
            contextParts.push(`[TOOL RESULT: ${block2.tool_use_id}]
${resultContent}`);
        }
    }
  }
  return { contextParts, systemReminders };
}
function addBetaInteractionAttributes(span, userPrompt) {
  if (!isBetaTracingEnabled())
    return;
  let { content: truncatedPrompt, truncated } = truncateContent(`[USER PROMPT]
${userPrompt}`);
  span.setAttributes({
    new_context: truncatedPrompt,
    ...truncated && {
      new_context_truncated: !0,
      new_context_original_length: userPrompt.length
    }
  });
}
function addBetaLLMRequestAttributes(span, newContext, messagesForAPI) {
  if (!isBetaTracingEnabled())
    return;
  if (newContext?.systemPrompt) {
    let promptHash = hashSystemPrompt(newContext.systemPrompt), preview = newContext.systemPrompt.slice(0, 500);
    if (span.setAttribute("system_prompt_hash", promptHash), span.setAttribute("system_prompt_preview", preview), span.setAttribute("system_prompt_length", newContext.systemPrompt.length), !seenHashes.has(promptHash)) {
      seenHashes.add(promptHash);
      let { content: truncatedPrompt, truncated } = truncateContent(newContext.systemPrompt);
      logOTelEvent("system_prompt", {
        system_prompt_hash: promptHash,
        system_prompt: truncatedPrompt,
        system_prompt_length: String(newContext.systemPrompt.length),
        ...truncated && { system_prompt_truncated: "true" }
      });
    }
  }
  if (newContext?.tools)
    try {
      let toolsWithHashes = jsonParse(newContext.tools).map((tool) => {
        let toolJson = jsonStringify(tool), toolHash = shortHash(toolJson);
        return {
          name: typeof tool.name === "string" ? tool.name : "unknown",
          hash: toolHash,
          json: toolJson
        };
      });
      span.setAttribute("tools", jsonStringify(toolsWithHashes.map(({ name: name3, hash }) => ({ name: name3, hash })))), span.setAttribute("tools_count", toolsWithHashes.length);
      for (let { name: name3, hash, json: json2 } of toolsWithHashes)
        if (!seenHashes.has(`tool_${hash}`)) {
          seenHashes.add(`tool_${hash}`);
          let { content: truncatedTool, truncated } = truncateContent(json2);
          logOTelEvent("tool", {
            tool_name: sanitizeToolNameForAnalytics(name3),
            tool_hash: hash,
            tool: truncatedTool,
            ...truncated && { tool_truncated: "true" }
          });
        }
    } catch {
      span.setAttribute("tools_parse_error", !0);
    }
  if (messagesForAPI && messagesForAPI.length > 0 && newContext?.querySource) {
    let querySource = newContext.querySource, lastHash = lastReportedMessageHash.get(querySource), startIndex = 0;
    if (lastHash)
      for (let i5 = 0;i5 < messagesForAPI.length; i5++) {
        let msg = messagesForAPI[i5];
        if (msg && hashMessage(msg) === lastHash) {
          startIndex = i5 + 1;
          break;
        }
      }
    let newMessages = messagesForAPI.slice(startIndex).filter((m4) => m4.type === "user");
    if (newMessages.length > 0) {
      let { contextParts, systemReminders } = formatMessagesForContext(newMessages);
      if (contextParts.length > 0) {
        let fullContext = contextParts.join(`

---

`), { content: truncatedContext, truncated } = truncateContent(fullContext);
        span.setAttributes({
          new_context: truncatedContext,
          new_context_message_count: newMessages.length,
          ...truncated && {
            new_context_truncated: !0,
            new_context_original_length: fullContext.length
          }
        });
      }
      if (systemReminders.length > 0) {
        let fullReminders = systemReminders.join(`

---

`), { content: truncatedReminders, truncated: remindersTruncated } = truncateContent(fullReminders);
        span.setAttributes({
          system_reminders: truncatedReminders,
          system_reminders_count: systemReminders.length,
          ...remindersTruncated && {
            system_reminders_truncated: !0,
            system_reminders_original_length: fullReminders.length
          }
        });
      }
      let lastMessage = messagesForAPI[messagesForAPI.length - 1];
      if (lastMessage)
        lastReportedMessageHash.set(querySource, hashMessage(lastMessage));
    }
  }
}
function addBetaLLMResponseAttributes(endAttributes, metadata) {
  if (!isBetaTracingEnabled() || !metadata)
    return;
  if (metadata.modelOutput !== void 0) {
    let { content: modelOutput, truncated: outputTruncated } = truncateContent(metadata.modelOutput);
    if (endAttributes["response.model_output"] = modelOutput, outputTruncated)
      endAttributes["response.model_output_truncated"] = !0, endAttributes["response.model_output_original_length"] = metadata.modelOutput.length;
  }
}
function addBetaToolInputAttributes(span, toolName, toolInput) {
  if (!isBetaTracingEnabled())
    return;
  let { content: truncatedInput, truncated } = truncateContent(`[TOOL INPUT: ${toolName}]
${toolInput}`);
  span.setAttributes({
    tool_input: truncatedInput,
    ...truncated && {
      tool_input_truncated: !0,
      tool_input_original_length: toolInput.length
    }
  });
}
function addBetaToolResultAttributes(endAttributes, toolName, toolResult) {
  if (!isBetaTracingEnabled())
    return;
  let { content: truncatedResult, truncated } = truncateContent(`[TOOL RESULT: ${toolName}]
${toolResult}`);
  if (endAttributes.new_context = truncatedResult, truncated)
    endAttributes.new_context_truncated = !0, endAttributes.new_context_original_length = toolResult.length;
}
var seenHashes, lastReportedMessageHash, MAX_CONTENT_SIZE = 61440, SYSTEM_REMINDER_REGEX;
var init_betaSessionTracing = __esm(() => {
  init_state();
  init_metadata();
  init_envUtils();
  init_slowOperations();
  init_events();
  seenHashes = /* @__PURE__ */ new Set, lastReportedMessageHash = /* @__PURE__ */ new Map;
  SYSTEM_REMINDER_REGEX = /^<system-reminder>\n?([\s\S]*?)\n?<\/system-reminder>$/;
});
