// Original: src/tools/shared/gitOperationTracking.ts
function gitCmdRe(subcmd, suffix = "") {
  return new RegExp(`\\bgit(?:\\s+-[cC]\\s+\\S+|\\s+--\\S+=\\S+)*\\s+${subcmd}\\b${suffix}`);
}
function parsePrUrl(url3) {
  let match = url3.match(/https:\/\/github\.com\/([^/]+\/[^/]+)\/pull\/(\d+)/);
  if (match?.[1] && match?.[2])
    return {
      prNumber: parseInt(match[2], 10),
      prUrl: url3,
      prRepository: match[1]
    };
  return null;
}
function findPrInStdout(stdout) {
  let m4 = stdout.match(/https:\/\/github\.com\/[^/\s]+\/[^/\s]+\/pull\/\d+/);
  return m4 ? parsePrUrl(m4[0]) : null;
}
function parseGitCommitId(stdout) {
  return stdout.match(/\[[\w./-]+(?: \(root-commit\))? ([0-9a-f]+)\]/)?.[1];
}
function parseGitPushBranch(output) {
  return output.match(/^\s*[+\-*!= ]?\s*(?:\[new branch\]|\S+\.\.+\S+)\s+\S+\s*->\s*(\S+)/m)?.[1];
}
function parsePrNumberFromText(stdout) {
  let match = stdout.match(/[Pp]ull request (?:\S+#)?#?(\d+)/);
  return match?.[1] ? parseInt(match[1], 10) : void 0;
}
function parseRefFromCommand(command12, verb) {
  let after = command12.split(gitCmdRe(verb))[1];
  if (!after)
    return;
  for (let t2 of after.trim().split(/\s+/)) {
    if (/^[&|;><]/.test(t2))
      break;
    if (t2.startsWith("-"))
      continue;
    return t2;
  }
  return;
}
function detectGitOperation(command12, output) {
  let result = {}, isCherryPick = GIT_CHERRY_PICK_RE.test(command12);
  if (GIT_COMMIT_RE.test(command12) || isCherryPick) {
    let sha = parseGitCommitId(output);
    if (sha)
      result.commit = {
        sha: sha.slice(0, 6),
        kind: isCherryPick ? "cherry-picked" : /--amend\b/.test(command12) ? "amended" : "committed"
      };
  }
  if (GIT_PUSH_RE.test(command12)) {
    let branch = parseGitPushBranch(output);
    if (branch)
      result.push = { branch };
  }
  if (GIT_MERGE_RE.test(command12) && /(Fast-forward|Merge made by)/.test(output)) {
    let ref = parseRefFromCommand(command12, "merge");
    if (ref)
      result.branch = { ref, action: "merged" };
  }
  if (GIT_REBASE_RE.test(command12) && /Successfully rebased/.test(output)) {
    let ref = parseRefFromCommand(command12, "rebase");
    if (ref)
      result.branch = { ref, action: "rebased" };
  }
  let prAction = GH_PR_ACTIONS.find((a2) => a2.re.test(command12))?.action;
  if (prAction) {
    let pr = findPrInStdout(output);
    if (pr)
      result.pr = { number: pr.prNumber, url: pr.prUrl, action: prAction };
    else {
      let num = parsePrNumberFromText(output);
      if (num)
        result.pr = { number: num, action: prAction };
    }
  }
  return result;
}
function trackGitOperations(command12, exitCode, stdout) {
  if (exitCode !== 0)
    return;
  if (GIT_COMMIT_RE.test(command12)) {
    if (logEvent("tengu_git_operation", {
      operation: "commit"
    }), command12.match(/--amend\b/))
      logEvent("tengu_git_operation", {
        operation: "commit_amend"
      });
    getCommitCounter()?.add(1);
  }
  if (GIT_PUSH_RE.test(command12))
    logEvent("tengu_git_operation", {
      operation: "push"
    });
  let prHit = GH_PR_ACTIONS.find((a2) => a2.re.test(command12));
  if (prHit)
    logEvent("tengu_git_operation", {
      operation: prHit.op
    });
  if (prHit?.action === "created") {
    if (getPrCounter()?.add(1), stdout) {
      let prInfo = findPrInStdout(stdout);
      if (prInfo)
        Promise.resolve().then(() => (init_sessionStorage(), exports_sessionStorage)).then(({ linkSessionToPR }) => {
          Promise.resolve().then(() => (init_state(), exports_state)).then(({ getSessionId: getSessionId3 }) => {
            let sessionId = getSessionId3();
            if (sessionId)
              linkSessionToPR(sessionId, prInfo.prNumber, prInfo.prUrl, prInfo.prRepository);
          });
        });
    }
  }
  if (command12.match(/\bglab\s+mr\s+create\b/))
    logEvent("tengu_git_operation", {
      operation: "pr_create"
    }), getPrCounter()?.add(1);
  let isCurlPost = command12.match(/\bcurl\b/) && (command12.match(/-X\s*POST\b/i) || command12.match(/--request\s*=?\s*POST\b/i) || command12.match(/\s-d\s/)), isPrEndpoint = command12.match(/https?:\/\/[^\s'"]*\/(pulls|pull-requests|merge[-_]requests)(?!\/\d)/i);
  if (isCurlPost && isPrEndpoint)
    logEvent("tengu_git_operation", {
      operation: "pr_create"
    }), getPrCounter()?.add(1);
}
var GIT_COMMIT_RE, GIT_PUSH_RE, GIT_CHERRY_PICK_RE, GIT_MERGE_RE, GIT_REBASE_RE, GH_PR_ACTIONS;
var init_gitOperationTracking = __esm(() => {
  init_state();
  GIT_COMMIT_RE = gitCmdRe("commit"), GIT_PUSH_RE = gitCmdRe("push"), GIT_CHERRY_PICK_RE = gitCmdRe("cherry-pick"), GIT_MERGE_RE = gitCmdRe("merge", "(?!-)"), GIT_REBASE_RE = gitCmdRe("rebase"), GH_PR_ACTIONS = [
    { re: /\bgh\s+pr\s+create\b/, action: "created", op: "pr_create" },
    { re: /\bgh\s+pr\s+edit\b/, action: "edited", op: "pr_edit" },
    { re: /\bgh\s+pr\s+merge\b/, action: "merged", op: "pr_merge" },
    { re: /\bgh\s+pr\s+comment\b/, action: "commented", op: "pr_comment" },
    { re: /\bgh\s+pr\s+close\b/, action: "closed", op: "pr_close" },
    { re: /\bgh\s+pr\s+ready\b/, action: "ready", op: "pr_ready" }
  ];
});
