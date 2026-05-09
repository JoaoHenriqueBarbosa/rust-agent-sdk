// function: renderToolUseErrorMessage
function renderToolUseErrorMessage(result, {
  progressMessagesForMessage,
  tools,
  verbose,
  isTranscriptMode
}) {
  return /* @__PURE__ */ jsx_dev_runtime116.jsxDEV(jsx_dev_runtime116.Fragment, {
    children: [
      renderToolUseProgressMessage3(progressMessagesForMessage, {
        tools,
        verbose,
        isTranscriptMode
      }),
      /* @__PURE__ */ jsx_dev_runtime116.jsxDEV(FallbackToolUseErrorMessage, {
        result,
        verbose
      }, void 0, !1, void 0, this)
    ]
  }, void 0, !0, void 0, this);
}
