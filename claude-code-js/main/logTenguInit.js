// function: logTenguInit
async function logTenguInit({
  hasInitialPrompt,
  hasStdin,
  verbose,
  debug,
  debugToStderr,
  print,
  outputFormat,
  inputFormat,
  numAllowedTools,
  numDisallowedTools,
  mcpClientCount,
  worktreeEnabled,
  skipWebFetchPreflight,
  githubActionInputs,
  dangerouslySkipPermissionsPassed,
  permissionMode,
  modeIsBypass,
  allowDangerouslySkipPermissionsPassed,
  systemPromptFlag,
  appendSystemPromptFlag,
  thinkingConfig,
  assistantActivationPath
}) {
  try {
    logEvent("tengu_init", {
      entrypoint: "claude",
      hasInitialPrompt,
      hasStdin,
      verbose,
      debug,
      debugToStderr,
      print,
      outputFormat,
      inputFormat,
      numAllowedTools,
      numDisallowedTools,
      mcpClientCount,
      worktree: worktreeEnabled,
      skipWebFetchPreflight,
      ...githubActionInputs && {
        githubActionInputs
      },
      dangerouslySkipPermissionsPassed,
      permissionMode,
      modeIsBypass,
      inProtectedNamespace: isInProtectedNamespace(),
      allowDangerouslySkipPermissionsPassed,
      thinkingType: thinkingConfig.type,
      ...systemPromptFlag && {
        systemPromptFlag
      },
      ...appendSystemPromptFlag && {
        appendSystemPromptFlag
      },
      is_simple: isBareMode() || void 0,
      is_coordinator: void 0,
      ...assistantActivationPath && {
        assistantActivationPath
      },
      autoUpdatesChannel: getInitialSettings().autoUpdatesChannel ?? "latest",
      ...{}
    });
  } catch (error44) {
    logError2(error44);
  }
}
