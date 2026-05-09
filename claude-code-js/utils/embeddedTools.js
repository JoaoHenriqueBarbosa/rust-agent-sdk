// Original: src/utils/embeddedTools.ts
function hasEmbeddedSearchTools() {
  if (!isEnvTruthy(process.env.EMBEDDED_SEARCH_TOOLS))
    return !1;
  let e = process.env.CLAUDE_CODE_ENTRYPOINT;
  return e !== "sdk-ts" && e !== "sdk-py" && e !== "sdk-cli" && e !== "local-agent";
}
function embeddedSearchToolsBinaryPath() {
  return process.execPath;
}
var init_embeddedTools = __esm(() => {
  init_envUtils();
});
