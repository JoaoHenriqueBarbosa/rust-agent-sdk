// Original: src/services/analytics/metadata.ts
import { extname as extname3 } from "path";
function sanitizeToolNameForAnalytics(toolName) {
  if (toolName.startsWith("mcp__"))
    return "mcp_tool";
  return toolName;
}
function isToolDetailsLoggingEnabled() {
  return isEnvTruthy(process.env.OTEL_LOG_TOOL_DETAILS);
}
function isAnalyticsToolDetailsLoggingEnabled(mcpServerType, mcpServerBaseUrl) {
  if (process.env.CLAUDE_CODE_ENTRYPOINT === "local-agent")
    return !0;
  if (mcpServerType === "claudeai-proxy")
    return !0;
  if (mcpServerBaseUrl && isOfficialMcpUrl(mcpServerBaseUrl))
    return !0;
  return !1;
}
function mcpToolDetailsForAnalytics(toolName, mcpServerType, mcpServerBaseUrl) {
  let details = extractMcpToolDetails(toolName);
  if (!details)
    return {};
  if (!BUILTIN_MCP_SERVER_NAMES.has(details.serverName) && !isAnalyticsToolDetailsLoggingEnabled(mcpServerType, mcpServerBaseUrl))
    return {};
  return {
    mcpServerName: details.serverName,
    mcpToolName: details.mcpToolName
  };
}
function extractMcpToolDetails(toolName) {
  if (!toolName.startsWith("mcp__"))
    return;
  let parts = toolName.split("__");
  if (parts.length < 3)
    return;
  let serverName = parts[1], mcpToolName = parts.slice(2).join("__");
  if (!serverName || !mcpToolName)
    return;
  return {
    serverName,
    mcpToolName
  };
}
function extractSkillName(toolName, input) {
  if (toolName !== "Skill")
    return;
  if (typeof input === "object" && input !== null && "skill" in input && typeof input.skill === "string")
    return input.skill;
  return;
}
function extractToolInputForTelemetry(input) {
  if (!isToolDetailsLoggingEnabled())
    return;
  let truncated = truncateToolInputValue(input), json2 = jsonStringify(truncated);
  if (json2.length > 4096)
    json2 = json2.slice(0, 4096) + "\u2026[truncated]";
  return json2;
}
function truncateToolInputValue(value, depth = 0) {
  if (typeof value === "string") {
    if (value.length > TOOL_INPUT_STRING_TRUNCATE_AT)
      return `${value.slice(0, TOOL_INPUT_STRING_TRUNCATE_TO)}\u2026[${value.length} chars]`;
    return value;
  }
  if (typeof value === "number" || typeof value === "boolean" || value === null || value === void 0)
    return value;
  if (depth >= TOOL_INPUT_MAX_DEPTH)
    return "<nested>";
  if (Array.isArray(value)) {
    let mapped = value.slice(0, TOOL_INPUT_MAX_COLLECTION_ITEMS).map((v2) => truncateToolInputValue(v2, depth + 1));
    if (value.length > TOOL_INPUT_MAX_COLLECTION_ITEMS)
      mapped.push(`\u2026[${value.length} items]`);
    return mapped;
  }
  if (typeof value === "object") {
    let entries = Object.entries(value).filter(([k3]) => !k3.startsWith("_")), mapped = entries.slice(0, TOOL_INPUT_MAX_COLLECTION_ITEMS).map(([k3, v2]) => [k3, truncateToolInputValue(v2, depth + 1)]);
    if (entries.length > TOOL_INPUT_MAX_COLLECTION_ITEMS)
      mapped.push(["\u2026", `${entries.length} keys`]);
    return Object.fromEntries(mapped);
  }
  return String(value);
}
function getFileExtensionForAnalytics(filePath) {
  let ext = extname3(filePath).toLowerCase();
  if (!ext || ext === ".")
    return;
  let extension = ext.slice(1);
  if (extension.length > MAX_FILE_EXTENSION_LENGTH)
    return "other";
  return extension;
}
function getFileExtensionsFromBashCommand(command12, simulatedSedEditFilePath) {
  if (!command12.includes(".") && !simulatedSedEditFilePath)
    return;
  let result, seen = /* @__PURE__ */ new Set;
  if (simulatedSedEditFilePath) {
    let ext = getFileExtensionForAnalytics(simulatedSedEditFilePath);
    if (ext)
      seen.add(ext), result = ext;
  }
  for (let subcmd of command12.split(COMPOUND_OPERATOR_REGEX)) {
    if (!subcmd)
      continue;
    let tokens = subcmd.split(WHITESPACE_REGEX);
    if (tokens.length < 2)
      continue;
    let firstToken = tokens[0], slashIdx = firstToken.lastIndexOf("/"), baseCmd = slashIdx >= 0 ? firstToken.slice(slashIdx + 1) : firstToken;
    if (!FILE_COMMANDS.has(baseCmd))
      continue;
    for (let i4 = 1;i4 < tokens.length; i4++) {
      let arg = tokens[i4];
      if (arg.charCodeAt(0) === 45)
        continue;
      let ext = getFileExtensionForAnalytics(arg);
      if (ext && !seen.has(ext))
        seen.add(ext), result = result ? result + "," + ext : ext;
    }
  }
  if (!result)
    return;
  return result;
}
var BUILTIN_MCP_SERVER_NAMES, TOOL_INPUT_STRING_TRUNCATE_AT = 512, TOOL_INPUT_STRING_TRUNCATE_TO = 128, TOOL_INPUT_MAX_COLLECTION_ITEMS = 20, TOOL_INPUT_MAX_DEPTH = 2, MAX_FILE_EXTENSION_LENGTH = 10, FILE_COMMANDS, COMPOUND_OPERATOR_REGEX, WHITESPACE_REGEX;
var init_metadata = __esm(() => {
  init_envUtils();
  init_slowOperations();
  BUILTIN_MCP_SERVER_NAMES = /* @__PURE__ */ new Set([]);
  FILE_COMMANDS = /* @__PURE__ */ new Set([
    "rm",
    "mv",
    "cp",
    "touch",
    "mkdir",
    "chmod",
    "chown",
    "cat",
    "head",
    "tail",
    "sort",
    "stat",
    "diff",
    "wc",
    "grep",
    "rg",
    "sed"
  ]), COMPOUND_OPERATOR_REGEX = /\s*(?:&&|\|\||[;|])\s*/, WHITESPACE_REGEX = /\s+/;
});
