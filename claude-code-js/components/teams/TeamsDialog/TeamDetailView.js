// function: TeamDetailView
function TeamDetailView(t0) {
  let $3 = import_compiler_runtime326.c(13), {
    teamName,
    teammates,
    selectedIndex,
    onCancel
  } = t0, subtitle = `${teammates.length} ${teammates.length === 1 ? "teammate" : "teammates"}`, supportsHideShow = getCachedBackend()?.supportsHideShow ?? !1, cycleModeShortcut = useShortcutDisplay("confirm:cycleMode", "Confirmation", "shift+tab"), t1 = `Team ${teamName}`, t2;
  if ($3[0] !== selectedIndex || $3[1] !== teammates)
    t2 = teammates.length === 0 ? /* @__PURE__ */ jsx_dev_runtime422.jsxDEV(ThemedText, {
      dimColor: !0,
      children: "No teammates"
    }, void 0, !1, void 0, this) : /* @__PURE__ */ jsx_dev_runtime422.jsxDEV(ThemedBox_default, {
      flexDirection: "column",
      children: teammates.map((teammate, index2) => /* @__PURE__ */ jsx_dev_runtime422.jsxDEV(TeammateListItem, {
        teammate,
        isSelected: index2 === selectedIndex
      }, teammate.agentId, !1, void 0, this))
    }, void 0, !1, void 0, this), $3[0] = selectedIndex, $3[1] = teammates, $3[2] = t2;
  else
    t2 = $3[2];
  let t3;
  if ($3[3] !== onCancel || $3[4] !== subtitle || $3[5] !== t1 || $3[6] !== t2)
    t3 = /* @__PURE__ */ jsx_dev_runtime422.jsxDEV(Dialog, {
      title: t1,
      subtitle,
      onCancel,
      color: "background",
      hideInputGuide: !0,
      children: t2
    }, void 0, !1, void 0, this), $3[3] = onCancel, $3[4] = subtitle, $3[5] = t1, $3[6] = t2, $3[7] = t3;
  else
    t3 = $3[7];
  let t4;
  if ($3[8] !== cycleModeShortcut)
    t4 = /* @__PURE__ */ jsx_dev_runtime422.jsxDEV(ThemedBox_default, {
      marginLeft: 1,
      children: /* @__PURE__ */ jsx_dev_runtime422.jsxDEV(ThemedText, {
        dimColor: !0,
        children: [
          figures_default.arrowUp,
          "/",
          figures_default.arrowDown,
          " select \xB7 Enter view \xB7 k kill \xB7 s shutdown \xB7 p prune idle",
          supportsHideShow && " \xB7 h hide/show \xB7 H hide/show all",
          " \xB7 ",
          cycleModeShortcut,
          " sync cycle modes for all \xB7 Esc close"
        ]
      }, void 0, !0, void 0, this)
    }, void 0, !1, void 0, this), $3[8] = cycleModeShortcut, $3[9] = t4;
  else
    t4 = $3[9];
  let t5;
  if ($3[10] !== t3 || $3[11] !== t4)
    t5 = /* @__PURE__ */ jsx_dev_runtime422.jsxDEV(jsx_dev_runtime422.Fragment, {
      children: [
        t3,
        t4
      ]
    }, void 0, !0, void 0, this), $3[10] = t3, $3[11] = t4, $3[12] = t5;
  else
    t5 = $3[12];
  return t5;
}
