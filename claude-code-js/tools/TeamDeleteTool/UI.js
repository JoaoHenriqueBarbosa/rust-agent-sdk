// Original: src/tools/TeamDeleteTool/UI.tsx
function renderToolUseMessage25(_input) {
  return "cleanup team: current";
}
function renderToolResultMessage23(content, _progressMessages, {
  verbose: _verbose
}) {
  let result = typeof content === "string" ? jsonParse(content) : content;
  if ("success" in result && "team_name" in result && "message" in result)
    return null;
  return null;
}
var init_UI23 = __esm(() => {
  init_slowOperations();
});
