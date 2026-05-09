// function: logStartupTelemetry
async function logStartupTelemetry() {
  if (isAnalyticsDisabled())
    return;
  let [isGit, worktreeCount, ghAuthStatus] = await Promise.all([getIsGit(), getWorktreeCount(), getGhAuthStatus()]);
  logEvent("tengu_startup_telemetry", {
    is_git: isGit,
    worktree_count: worktreeCount,
    gh_auth_status: ghAuthStatus,
    sandbox_enabled: SandboxManager2.isSandboxingEnabled(),
    are_unsandboxed_commands_allowed: SandboxManager2.areUnsandboxedCommandsAllowed(),
    is_auto_bash_allowed_if_sandbox_enabled: SandboxManager2.isAutoAllowBashIfSandboxedEnabled(),
    auto_updater_disabled: isAutoUpdaterDisabled(),
    prefers_reduced_motion: getInitialSettings().prefersReducedMotion ?? !1,
    ...getCertEnvVarTelemetry()
  });
}
