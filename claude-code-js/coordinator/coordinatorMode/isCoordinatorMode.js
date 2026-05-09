// function: isCoordinatorMode
function isCoordinatorMode() {
  return isEnvTruthy(process.env.CLAUDE_CODE_COORDINATOR_MODE);
}
