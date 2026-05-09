// Original: src/utils/permissions/bashClassifier.ts
function createPromptRuleContent(description) {
  return `prompt: ${description.trim()}`;
}
function isClassifierPermissionsEnabled() {
  return !1;
}
function getBashPromptDenyDescriptions(_context) {
  return [];
}
function getBashPromptAskDescriptions(_context) {
  return [];
}
function getBashPromptAllowDescriptions(_context) {
  return [];
}
async function classifyBashCommand(_command, _cwd, _descriptions, _behavior, _signal, _isNonInteractiveSession) {
  return {
    matches: !1,
    confidence: "high",
    reason: "This feature is disabled"
  };
}
async function generateGenericDescription(_command, specificDescription, _signal) {
  return specificDescription || null;
}
var PROMPT_PREFIX = "prompt:";
