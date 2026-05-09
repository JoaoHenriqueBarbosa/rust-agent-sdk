// Original: src/utils/permissions/permissionRuleParser.ts
function normalizeLegacyToolName(name) {
  return LEGACY_TOOL_NAME_ALIASES[name] ?? name;
}
function getLegacyToolNames(canonicalName) {
  let result = [];
  for (let [legacy, canonical] of Object.entries(LEGACY_TOOL_NAME_ALIASES))
    if (canonical === canonicalName)
      result.push(legacy);
  return result;
}
function escapeRuleContent(content) {
  return content.replace(/\\/g, "\\\\").replace(/\(/g, "\\(").replace(/\)/g, "\\)");
}
function unescapeRuleContent(content) {
  return content.replace(/\\\(/g, "(").replace(/\\\)/g, ")").replace(/\\\\/g, "\\");
}
function permissionRuleValueFromString(ruleString) {
  let openParenIndex = findFirstUnescapedChar(ruleString, "(");
  if (openParenIndex === -1)
    return { toolName: normalizeLegacyToolName(ruleString) };
  let closeParenIndex = findLastUnescapedChar(ruleString, ")");
  if (closeParenIndex === -1 || closeParenIndex <= openParenIndex)
    return { toolName: normalizeLegacyToolName(ruleString) };
  if (closeParenIndex !== ruleString.length - 1)
    return { toolName: normalizeLegacyToolName(ruleString) };
  let toolName = ruleString.substring(0, openParenIndex), rawContent = ruleString.substring(openParenIndex + 1, closeParenIndex);
  if (!toolName)
    return { toolName: normalizeLegacyToolName(ruleString) };
  if (rawContent === "" || rawContent === "*")
    return { toolName: normalizeLegacyToolName(toolName) };
  let ruleContent = unescapeRuleContent(rawContent);
  return { toolName: normalizeLegacyToolName(toolName), ruleContent };
}
function permissionRuleValueToString(ruleValue) {
  if (!ruleValue.ruleContent)
    return ruleValue.toolName;
  let escapedContent = escapeRuleContent(ruleValue.ruleContent);
  return `${ruleValue.toolName}(${escapedContent})`;
}
function findFirstUnescapedChar(str, char) {
  for (let i2 = 0;i2 < str.length; i2++)
    if (str[i2] === char) {
      let backslashCount = 0, j2 = i2 - 1;
      while (j2 >= 0 && str[j2] === "\\")
        backslashCount++, j2--;
      if (backslashCount % 2 === 0)
        return i2;
    }
  return -1;
}
function findLastUnescapedChar(str, char) {
  for (let i2 = str.length - 1;i2 >= 0; i2--)
    if (str[i2] === char) {
      let backslashCount = 0, j2 = i2 - 1;
      while (j2 >= 0 && str[j2] === "\\")
        backslashCount++, j2--;
      if (backslashCount % 2 === 0)
        return i2;
    }
  return -1;
}
var BRIEF_TOOL_NAME2, LEGACY_TOOL_NAME_ALIASES;
var init_permissionRuleParser = __esm(() => {
  init_constants3();
  BRIEF_TOOL_NAME2 = (init_prompt(), __toCommonJS(exports_prompt)).BRIEF_TOOL_NAME, LEGACY_TOOL_NAME_ALIASES = {
    Task: AGENT_TOOL_NAME,
    KillShell: TASK_STOP_TOOL_NAME,
    AgentOutputTool: TASK_OUTPUT_TOOL_NAME,
    BashOutputTool: TASK_OUTPUT_TOOL_NAME,
    ...BRIEF_TOOL_NAME2 ? { Brief: BRIEF_TOOL_NAME2 } : {}
  };
});
