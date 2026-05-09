// class: Project
class Project {
  currentSessionTag;
  currentSessionTitle;
  currentSessionAgentName;
  currentSessionAgentColor;
  currentSessionLastPrompt;
  currentSessionAgentSetting;
  currentSessionMode;
  currentSessionWorktree;
  currentSessionPrNumber;
  currentSessionPrUrl;
  currentSessionPrRepository;
  sessionFile = null;
  pendingEntries = [];
  remoteIngressUrl = null;
  internalEventWriter = null;
  internalEventReader = null;
  internalSubagentEventReader = null;
  pendingWriteCount = 0;
  flushResolvers = [];
  writeQueues = /* @__PURE__ */ new Map;
  flushTimer = null;
  activeDrain = null;
  FLUSH_INTERVAL_MS = 100;
  MAX_CHUNK_BYTES = 104857600;
  constructor() {}
  _resetFlushState() {
    if (this.pendingWriteCount = 0, this.flushResolvers = [], this.flushTimer)
      clearTimeout(this.flushTimer);
    this.flushTimer = null, this.activeDrain = null, this.writeQueues = /* @__PURE__ */ new Map;
  }
  incrementPendingWrites() {
    this.pendingWriteCount++;
  }
  decrementPendingWrites() {
    if (this.pendingWriteCount--, this.pendingWriteCount === 0) {
      for (let resolve44 of this.flushResolvers)
        resolve44();
      this.flushResolvers = [];
    }
  }
  async trackWrite(fn) {
    this.incrementPendingWrites();
    try {
      return await fn();
    } finally {
      this.decrementPendingWrites();
    }
  }
  enqueueWrite(filePath, entry) {
    return new Promise((resolve44) => {
      let queue2 = this.writeQueues.get(filePath);
      if (!queue2)
        queue2 = [], this.writeQueues.set(filePath, queue2);
      queue2.push({ entry, resolve: resolve44 }), this.scheduleDrain();
    });
  }
  scheduleDrain() {
    if (this.flushTimer)
      return;
    this.flushTimer = setTimeout(async () => {
      if (this.flushTimer = null, this.activeDrain = this.drainWriteQueue(), await this.activeDrain, this.activeDrain = null, this.writeQueues.size > 0)
        this.scheduleDrain();
    }, this.FLUSH_INTERVAL_MS);
  }
  async appendToFile(filePath, data) {
    try {
      await fsAppendFile(filePath, data, { mode: 384 });
    } catch {
      await mkdir37(dirname58(filePath), { recursive: !0, mode: 448 }), await fsAppendFile(filePath, data, { mode: 384 });
    }
  }
  async drainWriteQueue() {
    for (let [filePath, queue2] of this.writeQueues) {
      if (queue2.length === 0)
        continue;
      let batch = queue2.splice(0), content = "", resolvers2 = [];
      for (let { entry, resolve: resolve44 } of batch) {
        let line = jsonStringify(entry) + `
`;
        if (content.length + line.length >= this.MAX_CHUNK_BYTES) {
          await this.appendToFile(filePath, content);
          for (let r4 of resolvers2)
            r4();
          resolvers2.length = 0, content = "";
        }
        content += line, resolvers2.push(resolve44);
      }
      if (content.length > 0) {
        await this.appendToFile(filePath, content);
        for (let r4 of resolvers2)
          r4();
      }
    }
    for (let [filePath, queue2] of this.writeQueues)
      if (queue2.length === 0)
        this.writeQueues.delete(filePath);
  }
  resetSessionFile() {
    this.sessionFile = null, this.pendingEntries = [];
  }
  reAppendSessionMetadata(skipTitleRefresh = !1) {
    if (!this.sessionFile)
      return;
    let sessionId = getSessionId();
    if (!sessionId)
      return;
    let tailLines = readFileTailSync(this.sessionFile).split(`
`);
    if (!skipTitleRefresh) {
      let titleLine = tailLines.findLast((l3) => l3.startsWith('{"type":"custom-title"'));
      if (titleLine) {
        let tailTitle = extractLastJsonStringField(titleLine, "customTitle");
        if (tailTitle !== void 0)
          this.currentSessionTitle = tailTitle || void 0;
      }
    }
    let tagLine = tailLines.findLast((l3) => l3.startsWith('{"type":"tag"'));
    if (tagLine) {
      let tailTag = extractLastJsonStringField(tagLine, "tag");
      if (tailTag !== void 0)
        this.currentSessionTag = tailTag || void 0;
    }
    if (this.currentSessionLastPrompt)
      appendEntryToFile(this.sessionFile, {
        type: "last-prompt",
        lastPrompt: this.currentSessionLastPrompt,
        sessionId
      });
    if (this.currentSessionTitle)
      appendEntryToFile(this.sessionFile, {
        type: "custom-title",
        customTitle: this.currentSessionTitle,
        sessionId
      });
    if (this.currentSessionTag)
      appendEntryToFile(this.sessionFile, {
        type: "tag",
        tag: this.currentSessionTag,
        sessionId
      });
    if (this.currentSessionAgentName)
      appendEntryToFile(this.sessionFile, {
        type: "agent-name",
        agentName: this.currentSessionAgentName,
        sessionId
      });
    if (this.currentSessionAgentColor)
      appendEntryToFile(this.sessionFile, {
        type: "agent-color",
        agentColor: this.currentSessionAgentColor,
        sessionId
      });
    if (this.currentSessionAgentSetting)
      appendEntryToFile(this.sessionFile, {
        type: "agent-setting",
        agentSetting: this.currentSessionAgentSetting,
        sessionId
      });
    if (this.currentSessionMode)
      appendEntryToFile(this.sessionFile, {
        type: "mode",
        mode: this.currentSessionMode,
        sessionId
      });
    if (this.currentSessionWorktree !== void 0)
      appendEntryToFile(this.sessionFile, {
        type: "worktree-state",
        worktreeSession: this.currentSessionWorktree,
        sessionId
      });
    if (this.currentSessionPrNumber !== void 0 && this.currentSessionPrUrl && this.currentSessionPrRepository)
      appendEntryToFile(this.sessionFile, {
        type: "pr-link",
        sessionId,
        prNumber: this.currentSessionPrNumber,
        prUrl: this.currentSessionPrUrl,
        prRepository: this.currentSessionPrRepository,
        timestamp: (/* @__PURE__ */ new Date()).toISOString()
      });
  }
  async flush() {
    if (this.flushTimer)
      clearTimeout(this.flushTimer), this.flushTimer = null;
    if (this.activeDrain)
      await this.activeDrain;
    if (await this.drainWriteQueue(), this.pendingWriteCount === 0)
      return;
    return new Promise((resolve44) => {
      this.flushResolvers.push(resolve44);
    });
  }
  async removeMessageByUuid(targetUuid) {
    return this.trackWrite(async () => {
      if (this.sessionFile === null)
        return;
      try {
        let fileSize = 0, fh = await fsOpen2(this.sessionFile, "r+");
        try {
          let { size } = await fh.stat();
          if (fileSize = size, size === 0)
            return;
          let chunkLen = Math.min(size, LITE_READ_BUF_SIZE), tailStart = size - chunkLen, buf = Buffer.allocUnsafe(chunkLen), { bytesRead } = await fh.read(buf, 0, chunkLen, tailStart), tail = buf.subarray(0, bytesRead), needle = `"uuid":"${targetUuid}"`, matchIdx = tail.lastIndexOf(needle);
          if (matchIdx >= 0) {
            let prevNl = tail.lastIndexOf(10, matchIdx);
            if (prevNl >= 0 || tailStart === 0) {
              let lineStart = prevNl + 1, nextNl = tail.indexOf(10, matchIdx + needle.length), lineEnd = nextNl >= 0 ? nextNl + 1 : bytesRead, absLineStart = tailStart + lineStart, afterLen = bytesRead - lineEnd;
              if (await fh.truncate(absLineStart), afterLen > 0)
                await fh.write(tail, lineEnd, afterLen, absLineStart);
              return;
            }
          }
        } finally {
          await fh.close();
        }
        if (fileSize > MAX_TOMBSTONE_REWRITE_BYTES) {
          logForDebugging(`Skipping tombstone removal: session file too large (${formatFileSize(fileSize)})`, { level: "warn" });
          return;
        }
        let lines2 = (await readFile51(this.sessionFile, { encoding: "utf-8" })).split(`
`).filter((line) => {
          if (!line.trim())
            return !0;
          try {
            return jsonParse(line).uuid !== targetUuid;
          } catch {
            return !0;
          }
        });
        await writeFile43(this.sessionFile, lines2.join(`
`), {
          encoding: "utf8"
        });
      } catch {}
    });
  }
  shouldSkipPersistence() {
    let allowTestPersistence = isEnvTruthy(process.env.TEST_ENABLE_SESSION_PERSISTENCE);
    return getNodeEnv() === "test" && !allowTestPersistence || getSettings_DEPRECATED()?.cleanupPeriodDays === 0 || isSessionPersistenceDisabled() || isEnvTruthy(process.env.CLAUDE_CODE_SKIP_PROMPT_HISTORY);
  }
  async materializeSessionFile() {
    if (this.shouldSkipPersistence())
      return;
    if (this.ensureCurrentSessionFile(), this.reAppendSessionMetadata(), this.pendingEntries.length > 0) {
      let buffered = this.pendingEntries;
      this.pendingEntries = [];
      for (let entry of buffered)
        await this.appendEntry(entry);
    }
  }
  async insertMessageChain(messages, isSidechain = !1, agentId, startingParentUuid, teamInfo) {
    return this.trackWrite(async () => {
      let parentUuid = startingParentUuid ?? null;
      if (this.sessionFile === null && messages.some((m4) => m4.type === "user" || m4.type === "assistant"))
        await this.materializeSessionFile();
      let gitBranch;
      try {
        gitBranch = await getBranch();
      } catch {
        gitBranch = void 0;
      }
      let sessionId = getSessionId(), slug = getPlanSlugCache().get(sessionId);
      for (let message of messages) {
        let isCompactBoundary = isCompactBoundaryMessage(message), effectiveParentUuid = parentUuid;
        if (message.type === "user" && "sourceToolAssistantUUID" in message && message.sourceToolAssistantUUID)
          effectiveParentUuid = message.sourceToolAssistantUUID;
        let transcriptMessage = {
          parentUuid: isCompactBoundary ? null : effectiveParentUuid,
          logicalParentUuid: isCompactBoundary ? parentUuid : void 0,
          isSidechain,
          teamName: teamInfo?.teamName,
          agentName: teamInfo?.agentName,
          promptId: message.type === "user" ? getPromptId() ?? void 0 : void 0,
          agentId,
          ...message,
          userType: getUserType(),
          entrypoint: getEntrypoint(),
          cwd: getCwd(),
          sessionId,
          version: VERSION5,
          gitBranch,
          slug
        };
        if (await this.appendEntry(transcriptMessage), isChainParticipant(message))
          parentUuid = message.uuid;
      }
      if (!isSidechain) {
        let text2 = getFirstMeaningfulUserMessageTextContent(messages);
        if (text2) {
          let flat = text2.replace(/\n/g, " ").trim();
          this.currentSessionLastPrompt = flat.length > 200 ? flat.slice(0, 200).trim() + "\u2026" : flat;
        }
      }
    });
  }
  async insertFileHistorySnapshot(messageId, snapshot2, isSnapshotUpdate) {
    return this.trackWrite(async () => {
      let fileHistoryMessage = {
        type: "file-history-snapshot",
        messageId,
        snapshot: snapshot2,
        isSnapshotUpdate
      };
      await this.appendEntry(fileHistoryMessage);
    });
  }
  async insertQueueOperation(queueOp) {
    return this.trackWrite(async () => {
      await this.appendEntry(queueOp);
    });
  }
  async insertAttributionSnapshot(snapshot2) {
    return this.trackWrite(async () => {
      await this.appendEntry(snapshot2);
    });
  }
  async insertContentReplacement(replacements3, agentId) {
    return this.trackWrite(async () => {
      let entry = {
        type: "content-replacement",
        sessionId: getSessionId(),
        agentId,
        replacements: replacements3
      };
      await this.appendEntry(entry);
    });
  }
  async appendEntry(entry, sessionId = getSessionId()) {
    if (this.shouldSkipPersistence())
      return;
    let currentSessionId = getSessionId(), isCurrentSession = sessionId === currentSessionId, sessionFile;
    if (isCurrentSession) {
      if (this.sessionFile === null) {
        this.pendingEntries.push(entry);
        return;
      }
      sessionFile = this.sessionFile;
    } else {
      let existing = await this.getExistingSessionFile(sessionId);
      if (!existing) {
        logError2(Error(`appendEntry: session file not found for other session ${sessionId}`));
        return;
      }
      sessionFile = existing;
    }
    if (entry.type === "summary")
      this.enqueueWrite(sessionFile, entry);
    else if (entry.type === "custom-title")
      this.enqueueWrite(sessionFile, entry);
    else if (entry.type === "ai-title")
      this.enqueueWrite(sessionFile, entry);
    else if (entry.type === "last-prompt")
      this.enqueueWrite(sessionFile, entry);
    else if (entry.type === "task-summary")
      this.enqueueWrite(sessionFile, entry);
    else if (entry.type === "tag")
      this.enqueueWrite(sessionFile, entry);
    else if (entry.type === "agent-name")
      this.enqueueWrite(sessionFile, entry);
    else if (entry.type === "agent-color")
      this.enqueueWrite(sessionFile, entry);
    else if (entry.type === "agent-setting")
      this.enqueueWrite(sessionFile, entry);
    else if (entry.type === "pr-link")
      this.enqueueWrite(sessionFile, entry);
    else if (entry.type === "file-history-snapshot")
      this.enqueueWrite(sessionFile, entry);
    else if (entry.type === "attribution-snapshot")
      this.enqueueWrite(sessionFile, entry);
    else if (entry.type === "speculation-accept")
      this.enqueueWrite(sessionFile, entry);
    else if (entry.type === "mode")
      this.enqueueWrite(sessionFile, entry);
    else if (entry.type === "worktree-state")
      this.enqueueWrite(sessionFile, entry);
    else if (entry.type === "content-replacement") {
      let targetFile = entry.agentId ? getAgentTranscriptPath(entry.agentId) : sessionFile;
      this.enqueueWrite(targetFile, entry);
    } else if (entry.type === "marble-origami-commit")
      this.enqueueWrite(sessionFile, entry);
    else if (entry.type === "marble-origami-snapshot")
      this.enqueueWrite(sessionFile, entry);
    else {
      let messageSet = await getSessionMessages(sessionId);
      if (entry.type === "queue-operation")
        this.enqueueWrite(sessionFile, entry);
      else {
        let isAgentSidechain = entry.isSidechain && entry.agentId !== void 0, targetFile = isAgentSidechain ? getAgentTranscriptPath(asAgentId(entry.agentId)) : sessionFile, isNewUuid = !messageSet.has(entry.uuid);
        if (isAgentSidechain || isNewUuid) {
          if (this.enqueueWrite(targetFile, entry), !isAgentSidechain) {
            if (messageSet.add(entry.uuid), isTranscriptMessage(entry))
              await this.persistToRemote(sessionId, entry);
          }
        }
      }
    }
  }
  ensureCurrentSessionFile() {
    if (this.sessionFile === null)
      this.sessionFile = getTranscriptPath();
    return this.sessionFile;
  }
  existingSessionFiles = /* @__PURE__ */ new Map;
  async getExistingSessionFile(sessionId) {
    let cached3 = this.existingSessionFiles.get(sessionId);
    if (cached3)
      return cached3;
    let targetFile = getTranscriptPathForSession(sessionId);
    try {
      return await stat38(targetFile), this.existingSessionFiles.set(sessionId, targetFile), targetFile;
    } catch (e) {
      if (isFsInaccessible(e))
        return null;
      throw e;
    }
  }
  async persistToRemote(sessionId, entry) {
    if (isShuttingDown())
      return;
    if (this.internalEventWriter) {
      try {
        await this.internalEventWriter("transcript", entry, {
          ...isCompactBoundaryMessage(entry) && { isCompaction: !0 },
          ...entry.agentId && { agentId: entry.agentId }
        });
      } catch {
        logEvent("tengu_session_persistence_failed", {}), logForDebugging("Failed to write transcript as internal event");
      }
      return;
    }
    if (!isEnvTruthy(process.env.ENABLE_SESSION_PERSISTENCE) || !this.remoteIngressUrl)
      return;
    if (!await appendSessionLog(sessionId, entry, this.remoteIngressUrl))
      logEvent("tengu_session_persistence_failed", {}), gracefulShutdownSync(1, "other");
  }
  setRemoteIngressUrl(url3) {
    if (this.remoteIngressUrl = url3, logForDebugging(`Remote persistence enabled with URL: ${url3}`), url3)
      this.FLUSH_INTERVAL_MS = REMOTE_FLUSH_INTERVAL_MS;
  }
  setInternalEventWriter(writer) {
    this.internalEventWriter = writer, logForDebugging("CCR v2 internal event writer registered for transcript persistence"), this.FLUSH_INTERVAL_MS = REMOTE_FLUSH_INTERVAL_MS;
  }
  setInternalEventReader(reader) {
    this.internalEventReader = reader, logForDebugging("CCR v2 internal event reader registered for session resume");
  }
  setInternalSubagentEventReader(reader) {
    this.internalSubagentEventReader = reader, logForDebugging("CCR v2 subagent event reader registered for session resume");
  }
  getInternalEventReader() {
    return this.internalEventReader;
  }
  getInternalSubagentEventReader() {
    return this.internalSubagentEventReader;
  }
}
async function recordTranscript(messages, teamInfo, startingParentUuidHint, allMessages) {
  let cleanedMessages = cleanMessagesForLogging(messages, allMessages), sessionId = getSessionId(), messageSet = await getSessionMessages(sessionId), newMessages = [], startingParentUuid = startingParentUuidHint, seenNewMessage = !1;
  for (let m4 of cleanedMessages)
    if (messageSet.has(m4.uuid)) {
      if (!seenNewMessage && isChainParticipant(m4))
        startingParentUuid = m4.uuid;
    } else
      newMessages.push(m4), seenNewMessage = !0;
  if (newMessages.length > 0)
    await getProject().insertMessageChain(newMessages, !1, void 0, startingParentUuid, teamInfo);
  return newMessages.findLast(isChainParticipant)?.uuid ?? startingParentUuid ?? null;
}
async function recordSidechainTranscript(messages, agentId, startingParentUuid) {
  await getProject().insertMessageChain(cleanMessagesForLogging(messages), !0, agentId, startingParentUuid);
}
async function recordQueueOperation(queueOp) {
  await getProject().insertQueueOperation(queueOp);
}
async function removeTranscriptMessage(targetUuid) {
  await getProject().removeMessageByUuid(targetUuid);
}
async function recordFileHistorySnapshot(messageId, snapshot2, isSnapshotUpdate) {
  await getProject().insertFileHistorySnapshot(messageId, snapshot2, isSnapshotUpdate);
}
async function recordAttributionSnapshot(snapshot2) {
  await getProject().insertAttributionSnapshot(snapshot2);
}
async function recordContentReplacement(replacements3, agentId) {
  await getProject().insertContentReplacement(replacements3, agentId);
}
async function resetSessionFilePointer() {
  getProject().resetSessionFile();
}
function adoptResumedSessionFile() {
  let project2 = getProject();
  project2.sessionFile = getTranscriptPath(), project2.reAppendSessionMetadata(!0);
}
async function recordContextCollapseCommit(commit) {
  let sessionId = getSessionId();
  if (!sessionId)
    return;
  await getProject().appendEntry({
    type: "marble-origami-commit",
    sessionId,
    ...commit
  });
}
async function recordContextCollapseSnapshot(snapshot2) {
  let sessionId = getSessionId();
  if (!sessionId)
    return;
  await getProject().appendEntry({
    type: "marble-origami-snapshot",
    sessionId,
    ...snapshot2
  });
}
async function flushSessionStorage() {
  await getProject().flush();
}
async function hydrateRemoteSession(sessionId, ingressUrl) {
  switchSession(asSessionId(sessionId));
  let project2 = getProject();
  try {
    let remoteLogs = await getSessionLogs(sessionId, ingressUrl) || [], projectDir = getProjectDir2(getOriginalCwd());
    await mkdir37(projectDir, { recursive: !0, mode: 448 });
    let sessionFile = getTranscriptPathForSession(sessionId), content = remoteLogs.map((e) => jsonStringify(e) + `
`).join("");
    return await writeFile43(sessionFile, content, { encoding: "utf8", mode: 384 }), logForDebugging(`Hydrated ${remoteLogs.length} entries from remote`), remoteLogs.length > 0;
  } catch (error44) {
    return logForDebugging(`Error hydrating session from remote: ${error44}`), logForDiagnosticsNoPII("error", "hydrate_remote_session_fail"), !1;
  } finally {
    project2.setRemoteIngressUrl(ingressUrl);
  }
}
async function hydrateFromCCRv2InternalEvents(sessionId) {
  let startMs = Date.now();
  switchSession(asSessionId(sessionId));
  let project2 = getProject(), reader = project2.getInternalEventReader();
  if (!reader)
    return logForDebugging("No internal event reader registered for CCR v2 resume"), !1;
  try {
    let events2 = await reader();
    if (!events2)
      return logForDebugging("Failed to read internal events for resume"), logForDiagnosticsNoPII("error", "hydrate_ccr_v2_read_fail"), !1;
    let projectDir = getProjectDir2(getOriginalCwd());
    await mkdir37(projectDir, { recursive: !0, mode: 448 });
    let sessionFile = getTranscriptPathForSession(sessionId), fgContent = events2.map((e) => jsonStringify(e.payload) + `
`).join("");
    await writeFile43(sessionFile, fgContent, { encoding: "utf8", mode: 384 }), logForDebugging(`Hydrated ${events2.length} foreground entries from CCR v2 internal events`);
    let subagentEventCount = 0, subagentReader = project2.getInternalSubagentEventReader();
    if (subagentReader) {
      let subagentEvents = await subagentReader();
      if (subagentEvents && subagentEvents.length > 0) {
        subagentEventCount = subagentEvents.length;
        let byAgent = /* @__PURE__ */ new Map;
        for (let e of subagentEvents) {
          let agentId = e.agent_id || "";
          if (!agentId)
            continue;
          let list2 = byAgent.get(agentId);
          if (!list2)
            list2 = [], byAgent.set(agentId, list2);
          list2.push(e.payload);
        }
        for (let [agentId, entries2] of byAgent) {
          let agentFile = getAgentTranscriptPath(asAgentId(agentId));
          await mkdir37(dirname58(agentFile), { recursive: !0, mode: 448 });
          let agentContent = entries2.map((p4) => jsonStringify(p4) + `
`).join("");
          await writeFile43(agentFile, agentContent, {
            encoding: "utf8",
            mode: 384
          });
        }
        logForDebugging(`Hydrated ${subagentEvents.length} subagent entries across ${byAgent.size} agents`);
      }
    }
    return logForDiagnosticsNoPII("info", "hydrate_ccr_v2_completed", {
      duration_ms: Date.now() - startMs,
      event_count: events2.length,
      subagent_event_count: subagentEventCount
    }), events2.length > 0;
  } catch (error44) {
    if (error44 instanceof Error && error44.message === "CCRClient: Epoch mismatch (409)")
      throw error44;
    return logForDebugging(`Error hydrating session from CCR v2: ${error44}`), logForDiagnosticsNoPII("error", "hydrate_ccr_v2_fail"), !1;
  }
}
function extractFirstPrompt2(transcript) {
  let textContent2 = getFirstMeaningfulUserMessageTextContent(transcript);
  if (textContent2) {
    let result = textContent2.replace(/\n/g, " ").trim();
    if (result.length > 200)
      result = result.slice(0, 200).trim() + "\u2026";
    return result;
  }
  return "No prompt";
}
function getFirstMeaningfulUserMessageTextContent(transcript) {
  for (let msg of transcript) {
    if (msg.type !== "user" || msg.isMeta)
      continue;
    if ("isCompactSummary" in msg && msg.isCompactSummary)
      continue;
    let content = msg.message?.content;
    if (!content)
      continue;
    let texts = [];
    if (typeof content === "string")
      texts.push(content);
    else if (Array.isArray(content)) {
      for (let block2 of content)
        if (block2.type === "text" && block2.text)
          texts.push(block2.text);
    }
    for (let textContent2 of texts) {
      if (!textContent2)
        continue;
      let commandNameTag = extractTag(textContent2, COMMAND_NAME_TAG);
      if (commandNameTag) {
        let commandName = commandNameTag.replace(/^\//, "");
        if (builtInCommandNames().has(commandName))
          continue;
        else {
          let commandArgs = extractTag(textContent2, "command-args")?.trim();
          if (!commandArgs)
            continue;
          return `${commandNameTag} ${commandArgs}`;
        }
      }
      let bashInput = extractTag(textContent2, "bash-input");
      if (bashInput)
        return `! ${bashInput}`;
      if (SKIP_FIRST_PROMPT_PATTERN.test(textContent2))
        continue;
      return textContent2;
    }
  }
  return;
}
function removeExtraFields(transcript) {
  return transcript.map((m4) => {
    let { isSidechain, parentUuid, ...serializedMessage } = m4;
    return serializedMessage;
  });
}
function applyPreservedSegmentRelinks(messages) {
  let lastSeg, lastSegBoundaryIdx = -1, absoluteLastBoundaryIdx = -1, entryIndex = /* @__PURE__ */ new Map, i5 = 0;
  for (let entry of messages.values()) {
    if (entryIndex.set(entry.uuid, i5), isCompactBoundaryMessage(entry)) {
      absoluteLastBoundaryIdx = i5;
      let seg = entry.compactMetadata?.preservedSegment;
      if (seg)
        lastSeg = seg, lastSegBoundaryIdx = i5;
    }
    i5++;
  }
  if (!lastSeg)
    return;
  let segIsLive = lastSegBoundaryIdx === absoluteLastBoundaryIdx, preservedUuids = /* @__PURE__ */ new Set;
  if (segIsLive) {
    let walkSeen = /* @__PURE__ */ new Set, cur = messages.get(lastSeg.tailUuid), reachedHead = !1;
    while (cur && !walkSeen.has(cur.uuid)) {
      if (walkSeen.add(cur.uuid), preservedUuids.add(cur.uuid), cur.uuid === lastSeg.headUuid) {
        reachedHead = !0;
        break;
      }
      cur = cur.parentUuid ? messages.get(cur.parentUuid) : void 0;
    }
    if (!reachedHead) {
      logEvent("tengu_relink_walk_broken", {
        tailInTranscript: messages.has(lastSeg.tailUuid),
        headInTranscript: messages.has(lastSeg.headUuid),
        anchorInTranscript: messages.has(lastSeg.anchorUuid),
        walkSteps: walkSeen.size,
        transcriptSize: messages.size
      });
      return;
    }
  }
  if (segIsLive) {
    let head = messages.get(lastSeg.headUuid);
    if (head)
      messages.set(lastSeg.headUuid, {
        ...head,
        parentUuid: lastSeg.anchorUuid
      });
    for (let [uuid8, msg] of messages)
      if (msg.parentUuid === lastSeg.anchorUuid && uuid8 !== lastSeg.headUuid)
        messages.set(uuid8, { ...msg, parentUuid: lastSeg.tailUuid });
    for (let uuid8 of preservedUuids) {
      let msg = messages.get(uuid8);
      if (msg?.type !== "assistant")
        continue;
      messages.set(uuid8, {
        ...msg,
        message: {
          ...msg.message,
          usage: {
            ...msg.message.usage,
            input_tokens: 0,
            output_tokens: 0,
            cache_creation_input_tokens: 0,
            cache_read_input_tokens: 0
          }
        }
      });
    }
  }
  let toDelete = [];
  for (let [uuid8] of messages) {
    let idx = entryIndex.get(uuid8);
    if (idx !== void 0 && idx < absoluteLastBoundaryIdx && !preservedUuids.has(uuid8))
      toDelete.push(uuid8);
  }
  for (let uuid8 of toDelete)
    messages.delete(uuid8);
}
function applySnipRemovals(messages) {
  let toDelete = /* @__PURE__ */ new Set;
  for (let entry of messages.values()) {
    let removedUuids = entry.snipMetadata?.removedUuids;
    if (!removedUuids)
      continue;
    for (let uuid8 of removedUuids)
      toDelete.add(uuid8);
  }
  if (toDelete.size === 0)
    return;
  let deletedParent = /* @__PURE__ */ new Map, removedCount = 0;
  for (let uuid8 of toDelete) {
    let entry = messages.get(uuid8);
    if (!entry)
      continue;
    deletedParent.set(uuid8, entry.parentUuid), messages.delete(uuid8), removedCount++;
  }
  let resolve44 = (start) => {
    let path25 = [], cur = start;
    while (cur && toDelete.has(cur))
      if (path25.push(cur), cur = deletedParent.get(cur), cur === void 0) {
        cur = null;
        break;
      }
    for (let p4 of path25)
      deletedParent.set(p4, cur);
    return cur;
  }, relinkedCount = 0;
  for (let [uuid8, msg] of messages) {
    if (!msg.parentUuid || !toDelete.has(msg.parentUuid))
      continue;
    messages.set(uuid8, { ...msg, parentUuid: resolve44(msg.parentUuid) }), relinkedCount++;
  }
  logEvent("tengu_snip_resume_filtered", {
    removed_count: removedCount,
    relinked_count: relinkedCount
  });
}
function findLatestMessage(messages, predicate) {
  let latest, maxTime = -1 / 0;
  for (let m4 of messages) {
    if (!predicate(m4))
      continue;
    let t2 = Date.parse(m4.timestamp);
    if (t2 > maxTime)
      maxTime = t2, latest = m4;
  }
  return latest;
}
function buildConversationChain(messages, leafMessage) {
  let transcript = [], seen = /* @__PURE__ */ new Set, currentMsg = leafMessage;
  while (currentMsg) {
    if (seen.has(currentMsg.uuid)) {
      logError2(Error(`Cycle detected in parentUuid chain at message ${currentMsg.uuid}. Returning partial transcript.`)), logEvent("tengu_chain_parent_cycle", {});
      break;
    }
    seen.add(currentMsg.uuid), transcript.push(currentMsg), currentMsg = currentMsg.parentUuid ? messages.get(currentMsg.parentUuid) : void 0;
  }
  return transcript.reverse(), recoverOrphanedParallelToolResults(messages, transcript, seen);
}
function recoverOrphanedParallelToolResults(messages, chain4, seen) {
  let chainAssistants = chain4.filter((m4) => m4.type === "assistant");
  if (chainAssistants.length === 0)
    return chain4;
  let anchorByMsgId = /* @__PURE__ */ new Map;
  for (let a2 of chainAssistants)
    if (a2.message.id)
      anchorByMsgId.set(a2.message.id, a2);
  let siblingsByMsgId = /* @__PURE__ */ new Map, toolResultsByAsst = /* @__PURE__ */ new Map;
  for (let m4 of messages.values())
    if (m4.type === "assistant" && m4.message.id) {
      let group = siblingsByMsgId.get(m4.message.id);
      if (group)
        group.push(m4);
      else
        siblingsByMsgId.set(m4.message.id, [m4]);
    } else if (m4.type === "user" && m4.parentUuid && Array.isArray(m4.message.content) && m4.message.content.some((b) => b.type === "tool_result")) {
      let group = toolResultsByAsst.get(m4.parentUuid);
      if (group)
        group.push(m4);
      else
        toolResultsByAsst.set(m4.parentUuid, [m4]);
    }
  let processedGroups = /* @__PURE__ */ new Set, inserts = /* @__PURE__ */ new Map, recoveredCount = 0;
  for (let asst of chainAssistants) {
    let msgId = asst.message.id;
    if (!msgId || processedGroups.has(msgId))
      continue;
    processedGroups.add(msgId);
    let group = siblingsByMsgId.get(msgId) ?? [asst], orphanedSiblings = group.filter((s2) => !seen.has(s2.uuid)), orphanedTRs = [];
    for (let member of group) {
      let trs = toolResultsByAsst.get(member.uuid);
      if (!trs)
        continue;
      for (let tr of trs)
        if (!seen.has(tr.uuid))
          orphanedTRs.push(tr);
    }
    if (orphanedSiblings.length === 0 && orphanedTRs.length === 0)
      continue;
    orphanedSiblings.sort((a2, b) => a2.timestamp.localeCompare(b.timestamp)), orphanedTRs.sort((a2, b) => a2.timestamp.localeCompare(b.timestamp));
    let anchor = anchorByMsgId.get(msgId), recovered = [...orphanedSiblings, ...orphanedTRs];
    for (let r4 of recovered)
      seen.add(r4.uuid);
    recoveredCount += recovered.length, inserts.set(anchor.uuid, recovered);
  }
  if (recoveredCount === 0)
    return chain4;
  logEvent("tengu_chain_parallel_tr_recovered", {
    recovered_count: recoveredCount
  });
  let result = [];
  for (let m4 of chain4) {
    result.push(m4);
    let toInsert = inserts.get(m4.uuid);
    if (toInsert)
      result.push(...toInsert);
  }
  return result;
}
function checkResumeConsistency(chain4) {
  for (let i5 = chain4.length - 1;i5 >= 0; i5--) {
    let m4 = chain4[i5];
    if (m4.type !== "system" || m4.subtype !== "turn_duration")
      continue;
    let expected = m4.messageCount;
    if (expected === void 0)
      return;
    let actual = i5;
    logEvent("tengu_resume_consistency_delta", {
      expected,
      actual,
      delta: actual - expected,
      chain_length: chain4.length,
      checkpoint_age_entries: chain4.length - 1 - i5
    });
    return;
  }
}
function buildFileHistorySnapshotChain(fileHistorySnapshots, conversation) {
  let snapshots = [], indexByMessageId = /* @__PURE__ */ new Map;
  for (let message of conversation) {
    let snapshotMessage = fileHistorySnapshots.get(message.uuid);
    if (!snapshotMessage)
      continue;
    let { snapshot: snapshot2, isSnapshotUpdate } = snapshotMessage, existingIndex = isSnapshotUpdate ? indexByMessageId.get(snapshot2.messageId) : void 0;
    if (existingIndex === void 0)
      indexByMessageId.set(snapshot2.messageId, snapshots.length), snapshots.push(snapshot2);
    else
      snapshots[existingIndex] = snapshot2;
  }
  return snapshots;
}
function buildAttributionSnapshotChain(attributionSnapshots, _conversation) {
  return Array.from(attributionSnapshots.values());
}
async function loadTranscriptFromFile(filePath) {
  if (filePath.endsWith(".jsonl")) {
    let {
      messages: messages2,
      summaries,
      customTitles,
      tags,
      fileHistorySnapshots,
      attributionSnapshots,
      contextCollapseCommits,
      contextCollapseSnapshot,
      leafUuids,
      contentReplacements,
      worktreeStates
    } = await loadTranscriptFile(filePath);
    if (messages2.size === 0)
      throw Error("No messages found in JSONL file");
    let leafMessage = findLatestMessage(messages2.values(), (msg) => leafUuids.has(msg.uuid));
    if (!leafMessage)
      throw Error("No valid conversation chain found in JSONL file");
    let transcript = buildConversationChain(messages2, leafMessage), summary = summaries.get(leafMessage.uuid), customTitle = customTitles.get(leafMessage.sessionId), tag3 = tags.get(leafMessage.sessionId), sessionId = leafMessage.sessionId;
    return {
      ...convertToLogOption(transcript, 0, summary, customTitle, buildFileHistorySnapshotChain(fileHistorySnapshots, transcript), tag3, filePath, buildAttributionSnapshotChain(attributionSnapshots, transcript), void 0, contentReplacements.get(sessionId) ?? []),
      contextCollapseCommits: contextCollapseCommits.filter((e) => e.sessionId === sessionId),
      contextCollapseSnapshot: contextCollapseSnapshot?.sessionId === sessionId ? contextCollapseSnapshot : void 0,
      worktreeSession: worktreeStates.has(sessionId) ? worktreeStates.get(sessionId) : void 0
    };
  }
  let content = await readFile51(filePath, { encoding: "utf-8" }), parsed;
  try {
    parsed = jsonParse(content);
  } catch (error44) {
    throw Error(`Invalid JSON in transcript file: ${error44}`);
  }
  let messages;
  if (Array.isArray(parsed))
    messages = parsed;
  else if (parsed && typeof parsed === "object" && "messages" in parsed) {
    if (!Array.isArray(parsed.messages))
      throw Error("Transcript messages must be an array");
    messages = parsed.messages;
  } else
    throw Error("Transcript must be an array of messages or an object with a messages array");
  return convertToLogOption(messages, 0, void 0, void 0, void 0, void 0, filePath);
}
function hasVisibleUserContent(message) {
  if (message.type !== "user")
    return !1;
  if (message.isMeta)
    return !1;
  let content = message.message?.content;
  if (!content)
    return !1;
  if (typeof content === "string")
    return content.trim().length > 0;
  if (Array.isArray(content))
    return content.some((block2) => block2.type === "text" || block2.type === "image" || block2.type === "document");
  return !1;
}
function hasVisibleAssistantContent(message) {
  if (message.type !== "assistant")
    return !1;
  let content = message.message?.content;
  if (!content || !Array.isArray(content))
    return !1;
  return content.some((block2) => block2.type === "text" && typeof block2.text === "string" && block2.text.trim().length > 0);
}
function countVisibleMessages(transcript) {
  let count4 = 0;
  for (let message of transcript)
    switch (message.type) {
      case "user":
        if (hasVisibleUserContent(message))
          count4++;
        break;
      case "assistant":
        if (hasVisibleAssistantContent(message))
          count4++;
        break;
      case "attachment":
      case "system":
      case "progress":
        break;
    }
  return count4;
}
function convertToLogOption(transcript, value = 0, summary, customTitle, fileHistorySnapshots, tag3, fullPath, attributionSnapshots, agentSetting, contentReplacements) {
  let lastMessage = transcript.at(-1), firstMessage = transcript[0], firstPrompt = extractFirstPrompt2(transcript), created = new Date(firstMessage.timestamp), modified = new Date(lastMessage.timestamp);
  return {
    date: lastMessage.timestamp,
    messages: removeExtraFields(transcript),
    fullPath,
    value,
    created,
    modified,
    firstPrompt,
    messageCount: countVisibleMessages(transcript),
    isSidechain: firstMessage.isSidechain,
    teamName: firstMessage.teamName,
    agentName: firstMessage.agentName,
    agentSetting,
    leafUuid: lastMessage.uuid,
    summary,
    customTitle,
    tag: tag3,
    fileHistorySnapshots,
    attributionSnapshots,
    contentReplacements,
    gitBranch: lastMessage.gitBranch,
    projectPath: firstMessage.cwd
  };
}
async function trackSessionBranchingAnalytics(logs2) {
  let sessionIdCounts = /* @__PURE__ */ new Map, maxCount = 0;
  for (let log3 of logs2) {
    let sessionId = getSessionIdFromLog(log3);
    if (sessionId) {
      let newCount = (sessionIdCounts.get(sessionId) || 0) + 1;
      sessionIdCounts.set(sessionId, newCount), maxCount = Math.max(newCount, maxCount);
    }
  }
  if (maxCount <= 1)
    return;
  let branchCounts = Array.from(sessionIdCounts.values()).filter((c3) => c3 > 1), sessionsWithBranches = branchCounts.length, totalBranches = branchCounts.reduce((sum, count4) => sum + count4, 0);
  logEvent("tengu_session_forked_branches_fetched", {
    total_sessions: sessionIdCounts.size,
    sessions_with_branches: sessionsWithBranches,
    max_branches_per_session: Math.max(...branchCounts),
    avg_branches_per_session: Math.round(totalBranches / sessionsWithBranches),
    total_transcript_count: logs2.length
  });
}
async function fetchLogs(limit) {
  let projectDir = getProjectDir2(getOriginalCwd()), logs2 = await getSessionFilesLite(projectDir, limit, getOriginalCwd());
  return await trackSessionBranchingAnalytics(logs2), logs2;
}
function appendEntryToFile(fullPath, entry) {
  let fs18 = getFsImplementation(), line = jsonStringify(entry) + `
`;
  try {
    fs18.appendFileSync(fullPath, line, { mode: 384 });
  } catch {
    fs18.mkdirSync(dirname58(fullPath), { mode: 448 }), fs18.appendFileSync(fullPath, line, { mode: 384 });
  }
}
function readFileTailSync(fullPath) {
  let fd2;
  try {
    fd2 = openSync5(fullPath, "r");
    let st = fstatSync(fd2), tailOffset = Math.max(0, st.size - LITE_READ_BUF_SIZE), buf = Buffer.allocUnsafe(Math.min(LITE_READ_BUF_SIZE, st.size - tailOffset)), bytesRead = readSync3(fd2, buf, 0, buf.length, tailOffset);
    return buf.toString("utf8", 0, bytesRead);
  } catch {
    return "";
  } finally {
    if (fd2 !== void 0)
      try {
        closeSync4(fd2);
      } catch {}
  }
}
async function saveCustomTitle(sessionId, customTitle, fullPath, source = "user") {
  let resolvedPath5 = fullPath ?? getTranscriptPathForSession(sessionId);
  if (appendEntryToFile(resolvedPath5, {
    type: "custom-title",
    customTitle,
    sessionId
  }), sessionId === getSessionId())
    getProject().currentSessionTitle = customTitle;
  logEvent("tengu_session_renamed", {
    source
  });
}
function saveAiGeneratedTitle(sessionId, aiTitle) {
  appendEntryToFile(getTranscriptPathForSession(sessionId), {
    type: "ai-title",
    aiTitle,
    sessionId
  });
}
function saveTaskSummary(sessionId, summary) {
  appendEntryToFile(getTranscriptPathForSession(sessionId), {
    type: "task-summary",
    summary,
    sessionId,
    timestamp: (/* @__PURE__ */ new Date()).toISOString()
  });
}
async function saveTag(sessionId, tag3, fullPath) {
  let resolvedPath5 = fullPath ?? getTranscriptPathForSession(sessionId);
  if (appendEntryToFile(resolvedPath5, { type: "tag", tag: tag3, sessionId }), sessionId === getSessionId())
    getProject().currentSessionTag = tag3;
  logEvent("tengu_session_tagged", {});
}
async function linkSessionToPR(sessionId, prNumber, prUrl, prRepository, fullPath) {
  let resolvedPath5 = fullPath ?? getTranscriptPathForSession(sessionId);
  if (appendEntryToFile(resolvedPath5, {
    type: "pr-link",
    sessionId,
    prNumber,
    prUrl,
    prRepository,
    timestamp: (/* @__PURE__ */ new Date()).toISOString()
  }), sessionId === getSessionId()) {
    let project2 = getProject();
    project2.currentSessionPrNumber = prNumber, project2.currentSessionPrUrl = prUrl, project2.currentSessionPrRepository = prRepository;
  }
  logEvent("tengu_session_linked_to_pr", { prNumber });
}
function getCurrentSessionTag(sessionId) {
  if (sessionId === getSessionId())
    return getProject().currentSessionTag;
  return;
}
function getCurrentSessionTitle(sessionId) {
  if (sessionId === getSessionId())
    return getProject().currentSessionTitle;
  return;
}
function getCurrentSessionAgentColor() {
  return getProject().currentSessionAgentColor;
}
function restoreSessionMetadata(meta) {
  let project2 = getProject();
  if (meta.customTitle)
    project2.currentSessionTitle ??= meta.customTitle;
  if (meta.tag !== void 0)
    project2.currentSessionTag = meta.tag || void 0;
  if (meta.agentName)
    project2.currentSessionAgentName = meta.agentName;
  if (meta.agentColor)
    project2.currentSessionAgentColor = meta.agentColor;
  if (meta.agentSetting)
    project2.currentSessionAgentSetting = meta.agentSetting;
  if (meta.mode)
    project2.currentSessionMode = meta.mode;
  if (meta.worktreeSession !== void 0)
    project2.currentSessionWorktree = meta.worktreeSession;
  if (meta.prNumber !== void 0)
    project2.currentSessionPrNumber = meta.prNumber;
  if (meta.prUrl)
    project2.currentSessionPrUrl = meta.prUrl;
  if (meta.prRepository)
    project2.currentSessionPrRepository = meta.prRepository;
}
function clearSessionMetadata() {
  let project2 = getProject();
  project2.currentSessionTitle = void 0, project2.currentSessionTag = void 0, project2.currentSessionAgentName = void 0, project2.currentSessionAgentColor = void 0, project2.currentSessionLastPrompt = void 0, project2.currentSessionAgentSetting = void 0, project2.currentSessionMode = void 0, project2.currentSessionWorktree = void 0, project2.currentSessionPrNumber = void 0, project2.currentSessionPrUrl = void 0, project2.currentSessionPrRepository = void 0;
}
function reAppendSessionMetadata() {
  getProject().reAppendSessionMetadata();
}
async function saveAgentName(sessionId, agentName, fullPath, source = "user") {
  let resolvedPath5 = fullPath ?? getTranscriptPathForSession(sessionId);
  if (appendEntryToFile(resolvedPath5, { type: "agent-name", agentName, sessionId }), sessionId === getSessionId())
    getProject().currentSessionAgentName = agentName, updateSessionName(agentName);
  logEvent("tengu_agent_name_set", {
    source
  });
}
async function saveAgentColor(sessionId, agentColor, fullPath) {
  let resolvedPath5 = fullPath ?? getTranscriptPathForSession(sessionId);
  if (appendEntryToFile(resolvedPath5, {
    type: "agent-color",
    agentColor,
    sessionId
  }), sessionId === getSessionId())
    getProject().currentSessionAgentColor = agentColor;
  logEvent("tengu_agent_color_set", {});
}
function saveAgentSetting(agentSetting) {
  getProject().currentSessionAgentSetting = agentSetting;
}
function cacheSessionTitle(customTitle) {
  getProject().currentSessionTitle = customTitle;
}
function saveMode(mode) {
  getProject().currentSessionMode = mode;
}
function saveWorktreeState(worktreeSession) {
  let stripped = worktreeSession ? {
    originalCwd: worktreeSession.originalCwd,
    worktreePath: worktreeSession.worktreePath,
    worktreeName: worktreeSession.worktreeName,
    worktreeBranch: worktreeSession.worktreeBranch,
    originalBranch: worktreeSession.originalBranch,
    originalHeadCommit: worktreeSession.originalHeadCommit,
    sessionId: worktreeSession.sessionId,
    tmuxSessionName: worktreeSession.tmuxSessionName,
    hookBased: worktreeSession.hookBased
  } : null, project2 = getProject();
  if (project2.currentSessionWorktree = stripped, project2.sessionFile)
    appendEntryToFile(project2.sessionFile, {
      type: "worktree-state",
      worktreeSession: stripped,
      sessionId: getSessionId()
    });
}
function getSessionIdFromLog(log3) {
  if (log3.sessionId)
    return log3.sessionId;
  return log3.messages[0]?.sessionId;
}
function isLiteLog(log3) {
  return log3.messages.length === 0 && log3.sessionId !== void 0;
}
async function loadFullLog(log3) {
  if (!isLiteLog(log3))
    return log3;
  let sessionFile = log3.fullPath;
  if (!sessionFile)
    return log3;
  try {
    let {
      messages,
      summaries,
      customTitles,
      tags,
      agentNames,
      agentColors,
      agentSettings,
      prNumbers,
      prUrls,
      prRepositories,
      modes,
      worktreeStates,
      fileHistorySnapshots,
      attributionSnapshots,
      contentReplacements,
      contextCollapseCommits,
      contextCollapseSnapshot,
      leafUuids
    } = await loadTranscriptFile(sessionFile);
    if (messages.size === 0)
      return log3;
    let mostRecentLeaf = findLatestMessage(messages.values(), (msg) => leafUuids.has(msg.uuid) && (msg.type === "user" || msg.type === "assistant"));
    if (!mostRecentLeaf)
      return log3;
    let transcript = buildConversationChain(messages, mostRecentLeaf), sessionId = mostRecentLeaf.sessionId;
    return {
      ...log3,
      messages: removeExtraFields(transcript),
      firstPrompt: extractFirstPrompt2(transcript),
      messageCount: countVisibleMessages(transcript),
      summary: mostRecentLeaf ? summaries.get(mostRecentLeaf.uuid) : log3.summary,
      customTitle: sessionId ? customTitles.get(sessionId) : log3.customTitle,
      tag: sessionId ? tags.get(sessionId) : log3.tag,
      agentName: sessionId ? agentNames.get(sessionId) : log3.agentName,
      agentColor: sessionId ? agentColors.get(sessionId) : log3.agentColor,
      agentSetting: sessionId ? agentSettings.get(sessionId) : log3.agentSetting,
      mode: sessionId ? modes.get(sessionId) : log3.mode,
      worktreeSession: sessionId && worktreeStates.has(sessionId) ? worktreeStates.get(sessionId) : log3.worktreeSession,
      prNumber: sessionId ? prNumbers.get(sessionId) : log3.prNumber,
      prUrl: sessionId ? prUrls.get(sessionId) : log3.prUrl,
      prRepository: sessionId ? prRepositories.get(sessionId) : log3.prRepository,
      gitBranch: mostRecentLeaf?.gitBranch ?? log3.gitBranch,
      isSidechain: transcript[0]?.isSidechain ?? log3.isSidechain,
      teamName: transcript[0]?.teamName ?? log3.teamName,
      leafUuid: mostRecentLeaf?.uuid ?? log3.leafUuid,
      fileHistorySnapshots: buildFileHistorySnapshotChain(fileHistorySnapshots, transcript),
      attributionSnapshots: buildAttributionSnapshotChain(attributionSnapshots, transcript),
      contentReplacements: sessionId ? contentReplacements.get(sessionId) ?? [] : log3.contentReplacements,
      contextCollapseCommits: sessionId ? contextCollapseCommits.filter((e) => e.sessionId === sessionId) : void 0,
      contextCollapseSnapshot: sessionId && contextCollapseSnapshot?.sessionId === sessionId ? contextCollapseSnapshot : void 0
    };
  } catch {
    return log3;
  }
}
async function searchSessionsByCustomTitle(query3, options2) {
  let { limit, exact } = options2 || {}, worktreePaths = await getWorktreePaths(getOriginalCwd()), allStatLogs = await getStatOnlyLogsForWorktrees(worktreePaths), { logs: logs2 } = await enrichLogs(allStatLogs, 0, allStatLogs.length), normalizedQuery = query3.toLowerCase().trim(), matchingLogs = logs2.filter((log3) => {
    let title = log3.customTitle?.toLowerCase().trim();
    if (!title)
      return !1;
    return exact ? title === normalizedQuery : title.includes(normalizedQuery);
  }), sessionIdToLog = /* @__PURE__ */ new Map;
  for (let log3 of matchingLogs) {
    let sessionId = getSessionIdFromLog(log3);
    if (sessionId) {
      let existing = sessionIdToLog.get(sessionId);
      if (!existing || log3.modified > existing.modified)
        sessionIdToLog.set(sessionId, log3);
    }
  }
  let deduplicated = Array.from(sessionIdToLog.values());
  if (deduplicated.sort((a2, b) => b.modified.getTime() - a2.modified.getTime()), limit)
    return deduplicated.slice(0, limit);
  return deduplicated;
}
function resolveMetadataBuf(carry, chunkBuf) {
  if (carry === null || carry.length === 0)
    return chunkBuf;
  if (carry.length < METADATA_PREFIX_BOUND)
    return Buffer.concat([carry, chunkBuf]);
  if (carry[0] === 123) {
    for (let m4 of METADATA_MARKER_BUFS)
      if (carry.compare(m4, 0, m4.length, 1, 1 + m4.length) === 0)
        return Buffer.concat([carry, chunkBuf]);
  }
  let firstNl = chunkBuf.indexOf(10);
  return firstNl === -1 ? null : chunkBuf.subarray(firstNl + 1);
}
async function scanPreBoundaryMetadata(filePath, endOffset) {
  let { createReadStream: createReadStream3 } = await import("fs"), NEWLINE2 = 10, stream10 = createReadStream3(filePath, { end: endOffset - 1 }), metadataLines = [], carry = null;
  for await (let chunk2 of stream10) {
    let buf = resolveMetadataBuf(carry, chunk2);
    if (buf === null) {
      carry = null;
      continue;
    }
    let hasAnyMarker = !1;
    for (let m4 of METADATA_MARKER_BUFS)
      if (buf.includes(m4)) {
        hasAnyMarker = !0;
        break;
      }
    if (hasAnyMarker) {
      let lineStart = 0, nl = buf.indexOf(10);
      while (nl !== -1) {
        for (let m4 of METADATA_MARKER_BUFS) {
          let mIdx = buf.indexOf(m4, lineStart);
          if (mIdx !== -1 && mIdx < nl) {
            metadataLines.push(buf.toString("utf-8", lineStart, nl));
            break;
          }
        }
        lineStart = nl + 1, nl = buf.indexOf(10, lineStart);
      }
      carry = buf.subarray(lineStart);
    } else {
      let lastNl = buf.lastIndexOf(10);
      carry = lastNl >= 0 ? buf.subarray(lastNl + 1) : buf;
    }
    if (carry.length > 65536)
      carry = null;
  }
  if (carry !== null && carry.length > 0) {
    for (let m4 of METADATA_MARKER_BUFS)
      if (carry.includes(m4)) {
        metadataLines.push(carry.toString("utf-8"));
        break;
      }
  }
  return metadataLines;
}
function pickDepthOneUuidCandidate(buf, lineStart, candidates) {
  let depth = 0, inString = !1, escapeNext = !1, ci = 0;
  for (let i5 = lineStart;ci < candidates.length; i5++) {
    if (i5 === candidates[ci]) {
      if (depth === 1 && !inString)
        return candidates[ci];
      ci++;
    }
    let b = buf[i5];
    if (escapeNext)
      escapeNext = !1;
    else if (inString) {
      if (b === 92)
        escapeNext = !0;
      else if (b === 34)
        inString = !1;
    } else if (b === 34)
      inString = !0;
    else if (b === 123)
      depth++;
    else if (b === 125)
      depth--;
  }
  return candidates.at(-1);
}
function walkChainBeforeParse(buf) {
  let PARENT_PREFIX = Buffer.from('{"parentUuid":'), UUID_KEY = Buffer.from('"uuid":"'), SIDECHAIN_TRUE = Buffer.from('"isSidechain":true'), UUID_LEN = 36, TS_SUFFIX = Buffer.from('","timestamp":"'), TS_SUFFIX_LEN = TS_SUFFIX.length, PREFIX_LEN = PARENT_PREFIX.length, KEY_LEN = UUID_KEY.length, msgIdx = [], metaRanges = [], uuidToSlot = /* @__PURE__ */ new Map, pos = 0, len = buf.length;
  while (pos < len) {
    let nl = buf.indexOf(10, pos), lineEnd = nl === -1 ? len : nl + 1;
    if (lineEnd - pos > PREFIX_LEN && buf[pos] === 123 && buf.compare(PARENT_PREFIX, 0, PREFIX_LEN, pos, pos + PREFIX_LEN) === 0) {
      let parentStart = buf[pos + PREFIX_LEN] === 34 ? pos + PREFIX_LEN + 1 : -1, firstAny = -1, suffix0 = -1, suffixN, from = pos;
      for (;; ) {
        let next2 = buf.indexOf(UUID_KEY, from);
        if (next2 < 0 || next2 >= lineEnd)
          break;
        if (firstAny < 0)
          firstAny = next2;
        let after2 = next2 + KEY_LEN + 36;
        if (after2 + TS_SUFFIX_LEN <= lineEnd && buf.compare(TS_SUFFIX, 0, TS_SUFFIX_LEN, after2, after2 + TS_SUFFIX_LEN) === 0)
          if (suffix0 < 0)
            suffix0 = next2;
          else
            (suffixN ??= [suffix0]).push(next2);
        from = next2 + KEY_LEN;
      }
      let uk = suffixN ? pickDepthOneUuidCandidate(buf, pos, suffixN) : suffix0 >= 0 ? suffix0 : firstAny;
      if (uk >= 0) {
        let uuidStart = uk + KEY_LEN, uuid8 = buf.toString("latin1", uuidStart, uuidStart + 36);
        uuidToSlot.set(uuid8, msgIdx.length), msgIdx.push(pos, lineEnd, parentStart);
      } else
        metaRanges.push(pos, lineEnd);
    } else
      metaRanges.push(pos, lineEnd);
    pos = lineEnd;
  }
  let leafSlot = -1;
  for (let i5 = msgIdx.length - 3;i5 >= 0; i5 -= 3) {
    let sc = buf.indexOf(SIDECHAIN_TRUE, msgIdx[i5]);
    if (sc === -1 || sc >= msgIdx[i5 + 1]) {
      leafSlot = i5;
      break;
    }
  }
  if (leafSlot < 0)
    return buf;
  let seen = /* @__PURE__ */ new Set, chain4 = /* @__PURE__ */ new Set, chainBytes = 0, slot = leafSlot;
  while (slot !== void 0) {
    if (seen.has(slot))
      break;
    seen.add(slot), chain4.add(msgIdx[slot]), chainBytes += msgIdx[slot + 1] - msgIdx[slot];
    let parentStart = msgIdx[slot + 2];
    if (parentStart < 0)
      break;
    let parent2 = buf.toString("latin1", parentStart, parentStart + 36);
    slot = uuidToSlot.get(parent2);
  }
  if (len - chainBytes < len >> 1)
    return buf;
  let parts = [], m4 = 0;
  for (let i5 = 0;i5 < msgIdx.length; i5 += 3) {
    let start = msgIdx[i5];
    while (m4 < metaRanges.length && metaRanges[m4] < start)
      parts.push(buf.subarray(metaRanges[m4], metaRanges[m4 + 1])), m4 += 2;
    if (chain4.has(start))
      parts.push(buf.subarray(start, msgIdx[i5 + 1]));
  }
  while (m4 < metaRanges.length)
    parts.push(buf.subarray(metaRanges[m4], metaRanges[m4 + 1])), m4 += 2;
  return Buffer.concat(parts);
}
async function loadTranscriptFile(filePath, opts) {
  let messages = /* @__PURE__ */ new Map, summaries = /* @__PURE__ */ new Map, customTitles = /* @__PURE__ */ new Map, tags = /* @__PURE__ */ new Map, agentNames = /* @__PURE__ */ new Map, agentColors = /* @__PURE__ */ new Map, agentSettings = /* @__PURE__ */ new Map, prNumbers = /* @__PURE__ */ new Map, prUrls = /* @__PURE__ */ new Map, prRepositories = /* @__PURE__ */ new Map, modes = /* @__PURE__ */ new Map, worktreeStates = /* @__PURE__ */ new Map, fileHistorySnapshots = /* @__PURE__ */ new Map, attributionSnapshots = /* @__PURE__ */ new Map, contentReplacements = /* @__PURE__ */ new Map, agentContentReplacements = /* @__PURE__ */ new Map, contextCollapseCommits = [], contextCollapseSnapshot;
  try {
    let buf = null, metadataLines = null, hasPreservedSegment = !1;
    if (!isEnvTruthy(process.env.CLAUDE_CODE_DISABLE_PRECOMPACT_SKIP)) {
      let { size } = await stat38(filePath);
      if (size > SKIP_PRECOMPACT_THRESHOLD) {
        let scan = await readTranscriptForLoad(filePath, size);
        if (buf = scan.postBoundaryBuf, hasPreservedSegment = scan.hasPreservedSegment, scan.boundaryStartOffset > 0)
          metadataLines = await scanPreBoundaryMetadata(filePath, scan.boundaryStartOffset);
      }
    }
    if (buf ??= await readFile51(filePath), !opts?.keepAllLeaves && !hasPreservedSegment && !isEnvTruthy(process.env.CLAUDE_CODE_DISABLE_PRECOMPACT_SKIP) && buf.length > SKIP_PRECOMPACT_THRESHOLD)
      buf = walkChainBeforeParse(buf);
    if (metadataLines && metadataLines.length > 0) {
      let metaEntries = parseJSONL(Buffer.from(metadataLines.join(`
`)));
      for (let entry of metaEntries)
        if (entry.type === "summary" && entry.leafUuid)
          summaries.set(entry.leafUuid, entry.summary);
        else if (entry.type === "custom-title" && entry.sessionId)
          customTitles.set(entry.sessionId, entry.customTitle);
        else if (entry.type === "tag" && entry.sessionId)
          tags.set(entry.sessionId, entry.tag);
        else if (entry.type === "agent-name" && entry.sessionId)
          agentNames.set(entry.sessionId, entry.agentName);
        else if (entry.type === "agent-color" && entry.sessionId)
          agentColors.set(entry.sessionId, entry.agentColor);
        else if (entry.type === "agent-setting" && entry.sessionId)
          agentSettings.set(entry.sessionId, entry.agentSetting);
        else if (entry.type === "mode" && entry.sessionId)
          modes.set(entry.sessionId, entry.mode);
        else if (entry.type === "worktree-state" && entry.sessionId)
          worktreeStates.set(entry.sessionId, entry.worktreeSession);
        else if (entry.type === "pr-link" && entry.sessionId)
          prNumbers.set(entry.sessionId, entry.prNumber), prUrls.set(entry.sessionId, entry.prUrl), prRepositories.set(entry.sessionId, entry.prRepository);
    }
    let entries2 = parseJSONL(buf), progressBridge = /* @__PURE__ */ new Map;
    for (let entry of entries2) {
      if (isLegacyProgressEntry(entry)) {
        let parent2 = entry.parentUuid;
        progressBridge.set(entry.uuid, parent2 && progressBridge.has(parent2) ? progressBridge.get(parent2) ?? null : parent2);
        continue;
      }
      if (isTranscriptMessage(entry)) {
        if (entry.parentUuid && progressBridge.has(entry.parentUuid))
          entry.parentUuid = progressBridge.get(entry.parentUuid) ?? null;
        if (messages.set(entry.uuid, entry), isCompactBoundaryMessage(entry))
          contextCollapseCommits.length = 0, contextCollapseSnapshot = void 0;
      } else if (entry.type === "summary" && entry.leafUuid)
        summaries.set(entry.leafUuid, entry.summary);
      else if (entry.type === "custom-title" && entry.sessionId)
        customTitles.set(entry.sessionId, entry.customTitle);
      else if (entry.type === "tag" && entry.sessionId)
        tags.set(entry.sessionId, entry.tag);
      else if (entry.type === "agent-name" && entry.sessionId)
        agentNames.set(entry.sessionId, entry.agentName);
      else if (entry.type === "agent-color" && entry.sessionId)
        agentColors.set(entry.sessionId, entry.agentColor);
      else if (entry.type === "agent-setting" && entry.sessionId)
        agentSettings.set(entry.sessionId, entry.agentSetting);
      else if (entry.type === "mode" && entry.sessionId)
        modes.set(entry.sessionId, entry.mode);
      else if (entry.type === "worktree-state" && entry.sessionId)
        worktreeStates.set(entry.sessionId, entry.worktreeSession);
      else if (entry.type === "pr-link" && entry.sessionId)
        prNumbers.set(entry.sessionId, entry.prNumber), prUrls.set(entry.sessionId, entry.prUrl), prRepositories.set(entry.sessionId, entry.prRepository);
      else if (entry.type === "file-history-snapshot")
        fileHistorySnapshots.set(entry.messageId, entry);
      else if (entry.type === "attribution-snapshot")
        attributionSnapshots.set(entry.messageId, entry);
      else if (entry.type === "content-replacement")
        if (entry.agentId) {
          let existing = agentContentReplacements.get(entry.agentId) ?? [];
          agentContentReplacements.set(entry.agentId, existing), existing.push(...entry.replacements);
        } else {
          let existing = contentReplacements.get(entry.sessionId) ?? [];
          contentReplacements.set(entry.sessionId, existing), existing.push(...entry.replacements);
        }
      else if (entry.type === "marble-origami-commit")
        contextCollapseCommits.push(entry);
      else if (entry.type === "marble-origami-snapshot")
        contextCollapseSnapshot = entry;
    }
  } catch {}
  applyPreservedSegmentRelinks(messages), applySnipRemovals(messages);
  let allMessages = [...messages.values()], parentUuids = new Set(allMessages.map((msg) => msg.parentUuid).filter((uuid8) => uuid8 !== null)), terminalMessages = allMessages.filter((msg) => !parentUuids.has(msg.uuid)), leafUuids = /* @__PURE__ */ new Set, hasCycle = !1;
  for (let terminal of terminalMessages) {
    let seen = /* @__PURE__ */ new Set, current = terminal;
    while (current) {
      if (seen.has(current.uuid)) {
        hasCycle = !0;
        break;
      }
      if (seen.add(current.uuid), current.type === "user" || current.type === "assistant") {
        leafUuids.add(current.uuid);
        break;
      }
      current = current.parentUuid ? messages.get(current.parentUuid) : void 0;
    }
  }
  if (hasCycle)
    logEvent("tengu_transcript_parent_cycle", {});
  return {
    messages,
    summaries,
    customTitles,
    tags,
    agentNames,
    agentColors,
    agentSettings,
    prNumbers,
    prUrls,
    prRepositories,
    modes,
    worktreeStates,
    fileHistorySnapshots,
    attributionSnapshots,
    contentReplacements,
    agentContentReplacements,
    contextCollapseCommits,
    contextCollapseSnapshot,
    leafUuids
  };
}
async function loadSessionFile(sessionId) {
  let sessionFile = join134(getSessionProjectDir() ?? getProjectDir2(getOriginalCwd()), `${sessionId}.jsonl`);
  return loadTranscriptFile(sessionFile);
}
function clearSessionMessagesCache() {
  getSessionMessages.cache.clear?.();
}
async function doesMessageExistInSession(sessionId, messageUuid) {
  return (await getSessionMessages(sessionId)).has(messageUuid);
}
async function getLastSessionLog(sessionId) {
  let {
    messages,
    summaries,
    customTitles,
    tags,
    agentSettings,
    worktreeStates,
    fileHistorySnapshots,
    attributionSnapshots,
    contentReplacements,
    contextCollapseCommits,
    contextCollapseSnapshot
  } = await loadSessionFile(sessionId);
  if (messages.size === 0)
    return null;
  if (!getSessionMessages.cache.has(sessionId))
    getSessionMessages.cache.set(sessionId, Promise.resolve(new Set(messages.keys())));
  let lastMessage = findLatestMessage(messages.values(), (m4) => !m4.isSidechain);
  if (!lastMessage)
    return null;
  let transcript = buildConversationChain(messages, lastMessage), summary = summaries.get(lastMessage.uuid), customTitle = customTitles.get(lastMessage.sessionId), tag3 = tags.get(lastMessage.sessionId), agentSetting = agentSettings.get(sessionId);
  return {
    ...convertToLogOption(transcript, 0, summary, customTitle, buildFileHistorySnapshotChain(fileHistorySnapshots, transcript), tag3, getTranscriptPathForSession(sessionId), buildAttributionSnapshotChain(attributionSnapshots, transcript), agentSetting, contentReplacements.get(sessionId) ?? []),
    worktreeSession: worktreeStates.get(sessionId),
    contextCollapseCommits: contextCollapseCommits.filter((e) => e.sessionId === sessionId),
    contextCollapseSnapshot: contextCollapseSnapshot?.sessionId === sessionId ? contextCollapseSnapshot : void 0
  };
}
async function loadMessageLogs(limit) {
  let sessionLogs = await fetchLogs(limit), { logs: enriched } = await enrichLogs(sessionLogs, 0, sessionLogs.length), sorted = sortLogs(enriched);
  return sorted.forEach((log3, i5) => {
    log3.value = i5;
  }), sorted;
}
async function loadAllProjectsMessageLogs(limit, options2) {
  if (options2?.skipIndex)
    return loadAllProjectsMessageLogsFull(limit);
  return (await loadAllProjectsMessageLogsProgressive(limit, options2?.initialEnrichCount ?? INITIAL_ENRICH_COUNT)).logs;
}
async function loadAllProjectsMessageLogsFull(limit) {
  let projectsDir = getProjectsDir2(), dirents;
  try {
    dirents = await readdir27(projectsDir, { withFileTypes: !0 });
  } catch {
    return [];
  }
  let projectDirs = dirents.filter((dirent) => dirent.isDirectory()).map((dirent) => join134(projectsDir, dirent.name)), allLogs = (await Promise.all(projectDirs.map((projectDir) => getLogsWithoutIndex(projectDir, limit)))).flat(), deduped = /* @__PURE__ */ new Map;
  for (let log3 of allLogs) {
    let key3 = `${log3.sessionId ?? ""}:${log3.leafUuid ?? ""}`, existing = deduped.get(key3);
    if (!existing || log3.modified.getTime() > existing.modified.getTime())
      deduped.set(key3, log3);
  }
  let sorted = sortLogs([...deduped.values()]);
  return sorted.forEach((log3, i5) => {
    log3.value = i5;
  }), sorted;
}
async function loadAllProjectsMessageLogsProgressive(limit, initialEnrichCount = INITIAL_ENRICH_COUNT) {
  let projectsDir = getProjectsDir2(), dirents;
  try {
    dirents = await readdir27(projectsDir, { withFileTypes: !0 });
  } catch {
    return { logs: [], allStatLogs: [], nextIndex: 0 };
  }
  let projectDirs = dirents.filter((dirent) => dirent.isDirectory()).map((dirent) => join134(projectsDir, dirent.name)), rawLogs = [];
  for (let projectDir of projectDirs)
    rawLogs.push(...await getSessionFilesLite(projectDir, limit));
  let sorted = deduplicateLogsBySessionId(rawLogs), { logs: logs2, nextIndex } = await enrichLogs(sorted, 0, initialEnrichCount);
  return logs2.forEach((log3, i5) => {
    log3.value = i5;
  }), { logs: logs2, allStatLogs: sorted, nextIndex };
}
async function loadSameRepoMessageLogs(worktreePaths, limit, initialEnrichCount = INITIAL_ENRICH_COUNT) {
  return (await loadSameRepoMessageLogsProgressive(worktreePaths, limit, initialEnrichCount)).logs;
}
async function loadSameRepoMessageLogsProgressive(worktreePaths, limit, initialEnrichCount = INITIAL_ENRICH_COUNT) {
  logForDebugging(`/resume: loading sessions for cwd=${getOriginalCwd()}, worktrees=[${worktreePaths.join(", ")}]`);
  let allStatLogs = await getStatOnlyLogsForWorktrees(worktreePaths, limit);
  logForDebugging(`/resume: found ${allStatLogs.length} session files on disk`);
  let { logs: logs2, nextIndex } = await enrichLogs(allStatLogs, 0, initialEnrichCount);
  return logs2.forEach((log3, i5) => {
    log3.value = i5;
  }), { logs: logs2, allStatLogs, nextIndex };
}
async function getStatOnlyLogsForWorktrees(worktreePaths, limit) {
  let projectsDir = getProjectsDir2();
  if (worktreePaths.length <= 1) {
    let cwd2 = getOriginalCwd(), projectDir = getProjectDir2(cwd2);
    return getSessionFilesLite(projectDir, void 0, cwd2);
  }
  let caseInsensitive = process.platform === "win32", indexed = worktreePaths.map((wt) => {
    let sanitized = sanitizePath2(wt);
    return {
      path: wt,
      prefix: caseInsensitive ? sanitized.toLowerCase() : sanitized
    };
  });
  indexed.sort((a2, b) => b.prefix.length - a2.prefix.length);
  let allLogs = [], seenDirs = /* @__PURE__ */ new Set, allDirents;
  try {
    allDirents = await readdir27(projectsDir, { withFileTypes: !0 });
  } catch (e) {
    logForDebugging(`Failed to read projects dir ${projectsDir}, falling back to current project: ${e}`);
    let projectDir = getProjectDir2(getOriginalCwd());
    return getSessionFilesLite(projectDir, limit, getOriginalCwd());
  }
  for (let dirent of allDirents) {
    if (!dirent.isDirectory())
      continue;
    let dirName = caseInsensitive ? dirent.name.toLowerCase() : dirent.name;
    if (seenDirs.has(dirName))
      continue;
    for (let { path: wtPath, prefix } of indexed)
      if (dirName === prefix || dirName.startsWith(prefix + "-")) {
        seenDirs.add(dirName), allLogs.push(...await getSessionFilesLite(join134(projectsDir, dirent.name), void 0, wtPath));
        break;
      }
  }
  return deduplicateLogsBySessionId(allLogs);
}
async function getAgentTranscript(agentId) {
  let agentFile = getAgentTranscriptPath(agentId);
  try {
    let { messages, agentContentReplacements } = await loadTranscriptFile(agentFile), agentMessages = Array.from(messages.values()).filter((msg) => msg.agentId === agentId && msg.isSidechain);
    if (agentMessages.length === 0)
      return null;
    let parentUuids = new Set(agentMessages.map((msg) => msg.parentUuid)), leafMessage = findLatestMessage(agentMessages, (msg) => !parentUuids.has(msg.uuid));
    if (!leafMessage)
      return null;
    return {
      messages: buildConversationChain(messages, leafMessage).filter((msg) => msg.agentId === agentId).map(({ isSidechain, parentUuid, ...msg }) => msg),
      contentReplacements: agentContentReplacements.get(agentId) ?? []
    };
  } catch {
    return null;
  }
}
function extractAgentIdsFromMessages(messages) {
  let agentIds = [];
  for (let message of messages)
    if (message.type === "progress" && message.data && typeof message.data === "object" && "type" in message.data && (message.data.type === "agent_progress" || message.data.type === "skill_progress") && "agentId" in message.data && typeof message.data.agentId === "string")
      agentIds.push(message.data.agentId);
  return uniq(agentIds);
}
function extractTeammateTranscriptsFromTasks(tasks2) {
  let transcripts = {};
  for (let task of Object.values(tasks2))
    if (task.type === "in_process_teammate" && task.identity?.agentId && task.messages && task.messages.length > 0)
      transcripts[task.identity.agentId] = task.messages;
  return transcripts;
}
async function loadSubagentTranscripts(agentIds) {
  let results = await Promise.all(agentIds.map(async (agentId) => {
    try {
      let result = await getAgentTranscript(asAgentId(agentId));
      if (result && result.messages.length > 0)
        return { agentId, transcript: result.messages };
      return null;
    } catch {
      return null;
    }
  })), transcripts = {};
  for (let result of results)
    if (result)
      transcripts[result.agentId] = result.transcript;
  return transcripts;
}
async function loadAllSubagentTranscriptsFromDisk() {
  let subagentsDir = join134(getSessionProjectDir() ?? getProjectDir2(getOriginalCwd()), getSessionId(), "subagents"), entries2;
  try {
    entries2 = await readdir27(subagentsDir, { withFileTypes: !0 });
  } catch {
    return {};
  }
  let agentIds = entries2.filter((d) => d.isFile() && d.name.startsWith("agent-") && d.name.endsWith(".jsonl")).map((d) => d.name.slice(6, -6));
  return loadSubagentTranscripts(agentIds);
}
function isLoggableMessage(m4) {
  if (m4.type === "progress")
    return !1;
  if (m4.type === "attachment" && getUserType() !== "ant") {
    if (m4.attachment.type === "hook_additional_context" && isEnvTruthy(process.env.CLAUDE_CODE_SAVE_HOOK_ADDITIONAL_CONTEXT))
      return !0;
    return !1;
  }
  return !0;
}
function collectReplIds(messages) {
  let ids = /* @__PURE__ */ new Set;
  for (let m4 of messages)
    if (m4.type === "assistant" && Array.isArray(m4.message.content)) {
      for (let b of m4.message.content)
        if (b.type === "tool_use" && b.name === REPL_TOOL_NAME)
          ids.add(b.id);
    }
  return ids;
}
function transformMessagesForExternalTranscript(messages, replIds) {
  return messages.flatMap((m4) => {
    if (m4.type === "assistant" && Array.isArray(m4.message.content)) {
      let content = m4.message.content, filtered = content.some((b) => b.type === "tool_use" && b.name === REPL_TOOL_NAME) ? content.filter((b) => !(b.type === "tool_use" && b.name === REPL_TOOL_NAME)) : content;
      if (filtered.length === 0)
        return [];
      if (m4.isVirtual) {
        let { isVirtual: _omit, ...rest } = m4;
        return [{ ...rest, message: { ...m4.message, content: filtered } }];
      }
      if (filtered !== content)
        return [{ ...m4, message: { ...m4.message, content: filtered } }];
      return [m4];
    }
    if (m4.type === "user" && Array.isArray(m4.message.content)) {
      let content = m4.message.content, filtered = content.some((b) => b.type === "tool_result" && replIds.has(b.tool_use_id)) ? content.filter((b) => !(b.type === "tool_result" && replIds.has(b.tool_use_id))) : content;
      if (filtered.length === 0)
        return [];
      if (m4.isVirtual) {
        let { isVirtual: _omit, ...rest } = m4;
        return [{ ...rest, message: { ...m4.message, content: filtered } }];
      }
      if (filtered !== content)
        return [{ ...m4, message: { ...m4.message, content: filtered } }];
      return [m4];
    }
    if ("isVirtual" in m4 && m4.isVirtual) {
      let { isVirtual: _omit, ...rest } = m4;
      return [rest];
    }
    return [m4];
  });
}
function cleanMessagesForLogging(messages, allMessages = messages) {
  let filtered = messages.filter(isLoggableMessage);
  return getUserType() !== "ant" ? transformMessagesForExternalTranscript(filtered, collectReplIds(allMessages)) : filtered;
}
async function getLogByIndex(index) {
  return (await loadMessageLogs())[index] || null;
}
async function findUnresolvedToolUse(toolUseId) {
  try {
    let transcriptPath = getTranscriptPath(), { messages } = await loadTranscriptFile(transcriptPath), toolUseMessage = null;
    for (let message of messages.values())
      if (message.type === "assistant") {
        let content = message.message.content;
        if (Array.isArray(content)) {
          for (let block2 of content)
            if (block2.type === "tool_use" && block2.id === toolUseId) {
              toolUseMessage = message;
              break;
            }
        }
      } else if (message.type === "user") {
        let content = message.message.content;
        if (Array.isArray(content)) {
          for (let block2 of content)
            if (block2.type === "tool_result" && block2.tool_use_id === toolUseId)
              return null;
        }
      }
    return toolUseMessage;
  } catch {
    return null;
  }
}
async function getSessionFilesWithMtime(projectDir) {
  let sessionFilesMap = /* @__PURE__ */ new Map, dirents;
  try {
    dirents = await readdir27(projectDir, { withFileTypes: !0 });
  } catch {
    return sessionFilesMap;
  }
  let candidates = [];
  for (let dirent of dirents) {
    if (!dirent.isFile() || !dirent.name.endsWith(".jsonl"))
      continue;
    let sessionId = validateUuid2(basename40(dirent.name, ".jsonl"));
    if (!sessionId)
      continue;
    candidates.push({ sessionId, filePath: join134(projectDir, dirent.name) });
  }
  return await Promise.all(candidates.map(async ({ sessionId, filePath }) => {
    try {
      let st = await stat38(filePath);
      sessionFilesMap.set(sessionId, {
        path: filePath,
        mtime: st.mtime.getTime(),
        ctime: st.birthtime.getTime(),
        size: st.size
      });
    } catch {
      logForDebugging(`Failed to stat session file: ${filePath}`);
    }
  })), sessionFilesMap;
}
async function loadAllLogsFromSessionFile(sessionFile, projectPathOverride) {
  let {
    messages,
    summaries,
    customTitles,
    tags,
    agentNames,
    agentColors,
    agentSettings,
    prNumbers,
    prUrls,
    prRepositories,
    modes,
    fileHistorySnapshots,
    attributionSnapshots,
    contentReplacements,
    leafUuids
  } = await loadTranscriptFile(sessionFile, { keepAllLeaves: !0 });
  if (messages.size === 0)
    return [];
  let leafMessages = [], childrenByParent = /* @__PURE__ */ new Map;
  for (let msg of messages.values())
    if (leafUuids.has(msg.uuid))
      leafMessages.push(msg);
    else if (msg.parentUuid) {
      let siblings = childrenByParent.get(msg.parentUuid);
      if (siblings)
        siblings.push(msg);
      else
        childrenByParent.set(msg.parentUuid, [msg]);
    }
  let logs2 = [];
  for (let leafMessage of leafMessages) {
    let chain4 = buildConversationChain(messages, leafMessage);
    if (chain4.length === 0)
      continue;
    let trailingMessages = childrenByParent.get(leafMessage.uuid);
    if (trailingMessages)
      trailingMessages.sort((a2, b) => a2.timestamp < b.timestamp ? -1 : a2.timestamp > b.timestamp ? 1 : 0), chain4.push(...trailingMessages);
    let firstMessage = chain4[0], sessionId = leafMessage.sessionId;
    logs2.push({
      date: leafMessage.timestamp,
      messages: removeExtraFields(chain4),
      fullPath: sessionFile,
      value: 0,
      created: new Date(firstMessage.timestamp),
      modified: new Date(leafMessage.timestamp),
      firstPrompt: extractFirstPrompt2(chain4),
      messageCount: countVisibleMessages(chain4),
      isSidechain: firstMessage.isSidechain ?? !1,
      sessionId,
      leafUuid: leafMessage.uuid,
      summary: summaries.get(leafMessage.uuid),
      customTitle: customTitles.get(sessionId),
      tag: tags.get(sessionId),
      agentName: agentNames.get(sessionId),
      agentColor: agentColors.get(sessionId),
      agentSetting: agentSettings.get(sessionId),
      mode: modes.get(sessionId),
      prNumber: prNumbers.get(sessionId),
      prUrl: prUrls.get(sessionId),
      prRepository: prRepositories.get(sessionId),
      gitBranch: leafMessage.gitBranch,
      projectPath: projectPathOverride ?? firstMessage.cwd,
      fileHistorySnapshots: buildFileHistorySnapshotChain(fileHistorySnapshots, chain4),
      attributionSnapshots: buildAttributionSnapshotChain(attributionSnapshots, chain4),
      contentReplacements: contentReplacements.get(sessionId) ?? []
    });
  }
  return logs2;
}
async function getLogsWithoutIndex(projectDir, limit) {
  let sessionFilesMap = await getSessionFilesWithMtime(projectDir);
  if (sessionFilesMap.size === 0)
    return [];
  let filesToProcess;
  if (limit && sessionFilesMap.size > limit)
    filesToProcess = [...sessionFilesMap.values()].sort((a2, b) => b.mtime - a2.mtime).slice(0, limit);
  else
    filesToProcess = [...sessionFilesMap.values()];
  let logs2 = [];
  for (let fileInfo of filesToProcess)
    try {
      let fileLogOptions = await loadAllLogsFromSessionFile(fileInfo.path);
      logs2.push(...fileLogOptions);
    } catch {
      logForDebugging(`Failed to load session file: ${fileInfo.path}`);
    }
  return logs2;
}
async function readLiteMetadata(filePath, fileSize, buf) {
  let { head, tail } = await readHeadAndTail(filePath, fileSize, buf);
  if (!head)
    return { firstPrompt: "", isSidechain: !1 };
  let isSidechain = head.includes('"isSidechain":true') || head.includes('"isSidechain": true'), projectPath = extractJsonStringField(head, "cwd"), teamName = extractJsonStringField(head, "teamName"), agentSetting = extractJsonStringField(head, "agentSetting"), firstPrompt = extractLastJsonStringField(tail, "lastPrompt") || extractFirstPromptFromChunk(head) || extractJsonStringFieldPrefix(head, "content", 200) || extractJsonStringFieldPrefix(head, "text", 200) || "", customTitle = extractLastJsonStringField(tail, "customTitle") ?? extractLastJsonStringField(head, "customTitle") ?? extractLastJsonStringField(tail, "aiTitle") ?? extractLastJsonStringField(head, "aiTitle"), summary = extractLastJsonStringField(tail, "summary"), tag3 = extractLastJsonStringField(tail, "tag"), gitBranch = extractLastJsonStringField(tail, "gitBranch") ?? extractJsonStringField(head, "gitBranch"), prUrl = extractLastJsonStringField(tail, "prUrl"), prRepository = extractLastJsonStringField(tail, "prRepository"), prNumber, prNumStr = extractLastJsonStringField(tail, "prNumber");
  if (prNumStr)
    prNumber = parseInt(prNumStr, 10) || void 0;
  if (!prNumber) {
    let prNumMatch = tail.lastIndexOf('"prNumber":');
    if (prNumMatch >= 0) {
      let afterColon = tail.slice(prNumMatch + 11, prNumMatch + 25), num = parseInt(afterColon.trim(), 10);
      if (num > 0)
        prNumber = num;
    }
  }
  return {
    firstPrompt,
    gitBranch,
    isSidechain,
    projectPath,
    teamName,
    customTitle,
    summary,
    tag: tag3,
    agentSetting,
    prNumber,
    prUrl,
    prRepository
  };
}
function extractFirstPromptFromChunk(chunk2) {
  let start = 0, hasTickMessages = !1, firstCommandFallback = "";
  while (start < chunk2.length) {
    let newlineIdx = chunk2.indexOf(`
`, start), line = newlineIdx >= 0 ? chunk2.slice(start, newlineIdx) : chunk2.slice(start);
    if (start = newlineIdx >= 0 ? newlineIdx + 1 : chunk2.length, !line.includes('"type":"user"') && !line.includes('"type": "user"'))
      continue;
    if (line.includes('"tool_result"'))
      continue;
    if (line.includes('"isMeta":true') || line.includes('"isMeta": true'))
      continue;
    try {
      let entry = jsonParse(line);
      if (entry.type !== "user")
        continue;
      let message = entry.message;
      if (!message)
        continue;
      let content = message.content, texts = [];
      if (typeof content === "string")
        texts.push(content);
      else if (Array.isArray(content))
        for (let block2 of content) {
          let b = block2;
          if (b.type === "text" && typeof b.text === "string")
            texts.push(b.text);
        }
      for (let text2 of texts) {
        if (!text2)
          continue;
        let result = text2.replace(/\n/g, " ").trim(), commandNameTag = extractTag(result, COMMAND_NAME_TAG);
        if (commandNameTag) {
          let name3 = commandNameTag.replace(/^\//, ""), commandArgs = extractTag(result, "command-args")?.trim() || "";
          if (builtInCommandNames().has(name3) || !commandArgs) {
            if (!firstCommandFallback)
              firstCommandFallback = commandNameTag;
            continue;
          }
          return commandArgs ? `${commandNameTag} ${commandArgs}` : commandNameTag;
        }
        let bashInput = extractTag(result, "bash-input");
        if (bashInput)
          return `! ${bashInput}`;
        if (SKIP_FIRST_PROMPT_PATTERN.test(result)) {
          if (result.startsWith(`<${TICK_TAG}>`))
            hasTickMessages = !0;
          continue;
        }
        if (result.length > 200)
          result = result.slice(0, 200).trim() + "\u2026";
        return result;
      }
    } catch {
      continue;
    }
  }
  if (firstCommandFallback)
    return firstCommandFallback;
  if (hasTickMessages)
    return "Proactive session";
  return "";
}
function extractJsonStringFieldPrefix(text2, key3, maxLen) {
  let patterns = [`"${key3}":"`, `"${key3}": "`];
  for (let pattern of patterns) {
    let idx = text2.indexOf(pattern);
    if (idx < 0)
      continue;
    let valueStart = idx + pattern.length, i5 = valueStart, collected = 0;
    while (i5 < text2.length && collected < maxLen) {
      if (text2[i5] === "\\") {
        i5 += 2, collected++;
        continue;
      }
      if (text2[i5] === '"')
        break;
      i5++, collected++;
    }
    return text2.slice(valueStart, i5).replace(/\\n/g, " ").replace(/\\t/g, " ").trim();
  }
  return "";
}
function deduplicateLogsBySessionId(logs2) {
  let deduped = /* @__PURE__ */ new Map;
  for (let log3 of logs2) {
    if (!log3.sessionId)
      continue;
    let existing = deduped.get(log3.sessionId);
    if (!existing || log3.modified.getTime() > existing.modified.getTime())
      deduped.set(log3.sessionId, log3);
  }
  return sortLogs([...deduped.values()]).map((log3, i5) => ({
    ...log3,
    value: i5
  }));
}
async function getSessionFilesLite(projectDir, limit, projectPath) {
  let entries2 = [...(await getSessionFilesWithMtime(projectDir)).entries()].sort((a2, b) => b[1].mtime - a2[1].mtime);
  if (limit && entries2.length > limit)
    entries2 = entries2.slice(0, limit);
  let logs2 = [];
  for (let [sessionId, fileInfo] of entries2)
    logs2.push({
      date: new Date(fileInfo.mtime).toISOString(),
      messages: [],
      isLite: !0,
      fullPath: fileInfo.path,
      value: 0,
      created: new Date(fileInfo.ctime),
      modified: new Date(fileInfo.mtime),
      firstPrompt: "",
      messageCount: 0,
      fileSize: fileInfo.size,
      isSidechain: !1,
      sessionId,
      projectPath
    });
  let sorted = sortLogs(logs2);
  return sorted.forEach((log3, i5) => {
    log3.value = i5;
  }), sorted;
}
async function enrichLog(log3, readBuf) {
  if (!log3.isLite || !log3.fullPath)
    return log3;
  let meta = await readLiteMetadata(log3.fullPath, log3.fileSize ?? 0, readBuf), enriched = {
    ...log3,
    isLite: !1,
    firstPrompt: meta.firstPrompt,
    gitBranch: meta.gitBranch,
    isSidechain: meta.isSidechain,
    teamName: meta.teamName,
    customTitle: meta.customTitle,
    summary: meta.summary,
    tag: meta.tag,
    agentSetting: meta.agentSetting,
    prNumber: meta.prNumber,
    prUrl: meta.prUrl,
    prRepository: meta.prRepository,
    projectPath: meta.projectPath ?? log3.projectPath
  };
  if (!enriched.firstPrompt && !enriched.customTitle)
    enriched.firstPrompt = "(session)";
  if (enriched.isSidechain)
    return logForDebugging(`Session ${log3.sessionId} filtered from /resume: isSidechain=true`), null;
  if (enriched.teamName)
    return logForDebugging(`Session ${log3.sessionId} filtered from /resume: teamName=${enriched.teamName}`), null;
  return enriched;
}
async function enrichLogs(allLogs, startIndex, count4) {
  let result = [], readBuf = Buffer.alloc(LITE_READ_BUF_SIZE), i5 = startIndex;
  while (i5 < allLogs.length && result.length < count4) {
    let log3 = allLogs[i5];
    i5++;
    let enriched = await enrichLog(log3, readBuf);
    if (enriched)
      result.push(enriched);
  }
  let scanned = i5 - startIndex, filtered = scanned - result.length;
  if (filtered > 0)
    logForDebugging(`/resume: enriched ${scanned} sessions, ${filtered} filtered out, ${result.length} visible (${allLogs.length - i5} remaining on disk)`);
  return { logs: result, nextIndex: i5 };
}
var VERSION5, MAX_TOMBSTONE_REWRITE_BYTES = 52428800, SKIP_FIRST_PROMPT_PATTERN, EPHEMERAL_PROGRESS_TYPES, MAX_TRANSCRIPT_READ_BYTES = 52428800, agentTranscriptSubdirs, getProjectDir2, project = null, cleanupRegistered5 = !1, REMOTE_FLUSH_INTERVAL_MS = 10, METADATA_TYPE_MARKERS, METADATA_MARKER_BUFS, METADATA_PREFIX_BOUND = 25, getSessionMessages, INITIAL_ENRICH_COUNT = 50;
var init_sessionStorage = __esm(() => {
  init_memoize();
  init_state();
  init_commands5();
  init_xml();
  init_sessionIngress();
  init_constants9();
  init_ids();
  init_cleanupRegistry();
  init_concurrentSessions();
  init_cwd2();
  init_debug();
  init_diagLogs();
  init_envUtils();
  init_errors();
  init_format();
  init_fsOperations();
  init_getWorktreePaths();
  init_git();
  init_gracefulShutdown();
  init_json();
  init_log3();
  init_messages3();
  init_path2();
  init_sessionStoragePortable();
  init_settings2();
  init_slowOperations();
  init_uuid();
  VERSION5 = typeof MACRO < "u" ? "2.1.90" : "unknown", SKIP_FIRST_PROMPT_PATTERN = /^(?:\s*<[a-z][\w-]*[\s>]|\[Request interrupted by user[^\]]*\])/;
  EPHEMERAL_PROGRESS_TYPES = /* @__PURE__ */ new Set([
    "bash_progress",
    "powershell_progress",
    "mcp_progress",
    "sleep_progress"
  ]);
  agentTranscriptSubdirs = /* @__PURE__ */ new Map;
  getProjectDir2 = memoize_default((projectDir) => {
    return join134(getProjectsDir2(), sanitizePath2(projectDir));
  });
  METADATA_TYPE_MARKERS = [
    '"type":"summary"',
    '"type":"custom-title"',
    '"type":"tag"',
    '"type":"agent-name"',
    '"type":"agent-color"',
    '"type":"agent-setting"',
    '"type":"mode"',
    '"type":"worktree-state"',
    '"type":"pr-link"'
  ], METADATA_MARKER_BUFS = METADATA_TYPE_MARKERS.map((m4) => Buffer.from(m4));
  getSessionMessages = memoize_default(async (sessionId) => {
    let { messages } = await loadSessionFile(sessionId);
    return new Set(messages.keys());
  }, (sessionId) => sessionId);
});

