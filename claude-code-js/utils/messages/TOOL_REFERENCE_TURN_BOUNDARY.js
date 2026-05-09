// var: TOOL_REFERENCE_TURN_BOUNDARY
var TOOL_REFERENCE_TURN_BOUNDARY = "Tool loaded.", INTERRUPT_MESSAGE = "[Request interrupted by user]", INTERRUPT_MESSAGE_FOR_TOOL_USE = "[Request interrupted by user for tool use]", CANCEL_MESSAGE = "The user doesn't want to take this action right now. STOP what you are doing and wait for the user to tell you how to proceed.", REJECT_MESSAGE = "The user doesn't want to proceed with this tool use. The tool use was rejected (eg. if it was a file edit, the new_string was NOT written to the file). STOP what you are doing and wait for the user to tell you how to proceed.", REJECT_MESSAGE_WITH_REASON_PREFIX = `The user doesn't want to proceed with this tool use. The tool use was rejected (eg. if it was a file edit, the new_string was NOT written to the file). To tell you how to proceed, the user said:
`, SUBAGENT_REJECT_MESSAGE = "Permission for this tool use was denied. The tool use was rejected (eg. if it was a file edit, the new_string was NOT written to the file). Try a different approach or report the limitation to complete your task.", SUBAGENT_REJECT_MESSAGE_WITH_REASON_PREFIX = `Permission for this tool use was denied. The tool use was rejected (eg. if it was a file edit, the new_string was NOT written to the file). The user said:
`, PLAN_REJECTION_PREFIX = `The agent proposed a plan that was rejected by the user. The user chose to stay in plan mode rather than proceed with implementation.

Rejected plan:
`, DENIAL_WORKAROUND_GUIDANCE = "IMPORTANT: You *may* attempt to accomplish this action using other tools that might naturally be used to accomplish this goal, e.g. using head instead of cat. But you *should not* attempt to work around this denial in malicious ways, e.g. do not use your ability to run tests to execute non-test actions. You should only try to work around this restriction in reasonable ways that do not attempt to bypass the intent behind this denial. If you believe this capability is essential to complete the user's request, STOP and explain to the user what you were trying to do and why you need this permission. Let the user decide how to proceed.", NO_RESPONSE_REQUESTED = "No response requested.", SYNTHETIC_TOOL_RESULT_PLACEHOLDER = "[Tool result missing due to internal error]", SYNTHETIC_MODEL = "<synthetic>", SYNTHETIC_MESSAGES, EMPTY_LOOKUPS, EMPTY_STRING_SET, STRIPPED_TAGS_RE, PLAN_PHASE4_CONTROL = `### Phase 4: Final Plan
Goal: Write your final plan to the plan file (the only file you can edit).
- Begin with a **Context** section: explain why this change is being made \u2014 the problem or need it addresses, what prompted it, and the intended outcome
- Include only your recommended approach, not all alternatives
- Ensure that the plan file is concise enough to scan quickly, but detailed enough to execute effectively
- Include the paths of critical files to be modified
- Reference existing functions and utilities you found that should be reused, with their file paths
- Include a verification section describing how to test the changes end-to-end (run the code, use MCP tools, run tests)`, PLAN_PHASE4_TRIM = `### Phase 4: Final Plan
Goal: Write your final plan to the plan file (the only file you can edit).
- One-line **Context**: what is being changed and why
- Include only your recommended approach, not all alternatives
- List the paths of files to be modified
- Reference existing functions and utilities to reuse, with their file paths
- End with **Verification**: the single command to run to confirm the change works (no numbered test procedures)`, PLAN_PHASE4_CUT = `### Phase 4: Final Plan
Goal: Write your final plan to the plan file (the only file you can edit).
- Do NOT write a Context or Background section. The user just told you what they want.
- List the paths of files to be modified and what changes in each (one line per file)
- Reference existing functions and utilities to reuse, with their file paths
- End with **Verification**: the single command that confirms the change works
- Most good plans are under 40 lines. Prose is a sign you are padding.`, PLAN_PHASE4_CAP = `### Phase 4: Final Plan
Goal: Write your final plan to the plan file (the only file you can edit).
- Do NOT write a Context, Background, or Overview section. The user just told you what they want.
- Do NOT restate the user's request. Do NOT write prose paragraphs.
- List the paths of files to be modified and what changes in each (one bullet per file)
- Reference existing functions to reuse, with file:line
- End with the single verification command
- **Hard limit: 40 lines.** If the plan is longer, delete prose \u2014 not file paths.`;
var init_messages3 = __esm(() => {
  init_isObject();
  init_last();
  init_metadata();
  init_outputStyles();
  init_errors11();
  init_advisor();
  init_agentSwarmsEnabled();
  init_attachments2();
  init_shellQuote();
  init_format();
  init_planModeV2();
  init_slowOperations();
  init_exploreAgent();
  init_planAgent();
  init_builtInAgents();
  init_constants3();
  init_prompt10();
  init_BashTool();
  init_ExitPlanModeV2Tool();
  init_FileEditTool();
  init_prompt2();
  init_FileWriteTool();
  init_prompt5();
  init_state();
  init_xml();
  init_diagnosticTracking();
  init_Tool();
  init_FileReadTool();
  init_api4();
  init_config4();
  init_debug();
  init_displayTags();
  init_embeddedTools();
  init_format();
  init_imageValidation();
  init_json();
  init_log3();
  init_permissionRuleParser();
  init_planModeV2();
  init_tasks();
  init_toolSearch();
  SYNTHETIC_MESSAGES = /* @__PURE__ */ new Set([
    INTERRUPT_MESSAGE,
    INTERRUPT_MESSAGE_FOR_TOOL_USE,
    CANCEL_MESSAGE,
    REJECT_MESSAGE,
    NO_RESPONSE_REQUESTED
  ]);
  EMPTY_LOOKUPS = {
    siblingToolUseIDs: /* @__PURE__ */ new Map,
    progressMessagesByToolUseID: /* @__PURE__ */ new Map,
    inProgressHookCounts: /* @__PURE__ */ new Map,
    resolvedHookCounts: /* @__PURE__ */ new Map,
    toolResultByToolUseID: /* @__PURE__ */ new Map,
    toolUseByToolUseID: /* @__PURE__ */ new Map,
    normalizedMessageCount: 0,
    resolvedToolUseIDs: /* @__PURE__ */ new Set,
    erroredToolUseIDs: /* @__PURE__ */ new Set
  }, EMPTY_STRING_SET = Object.freeze(/* @__PURE__ */ new Set);
  STRIPPED_TAGS_RE = /<(commit_analysis|context|function_analysis|pr_analysis)>.*?<\/\1>\n?/gs;
});
