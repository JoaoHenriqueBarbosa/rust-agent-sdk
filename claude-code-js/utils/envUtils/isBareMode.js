// function: isBareMode
function isBareMode() {
  return isEnvTruthy(process.env.CLAUDE_CODE_SIMPLE) || process.argv.includes("--bare");
}
