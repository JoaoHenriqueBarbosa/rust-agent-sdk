// Original: src/utils/sandbox/sandbox-ui-utils.ts
function removeSandboxViolationTags(text2) {
  return text2.replace(/<sandbox_violations>[\s\S]*?<\/sandbox_violations>/g, "");
}
