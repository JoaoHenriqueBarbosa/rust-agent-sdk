// function: isWindowsSandboxPolicyViolation
function isWindowsSandboxPolicyViolation() {
  return getPlatform() === "windows" && SandboxManager2.isSandboxEnabledInSettings() && !SandboxManager2.areUnsandboxedCommandsAllowed();
}
