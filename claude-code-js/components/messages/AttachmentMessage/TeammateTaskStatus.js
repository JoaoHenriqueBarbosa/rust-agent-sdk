// function: TeammateTaskStatus
function TeammateTaskStatus(t0) {
  let $3 = import_compiler_runtime90.c(16), {
    attachment
  } = t0, bg = useSelectedMessageBg(), t1;
  if ($3[0] !== attachment.taskId)
    t1 = (s2) => s2.tasks[attachment.taskId], $3[0] = attachment.taskId, $3[1] = t1;
  else
    t1 = $3[1];
  let task = useAppState(t1);
  if (task?.type !== "in_process_teammate") {
    let t22;
    if ($3[2] !== attachment)
      t22 = /* @__PURE__ */ jsx_dev_runtime101.jsxDEV(GenericTaskStatus, {
        attachment
      }, void 0, !1, void 0, this), $3[2] = attachment, $3[3] = t22;
    else
      t22 = $3[3];
    return t22;
  }
  let t2;
  if ($3[4] !== task.identity.color)
    t2 = toInkColor(task.identity.color), $3[4] = task.identity.color, $3[5] = t2;
  else
    t2 = $3[5];
  let agentColor = t2, statusText = attachment.status === "completed" ? "shut down gracefully" : attachment.status, t3;
  if ($3[6] === Symbol.for("react.memo_cache_sentinel"))
    t3 = /* @__PURE__ */ jsx_dev_runtime101.jsxDEV(ThemedText, {
      dimColor: !0,
      children: [
        BLACK_CIRCLE,
        " "
      ]
    }, void 0, !0, void 0, this), $3[6] = t3;
  else
    t3 = $3[6];
  let t4;
  if ($3[7] !== agentColor || $3[8] !== task.identity.agentName)
    t4 = /* @__PURE__ */ jsx_dev_runtime101.jsxDEV(ThemedText, {
      color: agentColor,
      bold: !0,
      dimColor: !1,
      children: [
        "@",
        task.identity.agentName
      ]
    }, void 0, !0, void 0, this), $3[7] = agentColor, $3[8] = task.identity.agentName, $3[9] = t4;
  else
    t4 = $3[9];
  let t5;
  if ($3[10] !== statusText || $3[11] !== t4)
    t5 = /* @__PURE__ */ jsx_dev_runtime101.jsxDEV(ThemedText, {
      dimColor: !0,
      children: [
        "Teammate",
        " ",
        t4,
        " ",
        statusText
      ]
    }, void 0, !0, void 0, this), $3[10] = statusText, $3[11] = t4, $3[12] = t5;
  else
    t5 = $3[12];
  let t6;
  if ($3[13] !== bg || $3[14] !== t5)
    t6 = /* @__PURE__ */ jsx_dev_runtime101.jsxDEV(ThemedBox_default, {
      flexDirection: "row",
      width: "100%",
      marginTop: 1,
      backgroundColor: bg,
      children: [
        t3,
        t5
      ]
    }, void 0, !0, void 0, this), $3[13] = bg, $3[14] = t5, $3[15] = t6;
  else
    t6 = $3[15];
  return t6;
}
