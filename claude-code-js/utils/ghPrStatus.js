// Original: src/utils/ghPrStatus.ts
function deriveReviewState(isDraft, reviewDecision) {
  if (isDraft)
    return "draft";
  switch (reviewDecision) {
    case "APPROVED":
      return "approved";
    case "CHANGES_REQUESTED":
      return "changes_requested";
    default:
      return "pending";
  }
}
async function fetchPrStatus() {
  if (!await getIsGit())
    return null;
  let [branch2, defaultBranch] = await Promise.all([
    getBranch(),
    getDefaultBranch()
  ]);
  if (branch2 === defaultBranch)
    return null;
  let { stdout, code } = await execFileNoThrow("gh", [
    "pr",
    "view",
    "--json",
    "number,url,reviewDecision,isDraft,headRefName,state"
  ], { timeout: GH_TIMEOUT_MS, preserveOutputOnError: !1 });
  if (code !== 0 || !stdout.trim())
    return null;
  try {
    let data = jsonParse(stdout);
    if (data.headRefName === defaultBranch || data.headRefName === "main" || data.headRefName === "master")
      return null;
    if (data.state === "MERGED" || data.state === "CLOSED")
      return null;
    return {
      number: data.number,
      url: data.url,
      reviewState: deriveReviewState(data.isDraft, data.reviewDecision)
    };
  } catch {
    return null;
  }
}
var GH_TIMEOUT_MS = 5000;
var init_ghPrStatus = __esm(() => {
  init_execFileNoThrow();
  init_git();
  init_slowOperations();
});
