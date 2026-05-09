// Original: src/utils/ultraplan/ccrSession.ts
class ExitPlanModeScanner {
  exitPlanCalls = [];
  results = /* @__PURE__ */ new Map;
  rejectedIds = /* @__PURE__ */ new Set;
  terminated = null;
  rescanAfterRejection = !1;
  everSeenPending = !1;
  get rejectCount() {
    return this.rejectedIds.size;
  }
  get hasPendingPlan() {
    let id = this.exitPlanCalls.findLast((c3) => !this.rejectedIds.has(c3));
    return id !== void 0 && !this.results.has(id);
  }
  ingest(newEvents) {
    for (let m4 of newEvents)
      if (m4.type === "assistant")
        for (let block2 of m4.message.content) {
          if (block2.type !== "tool_use")
            continue;
          let tu = block2;
          if (tu.name === EXIT_PLAN_MODE_V2_TOOL_NAME)
            this.exitPlanCalls.push(tu.id);
        }
      else if (m4.type === "user") {
        let content = m4.message.content;
        if (!Array.isArray(content))
          continue;
        for (let block2 of content)
          if (block2.type === "tool_result")
            this.results.set(block2.tool_use_id, block2);
      } else if (m4.type === "result" && m4.subtype !== "success")
        this.terminated = { subtype: m4.subtype };
    let shouldScan = newEvents.length > 0 || this.rescanAfterRejection;
    this.rescanAfterRejection = !1;
    let found = null;
    if (shouldScan) {
      for (let i5 = this.exitPlanCalls.length - 1;i5 >= 0; i5--) {
        let id = this.exitPlanCalls[i5];
        if (this.rejectedIds.has(id))
          continue;
        let tr = this.results.get(id);
        if (!tr)
          found = { kind: "pending" };
        else if (tr.is_error === !0) {
          let teleportPlan = extractTeleportPlan(tr.content);
          found = teleportPlan !== null ? { kind: "teleport", plan: teleportPlan } : { kind: "rejected", id };
        } else
          found = { kind: "approved", plan: extractApprovedPlan(tr.content) };
        break;
      }
      if (found?.kind === "approved" || found?.kind === "teleport")
        return found;
    }
    if (found?.kind === "rejected")
      this.rejectedIds.add(found.id), this.rescanAfterRejection = !0;
    if (this.terminated)
      return { kind: "terminated", subtype: this.terminated.subtype };
    if (found?.kind === "rejected")
      return found;
    if (found?.kind === "pending")
      return this.everSeenPending = !0, found;
    return { kind: "unchanged" };
  }
}
async function pollForApprovedExitPlanMode(sessionId, timeoutMs, onPhaseChange, shouldStop) {
  let deadline = Date.now() + timeoutMs, scanner = new ExitPlanModeScanner, cursor = null, failures = 0, lastPhase = "running";
  while (Date.now() < deadline) {
    if (shouldStop?.())
      throw new UltraplanPollError("poll stopped by caller", "stopped", scanner.rejectCount);
    let newEvents, sessionStatus;
    try {
      let resp = await pollRemoteSessionEvents(sessionId, cursor);
      newEvents = resp.newEvents, cursor = resp.lastEventId, sessionStatus = resp.sessionStatus, failures = 0;
    } catch (e) {
      if (!isTransientNetworkError(e) || ++failures >= MAX_CONSECUTIVE_FAILURES)
        throw new UltraplanPollError(e instanceof Error ? e.message : String(e), "network_or_unknown", scanner.rejectCount, { cause: e });
      await sleep3(POLL_INTERVAL_MS2);
      continue;
    }
    let result;
    try {
      result = scanner.ingest(newEvents);
    } catch (e) {
      throw new UltraplanPollError(e instanceof Error ? e.message : String(e), "extract_marker_missing", scanner.rejectCount);
    }
    if (result.kind === "approved")
      return {
        plan: result.plan,
        rejectCount: scanner.rejectCount,
        executionTarget: "remote"
      };
    if (result.kind === "teleport")
      return {
        plan: result.plan,
        rejectCount: scanner.rejectCount,
        executionTarget: "local"
      };
    if (result.kind === "terminated")
      throw new UltraplanPollError(`remote session ended (${result.subtype}) before plan approval`, "terminated", scanner.rejectCount);
    let quietIdle = (sessionStatus === "idle" || sessionStatus === "requires_action") && newEvents.length === 0, phase = scanner.hasPendingPlan ? "plan_ready" : quietIdle ? "needs_input" : "running";
    if (phase !== lastPhase)
      logForDebugging(`[ultraplan] phase ${lastPhase} \u2192 ${phase}`), lastPhase = phase, onPhaseChange?.(phase);
    await sleep3(POLL_INTERVAL_MS2);
  }
  throw new UltraplanPollError(scanner.everSeenPending ? `no approval after ${timeoutMs / 1000}s` : `ExitPlanMode never reached after ${timeoutMs / 1000}s (the remote container failed to start, or session ID mismatch?)`, scanner.everSeenPending ? "timeout_pending" : "timeout_no_plan", scanner.rejectCount);
}
function contentToText(content) {
  return typeof content === "string" ? content : Array.isArray(content) ? content.map((b) => ("text" in b) ? b.text : "").join("") : "";
}
function extractTeleportPlan(content) {
  let text2 = contentToText(content), marker = `${ULTRAPLAN_TELEPORT_SENTINEL}
`, idx = text2.indexOf(marker);
  if (idx === -1)
    return null;
  return text2.slice(idx + marker.length).trimEnd();
}
function extractApprovedPlan(content) {
  let text2 = contentToText(content), markers = [
    `## Approved Plan (edited by user):
`,
    `## Approved Plan:
`
  ];
  for (let marker of markers) {
    let idx = text2.indexOf(marker);
    if (idx !== -1)
      return text2.slice(idx + marker.length).trimEnd();
  }
  throw Error(`ExitPlanMode approved but tool_result has no "## Approved Plan:" marker \u2014 remote may have hit the empty-plan or isAgent branch. Content preview: ${text2.slice(0, 200)}`);
}
var POLL_INTERVAL_MS2 = 3000, MAX_CONSECUTIVE_FAILURES = 5, UltraplanPollError, ULTRAPLAN_TELEPORT_SENTINEL = "__ULTRAPLAN_TELEPORT_LOCAL__";
var init_ccrSession = __esm(() => {
  init_debug();
  init_api2();
  init_teleport();
  UltraplanPollError = class UltraplanPollError extends Error {
    reason;
    rejectCount;
    constructor(message, reason, rejectCount, options2) {
      super(message, options2);
      this.reason = reason;
      this.rejectCount = rejectCount;
      this.name = "UltraplanPollError";
    }
  };
});

// src/utils/ultraplan/prompt.txt
var require_prompt = __commonJS((exports, module) => {
  module.exports = `You are an expert software architect performing an ULTRAPLAN session.

Your task is to produce a comprehensive, step-by-step implementation plan for the user's request. The plan should be detailed enough that a skilled developer (or an AI coding agent) can execute it without further clarification.

## Plan Structure

1. **Goal Statement**: A single sentence summarizing the objective.
2. **Context Analysis**: Key files, modules, and dependencies involved.
3. **Risk Assessment**: What could go wrong, edge cases, breaking changes.
4. **Implementation Steps**: Numbered, ordered steps with:
   - File path(s) to modify or create
   - What to change and why
   - Expected behavior after the change
5. **Verification Plan**: How to test that the implementation is correct.
6. **Rollback Strategy**: How to undo if something goes wrong.

## Guidelines

- Be specific about file paths and function names.
- Consider backwards compatibility.
- Flag any steps that require user input or decision.
- Estimate relative complexity of each step (low/medium/high).
- Group related changes into logical phases.
`;
});
