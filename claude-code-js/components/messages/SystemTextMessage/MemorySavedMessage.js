// function: MemorySavedMessage
function MemorySavedMessage(t0) {
  let $3 = import_compiler_runtime95.c(16), {
    message,
    addMargin
  } = t0, bg = useSelectedMessageBg(), {
    writtenPaths
  } = message, t1;
  if ($3[0] !== message)
    t1 = null, $3[0] = message, $3[1] = t1;
  else
    t1 = $3[1];
  let team = t1, privateCount = writtenPaths.length - (team?.count ?? 0), t2 = privateCount > 0 ? `${privateCount} ${privateCount === 1 ? "memory" : "memories"}` : null, t3 = team?.segment, t4;
  if ($3[2] !== t2 || $3[3] !== t3)
    t4 = [t2, t3].filter(Boolean), $3[2] = t2, $3[3] = t3, $3[4] = t4;
  else
    t4 = $3[4];
  let parts = t4, t5 = addMargin ? 1 : 0, t6;
  if ($3[5] === Symbol.for("react.memo_cache_sentinel"))
    t6 = /* @__PURE__ */ jsx_dev_runtime106.jsxDEV(ThemedBox_default, {
      minWidth: 2,
      children: /* @__PURE__ */ jsx_dev_runtime106.jsxDEV(ThemedText, {
        dimColor: !0,
        children: BLACK_CIRCLE
      }, void 0, !1, void 0, this)
    }, void 0, !1, void 0, this), $3[5] = t6;
  else
    t6 = $3[5];
  let t7 = message.verb ?? "Saved", t8 = parts.join(" \xB7 "), t9;
  if ($3[6] !== t7 || $3[7] !== t8)
    t9 = /* @__PURE__ */ jsx_dev_runtime106.jsxDEV(ThemedBox_default, {
      flexDirection: "row",
      children: [
        t6,
        /* @__PURE__ */ jsx_dev_runtime106.jsxDEV(ThemedText, {
          children: [
            t7,
            " ",
            t8
          ]
        }, void 0, !0, void 0, this)
      ]
    }, void 0, !0, void 0, this), $3[6] = t7, $3[7] = t8, $3[8] = t9;
  else
    t9 = $3[8];
  let t10;
  if ($3[9] !== writtenPaths)
    t10 = writtenPaths.map(_temp54), $3[9] = writtenPaths, $3[10] = t10;
  else
    t10 = $3[10];
  let t11;
  if ($3[11] !== bg || $3[12] !== t10 || $3[13] !== t5 || $3[14] !== t9)
    t11 = /* @__PURE__ */ jsx_dev_runtime106.jsxDEV(ThemedBox_default, {
      flexDirection: "column",
      marginTop: t5,
      backgroundColor: bg,
      children: [
        t9,
        t10
      ]
    }, void 0, !0, void 0, this), $3[11] = bg, $3[12] = t10, $3[13] = t5, $3[14] = t9, $3[15] = t11;
  else
    t11 = $3[15];
  return t11;
}
