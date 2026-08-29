// Original: src/utils/conversationRecovery.ts
import { relative as relative11 } from "path";
function migrateLegacyAttachmentTypes(message) {
  if (message.type !== "attachment")
    return message;
  let attachment = message.attachment;
  if (attachment.type === "new_file")
    return {
      ...message,
      attachment: {
        ...attachment,
        type: "file",
        displayPath: relative11(getCwd(), attachment.filename)
      }
    };
  if (attachment.type === "new_directory")
    return {
      ...message,
      attachment: {
        ...attachment,
        type: "directory",
        displayPath: relative11(getCwd(), attachment.path)
      }
    };
  if (!("displayPath" in attachment)) {
    let path16 = "filename" in attachment ? attachment.filename : ("path" in attachment) ? attachment.path : ("skillDir" in attachment) ? attachment.skillDir : void 0;
    if (path16)
      return {
        ...message,
        attachment: {
          ...attachment,
          displayPath: relative11(getCwd(), path16)
        }
      };
  }
  return message;
}
function deserializeMessages(serializedMessages) {
  return deserializeMessagesWithInterruptDetection(serializedMessages).messages;
}
function deserializeMessagesWithInterruptDetection(serializedMessages) {
  try {
    let migratedMessages = serializedMessages.map(migrateLegacyAttachmentTypes), validModes = new Set(PERMISSION_MODES);
    for (let msg of migratedMessages)
      if (msg.type === "user" && msg.permissionMode !== void 0 && !validModes.has(msg.permissionMode))
        msg.permissionMode = void 0;
    let filteredToolUses = filterUnresolvedToolUses(migratedMessages), filteredThinking = filterOrphanedThinkingOnlyMessages(filteredToolUses), filteredMessages = filterWhitespaceOnlyAssistantMessages(filteredThinking), internalState = detectTurnInterruption(filteredMessages), turnInterruptionState;
    if (internalState.kind === "interrupted_turn") {
      let [continuationMessage] = normalizeMessages([
        createUserMessage({
          content: "Continue from where you left off.",
          isMeta: !0
        })
      ]);
      filteredMessages.push(continuationMessage), turnInterruptionState = {
        kind: "interrupted_prompt",
        message: continuationMessage
      };
    } else
      turnInterruptionState = internalState;
    let lastRelevantIdx = filteredMessages.findLastIndex((m4) => m4.type !== "system" && m4.type !== "progress");
    if (lastRelevantIdx !== -1 && filteredMessages[lastRelevantIdx].type === "user")
      filteredMessages.splice(lastRelevantIdx + 1, 0, createAssistantMessage({
        content: NO_RESPONSE_REQUESTED
      }));
    return { messages: filteredMessages, turnInterruptionState };
  } catch (error44) {
    throw logError2(error44), error44;
  }
}
function detectTurnInterruption(messages) {
  if (messages.length === 0)
    return { kind: "none" };
  let lastMessageIdx = messages.findLastIndex((m4) => m4.type !== "system" && m4.type !== "progress" && !(m4.type === "assistant" && m4.isApiErrorMessage)), lastMessage = lastMessageIdx !== -1 ? messages[lastMessageIdx] : void 0;
  if (!lastMessage)
    return { kind: "none" };
  if (lastMessage.type === "assistant")
    return { kind: "none" };
  if (lastMessage.type === "user") {
    if (lastMessage.isMeta || lastMessage.isCompactSummary)
      return { kind: "none" };
    if (isToolUseResultMessage(lastMessage)) {
      if (isTerminalToolResult(lastMessage, messages, lastMessageIdx))
        return { kind: "none" };
      return { kind: "interrupted_turn" };
    }
    return { kind: "interrupted_prompt", message: lastMessage };
  }
  if (lastMessage.type === "attachment")
    return { kind: "interrupted_turn" };
  return { kind: "none" };
}
function isTerminalToolResult(result, messages, resultIdx) {
  let content = result.message.content;
  if (!Array.isArray(content))
    return !1;
  let block2 = content[0];
  if (block2?.type !== "tool_result")
    return !1;
  let toolUseId = block2.tool_use_id;
  for (let i5 = resultIdx - 1;i5 >= 0; i5--) {
    let msg = messages[i5];
    if (msg.type !== "assistant")
      continue;
    for (let b of msg.message.content)
      if (b.type === "tool_use" && b.id === toolUseId)
        return b.name === BRIEF_TOOL_NAME4 || b.name === LEGACY_BRIEF_TOOL_NAME2 || b.name === SEND_USER_FILE_TOOL_NAME;
  }
  return !1;
}
function restoreSkillStateFromMessages(messages) {
  for (let message of messages) {
    if (message.type !== "attachment")
      continue;
    if (message.attachment.type === "invoked_skills") {
      for (let skill of message.attachment.skills)
        if (skill.name && skill.path && skill.content)
          addInvokedSkill(skill.name, skill.path, skill.content, null);
    }
    if (message.attachment.type === "skill_listing")
      suppressNextSkillListing();
  }
}
async function loadMessagesFromJsonlPath(path16) {
  let { messages: byUuid, leafUuids } = await loadTranscriptFile(path16), tip = null, tipTs = 0;
  for (let m4 of byUuid.values()) {
    if (m4.isSidechain || !leafUuids.has(m4.uuid))
      continue;
    let ts = new Date(m4.timestamp).getTime();
    if (ts > tipTs)
      tipTs = ts, tip = m4;
  }
  if (!tip)
    return { messages: [], sessionId: void 0 };
  let chain4 = buildConversationChain(byUuid, tip);
  return {
    messages: removeExtraFields(chain4),
    sessionId: tip.sessionId
  };
}
async function loadConversationForResume(source, sourceJsonlFile) {
  try {
    let log3 = null, messages = null, sessionId;
    if (source === void 0) {
      let logsPromise = loadMessageLogs(), skip = /* @__PURE__ */ new Set;
      log3 = (await logsPromise).find((l3) => {
        let id = getSessionIdFromLog(l3);
        return !id || !skip.has(id);
      }) ?? null;
    } else if (sourceJsonlFile) {
      let loaded = await loadMessagesFromJsonlPath(sourceJsonlFile);
      messages = loaded.messages, sessionId = loaded.sessionId;
    } else if (typeof source === "string")
      log3 = await getLastSessionLog(source), sessionId = source;
    else
      log3 = source;
    if (!log3 && !messages)
      return null;
    if (log3) {
      if (isLiteLog(log3))
        log3 = await loadFullLog(log3);
      if (!sessionId)
        sessionId = getSessionIdFromLog(log3);
      if (sessionId)
        await copyPlanForResume(log3, asSessionId(sessionId));
      copyFileHistoryForResume(log3), messages = log3.messages, checkResumeConsistency(messages);
    }
    restoreSkillStateFromMessages(messages);
    let deserialized = deserializeMessagesWithInterruptDetection(messages);
    messages = deserialized.messages;
    let hookMessages = await processSessionStartHooks("resume", { sessionId });
    return messages.push(...hookMessages), {
      messages,
      turnInterruptionState: deserialized.turnInterruptionState,
      fileHistorySnapshots: log3?.fileHistorySnapshots,
      attributionSnapshots: log3?.attributionSnapshots,
      contentReplacements: log3?.contentReplacements,
      contextCollapseCommits: log3?.contextCollapseCommits,
      contextCollapseSnapshot: log3?.contextCollapseSnapshot,
      sessionId,
      agentName: log3?.agentName,
      agentColor: log3?.agentColor,
      agentSetting: log3?.agentSetting,
      customTitle: log3?.customTitle,
      tag: log3?.tag,
      mode: log3?.mode,
      worktreeSession: log3?.worktreeSession,
      prNumber: log3?.prNumber,
      prUrl: log3?.prUrl,
      prRepository: log3?.prRepository,
      fullPath: log3?.fullPath
    };
  } catch (error44) {
    throw logError2(error44), error44;
  }
}
var BRIEF_TOOL_NAME4, LEGACY_BRIEF_TOOL_NAME2, SEND_USER_FILE_TOOL_NAME = null;
var init_conversationRecovery = __esm(() => {
  init_cwd2();
  init_state();
  init_ids();
  init_permissions();
  init_attachments2();
  init_fileHistory();
  init_log3();
  init_messages3();
  init_plans();
  init_sessionStart();
  init_sessionStorage();
  BRIEF_TOOL_NAME4 = (init_prompt(), __toCommonJS(exports_prompt)).BRIEF_TOOL_NAME, LEGACY_BRIEF_TOOL_NAME2 = (init_prompt(), __toCommonJS(exports_prompt)).LEGACY_BRIEF_TOOL_NAME;
});
