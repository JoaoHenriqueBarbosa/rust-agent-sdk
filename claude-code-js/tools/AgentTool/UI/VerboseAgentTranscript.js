// function: VerboseAgentTranscript
function VerboseAgentTranscript(t0) {
  let $3 = import_compiler_runtime104.c(15), {
    progressMessages,
    tools,
    verbose
  } = t0, t1;
  if ($3[0] !== progressMessages)
    t1 = buildSubagentLookups(progressMessages.filter(_temp210).map(_temp38)), $3[0] = progressMessages, $3[1] = t1;
  else
    t1 = $3[1];
  let {
    lookups: agentLookups,
    inProgressToolUseIDs
  } = t1, t2;
  if ($3[2] !== agentLookups || $3[3] !== inProgressToolUseIDs || $3[4] !== progressMessages || $3[5] !== tools || $3[6] !== verbose) {
    let filteredMessages = progressMessages.filter(_temp45), t32;
    if ($3[8] !== agentLookups || $3[9] !== inProgressToolUseIDs || $3[10] !== tools || $3[11] !== verbose)
      t32 = (progressMessage) => /* @__PURE__ */ jsx_dev_runtime116.jsxDEV(MessageResponse, {
        height: 1,
        children: /* @__PURE__ */ jsx_dev_runtime116.jsxDEV(Message4, {
          message: progressMessage.data.message,
          lookups: agentLookups,
          addMargin: !1,
          tools,
          commands: [],
          verbose,
          inProgressToolUseIDs,
          progressMessagesForMessage: [],
          shouldAnimate: !1,
          shouldShowDot: !1,
          isTranscriptMode: !1,
          isStatic: !0
        }, void 0, !1, void 0, this)
      }, progressMessage.uuid, !1, void 0, this), $3[8] = agentLookups, $3[9] = inProgressToolUseIDs, $3[10] = tools, $3[11] = verbose, $3[12] = t32;
    else
      t32 = $3[12];
    t2 = filteredMessages.map(t32), $3[2] = agentLookups, $3[3] = inProgressToolUseIDs, $3[4] = progressMessages, $3[5] = tools, $3[6] = verbose, $3[7] = t2;
  } else
    t2 = $3[7];
  let t3;
  if ($3[13] !== t2)
    t3 = /* @__PURE__ */ jsx_dev_runtime116.jsxDEV(jsx_dev_runtime116.Fragment, {
      children: t2
    }, void 0, !1, void 0, this), $3[13] = t2, $3[14] = t3;
  else
    t3 = $3[14];
  return t3;
}
