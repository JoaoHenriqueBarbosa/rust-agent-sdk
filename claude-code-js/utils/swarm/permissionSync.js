// Original: src/utils/swarm/permissionSync.ts
function generateRequestId2() {
  return `perm-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
}
function createPermissionRequest(params) {
  let teamName = params.teamName || getTeamName(), workerId = params.workerId || getAgentId(), workerName = params.workerName || getAgentName(), workerColor = params.workerColor || getTeammateColor();
  if (!teamName)
    throw Error("Team name is required for permission requests");
  if (!workerId)
    throw Error("Worker ID is required for permission requests");
  if (!workerName)
    throw Error("Worker name is required for permission requests");
  return {
    id: generateRequestId2(),
    workerId,
    workerName,
    workerColor,
    teamName,
    toolName: params.toolName,
    toolUseId: params.toolUseId,
    description: params.description,
    input: params.input,
    permissionSuggestions: params.permissionSuggestions || [],
    status: "pending",
    createdAt: Date.now()
  };
}
function isTeamLeader(teamName) {
  if (!(teamName || getTeamName()))
    return !1;
  let agentId = getAgentId();
  return !agentId || agentId === "team-lead";
}
function isSwarmWorker() {
  let teamName = getTeamName(), agentId = getAgentId();
  return !!teamName && !!agentId && !isTeamLeader();
}
async function getLeaderName(teamName) {
  let team = teamName || getTeamName();
  if (!team)
    return null;
  let teamFile = await readTeamFileAsync(team);
  if (!teamFile)
    return logForDebugging(`[PermissionSync] Team file not found for team: ${team}`), null;
  return teamFile.members.find((m4) => m4.agentId === teamFile.leadAgentId)?.name || "team-lead";
}
async function sendPermissionRequestViaMailbox(request2) {
  let leaderName = await getLeaderName(request2.teamName);
  if (!leaderName)
    return logForDebugging("[PermissionSync] Cannot send permission request: leader name not found"), !1;
  try {
    let message = createPermissionRequestMessage({
      request_id: request2.id,
      agent_id: request2.workerName,
      tool_name: request2.toolName,
      tool_use_id: request2.toolUseId,
      description: request2.description,
      input: request2.input,
      permission_suggestions: request2.permissionSuggestions
    });
    return await writeToMailbox(leaderName, {
      from: request2.workerName,
      text: jsonStringify(message),
      timestamp: (/* @__PURE__ */ new Date()).toISOString(),
      color: request2.workerColor
    }, request2.teamName), logForDebugging(`[PermissionSync] Sent permission request ${request2.id} to leader ${leaderName} via mailbox`), !0;
  } catch (error44) {
    return logForDebugging(`[PermissionSync] Failed to send permission request via mailbox: ${error44}`), logError2(error44), !1;
  }
}
async function sendPermissionResponseViaMailbox(workerName, resolution, requestId, teamName) {
  let team = teamName || getTeamName();
  if (!team)
    return logForDebugging("[PermissionSync] Cannot send permission response: team name not found"), !1;
  try {
    let message = createPermissionResponseMessage({
      request_id: requestId,
      subtype: resolution.decision === "approved" ? "success" : "error",
      error: resolution.feedback,
      updated_input: resolution.updatedInput,
      permission_updates: resolution.permissionUpdates
    }), senderName = getAgentName() || "team-lead";
    return await writeToMailbox(workerName, {
      from: senderName,
      text: jsonStringify(message),
      timestamp: (/* @__PURE__ */ new Date()).toISOString()
    }, team), logForDebugging(`[PermissionSync] Sent permission response for ${requestId} to worker ${workerName} via mailbox`), !0;
  } catch (error44) {
    return logForDebugging(`[PermissionSync] Failed to send permission response via mailbox: ${error44}`), logError2(error44), !1;
  }
}
function generateSandboxRequestId() {
  return `sandbox-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
}
async function sendSandboxPermissionRequestViaMailbox(host, requestId, teamName) {
  let team = teamName || getTeamName();
  if (!team)
    return logForDebugging("[PermissionSync] Cannot send sandbox permission request: team name not found"), !1;
  let leaderName = await getLeaderName(team);
  if (!leaderName)
    return logForDebugging("[PermissionSync] Cannot send sandbox permission request: leader name not found"), !1;
  let workerId = getAgentId(), workerName = getAgentName(), workerColor = getTeammateColor();
  if (!workerId || !workerName)
    return logForDebugging("[PermissionSync] Cannot send sandbox permission request: worker ID or name not found"), !1;
  try {
    let message = createSandboxPermissionRequestMessage({
      requestId,
      workerId,
      workerName,
      workerColor,
      host
    });
    return await writeToMailbox(leaderName, {
      from: workerName,
      text: jsonStringify(message),
      timestamp: (/* @__PURE__ */ new Date()).toISOString(),
      color: workerColor
    }, team), logForDebugging(`[PermissionSync] Sent sandbox permission request ${requestId} for host ${host} to leader ${leaderName} via mailbox`), !0;
  } catch (error44) {
    return logForDebugging(`[PermissionSync] Failed to send sandbox permission request via mailbox: ${error44}`), logError2(error44), !1;
  }
}
async function sendSandboxPermissionResponseViaMailbox(workerName, requestId, host, allow, teamName) {
  let team = teamName || getTeamName();
  if (!team)
    return logForDebugging("[PermissionSync] Cannot send sandbox permission response: team name not found"), !1;
  try {
    let message = createSandboxPermissionResponseMessage({
      requestId,
      host,
      allow
    }), senderName = getAgentName() || "team-lead";
    return await writeToMailbox(workerName, {
      from: senderName,
      text: jsonStringify(message),
      timestamp: (/* @__PURE__ */ new Date()).toISOString()
    }, team), logForDebugging(`[PermissionSync] Sent sandbox permission response for ${requestId} (host: ${host}, allow: ${allow}) to worker ${workerName} via mailbox`), !0;
  } catch (error44) {
    return logForDebugging(`[PermissionSync] Failed to send sandbox permission response via mailbox: ${error44}`), logError2(error44), !1;
  }
}
var SwarmPermissionRequestSchema;
var init_permissionSync = __esm(() => {
  init_v4();
  init_debug();
  init_errors();
  init_log3();
  init_slowOperations();
  init_teammate();
  init_teammateMailbox();
  init_teamHelpers();
  SwarmPermissionRequestSchema = lazySchema(() => exports_external.object({
    id: exports_external.string(),
    workerId: exports_external.string(),
    workerName: exports_external.string(),
    workerColor: exports_external.string().optional(),
    teamName: exports_external.string(),
    toolName: exports_external.string(),
    toolUseId: exports_external.string(),
    description: exports_external.string(),
    input: exports_external.record(exports_external.string(), exports_external.unknown()),
    permissionSuggestions: exports_external.array(exports_external.unknown()),
    status: exports_external.enum(["pending", "approved", "rejected"]),
    resolvedBy: exports_external.enum(["worker", "leader"]).optional(),
    resolvedAt: exports_external.number().optional(),
    feedback: exports_external.string().optional(),
    updatedInput: exports_external.record(exports_external.string(), exports_external.unknown()).optional(),
    permissionUpdates: exports_external.array(exports_external.unknown()).optional(),
    createdAt: exports_external.number()
  }));
});
