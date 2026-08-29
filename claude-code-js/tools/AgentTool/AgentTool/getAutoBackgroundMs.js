// function: getAutoBackgroundMs
function getAutoBackgroundMs() {
  if (isEnvTruthy(process.env.CLAUDE_AUTO_BACKGROUND_TASKS))
    return 120000;
  return 0;
}
