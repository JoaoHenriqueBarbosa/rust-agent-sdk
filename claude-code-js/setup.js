// Original: src/setup.ts
var exports_setup = {};
__export(exports_setup, {
  setup: () => setup
});
async function setup(cwd2, permissionMode, allowDangerouslySkipPermissions, worktreeEnabled, worktreeName, tmuxEnabled, customSessionId, worktreePRNumber, messagingSocketPath) {
  logForDiagnosticsNoPII("info", "setup_started");
  let nodeVersion = process.version.match(/^v(\d+)\./)?.[1];
  if (!nodeVersion || parseInt(nodeVersion) < 18)
    console.error(source_default.bold.red("Error: Claude Code requires Node.js version 18 or higher.")), process.exit(1);
  if (customSessionId)
    switchSession(asSessionId(customSessionId));
  if (!isBareMode() || messagingSocketPath !== void 0)
    ;
  if (!isBareMode() && isAgentSwarmsEnabled()) {
    let { captureTeammateModeSnapshot: captureTeammateModeSnapshot2 } = await Promise.resolve().then(() => (init_teammateModeSnapshot(), exports_teammateModeSnapshot));
    captureTeammateModeSnapshot2();
  }
  if (!getIsNonInteractiveSession()) {
    if (isAgentSwarmsEnabled()) {
      let restoredIterm2Backup = await checkAndRestoreITerm2Backup();
      if (restoredIterm2Backup.status === "restored")
        console.log(source_default.yellow("Detected an interrupted iTerm2 setup. Your original settings have been restored. You may need to restart iTerm2 for the changes to take effect."));
      else if (restoredIterm2Backup.status === "failed")
        console.error(source_default.red(`Failed to restore iTerm2 settings. Please manually restore your original settings with: defaults import com.googlecode.iterm2 ${restoredIterm2Backup.backupPath}.`));
    }
    try {
      let restoredTerminalBackup = await checkAndRestoreTerminalBackup();
      if (restoredTerminalBackup.status === "restored")
        console.log(source_default.yellow("Detected an interrupted Terminal.app setup. Your original settings have been restored. You may need to restart Terminal.app for the changes to take effect."));
      else if (restoredTerminalBackup.status === "failed")
        console.error(source_default.red(`Failed to restore Terminal.app settings. Please manually restore your original settings with: defaults import com.apple.Terminal ${restoredTerminalBackup.backupPath}.`));
    } catch (error44) {
      logError2(error44);
    }
  }
  setCwd(cwd2);
  let hooksStart = Date.now();
  if (captureHooksConfigSnapshot(), logForDiagnosticsNoPII("info", "setup_hooks_captured", {
    duration_ms: Date.now() - hooksStart
  }), initializeFileChangedWatcher(cwd2), worktreeEnabled) {
    let hasHook = hasWorktreeCreateHook(), inGit = await getIsGit();
    if (!hasHook && !inGit)
      process.stderr.write(source_default.red(`Error: Can only use --worktree in a git repository, but ${source_default.bold(cwd2)} is not a git repository. Configure a WorktreeCreate hook in settings.json to use --worktree with other VCS systems.
`)), process.exit(1);
    let slug = worktreePRNumber ? `pr-${worktreePRNumber}` : worktreeName ?? getPlanSlug(), tmuxSessionName;
    if (inGit) {
      let mainRepoRoot = findCanonicalGitRoot(getCwd());
      if (!mainRepoRoot)
        process.stderr.write(source_default.red(`Error: Could not determine the main git repository root.
`)), process.exit(1);
      if (mainRepoRoot !== (findGitRoot(getCwd()) ?? getCwd()))
        logForDiagnosticsNoPII("info", "worktree_resolved_to_main_repo"), process.chdir(mainRepoRoot), setCwd(mainRepoRoot);
      tmuxSessionName = tmuxEnabled ? generateTmuxSessionName(mainRepoRoot, worktreeBranchName(slug)) : void 0;
    } else
      tmuxSessionName = tmuxEnabled ? generateTmuxSessionName(getCwd(), worktreeBranchName(slug)) : void 0;
    let worktreeSession;
    try {
      worktreeSession = await createWorktreeForSession(getSessionId(), slug, tmuxSessionName, worktreePRNumber ? { prNumber: worktreePRNumber } : void 0);
    } catch (error44) {
      process.stderr.write(source_default.red(`Error creating worktree: ${errorMessage(error44)}
`)), process.exit(1);
    }
    if (logEvent("tengu_worktree_created", { tmux_enabled: tmuxEnabled }), tmuxEnabled && tmuxSessionName) {
      let tmuxResult = await createTmuxSessionForWorktree(tmuxSessionName, worktreeSession.worktreePath);
      if (tmuxResult.created)
        console.log(source_default.green(`Created tmux session: ${source_default.bold(tmuxSessionName)}
To attach: ${source_default.bold(`tmux attach -t ${tmuxSessionName}`)}`));
      else
        console.error(source_default.yellow(`Warning: Failed to create tmux session: ${tmuxResult.error}`));
    }
    process.chdir(worktreeSession.worktreePath), setCwd(worktreeSession.worktreePath), setOriginalCwd(getCwd()), setProjectRoot(getCwd()), saveWorktreeState(worktreeSession), clearMemoryFileCaches(), updateHooksConfigSnapshot();
  }
  if (logForDiagnosticsNoPII("info", "setup_background_jobs_starting"), !isBareMode())
    initSessionMemory();
  lockCurrentVersion(), logForDiagnosticsNoPII("info", "setup_background_jobs_launched"), profileCheckpoint("setup_before_prefetch"), logForDiagnosticsNoPII("info", "setup_prefetch_starting");
  let skipPluginPrefetch = getIsNonInteractiveSession() && isEnvTruthy(process.env.CLAUDE_CODE_SYNC_PLUGIN_INSTALL) || isBareMode();
  if (!skipPluginPrefetch)
    getCommands(getProjectRoot());
  if (Promise.resolve().then(() => (init_loadPluginHooks(), exports_loadPluginHooks)).then((m4) => {
    if (!skipPluginPrefetch)
      m4.loadPluginHooks(), m4.setupPluginHookHotReload();
  }), !isBareMode())
    Promise.resolve().then(() => (init_sessionFileAccessHooks(), exports_sessionFileAccessHooks)).then((m4) => m4.registerSessionFileAccessHooks());
  if (initSinks(), logEvent("tengu_started", {}), prefetchApiKeyFromApiKeyHelperIfSafe(getIsNonInteractiveSession()), profileCheckpoint("setup_after_prefetch"), !isBareMode()) {
    let { hasReleaseNotes } = await checkForReleaseNotes(getGlobalConfig().lastReleaseNotesSeen);
    if (hasReleaseNotes)
      await getRecentActivity();
  }
  let projectConfig = getCurrentProjectConfig();
  if (projectConfig.lastCost !== void 0 && projectConfig.lastDuration !== void 0)
    logEvent("tengu_exit", {
      last_session_cost: projectConfig.lastCost,
      last_session_api_duration: projectConfig.lastAPIDuration,
      last_session_tool_duration: projectConfig.lastToolDuration,
      last_session_duration: projectConfig.lastDuration,
      last_session_lines_added: projectConfig.lastLinesAdded,
      last_session_lines_removed: projectConfig.lastLinesRemoved,
      last_session_total_input_tokens: projectConfig.lastTotalInputTokens,
      last_session_total_output_tokens: projectConfig.lastTotalOutputTokens,
      last_session_total_cache_creation_input_tokens: projectConfig.lastTotalCacheCreationInputTokens,
      last_session_total_cache_read_input_tokens: projectConfig.lastTotalCacheReadInputTokens,
      last_session_fps_average: projectConfig.lastFpsAverage,
      last_session_fps_low_1_pct: projectConfig.lastFpsLow1Pct,
      last_session_id: projectConfig.lastSessionId,
      ...projectConfig.lastSessionMetrics
    });
}
var init_setup3 = __esm(() => {
  init_source();
  init_cwd2();
  init_releaseNotes();
  init_Shell();
  init_sinks();
  init_state();
  init_commands5();
  init_sessionMemory();
  init_ids();
  init_agentSwarmsEnabled();
  init_appleTerminalBackup();
  init_auth14();
  init_claudemd();
  init_config4();
  init_diagLogs();
  init_envUtils();
  init_errors();
  init_git();
  init_fileChangedWatcher();
  init_hooksConfigSnapshot();
  init_hooks5();
  init_iTermBackup();
  init_log3();
  init_logoV2Utils();
  init_nativeInstaller();
  init_plans();
  init_sessionStorage();
  init_startupProfiler();
  init_worktree();
});
