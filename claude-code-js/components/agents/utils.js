// Original: src/components/agents/utils.ts
function getAgentSourceDisplayName(source) {
  if (source === "all")
    return "Agents";
  if (source === "built-in")
    return "Built-in agents";
  if (source === "plugin")
    return "Plugin agents";
  return capitalize_default(getSettingSourceName(source));
}
var init_utils17 = __esm(() => {
  init_capitalize();
  init_constants2();
});
