// Original: src/components/messages/UserTeammateMessage.tsx
function parseTeammateMessages(text2) {
  let messages = [];
  for (let match of text2.matchAll(TEAMMATE_MSG_REGEX))
    if (match[1] && match[4])
      messages.push({
        teammateId: match[1],
        color: match[2],
        summary: match[3],
        content: match[4].trim()
      });
  return messages;
}
function getDisplayName(teammateId) {
  if (teammateId === "leader")
    return "leader";
  return teammateId;
}
function UserTeammateMessage({
  addMargin,
  param: {
    text: text2
  },
  isTranscriptMode
}) {
  let messages = parseTeammateMessages(text2).filter((msg) => {
    if (isShutdownApproved(msg.content))
      return !1;
    try {
      if (jsonParse(msg.content)?.type === "teammate_terminated")
        return !1;
    } catch {}
    return !0;
  });
  if (messages.length === 0)
    return null;
  return /* @__PURE__ */ jsx_dev_runtime95.jsxDEV(ThemedBox_default, {
    flexDirection: "column",
    marginTop: addMargin ? 1 : 0,
    width: "100%",
    children: messages.map((msg_0, index) => {
      let inkColor = toInkColor(msg_0.color), displayName = getDisplayName(msg_0.teammateId), planApprovalElement = tryRenderPlanApprovalMessage(msg_0.content, displayName);
      if (planApprovalElement)
        return /* @__PURE__ */ jsx_dev_runtime95.jsxDEV(React29.Fragment, {
          children: planApprovalElement
        }, index, !1, void 0, this);
      let shutdownElement = tryRenderShutdownMessage(msg_0.content);
      if (shutdownElement)
        return /* @__PURE__ */ jsx_dev_runtime95.jsxDEV(React29.Fragment, {
          children: shutdownElement
        }, index, !1, void 0, this);
      let taskAssignmentElement = tryRenderTaskAssignmentMessage(msg_0.content);
      if (taskAssignmentElement)
        return /* @__PURE__ */ jsx_dev_runtime95.jsxDEV(React29.Fragment, {
          children: taskAssignmentElement
        }, index, !1, void 0, this);
      let parsedIdleNotification = null;
      try {
        parsedIdleNotification = jsonParse(msg_0.content);
      } catch {}
      if (parsedIdleNotification?.type === "idle_notification")
        return null;
      if (parsedIdleNotification?.type === "task_completed") {
        let taskCompleted = parsedIdleNotification;
        return /* @__PURE__ */ jsx_dev_runtime95.jsxDEV(ThemedBox_default, {
          flexDirection: "column",
          marginTop: 1,
          children: [
            /* @__PURE__ */ jsx_dev_runtime95.jsxDEV(ThemedText, {
              color: inkColor,
              children: `@${displayName}${figures_default.pointer}`
            }, void 0, !1, void 0, this),
            /* @__PURE__ */ jsx_dev_runtime95.jsxDEV(MessageResponse, {
              children: [
                /* @__PURE__ */ jsx_dev_runtime95.jsxDEV(ThemedText, {
                  color: "success",
                  children: "\u2713"
                }, void 0, !1, void 0, this),
                /* @__PURE__ */ jsx_dev_runtime95.jsxDEV(ThemedText, {
                  children: [
                    " ",
                    "Completed task #",
                    taskCompleted.taskId,
                    taskCompleted.taskSubject && /* @__PURE__ */ jsx_dev_runtime95.jsxDEV(ThemedText, {
                      dimColor: !0,
                      children: [
                        " (",
                        taskCompleted.taskSubject,
                        ")"
                      ]
                    }, void 0, !0, void 0, this)
                  ]
                }, void 0, !0, void 0, this)
              ]
            }, void 0, !0, void 0, this)
          ]
        }, index, !0, void 0, this);
      }
      return /* @__PURE__ */ jsx_dev_runtime95.jsxDEV(TeammateMessageContent, {
        displayName,
        inkColor,
        content: msg_0.content,
        summary: msg_0.summary,
        isTranscriptMode
      }, index, !1, void 0, this);
    })
  }, void 0, !1, void 0, this);
}
function TeammateMessageContent(t0) {
  let $3 = import_compiler_runtime84.c(14), {
    displayName,
    inkColor,
    content,
    summary,
    isTranscriptMode
  } = t0, t1 = `@${displayName}${figures_default.pointer}`, t2;
  if ($3[0] !== inkColor || $3[1] !== t1)
    t2 = /* @__PURE__ */ jsx_dev_runtime95.jsxDEV(ThemedText, {
      color: inkColor,
      children: t1
    }, void 0, !1, void 0, this), $3[0] = inkColor, $3[1] = t1, $3[2] = t2;
  else
    t2 = $3[2];
  let t3;
  if ($3[3] !== summary)
    t3 = summary && /* @__PURE__ */ jsx_dev_runtime95.jsxDEV(ThemedText, {
      children: [
        " ",
        summary
      ]
    }, void 0, !0, void 0, this), $3[3] = summary, $3[4] = t3;
  else
    t3 = $3[4];
  let t4;
  if ($3[5] !== t2 || $3[6] !== t3)
    t4 = /* @__PURE__ */ jsx_dev_runtime95.jsxDEV(ThemedBox_default, {
      children: [
        t2,
        t3
      ]
    }, void 0, !0, void 0, this), $3[5] = t2, $3[6] = t3, $3[7] = t4;
  else
    t4 = $3[7];
  let t5;
  if ($3[8] !== content || $3[9] !== isTranscriptMode)
    t5 = isTranscriptMode && /* @__PURE__ */ jsx_dev_runtime95.jsxDEV(ThemedBox_default, {
      paddingLeft: 2,
      children: /* @__PURE__ */ jsx_dev_runtime95.jsxDEV(ThemedText, {
        children: /* @__PURE__ */ jsx_dev_runtime95.jsxDEV(Ansi, {
          children: content
        }, void 0, !1, void 0, this)
      }, void 0, !1, void 0, this)
    }, void 0, !1, void 0, this), $3[8] = content, $3[9] = isTranscriptMode, $3[10] = t5;
  else
    t5 = $3[10];
  let t6;
  if ($3[11] !== t4 || $3[12] !== t5)
    t6 = /* @__PURE__ */ jsx_dev_runtime95.jsxDEV(ThemedBox_default, {
      flexDirection: "column",
      marginTop: 1,
      children: [
        t4,
        t5
      ]
    }, void 0, !0, void 0, this), $3[11] = t4, $3[12] = t5, $3[13] = t6;
  else
    t6 = $3[13];
  return t6;
}
var import_compiler_runtime84, React29, jsx_dev_runtime95, TEAMMATE_MSG_REGEX;
var init_UserTeammateMessage = __esm(() => {
  init_figures();
  init_xml();
  init_ink2();
  init_ink3();
  init_slowOperations();
  init_teammateMailbox();
  init_MessageResponse();
  init_PlanApprovalMessage();
  init_ShutdownMessage();
  init_TaskAssignmentMessage();
  import_compiler_runtime84 = __toESM(require_react_compiler_runtime_development(), 1), React29 = __toESM(require_react_development(), 1), jsx_dev_runtime95 = __toESM(require_react_jsx_dev_runtime_development(), 1), TEAMMATE_MSG_REGEX = new RegExp(`<${TEAMMATE_MESSAGE_TAG}\\s+teammate_id="([^"]+)"(?:\\s+color="([^"]+)")?(?:\\s+summary="([^"]+)")?>\\n?([\\s\\S]*?)\\n?<\\/${TEAMMATE_MESSAGE_TAG}>`, "g");
});
