// Original: src/components/messages/PlanApprovalMessage.tsx
function PlanApprovalRequestDisplay(t0) {
  let $3 = import_compiler_runtime83.c(10), {
    request: request2
  } = t0, t1;
  if ($3[0] !== request2.from)
    t1 = /* @__PURE__ */ jsx_dev_runtime94.jsxDEV(ThemedBox_default, {
      marginBottom: 1,
      children: /* @__PURE__ */ jsx_dev_runtime94.jsxDEV(ThemedText, {
        color: "planMode",
        bold: !0,
        children: [
          "Plan Approval Request from ",
          request2.from
        ]
      }, void 0, !0, void 0, this)
    }, void 0, !1, void 0, this), $3[0] = request2.from, $3[1] = t1;
  else
    t1 = $3[1];
  let t2;
  if ($3[2] !== request2.planContent)
    t2 = /* @__PURE__ */ jsx_dev_runtime94.jsxDEV(ThemedBox_default, {
      borderStyle: "dashed",
      borderColor: "subtle",
      borderLeft: !1,
      borderRight: !1,
      flexDirection: "column",
      paddingX: 1,
      marginBottom: 1,
      children: /* @__PURE__ */ jsx_dev_runtime94.jsxDEV(Markdown, {
        children: request2.planContent
      }, void 0, !1, void 0, this)
    }, void 0, !1, void 0, this), $3[2] = request2.planContent, $3[3] = t2;
  else
    t2 = $3[3];
  let t3;
  if ($3[4] !== request2.planFilePath)
    t3 = /* @__PURE__ */ jsx_dev_runtime94.jsxDEV(ThemedText, {
      dimColor: !0,
      children: [
        "Plan file: ",
        request2.planFilePath
      ]
    }, void 0, !0, void 0, this), $3[4] = request2.planFilePath, $3[5] = t3;
  else
    t3 = $3[5];
  let t4;
  if ($3[6] !== t1 || $3[7] !== t2 || $3[8] !== t3)
    t4 = /* @__PURE__ */ jsx_dev_runtime94.jsxDEV(ThemedBox_default, {
      flexDirection: "column",
      marginY: 1,
      children: /* @__PURE__ */ jsx_dev_runtime94.jsxDEV(ThemedBox_default, {
        borderStyle: "round",
        borderColor: "planMode",
        flexDirection: "column",
        paddingX: 1,
        children: [
          t1,
          t2,
          t3
        ]
      }, void 0, !0, void 0, this)
    }, void 0, !1, void 0, this), $3[6] = t1, $3[7] = t2, $3[8] = t3, $3[9] = t4;
  else
    t4 = $3[9];
  return t4;
}
function PlanApprovalResponseDisplay(t0) {
  let $3 = import_compiler_runtime83.c(13), {
    response: response7,
    senderName
  } = t0;
  if (response7.approved) {
    let t12;
    if ($3[0] !== senderName)
      t12 = /* @__PURE__ */ jsx_dev_runtime94.jsxDEV(ThemedBox_default, {
        children: /* @__PURE__ */ jsx_dev_runtime94.jsxDEV(ThemedText, {
          color: "success",
          bold: !0,
          children: [
            "\u2713 Plan Approved by ",
            senderName
          ]
        }, void 0, !0, void 0, this)
      }, void 0, !1, void 0, this), $3[0] = senderName, $3[1] = t12;
    else
      t12 = $3[1];
    let t22;
    if ($3[2] === Symbol.for("react.memo_cache_sentinel"))
      t22 = /* @__PURE__ */ jsx_dev_runtime94.jsxDEV(ThemedBox_default, {
        marginTop: 1,
        children: /* @__PURE__ */ jsx_dev_runtime94.jsxDEV(ThemedText, {
          children: "You can now proceed with implementation. Your plan mode restrictions have been lifted."
        }, void 0, !1, void 0, this)
      }, void 0, !1, void 0, this), $3[2] = t22;
    else
      t22 = $3[2];
    let t32;
    if ($3[3] !== t12)
      t32 = /* @__PURE__ */ jsx_dev_runtime94.jsxDEV(ThemedBox_default, {
        flexDirection: "column",
        marginY: 1,
        children: /* @__PURE__ */ jsx_dev_runtime94.jsxDEV(ThemedBox_default, {
          borderStyle: "round",
          borderColor: "success",
          flexDirection: "column",
          paddingX: 1,
          paddingY: 1,
          children: [
            t12,
            t22
          ]
        }, void 0, !0, void 0, this)
      }, void 0, !1, void 0, this), $3[3] = t12, $3[4] = t32;
    else
      t32 = $3[4];
    return t32;
  }
  let t1;
  if ($3[5] !== senderName)
    t1 = /* @__PURE__ */ jsx_dev_runtime94.jsxDEV(ThemedBox_default, {
      children: /* @__PURE__ */ jsx_dev_runtime94.jsxDEV(ThemedText, {
        color: "error",
        bold: !0,
        children: [
          "\u2717 Plan Rejected by ",
          senderName
        ]
      }, void 0, !0, void 0, this)
    }, void 0, !1, void 0, this), $3[5] = senderName, $3[6] = t1;
  else
    t1 = $3[6];
  let t2;
  if ($3[7] !== response7.feedback)
    t2 = response7.feedback && /* @__PURE__ */ jsx_dev_runtime94.jsxDEV(ThemedBox_default, {
      marginTop: 1,
      borderStyle: "dashed",
      borderColor: "subtle",
      borderLeft: !1,
      borderRight: !1,
      paddingX: 1,
      children: /* @__PURE__ */ jsx_dev_runtime94.jsxDEV(ThemedText, {
        children: [
          "Feedback: ",
          response7.feedback
        ]
      }, void 0, !0, void 0, this)
    }, void 0, !1, void 0, this), $3[7] = response7.feedback, $3[8] = t2;
  else
    t2 = $3[8];
  let t3;
  if ($3[9] === Symbol.for("react.memo_cache_sentinel"))
    t3 = /* @__PURE__ */ jsx_dev_runtime94.jsxDEV(ThemedBox_default, {
      marginTop: 1,
      children: /* @__PURE__ */ jsx_dev_runtime94.jsxDEV(ThemedText, {
        dimColor: !0,
        children: "Please revise your plan based on the feedback and call ExitPlanMode again."
      }, void 0, !1, void 0, this)
    }, void 0, !1, void 0, this), $3[9] = t3;
  else
    t3 = $3[9];
  let t4;
  if ($3[10] !== t1 || $3[11] !== t2)
    t4 = /* @__PURE__ */ jsx_dev_runtime94.jsxDEV(ThemedBox_default, {
      flexDirection: "column",
      marginY: 1,
      children: /* @__PURE__ */ jsx_dev_runtime94.jsxDEV(ThemedBox_default, {
        borderStyle: "round",
        borderColor: "error",
        flexDirection: "column",
        paddingX: 1,
        paddingY: 1,
        children: [
          t1,
          t2,
          t3
        ]
      }, void 0, !0, void 0, this)
    }, void 0, !1, void 0, this), $3[10] = t1, $3[11] = t2, $3[12] = t4;
  else
    t4 = $3[12];
  return t4;
}
function tryRenderPlanApprovalMessage(content, senderName) {
  let request2 = isPlanApprovalRequest(content);
  if (request2)
    return /* @__PURE__ */ jsx_dev_runtime94.jsxDEV(PlanApprovalRequestDisplay, {
      request: request2
    }, void 0, !1, void 0, this);
  let response7 = isPlanApprovalResponse(content);
  if (response7)
    return /* @__PURE__ */ jsx_dev_runtime94.jsxDEV(PlanApprovalResponseDisplay, {
      response: response7,
      senderName
    }, void 0, !1, void 0, this);
  return null;
}
function getPlanApprovalSummary(content) {
  let request2 = isPlanApprovalRequest(content);
  if (request2)
    return `[Plan Approval Request from ${request2.from}]`;
  let response7 = isPlanApprovalResponse(content);
  if (response7)
    if (response7.approved)
      return "[Plan Approved] You can now proceed with implementation";
    else
      return `[Plan Rejected] ${response7.feedback || "Please revise your plan"}`;
  return null;
}
function getIdleNotificationSummary(msg) {
  let parts = ["Agent idle"];
  if (msg.completedTaskId) {
    let status = msg.completedStatus || "completed";
    parts.push(`Task ${msg.completedTaskId} ${status}`);
  }
  if (msg.summary)
    parts.push(`Last DM: ${msg.summary}`);
  return parts.join(" \xB7 ");
}
function formatTeammateMessageContent(content) {
  let planSummary = getPlanApprovalSummary(content);
  if (planSummary)
    return planSummary;
  let shutdownSummary = getShutdownMessageSummary(content);
  if (shutdownSummary)
    return shutdownSummary;
  let idleMsg = isIdleNotification(content);
  if (idleMsg)
    return getIdleNotificationSummary(idleMsg);
  let taskAssignmentSummary = getTaskAssignmentSummary(content);
  if (taskAssignmentSummary)
    return taskAssignmentSummary;
  try {
    let parsed = jsonParse(content);
    if (parsed?.type === "teammate_terminated" && parsed.message)
      return parsed.message;
  } catch {}
  return content;
}
var import_compiler_runtime83, jsx_dev_runtime94;
var init_PlanApprovalMessage = __esm(() => {
  init_Markdown();
  init_ink2();
  init_slowOperations();
  init_teammateMailbox();
  init_ShutdownMessage();
  init_TaskAssignmentMessage();
  import_compiler_runtime83 = __toESM(require_react_compiler_runtime_development(), 1), jsx_dev_runtime94 = __toESM(require_react_jsx_dev_runtime_development(), 1);
});
