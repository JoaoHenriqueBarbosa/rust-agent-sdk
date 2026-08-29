// Original: src/components/messages/UserToolResultMessage/UserToolRejectMessage.tsx
function UserToolRejectMessage(t0) {
  let $3 = import_compiler_runtime100.c(13), {
    input,
    progressMessagesForMessage,
    style,
    tool,
    tools,
    verbose,
    isTranscriptMode
  } = t0, {
    columns
  } = useTerminalSize(), [theme] = useTheme();
  if (!tool || !tool.renderToolUseRejectedMessage) {
    let t12;
    if ($3[0] === Symbol.for("react.memo_cache_sentinel"))
      t12 = /* @__PURE__ */ jsx_dev_runtime111.jsxDEV(FallbackToolUseRejectedMessage, {}, void 0, !1, void 0, this), $3[0] = t12;
    else
      t12 = $3[0];
    return t12;
  }
  let t1 = tool.inputSchema, t2, t3;
  if ($3[1] !== columns || $3[2] !== input || $3[3] !== isTranscriptMode || $3[4] !== progressMessagesForMessage || $3[5] !== style || $3[6] !== theme || $3[7] !== tool || $3[8] !== tools || $3[9] !== verbose) {
    t3 = Symbol.for("react.early_return_sentinel");
    bb0: {
      let parsedInput = t1.safeParse(input);
      if (!parsedInput.success) {
        let t4;
        if ($3[12] === Symbol.for("react.memo_cache_sentinel"))
          t4 = /* @__PURE__ */ jsx_dev_runtime111.jsxDEV(FallbackToolUseRejectedMessage, {}, void 0, !1, void 0, this), $3[12] = t4;
        else
          t4 = $3[12];
        t3 = t4;
        break bb0;
      }
      t2 = tool.renderToolUseRejectedMessage(parsedInput.data, {
        columns,
        messages: [],
        tools,
        verbose,
        progressMessagesForMessage: filterToolProgressMessages(progressMessagesForMessage),
        style,
        theme,
        isTranscriptMode
      }) ?? /* @__PURE__ */ jsx_dev_runtime111.jsxDEV(FallbackToolUseRejectedMessage, {}, void 0, !1, void 0, this);
    }
    $3[1] = columns, $3[2] = input, $3[3] = isTranscriptMode, $3[4] = progressMessagesForMessage, $3[5] = style, $3[6] = theme, $3[7] = tool, $3[8] = tools, $3[9] = verbose, $3[10] = t2, $3[11] = t3;
  } else
    t2 = $3[10], t3 = $3[11];
  if (t3 !== Symbol.for("react.early_return_sentinel"))
    return t3;
  return t2;
}
var import_compiler_runtime100, jsx_dev_runtime111;
var init_UserToolRejectMessage = __esm(() => {
  init_useTerminalSize();
  init_ink2();
  init_Tool();
  init_FallbackToolUseRejectedMessage();
  import_compiler_runtime100 = __toESM(require_react_compiler_runtime_development(), 1), jsx_dev_runtime111 = __toESM(require_react_jsx_dev_runtime_development(), 1);
});
