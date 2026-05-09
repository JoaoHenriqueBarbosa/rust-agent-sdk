// var: POST_COMPACT_MAX_FILES_TO_RESTORE
var POST_COMPACT_MAX_FILES_TO_RESTORE = 5, POST_COMPACT_TOKEN_BUDGET = 50000, POST_COMPACT_MAX_TOKENS_PER_FILE = 5000, POST_COMPACT_MAX_TOKENS_PER_SKILL = 5000, POST_COMPACT_SKILLS_TOKEN_BUDGET = 25000, MAX_COMPACT_STREAMING_RETRIES = 2, ERROR_MESSAGE_NOT_ENOUGH_MESSAGES = "Not enough messages to compact.", MAX_PTL_RETRIES = 3, PTL_RETRY_MARKER = "[earlier conversation truncated for compaction retry]", ERROR_MESSAGE_PROMPT_TOO_LONG = "Conversation too long. Press esc twice to go up a few messages and try again.", ERROR_MESSAGE_USER_ABORT = "API Error: Request was aborted.", ERROR_MESSAGE_INCOMPLETE_RESPONSE = "Compaction interrupted \xB7 This may be due to network issues \u2014 please try again.", SKILL_TRUNCATION_MARKER = `

[... skill content truncated for compaction; use Read on the skill path if you need the full text]`;
var init_compact = __esm(() => {
  init_uniqBy();
  init_sdk();
  init_state();
  init_state();
  init_FileReadTool();
  init_prompt2();
  init_ToolSearchTool();
  init_attachments2();
  init_config4();
  init_context();
  init_contextAnalysis();
  init_debug();
  init_errors();
  init_fileStateCache();
  init_forkedAgent();
  init_hooks5();
  init_log3();
  init_types22();
  init_messages3();
  init_path2();
  init_plans();
  init_sessionActivity();
  init_sessionStart();
  init_sessionStorage();
  init_slowOperations();
  init_diskOutput();
  init_tokens();
  init_toolSearch();
  init_claude();
  init_errors11();
  init_withRetry();
  init_internalLogging();
  init_tokenEstimation();
  init_prompt20();
});
