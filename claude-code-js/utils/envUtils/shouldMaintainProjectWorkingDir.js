// function: shouldMaintainProjectWorkingDir
function shouldMaintainProjectWorkingDir() {
  return isEnvTruthy(process.env.CLAUDE_BASH_MAINTAIN_PROJECT_WORKING_DIR);
}
