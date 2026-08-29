// function: fileHistoryEnabled
function fileHistoryEnabled() {
  if (getIsNonInteractiveSession())
    return fileHistoryEnabledSdk();
  return getGlobalConfig().fileCheckpointingEnabled !== !1 && !isEnvTruthy(process.env.CLAUDE_CODE_DISABLE_FILE_CHECKPOINTING);
}
