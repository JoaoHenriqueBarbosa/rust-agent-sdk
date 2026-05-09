// Original: src/utils/filePersistence/outputsScanner.ts
function getEnvironmentKind() {
  let kind = process.env.CLAUDE_CODE_ENVIRONMENT_KIND;
  if (kind === "byoc" || kind === "anthropic_cloud")
    return kind;
  return null;
}
var init_outputsScanner = __esm(() => {
  init_debug();
});
