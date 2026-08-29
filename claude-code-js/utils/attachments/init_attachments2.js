// var: init_attachments2
var init_attachments2 = __esm(() => {
  init_Tool();
  init_FileReadTool();
  init_readFileInRange();
  init_path2();
  init_fsOperations();
  init_tasks();
  init_plans();
  init_ide();
  init_claudemd();
  init_cwd2();
  init_selectors();
  init_log3();
  init_debug();
  init_errors();
  init_diagnosticTracking();
  init_settings2();
  init_utils13();
  init_imageResizer();
  init_commands5();
  init_uniqBy();
  init_state();
  init_prompt7();
  init_context();
  init_prompt2();
  init_limits();
  init_fileStateCache();
  init_abortController();
  init_errors();
  init_file();
  init_loadAgentsDir();
  init_constants3();
  init_prompt18();
  init_permissions2();
  init_auth14();
  init_mcpStringUtils();
  init_filesystem();
  init_framework();
  init_diskOutput();
  init_LocalAgentTask();
  init_state();
  init_toolSearch();
  init_mcpInstructionsDelta();
  init_common3();
  init_AsyncHookRegistry();
  init_LSPDiagnosticRegistry();
  init_debug();
  init_messages3();
  init_envUtils();
  init_thinking();
  init_tokens();
  init_autoCompact();
  init_hooks5();
  init_slowOperations();
  init_pdfUtils();
  init_common2();
  init_pdf();
  init_agentSwarmsEnabled();
  init_findRelevantMemories();
  init_paths();
  init_agentMemory();
  init_teammateMailbox();
  init_teammate();
  init_teammateContext();
  init_teamHelpers();
  init_tasks();
  BRIEF_TOOL_NAME5 = (init_prompt(), __toCommonJS(exports_prompt)).BRIEF_TOOL_NAME, TODO_REMINDER_CONFIG = {
    TURNS_SINCE_WRITE: 10,
    TURNS_BETWEEN_REMINDERS: 10
  }, PLAN_MODE_ATTACHMENT_CONFIG = {
    TURNS_BETWEEN_ATTACHMENTS: 5,
    FULL_REMINDER_EVERY_N_ATTACHMENTS: 5
  }, RELEVANT_MEMORIES_CONFIG = {
    MAX_SESSION_BYTES: 61440
  }, VERIFY_PLAN_REMINDER_CONFIG = {
    TURNS_BETWEEN_REMINDERS: 10
  };
  INLINE_NOTIFICATION_MODES = /* @__PURE__ */ new Set(["prompt", "task-notification"]);
  sentSkillNames = /* @__PURE__ */ new Map;
});
