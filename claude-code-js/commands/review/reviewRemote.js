// Original: src/commands/review/reviewRemote.ts
function confirmOverage() {
  sessionOverageConfirmed = !0;
}
async function checkOverageGate() {
  if (isTeamSubscriber() || isEnterpriseSubscriber())
    return { kind: "proceed", billingNote: "" };
  let [quota, utilization] = await Promise.all([
    fetchUltrareviewQuota(),
    fetchUtilization().catch(() => null)
  ]);
  if (!quota)
    return { kind: "proceed", billingNote: "" };
  if (quota.reviews_remaining > 0)
    return {
      kind: "proceed",
      billingNote: ` This is free ultrareview ${quota.reviews_used + 1} of ${quota.reviews_limit}.`
    };
  if (!utilization)
    return { kind: "proceed", billingNote: "" };
  let extraUsage2 = utilization.extra_usage;
  if (!extraUsage2?.is_enabled)
    return logEvent("tengu_review_overage_not_enabled", {}), { kind: "not-enabled" };
  let monthlyLimit = extraUsage2.monthly_limit, usedCredits = extraUsage2.used_credits ?? 0, available = monthlyLimit === null || monthlyLimit === void 0 ? 1 / 0 : monthlyLimit - usedCredits;
  if (available < 10)
    return logEvent("tengu_review_overage_low_balance", { available }), { kind: "low-balance", available };
  if (!sessionOverageConfirmed)
    return logEvent("tengu_review_overage_dialog_shown", {}), { kind: "needs-confirm" };
  return {
    kind: "proceed",
    billingNote: " This review bills as Extra Usage."
  };
}
async function launchRemoteReview(args, context7, billingNote) {
  let eligibility = await checkRemoteAgentEligibility();
  if (!eligibility.eligible) {
    let blockers = eligibility.errors.filter((e) => e.type !== "no_remote_environment");
    if (blockers.length > 0)
      return logEvent("tengu_review_remote_precondition_failed", {
        precondition_errors: blockers.map((e) => e.type).join(",")
      }), [
        {
          type: "text",
          text: `Ultrareview cannot launch:
${blockers.map(formatPreconditionError).join(`
`)}`
        }
      ];
  }
  let resolvedBillingNote = billingNote ?? "", prNumber = args.trim(), isPrNumber = /^\d+$/.test(prNumber), CODE_REVIEW_ENV_ID = "env_011111111111111111111113", raw = null, posInt = (v2, fallback, max2) => {
    if (typeof v2 !== "number" || !Number.isFinite(v2))
      return fallback;
    let n5 = Math.floor(v2);
    if (n5 <= 0)
      return fallback;
    return max2 !== void 0 && n5 > max2 ? fallback : n5;
  }, commonEnvVars = {
    BUGHUNTER_DRY_RUN: "1",
    BUGHUNTER_FLEET_SIZE: String(posInt(raw?.fleet_size, 5, 20)),
    BUGHUNTER_MAX_DURATION: String(posInt(raw?.max_duration_minutes, 10, 25)),
    BUGHUNTER_AGENT_TIMEOUT: String(posInt(raw?.agent_timeout_seconds, 600, 1800)),
    BUGHUNTER_TOTAL_WALLCLOCK: String(posInt(raw?.total_wallclock_minutes, 22, 27)),
    ...process.env.BUGHUNTER_DEV_BUNDLE_B64 && {
      BUGHUNTER_DEV_BUNDLE_B64: process.env.BUGHUNTER_DEV_BUNDLE_B64
    }
  }, session, command16, target;
  if (isPrNumber) {
    let repo = await detectCurrentRepositoryWithHost();
    if (!repo || repo.host !== "github.com")
      return logEvent("tengu_review_remote_precondition_failed", {}), null;
    session = await teleportToRemote({
      initialMessage: null,
      description: `ultrareview: ${repo.owner}/${repo.name}#${prNumber}`,
      signal: context7.abortController.signal,
      branchName: `refs/pull/${prNumber}/head`,
      environmentId: CODE_REVIEW_ENV_ID,
      environmentVariables: {
        BUGHUNTER_PR_NUMBER: prNumber,
        BUGHUNTER_REPOSITORY: `${repo.owner}/${repo.name}`,
        ...commonEnvVars
      }
    }), command16 = `/ultrareview ${prNumber}`, target = `${repo.owner}/${repo.name}#${prNumber}`;
  } else {
    let baseBranch = await getDefaultBranch() || "main", { stdout: mbOut, code: mbCode } = await execFileNoThrow(gitExe(), ["merge-base", baseBranch, "HEAD"], { preserveOutputOnError: !1 }), mergeBaseSha = mbOut.trim();
    if (mbCode !== 0 || !mergeBaseSha)
      return logEvent("tengu_review_remote_precondition_failed", {}), [
        {
          type: "text",
          text: `Could not find merge-base with ${baseBranch}. Make sure you're in a git repo with a ${baseBranch} branch.`
        }
      ];
    let { stdout: diffStat, code: diffCode } = await execFileNoThrow(gitExe(), ["diff", "--shortstat", mergeBaseSha], { preserveOutputOnError: !1 });
    if (diffCode === 0 && !diffStat.trim())
      return logEvent("tengu_review_remote_precondition_failed", {}), [
        {
          type: "text",
          text: `No changes against the ${baseBranch} fork point. Make some commits or stage files first.`
        }
      ];
    if (session = await teleportToRemote({
      initialMessage: null,
      description: `ultrareview: ${baseBranch}`,
      signal: context7.abortController.signal,
      useBundle: !0,
      environmentId: CODE_REVIEW_ENV_ID,
      environmentVariables: {
        BUGHUNTER_BASE_BRANCH: mergeBaseSha,
        ...commonEnvVars
      }
    }), !session)
      return logEvent("tengu_review_remote_teleport_failed", {}), [
        {
          type: "text",
          text: "Repo is too large. Push a PR and use `/ultrareview <PR#>` instead."
        }
      ];
    command16 = "/ultrareview", target = baseBranch;
  }
  if (!session)
    return logEvent("tengu_review_remote_teleport_failed", {}), null;
  registerRemoteAgentTask({
    remoteTaskType: "ultrareview",
    session,
    command: command16,
    context: context7,
    isRemoteReview: !0
  }), logEvent("tengu_review_remote_launched", {});
  let sessionUrl = getRemoteTaskSessionUrl(session.id);
  return [
    {
      type: "text",
      text: `Ultrareview launched for ${target} (~10\u201320 min, runs in the cloud). Track: ${sessionUrl}${resolvedBillingNote} Findings arrive via task-notification. Briefly acknowledge the launch to the user without repeating the target or URL \u2014 both are already visible in the tool output above.`
    }
  ];
}
var sessionOverageConfirmed = !1;
var init_reviewRemote = __esm(() => {
  init_ultrareviewQuota();
  init_usage();
  init_RemoteAgentTask();
  init_auth14();
  init_detectRepository();
  init_execFileNoThrow();
  init_git();
  init_teleport();
});
