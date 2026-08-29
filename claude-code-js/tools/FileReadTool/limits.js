// Original: src/tools/FileReadTool/limits.ts
function getEnvMaxTokens() {
  let override = process.env.CLAUDE_CODE_FILE_READ_MAX_OUTPUT_TOKENS;
  if (override) {
    let parsed = parseInt(override, 10);
    if (!isNaN(parsed) && parsed > 0)
      return parsed;
  }
  return;
}
var DEFAULT_MAX_OUTPUT_TOKENS = 25000, getDefaultFileReadingLimits;
var init_limits = __esm(() => {
  init_memoize();
  init_file();
  getDefaultFileReadingLimits = memoize_default(() => {
    let envMaxTokens = getEnvMaxTokens();
    return {
      maxSizeBytes: MAX_OUTPUT_SIZE,
      maxTokens: envMaxTokens ?? DEFAULT_MAX_OUTPUT_TOKENS,
      includeMaxSizeInPrompt: void 0,
      targetedRangeNudge: void 0
    };
  });
});
