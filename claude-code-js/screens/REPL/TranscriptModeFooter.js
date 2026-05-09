// function: TranscriptModeFooter
function TranscriptModeFooter(t0) {
  let $3 = import_compiler_runtime360.c(9), {
    showAllInTranscript,
    virtualScroll,
    searchBadge,
    suppressShowAll: t1,
    status: status2
  } = t0, suppressShowAll = t1 === void 0 ? !1 : t1, toggleShortcut = useShortcutDisplay("app:toggleTranscript", "Global", "ctrl+o"), showAllShortcut = useShortcutDisplay("transcript:toggleShowAll", "Transcript", "ctrl+e"), t2 = searchBadge ? " \xB7 n/N to navigate" : virtualScroll ? ` \xB7 ${figures_default.arrowUp}${figures_default.arrowDown} scroll \xB7 home/end top/bottom` : suppressShowAll ? "" : ` \xB7 ${showAllShortcut} to ${showAllInTranscript ? "collapse" : "show all"}`, t3;
  if ($3[0] !== t2 || $3[1] !== toggleShortcut)
    t3 = /* @__PURE__ */ jsx_dev_runtime458.jsxDEV(ThemedText, {
      dimColor: !0,
      children: [
        "Showing detailed transcript \xB7 ",
        toggleShortcut,
        " to toggle",
        t2
      ]
    }, void 0, !0, void 0, this), $3[0] = t2, $3[1] = toggleShortcut, $3[2] = t3;
  else
    t3 = $3[2];
  let t4;
  if ($3[3] !== searchBadge || $3[4] !== status2)
    t4 = status2 ? /* @__PURE__ */ jsx_dev_runtime458.jsxDEV(jsx_dev_runtime458.Fragment, {
      children: [
        /* @__PURE__ */ jsx_dev_runtime458.jsxDEV(ThemedBox_default, {
          flexGrow: 1
        }, void 0, !1, void 0, this),
        /* @__PURE__ */ jsx_dev_runtime458.jsxDEV(ThemedText, {
          children: [
            status2,
            " "
          ]
        }, void 0, !0, void 0, this)
      ]
    }, void 0, !0, void 0, this) : searchBadge ? /* @__PURE__ */ jsx_dev_runtime458.jsxDEV(jsx_dev_runtime458.Fragment, {
      children: [
        /* @__PURE__ */ jsx_dev_runtime458.jsxDEV(ThemedBox_default, {
          flexGrow: 1
        }, void 0, !1, void 0, this),
        /* @__PURE__ */ jsx_dev_runtime458.jsxDEV(ThemedText, {
          dimColor: !0,
          children: [
            searchBadge.current,
            "/",
            searchBadge.count,
            "  "
          ]
        }, void 0, !0, void 0, this)
      ]
    }, void 0, !0, void 0, this) : null, $3[3] = searchBadge, $3[4] = status2, $3[5] = t4;
  else
    t4 = $3[5];
  let t5;
  if ($3[6] !== t3 || $3[7] !== t4)
    t5 = /* @__PURE__ */ jsx_dev_runtime458.jsxDEV(ThemedBox_default, {
      noSelect: !0,
      alignItems: "center",
      alignSelf: "center",
      borderTopDimColor: !0,
      borderBottom: !1,
      borderLeft: !1,
      borderRight: !1,
      borderStyle: "single",
      marginTop: 1,
      paddingLeft: 2,
      width: "100%",
      children: [
        t3,
        t4
      ]
    }, void 0, !0, void 0, this), $3[6] = t3, $3[7] = t4, $3[8] = t5;
  else
    t5 = $3[8];
  return t5;
}
