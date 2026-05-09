// Original: src/utils/settings/permissionValidation.ts
function isEscaped(str, index) {
  let backslashCount = 0, j2 = index - 1;
  while (j2 >= 0 && str[j2] === "\\")
    backslashCount++, j2--;
  return backslashCount % 2 !== 0;
}
function countUnescapedChar(str, char) {
  let count3 = 0;
  for (let i2 = 0;i2 < str.length; i2++)
    if (str[i2] === char && !isEscaped(str, i2))
      count3++;
  return count3;
}
function hasUnescapedEmptyParens(str) {
  for (let i2 = 0;i2 < str.length - 1; i2++)
    if (str[i2] === "(" && str[i2 + 1] === ")") {
      if (!isEscaped(str, i2))
        return !0;
    }
  return !1;
}
function validatePermissionRule(rule) {
  if (!rule || rule.trim() === "")
    return { valid: !1, error: "Permission rule cannot be empty" };
  let openCount = countUnescapedChar(rule, "("), closeCount = countUnescapedChar(rule, ")");
  if (openCount !== closeCount)
    return {
      valid: !1,
      error: "Mismatched parentheses",
      suggestion: "Ensure all opening parentheses have matching closing parentheses"
    };
  if (hasUnescapedEmptyParens(rule)) {
    let toolName = rule.substring(0, rule.indexOf("("));
    if (!toolName)
      return {
        valid: !1,
        error: "Empty parentheses with no tool name",
        suggestion: "Specify a tool name before the parentheses"
      };
    return {
      valid: !1,
      error: "Empty parentheses",
      suggestion: `Either specify a pattern or use just "${toolName}" without parentheses`,
      examples: [`${toolName}`, `${toolName}(some-pattern)`]
    };
  }
  let parsed = permissionRuleValueFromString(rule), mcpInfo = mcpInfoFromString(parsed.toolName);
  if (mcpInfo) {
    if (parsed.ruleContent !== void 0 || countUnescapedChar(rule, "(") > 0)
      return {
        valid: !1,
        error: "MCP rules do not support patterns in parentheses",
        suggestion: `Use "${parsed.toolName}" without parentheses, or use "mcp__${mcpInfo.serverName}__*" for all tools`,
        examples: [
          `mcp__${mcpInfo.serverName}`,
          `mcp__${mcpInfo.serverName}__*`,
          mcpInfo.toolName && mcpInfo.toolName !== "*" ? `mcp__${mcpInfo.serverName}__${mcpInfo.toolName}` : void 0
        ].filter(Boolean)
      };
    return { valid: !0 };
  }
  if (!parsed.toolName || parsed.toolName.length === 0)
    return { valid: !1, error: "Tool name cannot be empty" };
  if (parsed.toolName[0] !== parsed.toolName[0]?.toUpperCase())
    return {
      valid: !1,
      error: "Tool names must start with uppercase",
      suggestion: `Use "${capitalize(String(parsed.toolName))}"`
    };
  let customValidation = getCustomValidation(parsed.toolName);
  if (customValidation && parsed.ruleContent !== void 0) {
    let customResult = customValidation(parsed.ruleContent);
    if (!customResult.valid)
      return customResult;
  }
  if (isBashPrefixTool(parsed.toolName) && parsed.ruleContent !== void 0) {
    let content = parsed.ruleContent;
    if (content.includes(":*") && !content.endsWith(":*"))
      return {
        valid: !1,
        error: "The :* pattern must be at the end",
        suggestion: "Move :* to the end for prefix matching, or use * for wildcard matching",
        examples: [
          "Bash(npm run:*) - prefix matching (legacy)",
          "Bash(npm run *) - wildcard matching"
        ]
      };
    if (content === ":*")
      return {
        valid: !1,
        error: "Prefix cannot be empty before :*",
        suggestion: "Specify a command prefix before :*",
        examples: ["Bash(npm:*)", "Bash(git:*)"]
      };
  }
  if (isFilePatternTool(parsed.toolName) && parsed.ruleContent !== void 0) {
    let content = parsed.ruleContent;
    if (content.includes(":*"))
      return {
        valid: !1,
        error: 'The ":*" syntax is only for Bash prefix rules',
        suggestion: 'Use glob patterns like "*" or "**" for file matching',
        examples: [
          `${parsed.toolName}(*.ts) - matches .ts files`,
          `${parsed.toolName}(src/**) - matches all files in src`,
          `${parsed.toolName}(**/*.test.ts) - matches test files`
        ]
      };
    if (content.includes("*") && !content.match(/^\*|\*$|\*\*|\/\*|\*\.|\*\)/) && !content.includes("**"))
      return {
        valid: !1,
        error: "Wildcard placement might be incorrect",
        suggestion: "Wildcards are typically used at path boundaries",
        examples: [
          `${parsed.toolName}(*.js) - all .js files`,
          `${parsed.toolName}(src/*) - all files directly in src`,
          `${parsed.toolName}(src/**) - all files recursively in src`
        ]
      };
  }
  return { valid: !0 };
}
var PermissionRuleSchema;
var init_permissionValidation = __esm(() => {
  init_v4();
  init_mcpStringUtils();
  init_permissionRuleParser();
  init_toolValidationConfig();
  PermissionRuleSchema = lazySchema(() => exports_external.string().superRefine((val, ctx) => {
    let result = validatePermissionRule(val);
    if (!result.valid) {
      let message = result.error;
      if (result.suggestion)
        message += `. ${result.suggestion}`;
      if (result.examples && result.examples.length > 0)
        message += `. Examples: ${result.examples.join(", ")}`;
      ctx.addIssue({
        code: exports_external.ZodIssueCode.custom,
        message,
        params: { received: val }
      });
    }
  }));
});
