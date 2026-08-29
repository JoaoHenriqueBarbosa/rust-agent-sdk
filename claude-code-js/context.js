// Original: src/context.ts
function setSystemPromptInjection(value) {
  systemPromptInjection = value, getUserContext.cache.clear?.(), getSystemContext.cache.clear?.();
}
var MAX_STATUS_CHARS = 2000, systemPromptInjection = null, getGitStatus, getSystemContext, getUserContext;
var init_context2 = __esm(() => {
  init_memoize();
  init_state();
  init_common2();
  init_claudemd();
  init_diagLogs();
  init_envUtils();
  init_execFileNoThrow();
  init_git();
  init_gitSettings();
  init_log3();
  getGitStatus = memoize_default(async () => {
    let startTime = Date.now();
    logForDiagnosticsNoPII("info", "git_status_started");
    let isGitStart = Date.now(), isGit = await getIsGit();
    if (logForDiagnosticsNoPII("info", "git_is_git_check_completed", {
      duration_ms: Date.now() - isGitStart,
      is_git: isGit
    }), !isGit)
      return logForDiagnosticsNoPII("info", "git_status_skipped_not_git", {
        duration_ms: Date.now() - startTime
      }), null;
    try {
      let gitCmdsStart = Date.now(), [branch, mainBranch, status, log3, userName] = await Promise.all([
        getBranch(),
        getDefaultBranch(),
        execFileNoThrow(gitExe(), ["--no-optional-locks", "status", "--short"], {
          preserveOutputOnError: !1
        }).then(({ stdout }) => stdout.trim()),
        execFileNoThrow(gitExe(), ["--no-optional-locks", "log", "--oneline", "-n", "5"], {
          preserveOutputOnError: !1
        }).then(({ stdout }) => stdout.trim()),
        execFileNoThrow(gitExe(), ["config", "user.name"], {
          preserveOutputOnError: !1
        }).then(({ stdout }) => stdout.trim())
      ]);
      logForDiagnosticsNoPII("info", "git_commands_completed", {
        duration_ms: Date.now() - gitCmdsStart,
        status_length: status.length
      });
      let truncatedStatus = status.length > MAX_STATUS_CHARS ? status.substring(0, MAX_STATUS_CHARS) + `
... (truncated because it exceeds 2k characters. If you need more information, run "git status" using BashTool)` : status;
      return logForDiagnosticsNoPII("info", "git_status_completed", {
        duration_ms: Date.now() - startTime,
        truncated: status.length > MAX_STATUS_CHARS
      }), [
        "This is the git status at the start of the conversation. Note that this status is a snapshot in time, and will not update during the conversation.",
        `Current branch: ${branch}`,
        `Main branch (you will usually use this for PRs): ${mainBranch}`,
        ...userName ? [`Git user: ${userName}`] : [],
        `Status:
${truncatedStatus || "(clean)"}`,
        `Recent commits:
${log3}`
      ].join(`

`);
    } catch (error44) {
      return logForDiagnosticsNoPII("error", "git_status_failed", {
        duration_ms: Date.now() - startTime
      }), logError2(error44), null;
    }
  }), getSystemContext = memoize_default(async () => {
    let startTime = Date.now();
    logForDiagnosticsNoPII("info", "system_context_started");
    let gitStatus = isEnvTruthy(process.env.CLAUDE_CODE_REMOTE) || !shouldIncludeGitInstructions() ? null : await getGitStatus(), injection = null;
    return logForDiagnosticsNoPII("info", "system_context_completed", {
      duration_ms: Date.now() - startTime,
      has_git_status: gitStatus !== null,
      has_injection: injection !== null
    }), {
      ...gitStatus && { gitStatus }
    };
  }), getUserContext = memoize_default(async () => {
    let startTime = Date.now();
    logForDiagnosticsNoPII("info", "user_context_started");
    let shouldDisableClaudeMd = isEnvTruthy(process.env.CLAUDE_CODE_DISABLE_CLAUDE_MDS) || isBareMode() && getAdditionalDirectoriesForClaudeMd().length === 0, claudeMd = shouldDisableClaudeMd ? null : getClaudeMds(filterInjectedMemoryFiles(await getMemoryFiles()));
    return setCachedClaudeMdContent(claudeMd || null), logForDiagnosticsNoPII("info", "user_context_completed", {
      duration_ms: Date.now() - startTime,
      claudemd_length: claudeMd?.length ?? 0,
      claudemd_disabled: Boolean(shouldDisableClaudeMd)
    }), {
      ...claudeMd && { claudeMd },
      currentDate: `Today's date is ${getLocalISODate()}.`
    };
  });
});
