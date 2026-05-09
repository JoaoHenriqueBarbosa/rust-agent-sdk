// Original: src/components/TeammateViewHeader.tsx
function TeammateViewHeader() {
  let $3 = import_compiler_runtime338.c(14), viewedTeammate = useAppState(_temp201);
  if (!viewedTeammate)
    return null;
  let t0;
  if ($3[0] !== viewedTeammate.identity.color)
    t0 = toInkColor(viewedTeammate.identity.color), $3[0] = viewedTeammate.identity.color, $3[1] = t0;
  else
    t0 = $3[1];
  let nameColor = t0, t1;
  if ($3[2] === Symbol.for("react.memo_cache_sentinel"))
    t1 = /* @__PURE__ */ jsx_dev_runtime437.jsxDEV(ThemedText, {
      children: "Viewing "
    }, void 0, !1, void 0, this), $3[2] = t1;
  else
    t1 = $3[2];
  let t2;
  if ($3[3] !== nameColor || $3[4] !== viewedTeammate.identity.agentName)
    t2 = /* @__PURE__ */ jsx_dev_runtime437.jsxDEV(ThemedText, {
      color: nameColor,
      bold: !0,
      children: [
        "@",
        viewedTeammate.identity.agentName
      ]
    }, void 0, !0, void 0, this), $3[3] = nameColor, $3[4] = viewedTeammate.identity.agentName, $3[5] = t2;
  else
    t2 = $3[5];
  let t3;
  if ($3[6] === Symbol.for("react.memo_cache_sentinel"))
    t3 = /* @__PURE__ */ jsx_dev_runtime437.jsxDEV(ThemedText, {
      dimColor: !0,
      children: [
        " \xB7 ",
        /* @__PURE__ */ jsx_dev_runtime437.jsxDEV(KeyboardShortcutHint, {
          shortcut: "esc",
          action: "return"
        }, void 0, !1, void 0, this)
      ]
    }, void 0, !0, void 0, this), $3[6] = t3;
  else
    t3 = $3[6];
  let t4;
  if ($3[7] !== t2)
    t4 = /* @__PURE__ */ jsx_dev_runtime437.jsxDEV(ThemedBox_default, {
      children: [
        t1,
        t2,
        t3
      ]
    }, void 0, !0, void 0, this), $3[7] = t2, $3[8] = t4;
  else
    t4 = $3[8];
  let t5;
  if ($3[9] !== viewedTeammate.prompt)
    t5 = /* @__PURE__ */ jsx_dev_runtime437.jsxDEV(ThemedText, {
      dimColor: !0,
      children: viewedTeammate.prompt
    }, void 0, !1, void 0, this), $3[9] = viewedTeammate.prompt, $3[10] = t5;
  else
    t5 = $3[10];
  let t6;
  if ($3[11] !== t4 || $3[12] !== t5)
    t6 = /* @__PURE__ */ jsx_dev_runtime437.jsxDEV(OffscreenFreeze, {
      children: /* @__PURE__ */ jsx_dev_runtime437.jsxDEV(ThemedBox_default, {
        flexDirection: "column",
        marginBottom: 1,
        children: [
          t4,
          t5
        ]
      }, void 0, !0, void 0, this)
    }, void 0, !1, void 0, this), $3[11] = t4, $3[12] = t5, $3[13] = t6;
  else
    t6 = $3[13];
  return t6;
}
function _temp201(s2) {
  return getViewedTeammateTask(s2);
}
var import_compiler_runtime338, jsx_dev_runtime437;
var init_TeammateViewHeader = __esm(() => {
  init_ink2();
  init_AppState();
  init_selectors();
  init_ink3();
  init_KeyboardShortcutHint();
  init_OffscreenFreeze();
  import_compiler_runtime338 = __toESM(require_react_compiler_runtime_development(), 1), jsx_dev_runtime437 = __toESM(require_react_jsx_dev_runtime_development(), 1);
});
