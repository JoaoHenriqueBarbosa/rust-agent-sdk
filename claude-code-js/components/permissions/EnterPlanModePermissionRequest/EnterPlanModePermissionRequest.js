// Original: src/components/permissions/EnterPlanModePermissionRequest/EnterPlanModePermissionRequest.tsx
function EnterPlanModePermissionRequest(t0) {
  let $3 = import_compiler_runtime300.c(18), {
    toolUseConfirm,
    onDone,
    onReject,
    workerBadge
  } = t0, toolPermissionContextMode = useAppState(_temp181), t1;
  if ($3[0] !== onDone || $3[1] !== onReject || $3[2] !== toolPermissionContextMode || $3[3] !== toolUseConfirm)
    t1 = function(value) {
      if (value === "yes")
        logEvent("tengu_plan_enter", {
          interviewPhaseEnabled: isPlanModeInterviewPhaseEnabled(),
          entryMethod: "tool"
        }), handlePlanModeTransition(toolPermissionContextMode, "plan"), onDone(), toolUseConfirm.onAllow({}, [{
          type: "setMode",
          mode: "plan",
          destination: "session"
        }]);
      else
        onDone(), onReject(), toolUseConfirm.onReject();
    }, $3[0] = onDone, $3[1] = onReject, $3[2] = toolPermissionContextMode, $3[3] = toolUseConfirm, $3[4] = t1;
  else
    t1 = $3[4];
  let handleResponse = t1, t2;
  if ($3[5] === Symbol.for("react.memo_cache_sentinel"))
    t2 = /* @__PURE__ */ jsx_dev_runtime387.jsxDEV(ThemedText, {
      children: "Claude wants to enter plan mode to explore and design an implementation approach."
    }, void 0, !1, void 0, this), $3[5] = t2;
  else
    t2 = $3[5];
  let t3;
  if ($3[6] === Symbol.for("react.memo_cache_sentinel"))
    t3 = /* @__PURE__ */ jsx_dev_runtime387.jsxDEV(ThemedBox_default, {
      marginTop: 1,
      flexDirection: "column",
      children: [
        /* @__PURE__ */ jsx_dev_runtime387.jsxDEV(ThemedText, {
          dimColor: !0,
          children: "In plan mode, Claude will:"
        }, void 0, !1, void 0, this),
        /* @__PURE__ */ jsx_dev_runtime387.jsxDEV(ThemedText, {
          dimColor: !0,
          children: " \xB7 Explore the codebase thoroughly"
        }, void 0, !1, void 0, this),
        /* @__PURE__ */ jsx_dev_runtime387.jsxDEV(ThemedText, {
          dimColor: !0,
          children: " \xB7 Identify existing patterns"
        }, void 0, !1, void 0, this),
        /* @__PURE__ */ jsx_dev_runtime387.jsxDEV(ThemedText, {
          dimColor: !0,
          children: " \xB7 Design an implementation strategy"
        }, void 0, !1, void 0, this),
        /* @__PURE__ */ jsx_dev_runtime387.jsxDEV(ThemedText, {
          dimColor: !0,
          children: " \xB7 Present a plan for your approval"
        }, void 0, !1, void 0, this)
      ]
    }, void 0, !0, void 0, this), $3[6] = t3;
  else
    t3 = $3[6];
  let t4;
  if ($3[7] === Symbol.for("react.memo_cache_sentinel"))
    t4 = /* @__PURE__ */ jsx_dev_runtime387.jsxDEV(ThemedBox_default, {
      marginTop: 1,
      children: /* @__PURE__ */ jsx_dev_runtime387.jsxDEV(ThemedText, {
        dimColor: !0,
        children: "No code changes will be made until you approve the plan."
      }, void 0, !1, void 0, this)
    }, void 0, !1, void 0, this), $3[7] = t4;
  else
    t4 = $3[7];
  let t5;
  if ($3[8] === Symbol.for("react.memo_cache_sentinel"))
    t5 = {
      label: "Yes, enter plan mode",
      value: "yes"
    }, $3[8] = t5;
  else
    t5 = $3[8];
  let t6;
  if ($3[9] === Symbol.for("react.memo_cache_sentinel"))
    t6 = [t5, {
      label: "No, start implementing now",
      value: "no"
    }], $3[9] = t6;
  else
    t6 = $3[9];
  let t7;
  if ($3[10] !== handleResponse)
    t7 = () => handleResponse("no"), $3[10] = handleResponse, $3[11] = t7;
  else
    t7 = $3[11];
  let t8;
  if ($3[12] !== handleResponse || $3[13] !== t7)
    t8 = /* @__PURE__ */ jsx_dev_runtime387.jsxDEV(ThemedBox_default, {
      flexDirection: "column",
      marginTop: 1,
      paddingX: 1,
      children: [
        t2,
        t3,
        t4,
        /* @__PURE__ */ jsx_dev_runtime387.jsxDEV(ThemedBox_default, {
          marginTop: 1,
          children: /* @__PURE__ */ jsx_dev_runtime387.jsxDEV(Select, {
            options: t6,
            onChange: handleResponse,
            onCancel: t7
          }, void 0, !1, void 0, this)
        }, void 0, !1, void 0, this)
      ]
    }, void 0, !0, void 0, this), $3[12] = handleResponse, $3[13] = t7, $3[14] = t8;
  else
    t8 = $3[14];
  let t9;
  if ($3[15] !== t8 || $3[16] !== workerBadge)
    t9 = /* @__PURE__ */ jsx_dev_runtime387.jsxDEV(PermissionDialog, {
      color: "planMode",
      title: "Enter plan mode?",
      workerBadge,
      children: t8
    }, void 0, !1, void 0, this), $3[15] = t8, $3[16] = workerBadge, $3[17] = t9;
  else
    t9 = $3[17];
  return t9;
}
function _temp181(s2) {
  return s2.toolPermissionContext.mode;
}
var import_compiler_runtime300, jsx_dev_runtime387;
var init_EnterPlanModePermissionRequest = __esm(() => {
  init_state();
  init_ink2();
  init_AppState();
  init_planModeV2();
  init_CustomSelect();
  init_PermissionDialog();
  import_compiler_runtime300 = __toESM(require_react_compiler_runtime_development(), 1), jsx_dev_runtime387 = __toESM(require_react_jsx_dev_runtime_development(), 1);
});
