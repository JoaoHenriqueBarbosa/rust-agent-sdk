// function: renderToolUseRejectedMessage
function renderToolUseRejectedMessage(_input, {
  progressMessagesForMessage,
  tools,
  verbose,
  isTranscriptMode
}) {
  let firstData = progressMessagesForMessage[0]?.data, agentId = firstData && hasProgressMessage(firstData) ? firstData.agentId : void 0;
  return /* @__PURE__ */ jsx_dev_runtime116.jsxDEV(jsx_dev_runtime116.Fragment, {
    children: [
      !1,
      renderToolUseProgressMessage3(progressMessagesForMessage, {
        tools,
        verbose,
        isTranscriptMode
      }),
      /* @__PURE__ */ jsx_dev_runtime116.jsxDEV(FallbackToolUseRejectedMessage, {}, void 0, !1, void 0, this)
    ]
  }, void 0, !0, void 0, this);
}
