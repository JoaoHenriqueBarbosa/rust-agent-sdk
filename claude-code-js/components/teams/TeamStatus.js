// Original: src/components/teams/TeamStatus.tsx
function TeamStatus(t0) {
  let $3 = import_compiler_runtime329.c(14), {
    teamsSelected,
    showHint
  } = t0, teamContext = useAppState(_temp199), t1;
  if ($3[0] !== teamContext)
    t1 = teamContext ? Object.values(teamContext.teammates).filter(_temp282).length : 0, $3[0] = teamContext, $3[1] = t1;
  else
    t1 = $3[1];
  let totalTeammates = t1;
  if (totalTeammates === 0)
    return null;
  let t2;
  if ($3[2] !== showHint || $3[3] !== teamsSelected)
    t2 = showHint && teamsSelected ? /* @__PURE__ */ jsx_dev_runtime426.jsxDEV(jsx_dev_runtime426.Fragment, {
      children: [
        /* @__PURE__ */ jsx_dev_runtime426.jsxDEV(ThemedText, {
          dimColor: !0,
          children: "\xB7 "
        }, void 0, !1, void 0, this),
        /* @__PURE__ */ jsx_dev_runtime426.jsxDEV(ThemedText, {
          dimColor: !0,
          children: "Enter to view"
        }, void 0, !1, void 0, this)
      ]
    }, void 0, !0, void 0, this) : null, $3[2] = showHint, $3[3] = teamsSelected, $3[4] = t2;
  else
    t2 = $3[4];
  let hint = t2, statusText = `${totalTeammates} ${totalTeammates === 1 ? "teammate" : "teammates"}`, t3 = teamsSelected ? "selected" : "normal", t4;
  if ($3[5] !== statusText || $3[6] !== t3 || $3[7] !== teamsSelected)
    t4 = /* @__PURE__ */ jsx_dev_runtime426.jsxDEV(ThemedText, {
      color: "background",
      inverse: teamsSelected,
      children: statusText
    }, t3, !1, void 0, this), $3[5] = statusText, $3[6] = t3, $3[7] = teamsSelected, $3[8] = t4;
  else
    t4 = $3[8];
  let t5;
  if ($3[9] !== hint)
    t5 = hint ? /* @__PURE__ */ jsx_dev_runtime426.jsxDEV(ThemedText, {
      children: [
        " ",
        hint
      ]
    }, void 0, !0, void 0, this) : null, $3[9] = hint, $3[10] = t5;
  else
    t5 = $3[10];
  let t6;
  if ($3[11] !== t4 || $3[12] !== t5)
    t6 = /* @__PURE__ */ jsx_dev_runtime426.jsxDEV(jsx_dev_runtime426.Fragment, {
      children: [
        t4,
        t5
      ]
    }, void 0, !0, void 0, this), $3[11] = t4, $3[12] = t5, $3[13] = t6;
  else
    t6 = $3[13];
  return t6;
}
function _temp282(t2) {
  return t2.name !== "team-lead";
}
function _temp199(s2) {
  return s2.teamContext;
}
var import_compiler_runtime329, jsx_dev_runtime426;
var init_TeamStatus = __esm(() => {
  init_ink2();
  init_AppState();
  import_compiler_runtime329 = __toESM(require_react_compiler_runtime_development(), 1), jsx_dev_runtime426 = __toESM(require_react_jsx_dev_runtime_development(), 1);
});
