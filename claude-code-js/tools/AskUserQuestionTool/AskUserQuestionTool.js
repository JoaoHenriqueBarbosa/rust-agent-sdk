// Original: src/tools/AskUserQuestionTool/AskUserQuestionTool.tsx
function AskUserQuestionResultMessage(t0) {
  let $3 = import_compiler_runtime120.c(3), {
    answers
  } = t0, t1;
  if ($3[0] === Symbol.for("react.memo_cache_sentinel"))
    t1 = /* @__PURE__ */ jsx_dev_runtime144.jsxDEV(ThemedBox_default, {
      flexDirection: "row",
      children: [
        /* @__PURE__ */ jsx_dev_runtime144.jsxDEV(ThemedText, {
          color: getModeColor("default"),
          children: [
            BLACK_CIRCLE,
            "\xA0"
          ]
        }, void 0, !0, void 0, this),
        /* @__PURE__ */ jsx_dev_runtime144.jsxDEV(ThemedText, {
          children: "User answered Claude's questions:"
        }, void 0, !1, void 0, this)
      ]
    }, void 0, !0, void 0, this), $3[0] = t1;
  else
    t1 = $3[0];
  let t2;
  if ($3[1] !== answers)
    t2 = /* @__PURE__ */ jsx_dev_runtime144.jsxDEV(ThemedBox_default, {
      flexDirection: "column",
      marginTop: 1,
      children: [
        t1,
        /* @__PURE__ */ jsx_dev_runtime144.jsxDEV(MessageResponse, {
          children: /* @__PURE__ */ jsx_dev_runtime144.jsxDEV(ThemedBox_default, {
            flexDirection: "column",
            children: Object.entries(answers).map(_temp50)
          }, void 0, !1, void 0, this)
        }, void 0, !1, void 0, this)
      ]
    }, void 0, !0, void 0, this), $3[1] = answers, $3[2] = t2;
  else
    t2 = $3[2];
  return t2;
}
function _temp50(t0) {
  let [questionText, answer] = t0;
  return /* @__PURE__ */ jsx_dev_runtime144.jsxDEV(ThemedText, {
    color: "inactive",
    children: [
      "\xB7 ",
      questionText,
      " \u2192 ",
      answer
    ]
  }, questionText, !0, void 0, this);
}
function validateHtmlPreview(preview) {
  if (preview === void 0)
    return null;
  if (/<\s*(html|body|!doctype)\b/i.test(preview))
    return "preview must be an HTML fragment, not a full document (no <html>, <body>, or <!DOCTYPE>)";
  if (/<\s*(script|style)\b/i.test(preview))
    return "preview must not contain <script> or <style> tags. Use inline styles via the style attribute if needed.";
  if (!/<[a-z][^>]*>/i.test(preview))
    return 'preview must contain HTML (previewFormat is set to "html"). Wrap content in a tag like <div> or <pre>.';
  return null;
}
var import_compiler_runtime120, jsx_dev_runtime144, questionOptionSchema, questionSchema, annotationsSchema, UNIQUENESS_REFINE, commonFields, inputSchema25, outputSchema19, AskUserQuestionTool;
var init_AskUserQuestionTool = __esm(() => {
  init_state();
  init_MessageResponse();
  init_figures2();
  init_PermissionMode();
  init_v4();
  init_ink2();
  init_Tool();
  init_prompt10();
  import_compiler_runtime120 = __toESM(require_react_compiler_runtime_development(), 1), jsx_dev_runtime144 = __toESM(require_react_jsx_dev_runtime_development(), 1), questionOptionSchema = lazySchema(() => exports_external.object({
    label: exports_external.string().describe("The display text for this option that the user will see and select. Should be concise (1-5 words) and clearly describe the choice."),
    description: exports_external.string().describe("Explanation of what this option means or what will happen if chosen. Useful for providing context about trade-offs or implications."),
    preview: exports_external.string().optional().describe("Optional preview content rendered when this option is focused. Use for mockups, code snippets, or visual comparisons that help users compare options. See the tool description for the expected content format.")
  })), questionSchema = lazySchema(() => exports_external.object({
    question: exports_external.string().describe('The complete question to ask the user. Should be clear, specific, and end with a question mark. Example: "Which library should we use for date formatting?" If multiSelect is true, phrase it accordingly, e.g. "Which features do you want to enable?"'),
    header: exports_external.string().describe(`Very short label displayed as a chip/tag (max ${ASK_USER_QUESTION_TOOL_CHIP_WIDTH} chars). Examples: "Auth method", "Library", "Approach".`),
    options: exports_external.array(questionOptionSchema()).min(2).max(4).describe("The available choices for this question. Must have 2-4 options. Each option should be a distinct, mutually exclusive choice (unless multiSelect is enabled). There should be no 'Other' option, that will be provided automatically."),
    multiSelect: exports_external.boolean().default(!1).describe("Set to true to allow the user to select multiple options instead of just one. Use when choices are not mutually exclusive.")
  })), annotationsSchema = lazySchema(() => {
    let annotationSchema = exports_external.object({
      preview: exports_external.string().optional().describe("The preview content of the selected option, if the question used previews."),
      notes: exports_external.string().optional().describe("Free-text notes the user added to their selection.")
    });
    return exports_external.record(exports_external.string(), annotationSchema).optional().describe("Optional per-question annotations from the user (e.g., notes on preview selections). Keyed by question text.");
  }), UNIQUENESS_REFINE = {
    check: (data) => {
      let questions = data.questions.map((q4) => q4.question);
      if (questions.length !== new Set(questions).size)
        return !1;
      for (let question of data.questions) {
        let labels = question.options.map((opt) => opt.label);
        if (labels.length !== new Set(labels).size)
          return !1;
      }
      return !0;
    },
    message: "Question texts must be unique, option labels must be unique within each question"
  }, commonFields = lazySchema(() => ({
    answers: exports_external.record(exports_external.string(), exports_external.string()).optional().describe("User answers collected by the permission component"),
    annotations: annotationsSchema(),
    metadata: exports_external.object({
      source: exports_external.string().optional().describe('Optional identifier for the source of this question (e.g., "remember" for /remember command). Used for analytics tracking.')
    }).optional().describe("Optional metadata for tracking and analytics purposes. Not displayed to user.")
  })), inputSchema25 = lazySchema(() => exports_external.strictObject({
    questions: exports_external.array(questionSchema()).min(1).max(4).describe("Questions to ask the user (1-4 questions)"),
    ...commonFields()
  }).refine(UNIQUENESS_REFINE.check, {
    message: UNIQUENESS_REFINE.message
  })), outputSchema19 = lazySchema(() => exports_external.object({
    questions: exports_external.array(questionSchema()).describe("The questions that were asked"),
    answers: exports_external.record(exports_external.string(), exports_external.string()).describe("The answers provided by the user (question text -> answer string; multi-select answers are comma-separated)"),
    annotations: annotationsSchema()
  }));
  AskUserQuestionTool = buildTool({
    name: ASK_USER_QUESTION_TOOL_NAME,
    searchHint: "prompt the user with a multiple-choice question",
    maxResultSizeChars: 1e5,
    shouldDefer: !0,
    async description() {
      return DESCRIPTION6;
    },
    async prompt() {
      let format4 = getQuestionPreviewFormat();
      if (format4 === void 0)
        return ASK_USER_QUESTION_TOOL_PROMPT;
      return ASK_USER_QUESTION_TOOL_PROMPT + PREVIEW_FEATURE_PROMPT[format4];
    },
    get inputSchema() {
      return inputSchema25();
    },
    get outputSchema() {
      return outputSchema19();
    },
    userFacingName() {
      return "";
    },
    isEnabled() {
      if (getAllowedChannels().length > 0)
        return !1;
      return !0;
    },
    isConcurrencySafe() {
      return !0;
    },
    isReadOnly() {
      return !0;
    },
    toAutoClassifierInput(input) {
      return input.questions.map((q4) => q4.question).join(" | ");
    },
    requiresUserInteraction() {
      return !0;
    },
    async validateInput({
      questions
    }) {
      if (getQuestionPreviewFormat() !== "html")
        return {
          result: !0
        };
      for (let q4 of questions)
        for (let opt of q4.options) {
          let err2 = validateHtmlPreview(opt.preview);
          if (err2)
            return {
              result: !1,
              message: `Option "${opt.label}" in question "${q4.question}": ${err2}`,
              errorCode: 1
            };
        }
      return {
        result: !0
      };
    },
    async checkPermissions(input) {
      return {
        behavior: "ask",
        message: "Answer questions?",
        updatedInput: input
      };
    },
    renderToolUseMessage() {
      return null;
    },
    renderToolUseProgressMessage() {
      return null;
    },
    renderToolResultMessage({
      answers
    }, _toolUseID) {
      return /* @__PURE__ */ jsx_dev_runtime144.jsxDEV(AskUserQuestionResultMessage, {
        answers
      }, void 0, !1, void 0, this);
    },
    renderToolUseRejectedMessage() {
      return /* @__PURE__ */ jsx_dev_runtime144.jsxDEV(ThemedBox_default, {
        flexDirection: "row",
        marginTop: 1,
        children: [
          /* @__PURE__ */ jsx_dev_runtime144.jsxDEV(ThemedText, {
            color: getModeColor("default"),
            children: [
              BLACK_CIRCLE,
              "\xA0"
            ]
          }, void 0, !0, void 0, this),
          /* @__PURE__ */ jsx_dev_runtime144.jsxDEV(ThemedText, {
            children: "User declined to answer questions"
          }, void 0, !1, void 0, this)
        ]
      }, void 0, !0, void 0, this);
    },
    renderToolUseErrorMessage() {
      return null;
    },
    async call({
      questions,
      answers = {},
      annotations
    }, _context) {
      return {
        data: {
          questions,
          answers,
          ...annotations && {
            annotations
          }
        }
      };
    },
    mapToolResultToToolResultBlockParam({
      answers,
      annotations
    }, toolUseID) {
      return {
        type: "tool_result",
        content: `User has answered your questions: ${Object.entries(answers).map(([questionText, answer]) => {
          let annotation = annotations?.[questionText], parts = [`"${questionText}"="${answer}"`];
          if (annotation?.preview)
            parts.push(`selected preview:
${annotation.preview}`);
          if (annotation?.notes)
            parts.push(`user notes: ${annotation.notes}`);
          return parts.join(" ");
        }).join(", ")}. You can now continue with the user's answers in mind.`,
        tool_use_id: toolUseID
      };
    }
  });
});
