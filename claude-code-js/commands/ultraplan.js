// Original: src/commands/ultraplan.tsx
function getUltraplanModel() {
  return ALL_MODEL_CONFIGS.opus46.firstParty;
}
function buildUltraplanPrompt(blurb, seedPlan) {
  let parts = [];
  if (seedPlan)
    parts.push("Here is a draft plan to refine:", "", seedPlan, "");
  if (parts.push(ULTRAPLAN_INSTRUCTIONS), blurb)
    parts.push("", blurb);
  return parts.join(`
`);
}
function startDetachedPoll(taskId, sessionId, url3, getAppState, setAppState) {
  let started = Date.now(), failed = !1;
  (async () => {
    try {
      let {
        plan,
        rejectCount,
        executionTarget
      } = await pollForApprovedExitPlanMode(sessionId, ULTRAPLAN_TIMEOUT_MS, (phase) => {
        if (phase === "needs_input")
          logEvent("tengu_ultraplan_awaiting_input", {});
        updateTaskState(taskId, setAppState, (t2) => {
          if (t2.status !== "running")
            return t2;
          let next2 = phase === "running" ? void 0 : phase;
          return t2.ultraplanPhase === next2 ? t2 : {
            ...t2,
            ultraplanPhase: next2
          };
        });
      }, () => getAppState().tasks?.[taskId]?.status !== "running");
      if (logEvent("tengu_ultraplan_approved", {
        duration_ms: Date.now() - started,
        plan_length: plan.length,
        reject_count: rejectCount,
        execution_target: executionTarget
      }), executionTarget === "remote") {
        if (getAppState().tasks?.[taskId]?.status !== "running")
          return;
        updateTaskState(taskId, setAppState, (t2) => t2.status !== "running" ? t2 : {
          ...t2,
          status: "completed",
          endTime: Date.now()
        }), setAppState((prev) => prev.ultraplanSessionUrl === url3 ? {
          ...prev,
          ultraplanSessionUrl: void 0
        } : prev), enqueuePendingNotification({
          value: [`Ultraplan approved \u2014 executing in Claude Code on the web. Follow along at: ${url3}`, "", "Results will land as a pull request when the remote session finishes. There is nothing to do here."].join(`
`),
          mode: "task-notification"
        });
      } else
        setAppState((prev) => {
          let task = prev.tasks?.[taskId];
          if (!task || task.status !== "running")
            return prev;
          return {
            ...prev,
            ultraplanPendingChoice: {
              plan,
              sessionId,
              taskId
            }
          };
        });
    } catch (e) {
      if (getAppState().tasks?.[taskId]?.status !== "running")
        return;
      failed = !0, logEvent("tengu_ultraplan_failed", {
        duration_ms: Date.now() - started,
        reason: e instanceof UltraplanPollError ? e.reason : "network_or_unknown",
        reject_count: e instanceof UltraplanPollError ? e.rejectCount : void 0
      }), enqueuePendingNotification({
        value: `Ultraplan failed: ${errorMessage(e)}

Session: ${url3}`,
        mode: "task-notification"
      }), archiveRemoteSession(sessionId).catch((e2) => logForDebugging(`ultraplan archive failed: ${String(e2)}`)), setAppState((prev) => prev.ultraplanSessionUrl === url3 ? {
        ...prev,
        ultraplanSessionUrl: void 0
      } : prev);
    } finally {
      if (failed)
        updateTaskState(taskId, setAppState, (t2) => t2.status !== "running" ? t2 : {
          ...t2,
          status: "failed",
          endTime: Date.now()
        });
    }
  })();
}
function buildLaunchMessage(_disconnectedBridge) {
  return `${DIAMOND_OPEN} ultraplan
Starting Claude Code on the web\u2026`;
}
function buildSessionReadyMessage(url3) {
  return `${DIAMOND_OPEN} ultraplan \xB7 Monitor progress in Claude Code on the web ${url3}
You can continue working \u2014 when the ${DIAMOND_OPEN} fills, press \u2193 to view results`;
}
function buildAlreadyActiveMessage(url3) {
  return url3 ? `ultraplan: already polling. Open ${url3} to check status, or wait for the plan to land here.` : "ultraplan: already launching. Please wait for the session to start.";
}
async function stopUltraplan(taskId, sessionId, setAppState) {
  await RemoteAgentTask.kill(taskId, setAppState), setAppState((prev) => prev.ultraplanSessionUrl || prev.ultraplanPendingChoice || prev.ultraplanLaunching ? {
    ...prev,
    ultraplanSessionUrl: void 0,
    ultraplanPendingChoice: void 0,
    ultraplanLaunching: void 0
  } : prev);
  let url3 = getRemoteSessionUrl(sessionId, process.env.SESSION_INGRESS_URL);
  enqueuePendingNotification({
    value: `Ultraplan stopped.

Session: ${url3}`,
    mode: "task-notification"
  }), enqueuePendingNotification({
    value: "The user stopped the ultraplan session above. Do not respond to the stop notification \u2014 wait for their next message.",
    mode: "task-notification",
    isMeta: !0
  });
}
async function launchUltraplan2(opts) {
  let {
    blurb,
    seedPlan,
    getAppState,
    setAppState,
    signal,
    disconnectedBridge,
    onSessionReady
  } = opts, {
    ultraplanSessionUrl: active,
    ultraplanLaunching
  } = getAppState();
  if (active || ultraplanLaunching)
    return logEvent("tengu_ultraplan_create_failed", {
      reason: active ? "already_polling" : "already_launching"
    }), buildAlreadyActiveMessage(active);
  if (!blurb && !seedPlan)
    return [
      'Usage: /ultraplan \\<prompt\\>, or include "ultraplan" anywhere',
      "in your prompt",
      "",
      "Advanced multi-agent plan mode with our most powerful model",
      "(Opus). Runs in Claude Code on the web. When the plan is ready,",
      "you can execute it in the web session or send it back here.",
      "Terminal stays free while the remote plans.",
      "Requires /login.",
      "",
      `Terms: ${CCR_TERMS_URL2}`
    ].join(`
`);
  return setAppState((prev) => prev.ultraplanLaunching ? prev : {
    ...prev,
    ultraplanLaunching: !0
  }), launchDetached({
    blurb,
    seedPlan,
    getAppState,
    setAppState,
    signal,
    onSessionReady
  }), buildLaunchMessage(disconnectedBridge);
}
async function launchDetached(opts) {
  let {
    blurb,
    seedPlan,
    getAppState,
    setAppState,
    signal,
    onSessionReady
  } = opts, sessionId;
  try {
    let model = getUltraplanModel(), eligibility = await checkRemoteAgentEligibility();
    if (!eligibility.eligible) {
      logEvent("tengu_ultraplan_create_failed", {
        reason: "precondition",
        precondition_errors: eligibility.errors.map((e) => e.type).join(",")
      });
      let reasons = eligibility.errors.map(formatPreconditionError).join(`
`);
      enqueuePendingNotification({
        value: `ultraplan: cannot launch remote session \u2014
${reasons}`,
        mode: "task-notification"
      });
      return;
    }
    let prompt = buildUltraplanPrompt(blurb, seedPlan), bundleFailMsg, session2 = await teleportToRemote({
      initialMessage: prompt,
      description: blurb || "Refine local plan",
      model,
      permissionMode: "plan",
      ultraplan: !0,
      signal,
      useDefaultEnvironment: !0,
      onBundleFail: (msg) => {
        bundleFailMsg = msg;
      }
    });
    if (!session2) {
      logEvent("tengu_ultraplan_create_failed", {
        reason: bundleFailMsg ? "bundle_fail" : "teleport_null"
      }), enqueuePendingNotification({
        value: `ultraplan: session creation failed${bundleFailMsg ? ` \u2014 ${bundleFailMsg}` : ""}. See --debug for details.`,
        mode: "task-notification"
      });
      return;
    }
    sessionId = session2.id;
    let url3 = getRemoteSessionUrl(session2.id, process.env.SESSION_INGRESS_URL);
    setAppState((prev) => ({
      ...prev,
      ultraplanSessionUrl: url3,
      ultraplanLaunching: void 0
    })), onSessionReady?.(buildSessionReadyMessage(url3)), logEvent("tengu_ultraplan_launched", {
      has_seed_plan: Boolean(seedPlan),
      model
    });
    let {
      taskId
    } = registerRemoteAgentTask({
      remoteTaskType: "ultraplan",
      session: {
        id: session2.id,
        title: blurb || "Ultraplan"
      },
      command: blurb,
      context: {
        abortController: new AbortController,
        getAppState,
        setAppState
      },
      isUltraplan: !0
    });
    startDetachedPoll(taskId, session2.id, url3, getAppState, setAppState);
  } catch (e) {
    if (logError2(e), logEvent("tengu_ultraplan_create_failed", {
      reason: "unexpected_error"
    }), enqueuePendingNotification({
      value: `ultraplan: unexpected error \u2014 ${errorMessage(e)}`,
      mode: "task-notification"
    }), sessionId)
      archiveRemoteSession(sessionId).catch((err2) => logForDebugging("ultraplan: failed to archive orphaned session", err2)), setAppState((prev) => prev.ultraplanSessionUrl ? {
        ...prev,
        ultraplanSessionUrl: void 0
      } : prev);
  } finally {
    setAppState((prev) => prev.ultraplanLaunching ? {
      ...prev,
      ultraplanLaunching: void 0
    } : prev);
  }
}
var ULTRAPLAN_TIMEOUT_MS = 1800000, CCR_TERMS_URL2 = "https://code.claude.com/docs/en/claude-code-on-the-web", _rawPrompt, DEFAULT_INSTRUCTIONS, ULTRAPLAN_INSTRUCTIONS, call35 = async (onDone, context7, args) => {
  let blurb = args.trim();
  if (!blurb) {
    let msg = await launchUltraplan2({
      blurb,
      getAppState: context7.getAppState,
      setAppState: context7.setAppState,
      signal: context7.abortController.signal
    });
    return onDone(msg, {
      display: "system"
    }), null;
  }
  let {
    ultraplanSessionUrl: active,
    ultraplanLaunching
  } = context7.getAppState();
  if (active || ultraplanLaunching)
    return logEvent("tengu_ultraplan_create_failed", {
      reason: active ? "already_polling" : "already_launching"
    }), onDone(buildAlreadyActiveMessage(active), {
      display: "system"
    }), null;
  return context7.setAppState((prev) => ({
    ...prev,
    ultraplanLaunchPending: {
      blurb
    }
  })), onDone(void 0, {
    display: "skip"
  }), null;
}, ultraplan_default;
var init_ultraplan = __esm(() => {
  init_figures2();
  init_RemoteAgentTask();
  init_debug();
  init_errors();
  init_log3();
  init_messageQueueManager();
  init_configs();
  init_framework();
  init_teleport();
  init_ccrSession();
  _rawPrompt = require_prompt(), DEFAULT_INSTRUCTIONS = (typeof _rawPrompt === "string" ? _rawPrompt : _rawPrompt.default).trimEnd(), ULTRAPLAN_INSTRUCTIONS = DEFAULT_INSTRUCTIONS;
  ultraplan_default = {
    type: "local-jsx",
    name: "ultraplan",
    description: `~10\u201330 min \xB7 Claude Code on the web drafts an advanced plan you can edit and approve. See ${CCR_TERMS_URL2}`,
    argumentHint: "<prompt>",
    isEnabled: () => !1,
    load: () => Promise.resolve({
      call: call35
    })
  };
});
