// function: GenericTaskStatus
function GenericTaskStatus(t0) {
  let $3 = import_compiler_runtime90.c(9), {
    attachment
  } = t0, bg = useSelectedMessageBg(), statusText = attachment.status === "completed" ? "completed in background" : attachment.status === "killed" ? "stopped" : attachment.status === "running" ? "still running in background" : attachment.status, t1;
  if ($3[0] === Symbol.for("react.memo_cache_sentinel"))
    t1 = /* @__PURE__ */ jsx_dev_runtime101.jsxDEV(ThemedText, {
      dimColor: !0,
      children: [
        BLACK_CIRCLE,
        " "
      ]
    }, void 0, !0, void 0, this), $3[0] = t1;
  else
    t1 = $3[0];
  let t2;
  if ($3[1] !== attachment.description)
    t2 = /* @__PURE__ */ jsx_dev_runtime101.jsxDEV(ThemedText, {
      bold: !0,
      children: attachment.description
    }, void 0, !1, void 0, this), $3[1] = attachment.description, $3[2] = t2;
  else
    t2 = $3[2];
  let t3;
  if ($3[3] !== statusText || $3[4] !== t2)
    t3 = /* @__PURE__ */ jsx_dev_runtime101.jsxDEV(ThemedText, {
      dimColor: !0,
      children: [
        'Task "',
        t2,
        '" ',
        statusText
      ]
    }, void 0, !0, void 0, this), $3[3] = statusText, $3[4] = t2, $3[5] = t3;
  else
    t3 = $3[5];
  let t4;
  if ($3[6] !== bg || $3[7] !== t3)
    t4 = /* @__PURE__ */ jsx_dev_runtime101.jsxDEV(ThemedBox_default, {
      flexDirection: "row",
      width: "100%",
      marginTop: 1,
      backgroundColor: bg,
      children: [
        t1,
        t3
      ]
    }, void 0, !0, void 0, this), $3[6] = bg, $3[7] = t3, $3[8] = t4;
  else
    t4 = $3[8];
  return t4;
}
