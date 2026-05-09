// Original: src/commands/branch/branch.ts
var exports_branch = {};
__export(exports_branch, {
  deriveFirstPrompt: () => deriveFirstPrompt,
  call: () => call47
});
import { randomUUID as randomUUID25 } from "crypto";
import { mkdir as mkdir30, readFile as readFile45, writeFile as writeFile37 } from "fs/promises";
function deriveFirstPrompt(firstUserMessage) {
  let content = firstUserMessage?.message?.content;
  if (!content)
    return "Branched conversation";
  let raw = typeof content === "string" ? content : content.find((block2) => block2.type === "text")?.text;
  if (!raw)
    return "Branched conversation";
  return raw.replace(/\s+/g, " ").trim().slice(0, 100) || "Branched conversation";
}
async function createFork(customTitle) {
  let forkSessionId = randomUUID25(), originalSessionId = getSessionId(), projectDir = getProjectDir2(getOriginalCwd()), forkSessionPath = getTranscriptPathForSession(forkSessionId), currentTranscriptPath = getTranscriptPath();
  await mkdir30(projectDir, { recursive: !0, mode: 448 });
  let transcriptContent;
  try {
    transcriptContent = await readFile45(currentTranscriptPath);
  } catch {
    throw Error("No conversation to branch");
  }
  if (transcriptContent.length === 0)
    throw Error("No conversation to branch");
  let entries2 = parseJSONL(transcriptContent), mainConversationEntries = entries2.filter((entry) => isTranscriptMessage(entry) && !entry.isSidechain), contentReplacementRecords = entries2.filter((entry) => entry.type === "content-replacement" && entry.sessionId === originalSessionId).flatMap((entry) => entry.replacements);
  if (mainConversationEntries.length === 0)
    throw Error("No messages to branch");
  let parentUuid = null, lines2 = [], serializedMessages = [];
  for (let entry of mainConversationEntries) {
    let forkedEntry = {
      ...entry,
      sessionId: forkSessionId,
      parentUuid,
      isSidechain: !1,
      forkedFrom: {
        sessionId: originalSessionId,
        messageUuid: entry.uuid
      }
    }, serialized = {
      ...entry,
      sessionId: forkSessionId
    };
    if (serializedMessages.push(serialized), lines2.push(jsonStringify(forkedEntry)), entry.type !== "progress")
      parentUuid = entry.uuid;
  }
  if (contentReplacementRecords.length > 0) {
    let forkedReplacementEntry = {
      type: "content-replacement",
      sessionId: forkSessionId,
      replacements: contentReplacementRecords
    };
    lines2.push(jsonStringify(forkedReplacementEntry));
  }
  return await writeFile37(forkSessionPath, lines2.join(`
`) + `
`, {
    encoding: "utf8",
    mode: 384
  }), {
    sessionId: forkSessionId,
    title: customTitle,
    forkPath: forkSessionPath,
    serializedMessages,
    contentReplacementRecords
  };
}
async function getUniqueForkName(baseName) {
  let candidateName = `${baseName} (Branch)`;
  if ((await searchSessionsByCustomTitle(candidateName, { exact: !0 })).length === 0)
    return candidateName;
  let existingForks = await searchSessionsByCustomTitle(`${baseName} (Branch`), usedNumbers = /* @__PURE__ */ new Set([1]), forkNumberPattern = new RegExp(`^${escapeRegExp(baseName)} \\(Branch(?: (\\d+))?\\)$`);
  for (let session2 of existingForks) {
    let match = session2.customTitle?.match(forkNumberPattern);
    if (match)
      if (match[1])
        usedNumbers.add(parseInt(match[1], 10));
      else
        usedNumbers.add(1);
  }
  let nextNumber = 2;
  while (usedNumbers.has(nextNumber))
    nextNumber++;
  return `${baseName} (Branch ${nextNumber})`;
}
async function call47(onDone, context7, args) {
  let customTitle = args?.trim() || void 0, originalSessionId = getSessionId();
  try {
    let {
      sessionId,
      title,
      forkPath,
      serializedMessages,
      contentReplacementRecords
    } = await createFork(customTitle), now2 = /* @__PURE__ */ new Date, firstPrompt = deriveFirstPrompt(serializedMessages.find((m4) => m4.type === "user")), effectiveTitle = await getUniqueForkName(title ?? firstPrompt);
    await saveCustomTitle(sessionId, effectiveTitle, forkPath), logEvent("tengu_conversation_forked", {
      message_count: serializedMessages.length,
      has_custom_title: !!title
    });
    let forkLog = {
      date: now2.toISOString().split("T")[0],
      messages: serializedMessages,
      fullPath: forkPath,
      value: now2.getTime(),
      created: now2,
      modified: now2,
      firstPrompt,
      messageCount: serializedMessages.length,
      isSidechain: !1,
      sessionId,
      customTitle: effectiveTitle,
      contentReplacements: contentReplacementRecords
    }, titleInfo = title ? ` "${title}"` : "", resumeHint = `
To resume the original: claude -r ${originalSessionId}`, successMessage = `Branched conversation${titleInfo}. You are now in the branch.${resumeHint}`;
    if (context7.resume)
      await context7.resume(sessionId, forkLog, "fork"), onDone(successMessage, { display: "system" });
    else
      onDone(`Branched conversation${titleInfo}. Resume with: /resume ${sessionId}`);
    return null;
  } catch (error44) {
    let message = error44 instanceof Error ? error44.message : "Unknown error occurred";
    return onDone(`Failed to branch conversation: ${message}`), null;
  }
}
var init_branch = __esm(() => {
  init_state();
  init_json();
  init_sessionStorage();
  init_slowOperations();
});
