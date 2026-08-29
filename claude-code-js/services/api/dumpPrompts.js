// Original: src/services/api/dumpPrompts.ts
import { createHash as createHash7 } from "crypto";
import { promises as fs15 } from "fs";
import { dirname as dirname25, join as join45 } from "path";
function hashString2(str) {
  return createHash7("sha256").update(str).digest("hex");
}
function clearDumpState(agentIdOrSessionId) {
  dumpState.delete(agentIdOrSessionId);
}
function clearAllDumpState() {
  dumpState.clear();
}
function addApiRequestToCache(requestData) {
  if (cachedApiRequests.push({
    timestamp: (/* @__PURE__ */ new Date()).toISOString(),
    request: requestData
  }), cachedApiRequests.length > MAX_CACHED_REQUESTS)
    cachedApiRequests.shift();
}
function getDumpPromptsPath(agentIdOrSessionId) {
  return join45(getClaudeConfigHomeDir(), "dump-prompts", `${agentIdOrSessionId ?? getSessionId()}.jsonl`);
}
function appendToFile(filePath, entries) {
  if (entries.length === 0)
    return;
  fs15.mkdir(dirname25(filePath), { recursive: !0 }).then(() => fs15.appendFile(filePath, entries.join(`
`) + `
`)).catch(() => {});
}
function initFingerprint(req) {
  let { tools, system } = req, sysLen = typeof system === "string" ? system.length : Array.isArray(system) ? system.reduce((n5, b) => n5 + (b.text?.length ?? 0), 0) : 0, toolNames = tools?.map((t2) => t2.name ?? "").join(",") ?? "";
  return `${req.model}|${toolNames}|${sysLen}`;
}
function dumpRequest(body, ts, state3, filePath) {
  try {
    let req = jsonParse(body);
    addApiRequestToCache(req);
    return;
  } catch {}
}
function createDumpPromptsFetch(agentIdOrSessionId) {
  let filePath = getDumpPromptsPath(agentIdOrSessionId);
  return async (input, init2) => {
    let state3 = dumpState.get(agentIdOrSessionId) ?? {
      initialized: !1,
      messageCountSeen: 0,
      lastInitDataHash: "",
      lastInitFingerprint: ""
    };
    dumpState.set(agentIdOrSessionId, state3);
    let timestamp;
    if (init2?.method === "POST" && init2.body)
      timestamp = (/* @__PURE__ */ new Date()).toISOString(), setImmediate(dumpRequest, init2.body, timestamp, state3, filePath);
    let response7 = await globalThis.fetch(input, init2);
    return timestamp && response7.ok, response7;
  };
}
var MAX_CACHED_REQUESTS = 5, cachedApiRequests, dumpState;
var init_dumpPrompts = __esm(() => {
  init_state();
  init_envUtils();
  init_slowOperations();
  cachedApiRequests = [], dumpState = /* @__PURE__ */ new Map;
});
