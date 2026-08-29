// Original: src/utils/settings/toolValidationConfig.ts
function isFilePatternTool(toolName) {
  return TOOL_VALIDATION_CONFIG.filePatternTools.includes(toolName);
}
function isBashPrefixTool(toolName) {
  return TOOL_VALIDATION_CONFIG.bashPrefixTools.includes(toolName);
}
function getCustomValidation(toolName) {
  return TOOL_VALIDATION_CONFIG.customValidation[toolName];
}
var TOOL_VALIDATION_CONFIG;
var init_toolValidationConfig = __esm(() => {
  TOOL_VALIDATION_CONFIG = {
    filePatternTools: [
      "Read",
      "Write",
      "Edit",
      "Glob",
      "NotebookRead",
      "NotebookEdit"
    ],
    bashPrefixTools: ["Bash"],
    customValidation: {
      WebSearch: (content) => {
        if (content.includes("*") || content.includes("?"))
          return {
            valid: !1,
            error: "WebSearch does not support wildcards",
            suggestion: "Use exact search terms without * or ?",
            examples: ["WebSearch(claude ai)", "WebSearch(typescript tutorial)"]
          };
        return { valid: !0 };
      },
      WebFetch: (content) => {
        if (content.includes("://") || content.startsWith("http"))
          return {
            valid: !1,
            error: "WebFetch permissions use domain format, not URLs",
            suggestion: 'Use "domain:hostname" format',
            examples: [
              "WebFetch(domain:example.com)",
              "WebFetch(domain:github.com)"
            ]
          };
        if (!content.startsWith("domain:"))
          return {
            valid: !1,
            error: 'WebFetch permissions must use "domain:" prefix',
            suggestion: 'Use "domain:hostname" format',
            examples: [
              "WebFetch(domain:example.com)",
              "WebFetch(domain:*.google.com)"
            ]
          };
        return { valid: !0 };
      }
    }
  };
});
