// Original: src/utils/commitAttribution.ts
function getAttributionRepoRoot() {
  let cwd2 = getCwd();
  return findGitRoot(cwd2) ?? getOriginalCwd();
}
function getClientSurface() {
  return process.env.CLAUDE_CODE_ENTRYPOINT ?? "cli";
}
function createEmptyAttributionState() {
  return {
    fileStates: /* @__PURE__ */ new Map,
    sessionBaselines: /* @__PURE__ */ new Map,
    surface: getClientSurface(),
    startingHeadSha: null,
    promptCount: 0,
    promptCountAtLastCommit: 0,
    permissionPromptCount: 0,
    permissionPromptCountAtLastCommit: 0,
    escapeCount: 0,
    escapeCountAtLastCommit: 0
  };
}
var INTERNAL_MODEL_REPOS, repoClassCache = null, isInternalModelRepo;
var init_commitAttribution = __esm(() => {
  init_state();
  init_cwd2();
  init_debug();
  init_execFileNoThrow();
  init_fsOperations();
  init_generatedFiles();
  init_gitFilesystem();
  init_git();
  init_log3();
  init_model();
  INTERNAL_MODEL_REPOS = [
    "github.com:anthropics/claude-cli-internal",
    "github.com/anthropics/claude-cli-internal",
    "github.com:anthropics/anthropic",
    "github.com/anthropics/anthropic",
    "github.com:anthropics/apps",
    "github.com/anthropics/apps",
    "github.com:anthropics/casino",
    "github.com/anthropics/casino",
    "github.com:anthropics/dbt",
    "github.com/anthropics/dbt",
    "github.com:anthropics/dotfiles",
    "github.com/anthropics/dotfiles",
    "github.com:anthropics/terraform-config",
    "github.com/anthropics/terraform-config",
    "github.com:anthropics/hex-export",
    "github.com/anthropics/hex-export",
    "github.com:anthropics/feedback-v2",
    "github.com/anthropics/feedback-v2",
    "github.com:anthropics/labs",
    "github.com/anthropics/labs",
    "github.com:anthropics/argo-rollouts",
    "github.com/anthropics/argo-rollouts",
    "github.com:anthropics/starling-configs",
    "github.com/anthropics/starling-configs",
    "github.com:anthropics/ts-tools",
    "github.com/anthropics/ts-tools",
    "github.com:anthropics/ts-capsules",
    "github.com/anthropics/ts-capsules",
    "github.com:anthropics/feldspar-testing",
    "github.com/anthropics/feldspar-testing",
    "github.com:anthropics/trellis",
    "github.com/anthropics/trellis",
    "github.com:anthropics/claude-for-hiring",
    "github.com/anthropics/claude-for-hiring",
    "github.com:anthropics/forge-web",
    "github.com/anthropics/forge-web",
    "github.com:anthropics/infra-manifests",
    "github.com/anthropics/infra-manifests",
    "github.com:anthropics/mycro_manifests",
    "github.com/anthropics/mycro_manifests",
    "github.com:anthropics/mycro_configs",
    "github.com/anthropics/mycro_configs",
    "github.com:anthropics/mobile-apps",
    "github.com/anthropics/mobile-apps"
  ];
  isInternalModelRepo = sequential(async () => {
    if (repoClassCache !== null)
      return repoClassCache === "internal";
    let cwd2 = getAttributionRepoRoot(), remoteUrl = await getRemoteUrlForDir(cwd2);
    if (!remoteUrl)
      return repoClassCache = "none", !1;
    let isInternal = INTERNAL_MODEL_REPOS.some((repo) => remoteUrl.includes(repo));
    return repoClassCache = isInternal ? "internal" : "external", isInternal;
  });
});
