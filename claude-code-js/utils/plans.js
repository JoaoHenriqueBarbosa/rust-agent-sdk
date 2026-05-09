// Original: src/utils/plans.ts
import { randomUUID as randomUUID26 } from "crypto";
import { copyFile as copyFile10, writeFile as writeFile44 } from "fs/promises";
import { join as join135, resolve as resolve44, sep as sep31 } from "path";
function getPlanSlug(sessionId) {
  let id = sessionId ?? getSessionId(), cache7 = getPlanSlugCache(), slug = cache7.get(id);
  if (!slug) {
    let plansDir = getPlansDirectory();
    for (let i5 = 0;i5 < MAX_SLUG_RETRIES; i5++) {
      slug = generateWordSlug();
      let filePath = join135(plansDir, `${slug}.md`);
      if (!getFsImplementation().existsSync(filePath))
        break;
    }
    cache7.set(id, slug);
  }
  return slug;
}
function setPlanSlug(sessionId, slug) {
  getPlanSlugCache().set(sessionId, slug);
}
function clearAllPlanSlugs() {
  getPlanSlugCache().clear();
}
function getPlanFilePath(agentId) {
  let planSlug = getPlanSlug(getSessionId());
  if (!agentId)
    return join135(getPlansDirectory(), `${planSlug}.md`);
  return join135(getPlansDirectory(), `${planSlug}-agent-${agentId}.md`);
}
function getPlan(agentId) {
  let filePath = getPlanFilePath(agentId);
  try {
    return getFsImplementation().readFileSync(filePath, { encoding: "utf-8" });
  } catch (error44) {
    if (isENOENT(error44))
      return null;
    return logError2(error44), null;
  }
}
function getSlugFromLog(log3) {
  return log3.messages.find((m4) => m4.slug)?.slug;
}
async function copyPlanForResume(log3, targetSessionId) {
  let slug = getSlugFromLog(log3);
  if (!slug)
    return !1;
  let sessionId = targetSessionId ?? getSessionId();
  setPlanSlug(sessionId, slug);
  let planPath = join135(getPlansDirectory(), `${slug}.md`);
  try {
    return await getFsImplementation().readFile(planPath, { encoding: "utf-8" }), !0;
  } catch (e) {
    if (!isENOENT(e))
      return logError2(e), !1;
    if (getEnvironmentKind() === null)
      return !1;
    logForDebugging(`Plan file missing during resume: ${planPath}. Attempting recovery.`);
    let snapshotPlan = findFileSnapshotEntry(log3.messages, "plan"), recovered = null;
    if (snapshotPlan && snapshotPlan.content.length > 0)
      recovered = snapshotPlan.content, logForDebugging(`Plan recovered from file snapshot, ${recovered.length} chars`, { level: "info" });
    else if (recovered = recoverPlanFromMessages(log3), recovered)
      logForDebugging(`Plan recovered from message history, ${recovered.length} chars`, { level: "info" });
    if (recovered)
      try {
        return await writeFile44(planPath, recovered, { encoding: "utf-8" }), !0;
      } catch (writeError) {
        return logError2(writeError), !1;
      }
    return logForDebugging("Plan file recovery failed: no file snapshot or plan content found in message history"), !1;
  }
}
async function copyPlanForFork(log3, targetSessionId) {
  let originalSlug = getSlugFromLog(log3);
  if (!originalSlug)
    return !1;
  let plansDir = getPlansDirectory(), originalPlanPath = join135(plansDir, `${originalSlug}.md`), newSlug = getPlanSlug(targetSessionId), newPlanPath = join135(plansDir, `${newSlug}.md`);
  try {
    return await copyFile10(originalPlanPath, newPlanPath), !0;
  } catch (error44) {
    if (isENOENT(error44))
      return !1;
    return logError2(error44), !1;
  }
}
function recoverPlanFromMessages(log3) {
  for (let i5 = log3.messages.length - 1;i5 >= 0; i5--) {
    let msg = log3.messages[i5];
    if (!msg)
      continue;
    if (msg.type === "assistant") {
      let { content } = msg.message;
      if (Array.isArray(content)) {
        for (let block2 of content)
          if (block2.type === "tool_use" && block2.name === EXIT_PLAN_MODE_V2_TOOL_NAME) {
            let plan2 = block2.input?.plan;
            if (typeof plan2 === "string" && plan2.length > 0)
              return plan2;
          }
      }
    }
    if (msg.type === "user") {
      let userMsg = msg;
      if (typeof userMsg.planContent === "string" && userMsg.planContent.length > 0)
        return userMsg.planContent;
    }
    if (msg.type === "attachment") {
      let attachmentMsg = msg;
      if (attachmentMsg.attachment?.type === "plan_file_reference") {
        let plan2 = attachmentMsg.attachment.planContent;
        if (typeof plan2 === "string" && plan2.length > 0)
          return plan2;
      }
    }
  }
  return null;
}
function findFileSnapshotEntry(messages, key3) {
  for (let i5 = messages.length - 1;i5 >= 0; i5--) {
    let msg = messages[i5];
    if (msg?.type === "system" && "subtype" in msg && msg.subtype === "file_snapshot" && "snapshotFiles" in msg)
      return msg.snapshotFiles.find((f) => f.key === key3);
  }
  return;
}
async function persistFileSnapshotIfRemote() {
  if (getEnvironmentKind() === null)
    return;
  try {
    let snapshotFiles = [], plan2 = getPlan();
    if (plan2)
      snapshotFiles.push({
        key: "plan",
        path: getPlanFilePath(),
        content: plan2
      });
    if (snapshotFiles.length === 0)
      return;
    let message = {
      type: "system",
      subtype: "file_snapshot",
      content: "File snapshot",
      level: "info",
      isMeta: !0,
      timestamp: (/* @__PURE__ */ new Date()).toISOString(),
      uuid: randomUUID26(),
      snapshotFiles
    }, { recordTranscript: recordTranscript2 } = await Promise.resolve().then(() => (init_sessionStorage(), exports_sessionStorage));
    await recordTranscript2([message]);
  } catch (error44) {
    logError2(error44);
  }
}
var MAX_SLUG_RETRIES = 10, getPlansDirectory;
var init_plans = __esm(() => {
  init_memoize();
  init_state();
  init_cwd2();
  init_debug();
  init_envUtils();
  init_errors();
  init_outputsScanner();
  init_fsOperations();
  init_log3();
  init_settings2();
  init_words();
  getPlansDirectory = memoize_default(function() {
    let settingsDir = getInitialSettings().plansDirectory, plansPath;
    if (settingsDir) {
      let cwd2 = getCwd(), resolved = resolve44(cwd2, settingsDir);
      if (!resolved.startsWith(cwd2 + sep31) && resolved !== cwd2)
        logError2(Error(`plansDirectory must be within project root: ${settingsDir}`)), plansPath = join135(getClaudeConfigHomeDir(), "plans");
      else
        plansPath = resolved;
    } else
      plansPath = join135(getClaudeConfigHomeDir(), "plans");
    try {
      getFsImplementation().mkdirSync(plansPath);
    } catch (error44) {
      logError2(error44);
    }
    return plansPath;
  });
});
