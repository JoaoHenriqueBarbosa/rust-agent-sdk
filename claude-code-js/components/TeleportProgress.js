// Original: src/components/TeleportProgress.tsx
var exports_TeleportProgress = {};
__export(exports_TeleportProgress, {
  teleportWithProgress: () => teleportWithProgress,
  TeleportProgress: () => TeleportProgress
});
function TeleportProgress(t0) {
  let $3 = import_compiler_runtime378.c(16), {
    currentStep,
    sessionId
  } = t0, [ref, time4] = useAnimationFrame(100), frame = Math.floor(time4 / 100) % SPINNER_FRAMES3.length, t1;
  if ($3[0] !== currentStep)
    t1 = (s2) => s2.key === currentStep, $3[0] = currentStep, $3[1] = t1;
  else
    t1 = $3[1];
  let currentStepIndex = STEPS.findIndex(t1), t2 = SPINNER_FRAMES3[frame], t3;
  if ($3[2] !== t2)
    t3 = /* @__PURE__ */ jsx_dev_runtime480.jsxDEV(ThemedBox_default, {
      marginBottom: 1,
      children: /* @__PURE__ */ jsx_dev_runtime480.jsxDEV(ThemedText, {
        bold: !0,
        color: "claude",
        children: [
          t2,
          " Teleporting session\u2026"
        ]
      }, void 0, !0, void 0, this)
    }, void 0, !1, void 0, this), $3[2] = t2, $3[3] = t3;
  else
    t3 = $3[3];
  let t4;
  if ($3[4] !== sessionId)
    t4 = sessionId && /* @__PURE__ */ jsx_dev_runtime480.jsxDEV(ThemedBox_default, {
      marginBottom: 1,
      children: /* @__PURE__ */ jsx_dev_runtime480.jsxDEV(ThemedText, {
        dimColor: !0,
        children: sessionId
      }, void 0, !1, void 0, this)
    }, void 0, !1, void 0, this), $3[4] = sessionId, $3[5] = t4;
  else
    t4 = $3[5];
  let t5;
  if ($3[6] !== currentStepIndex || $3[7] !== frame)
    t5 = STEPS.map((step, index2) => {
      let isComplete = index2 < currentStepIndex, isCurrent = index2 === currentStepIndex, isPending = index2 > currentStepIndex, icon, color3;
      if (isComplete)
        icon = figures_default.tick, color3 = "green";
      else if (isCurrent)
        icon = SPINNER_FRAMES3[frame], color3 = "claude";
      else
        icon = figures_default.circle, color3 = void 0;
      return /* @__PURE__ */ jsx_dev_runtime480.jsxDEV(ThemedBox_default, {
        flexDirection: "row",
        children: [
          /* @__PURE__ */ jsx_dev_runtime480.jsxDEV(ThemedBox_default, {
            width: 2,
            children: /* @__PURE__ */ jsx_dev_runtime480.jsxDEV(ThemedText, {
              color: color3,
              dimColor: isPending,
              children: icon
            }, void 0, !1, void 0, this)
          }, void 0, !1, void 0, this),
          /* @__PURE__ */ jsx_dev_runtime480.jsxDEV(ThemedText, {
            dimColor: isPending,
            bold: isCurrent,
            children: step.label
          }, void 0, !1, void 0, this)
        ]
      }, step.key, !0, void 0, this);
    }), $3[6] = currentStepIndex, $3[7] = frame, $3[8] = t5;
  else
    t5 = $3[8];
  let t6;
  if ($3[9] !== t5)
    t6 = /* @__PURE__ */ jsx_dev_runtime480.jsxDEV(ThemedBox_default, {
      flexDirection: "column",
      marginLeft: 2,
      children: t5
    }, void 0, !1, void 0, this), $3[9] = t5, $3[10] = t6;
  else
    t6 = $3[10];
  let t7;
  if ($3[11] !== ref || $3[12] !== t3 || $3[13] !== t4 || $3[14] !== t6)
    t7 = /* @__PURE__ */ jsx_dev_runtime480.jsxDEV(ThemedBox_default, {
      ref,
      flexDirection: "column",
      paddingX: 1,
      paddingY: 1,
      children: [
        t3,
        t4,
        t6
      ]
    }, void 0, !0, void 0, this), $3[11] = ref, $3[12] = t3, $3[13] = t4, $3[14] = t6, $3[15] = t7;
  else
    t7 = $3[15];
  return t7;
}
async function teleportWithProgress(root3, sessionId) {
  let setStep = () => {};
  function TeleportProgressWrapper() {
    let [step, _setStep] = import_react316.useState("validating");
    return setStep = _setStep, /* @__PURE__ */ jsx_dev_runtime480.jsxDEV(TeleportProgress, {
      currentStep: step,
      sessionId
    }, void 0, !1, void 0, this);
  }
  root3.render(/* @__PURE__ */ jsx_dev_runtime480.jsxDEV(AppStateProvider, {
    children: /* @__PURE__ */ jsx_dev_runtime480.jsxDEV(TeleportProgressWrapper, {}, void 0, !1, void 0, this)
  }, void 0, !1, void 0, this));
  let result = await teleportResumeCodeSession(sessionId, setStep);
  setStep("checking_out");
  let {
    branchName,
    branchError
  } = await checkOutTeleportedSessionBranch(result.branch);
  return {
    messages: processMessagesForTeleportResume(result.log, branchError),
    branchName
  };
}
var import_compiler_runtime378, import_react316, jsx_dev_runtime480, SPINNER_FRAMES3, STEPS;
var init_TeleportProgress = __esm(() => {
  init_figures();
  init_ink2();
  init_AppState();
  init_teleport();
  import_compiler_runtime378 = __toESM(require_react_compiler_runtime_development(), 1), import_react316 = __toESM(require_react_development(), 1), jsx_dev_runtime480 = __toESM(require_react_jsx_dev_runtime_development(), 1), SPINNER_FRAMES3 = ["\u25D0", "\u25D3", "\u25D1", "\u25D2"], STEPS = [{
    key: "validating",
    label: "Validating session"
  }, {
    key: "fetching_logs",
    label: "Fetching session logs"
  }, {
    key: "fetching_branch",
    label: "Getting branch info"
  }, {
    key: "checking_out",
    label: "Checking out branch"
  }];
});
