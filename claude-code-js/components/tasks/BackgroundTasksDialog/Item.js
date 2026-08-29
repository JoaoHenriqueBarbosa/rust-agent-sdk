// function: Item
function Item(t0) {
  let $3 = import_compiler_runtime229.c(14), {
    item,
    isSelected
  } = t0, {
    columns
  } = useTerminalSize(), maxActivityWidth = Math.max(30, columns - 26), t1;
  if ($3[0] === Symbol.for("react.memo_cache_sentinel"))
    t1 = isCoordinatorMode(), $3[0] = t1;
  else
    t1 = $3[0];
  let useGreyPointer = t1, t2 = useGreyPointer && isSelected, t3 = isSelected ? figures_default.pointer + " " : "  ", t4;
  if ($3[1] !== t2 || $3[2] !== t3)
    t4 = /* @__PURE__ */ jsx_dev_runtime289.jsxDEV(ThemedText, {
      dimColor: t2,
      children: t3
    }, void 0, !1, void 0, this), $3[1] = t2, $3[2] = t3, $3[3] = t4;
  else
    t4 = $3[3];
  let t5 = isSelected && !useGreyPointer ? "suggestion" : void 0, t6;
  if ($3[4] !== item.task || $3[5] !== item.type || $3[6] !== maxActivityWidth)
    t6 = item.type === "leader" ? /* @__PURE__ */ jsx_dev_runtime289.jsxDEV(ThemedText, {
      children: [
        "@",
        TEAM_LEAD_NAME
      ]
    }, void 0, !0, void 0, this) : /* @__PURE__ */ jsx_dev_runtime289.jsxDEV(BackgroundTask, {
      task: item.task,
      maxActivityWidth
    }, void 0, !1, void 0, this), $3[4] = item.task, $3[5] = item.type, $3[6] = maxActivityWidth, $3[7] = t6;
  else
    t6 = $3[7];
  let t7;
  if ($3[8] !== t5 || $3[9] !== t6)
    t7 = /* @__PURE__ */ jsx_dev_runtime289.jsxDEV(ThemedText, {
      color: t5,
      children: t6
    }, void 0, !1, void 0, this), $3[8] = t5, $3[9] = t6, $3[10] = t7;
  else
    t7 = $3[10];
  let t8;
  if ($3[11] !== t4 || $3[12] !== t7)
    t8 = /* @__PURE__ */ jsx_dev_runtime289.jsxDEV(ThemedBox_default, {
      flexDirection: "row",
      children: [
        t4,
        t7
      ]
    }, void 0, !0, void 0, this), $3[11] = t4, $3[12] = t7, $3[13] = t8;
  else
    t8 = $3[13];
  return t8;
}
