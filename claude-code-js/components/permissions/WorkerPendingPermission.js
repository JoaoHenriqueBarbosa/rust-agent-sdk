// Original: src/components/permissions/WorkerPendingPermission.tsx
function WorkerPendingPermission(t0) {
  let $3 = import_compiler_runtime286.c(15), {
    toolName,
    description
  } = t0, t1;
  if ($3[0] === Symbol.for("react.memo_cache_sentinel"))
    t1 = getTeamName(), $3[0] = t1;
  else
    t1 = $3[0];
  let teamName = t1, t2;
  if ($3[1] === Symbol.for("react.memo_cache_sentinel"))
    t2 = getAgentName(), $3[1] = t2;
  else
    t2 = $3[1];
  let agentName = t2, t3;
  if ($3[2] === Symbol.for("react.memo_cache_sentinel"))
    t3 = getTeammateColor(), $3[2] = t3;
  else
    t3 = $3[2];
  let agentColor = t3, t4, t5;
  if ($3[3] === Symbol.for("react.memo_cache_sentinel"))
    t4 = /* @__PURE__ */ jsx_dev_runtime369.jsxDEV(ThemedBox_default, {
      marginBottom: 1,
      children: [
        /* @__PURE__ */ jsx_dev_runtime369.jsxDEV(Spinner, {}, void 0, !1, void 0, this),
        /* @__PURE__ */ jsx_dev_runtime369.jsxDEV(ThemedText, {
          color: "warning",
          bold: !0,
          children: [
            " ",
            "Waiting for team lead approval"
          ]
        }, void 0, !0, void 0, this)
      ]
    }, void 0, !0, void 0, this), t5 = agentName && agentColor && /* @__PURE__ */ jsx_dev_runtime369.jsxDEV(ThemedBox_default, {
      marginBottom: 1,
      children: /* @__PURE__ */ jsx_dev_runtime369.jsxDEV(WorkerBadge, {
        name: agentName,
        color: agentColor
      }, void 0, !1, void 0, this)
    }, void 0, !1, void 0, this), $3[3] = t4, $3[4] = t5;
  else
    t4 = $3[3], t5 = $3[4];
  let t6;
  if ($3[5] === Symbol.for("react.memo_cache_sentinel"))
    t6 = /* @__PURE__ */ jsx_dev_runtime369.jsxDEV(ThemedText, {
      dimColor: !0,
      children: "Tool: "
    }, void 0, !1, void 0, this), $3[5] = t6;
  else
    t6 = $3[5];
  let t7;
  if ($3[6] !== toolName)
    t7 = /* @__PURE__ */ jsx_dev_runtime369.jsxDEV(ThemedBox_default, {
      children: [
        t6,
        /* @__PURE__ */ jsx_dev_runtime369.jsxDEV(ThemedText, {
          children: toolName
        }, void 0, !1, void 0, this)
      ]
    }, void 0, !0, void 0, this), $3[6] = toolName, $3[7] = t7;
  else
    t7 = $3[7];
  let t8;
  if ($3[8] === Symbol.for("react.memo_cache_sentinel"))
    t8 = /* @__PURE__ */ jsx_dev_runtime369.jsxDEV(ThemedText, {
      dimColor: !0,
      children: "Action: "
    }, void 0, !1, void 0, this), $3[8] = t8;
  else
    t8 = $3[8];
  let t9;
  if ($3[9] !== description)
    t9 = /* @__PURE__ */ jsx_dev_runtime369.jsxDEV(ThemedBox_default, {
      children: [
        t8,
        /* @__PURE__ */ jsx_dev_runtime369.jsxDEV(ThemedText, {
          children: description
        }, void 0, !1, void 0, this)
      ]
    }, void 0, !0, void 0, this), $3[9] = description, $3[10] = t9;
  else
    t9 = $3[10];
  let t10;
  if ($3[11] === Symbol.for("react.memo_cache_sentinel"))
    t10 = teamName && /* @__PURE__ */ jsx_dev_runtime369.jsxDEV(ThemedBox_default, {
      marginTop: 1,
      children: /* @__PURE__ */ jsx_dev_runtime369.jsxDEV(ThemedText, {
        dimColor: !0,
        children: [
          "Permission request sent to team ",
          '"',
          teamName,
          '"',
          " leader"
        ]
      }, void 0, !0, void 0, this)
    }, void 0, !1, void 0, this), $3[11] = t10;
  else
    t10 = $3[11];
  let t11;
  if ($3[12] !== t7 || $3[13] !== t9)
    t11 = /* @__PURE__ */ jsx_dev_runtime369.jsxDEV(ThemedBox_default, {
      flexDirection: "column",
      borderStyle: "round",
      borderColor: "warning",
      paddingX: 1,
      children: [
        t4,
        t5,
        t7,
        t9,
        t10
      ]
    }, void 0, !0, void 0, this), $3[12] = t7, $3[13] = t9, $3[14] = t11;
  else
    t11 = $3[14];
  return t11;
}
var import_compiler_runtime286, jsx_dev_runtime369;
var init_WorkerPendingPermission = __esm(() => {
  init_ink2();
  init_teammate();
  init_Spinner2();
  init_WorkerBadge();
  import_compiler_runtime286 = __toESM(require_react_compiler_runtime_development(), 1), jsx_dev_runtime369 = __toESM(require_react_jsx_dev_runtime_development(), 1);
});
