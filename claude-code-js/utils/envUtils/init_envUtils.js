// var: init_envUtils
var init_envUtils = __esm(() => {
  init_memoize();
  getClaudeConfigHomeDir = memoize_default(() => {
    return (process.env.CLAUDE_CONFIG_DIR ?? join(homedir(), ".claude")).normalize("NFC");
  }, () => process.env.CLAUDE_CONFIG_DIR);
  VERTEX_REGION_OVERRIDES = [
    ["claude-haiku-4-5", "VERTEX_REGION_CLAUDE_HAIKU_4_5"],
    ["claude-3-5-haiku", "VERTEX_REGION_CLAUDE_3_5_HAIKU"],
    ["claude-3-5-sonnet", "VERTEX_REGION_CLAUDE_3_5_SONNET"],
    ["claude-3-7-sonnet", "VERTEX_REGION_CLAUDE_3_7_SONNET"],
    ["claude-opus-4-1", "VERTEX_REGION_CLAUDE_4_1_OPUS"],
    ["claude-opus-4", "VERTEX_REGION_CLAUDE_4_0_OPUS"],
    ["claude-sonnet-4-6", "VERTEX_REGION_CLAUDE_4_6_SONNET"],
    ["claude-sonnet-4-5", "VERTEX_REGION_CLAUDE_4_5_SONNET"],
    ["claude-sonnet-4", "VERTEX_REGION_CLAUDE_4_0_SONNET"]
  ];
});
