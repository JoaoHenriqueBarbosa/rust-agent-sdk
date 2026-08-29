// Original: src/commands/plan/plan.tsx
var exports_plan = {};
__export(exports_plan, {
  call: () => call41
});
function PlanDisplay(t0) {
  let $3 = import_compiler_runtime238.c(11), {
    planContent,
    planPath,
    editorName
  } = t0, t1;
  if ($3[0] === Symbol.for("react.memo_cache_sentinel"))
    t1 = /* @__PURE__ */ jsx_dev_runtime301.jsxDEV(ThemedText, {
      bold: !0,
      children: "Current Plan"
    }, void 0, !1, void 0, this), $3[0] = t1;
  else
    t1 = $3[0];
  let t2;
  if ($3[1] !== planPath)
    t2 = /* @__PURE__ */ jsx_dev_runtime301.jsxDEV(ThemedText, {
      dimColor: !0,
      children: planPath
    }, void 0, !1, void 0, this), $3[1] = planPath, $3[2] = t2;
  else
    t2 = $3[2];
  let t3;
  if ($3[3] !== planContent)
    t3 = /* @__PURE__ */ jsx_dev_runtime301.jsxDEV(ThemedBox_default, {
      marginTop: 1,
      children: /* @__PURE__ */ jsx_dev_runtime301.jsxDEV(ThemedText, {
        children: planContent
      }, void 0, !1, void 0, this)
    }, void 0, !1, void 0, this), $3[3] = planContent, $3[4] = t3;
  else
    t3 = $3[4];
  let t4;
  if ($3[5] !== editorName)
    t4 = editorName && /* @__PURE__ */ jsx_dev_runtime301.jsxDEV(ThemedBox_default, {
      marginTop: 1,
      children: [
        /* @__PURE__ */ jsx_dev_runtime301.jsxDEV(ThemedText, {
          dimColor: !0,
          children: '"/plan open"'
        }, void 0, !1, void 0, this),
        /* @__PURE__ */ jsx_dev_runtime301.jsxDEV(ThemedText, {
          dimColor: !0,
          children: " to edit this plan in "
        }, void 0, !1, void 0, this),
        /* @__PURE__ */ jsx_dev_runtime301.jsxDEV(ThemedText, {
          bold: !0,
          dimColor: !0,
          children: editorName
        }, void 0, !1, void 0, this)
      ]
    }, void 0, !0, void 0, this), $3[5] = editorName, $3[6] = t4;
  else
    t4 = $3[6];
  let t5;
  if ($3[7] !== t2 || $3[8] !== t3 || $3[9] !== t4)
    t5 = /* @__PURE__ */ jsx_dev_runtime301.jsxDEV(ThemedBox_default, {
      flexDirection: "column",
      children: [
        t1,
        t2,
        t3,
        t4
      ]
    }, void 0, !0, void 0, this), $3[7] = t2, $3[8] = t3, $3[9] = t4, $3[10] = t5;
  else
    t5 = $3[10];
  return t5;
}
async function call41(onDone, context7, args) {
  let {
    getAppState,
    setAppState
  } = context7, currentMode = getAppState().toolPermissionContext.mode;
  if (currentMode !== "plan") {
    handlePlanModeTransition(currentMode, "plan"), setAppState((prev) => ({
      ...prev,
      toolPermissionContext: applyPermissionUpdate(prepareContextForPlanMode(prev.toolPermissionContext), {
        type: "setMode",
        mode: "plan",
        destination: "session"
      })
    }));
    let description = args.trim();
    if (description && description !== "open")
      onDone("Enabled plan mode", {
        shouldQuery: !0
      });
    else
      onDone("Enabled plan mode");
    return null;
  }
  let planContent = getPlan(), planPath = getPlanFilePath();
  if (!planContent)
    return onDone("Already in plan mode. No plan written yet."), null;
  if (args.trim().split(/\s+/)[0] === "open") {
    let result = await editFileInEditor(planPath);
    if (result.error)
      onDone(`Failed to open plan in editor: ${result.error}`);
    else
      onDone(`Opened plan in editor: ${planPath}`);
    return null;
  }
  let editor = getExternalEditor(), editorName = editor ? toIDEDisplayName(editor) : void 0, output = await renderToString(/* @__PURE__ */ jsx_dev_runtime301.jsxDEV(PlanDisplay, {
    planContent,
    planPath,
    editorName
  }, void 0, !1, void 0, this));
  return onDone(output), null;
}
var import_compiler_runtime238, jsx_dev_runtime301;
var init_plan = __esm(() => {
  init_state();
  init_ink2();
  init_editor();
  init_ide();
  init_PermissionUpdate();
  init_permissionSetup();
  init_plans();
  init_promptEditor();
  init_staticRender();
  import_compiler_runtime238 = __toESM(require_react_compiler_runtime_development(), 1), jsx_dev_runtime301 = __toESM(require_react_jsx_dev_runtime_development(), 1);
});
