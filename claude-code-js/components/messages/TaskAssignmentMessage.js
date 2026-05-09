// Original: src/components/messages/TaskAssignmentMessage.tsx
function TaskAssignmentDisplay(t0) {
  let $3 = import_compiler_runtime82.c(11), {
    assignment
  } = t0, t1;
  if ($3[0] !== assignment.assignedBy || $3[1] !== assignment.taskId)
    t1 = /* @__PURE__ */ jsx_dev_runtime93.jsxDEV(ThemedBox_default, {
      marginBottom: 1,
      children: /* @__PURE__ */ jsx_dev_runtime93.jsxDEV(ThemedText, {
        color: "cyan_FOR_SUBAGENTS_ONLY",
        bold: !0,
        children: [
          "Task #",
          assignment.taskId,
          " assigned by ",
          assignment.assignedBy
        ]
      }, void 0, !0, void 0, this)
    }, void 0, !1, void 0, this), $3[0] = assignment.assignedBy, $3[1] = assignment.taskId, $3[2] = t1;
  else
    t1 = $3[2];
  let t2;
  if ($3[3] !== assignment.subject)
    t2 = /* @__PURE__ */ jsx_dev_runtime93.jsxDEV(ThemedBox_default, {
      children: /* @__PURE__ */ jsx_dev_runtime93.jsxDEV(ThemedText, {
        bold: !0,
        children: assignment.subject
      }, void 0, !1, void 0, this)
    }, void 0, !1, void 0, this), $3[3] = assignment.subject, $3[4] = t2;
  else
    t2 = $3[4];
  let t3;
  if ($3[5] !== assignment.description)
    t3 = assignment.description && /* @__PURE__ */ jsx_dev_runtime93.jsxDEV(ThemedBox_default, {
      marginTop: 1,
      children: /* @__PURE__ */ jsx_dev_runtime93.jsxDEV(ThemedText, {
        dimColor: !0,
        children: assignment.description
      }, void 0, !1, void 0, this)
    }, void 0, !1, void 0, this), $3[5] = assignment.description, $3[6] = t3;
  else
    t3 = $3[6];
  let t4;
  if ($3[7] !== t1 || $3[8] !== t2 || $3[9] !== t3)
    t4 = /* @__PURE__ */ jsx_dev_runtime93.jsxDEV(ThemedBox_default, {
      flexDirection: "column",
      marginY: 1,
      children: /* @__PURE__ */ jsx_dev_runtime93.jsxDEV(ThemedBox_default, {
        borderStyle: "round",
        borderColor: "cyan_FOR_SUBAGENTS_ONLY",
        flexDirection: "column",
        paddingX: 1,
        paddingY: 1,
        children: [
          t1,
          t2,
          t3
        ]
      }, void 0, !0, void 0, this)
    }, void 0, !1, void 0, this), $3[7] = t1, $3[8] = t2, $3[9] = t3, $3[10] = t4;
  else
    t4 = $3[10];
  return t4;
}
function tryRenderTaskAssignmentMessage(content) {
  let assignment = isTaskAssignment(content);
  if (assignment)
    return /* @__PURE__ */ jsx_dev_runtime93.jsxDEV(TaskAssignmentDisplay, {
      assignment
    }, void 0, !1, void 0, this);
  return null;
}
function getTaskAssignmentSummary(content) {
  let assignment = isTaskAssignment(content);
  if (assignment)
    return `[Task Assigned] #${assignment.taskId} - ${assignment.subject}`;
  return null;
}
var import_compiler_runtime82, jsx_dev_runtime93;
var init_TaskAssignmentMessage = __esm(() => {
  init_ink2();
  init_teammateMailbox();
  import_compiler_runtime82 = __toESM(require_react_compiler_runtime_development(), 1), jsx_dev_runtime93 = __toESM(require_react_jsx_dev_runtime_development(), 1);
});
