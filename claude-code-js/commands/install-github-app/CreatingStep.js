// Original: src/commands/install-github-app/CreatingStep.tsx
function CreatingStep(t0) {
  let $3 = import_compiler_runtime173.c(10), {
    currentWorkflowInstallStep,
    secretExists,
    useExistingSecret,
    secretName,
    skipWorkflow: t1,
    selectedWorkflows
  } = t0, skipWorkflow = t1 === void 0 ? !1 : t1, t2;
  if ($3[0] !== secretExists || $3[1] !== secretName || $3[2] !== selectedWorkflows || $3[3] !== skipWorkflow || $3[4] !== useExistingSecret)
    t2 = skipWorkflow ? ["Getting repository information", secretExists && useExistingSecret ? "Using existing API key secret" : `Setting up ${secretName} secret`] : ["Getting repository information", "Creating branch", selectedWorkflows.length > 1 ? "Creating workflow files" : "Creating workflow file", secretExists && useExistingSecret ? "Using existing API key secret" : `Setting up ${secretName} secret`, "Opening pull request page"], $3[0] = secretExists, $3[1] = secretName, $3[2] = selectedWorkflows, $3[3] = skipWorkflow, $3[4] = useExistingSecret, $3[5] = t2;
  else
    t2 = $3[5];
  let progressSteps = t2, t3;
  if ($3[6] === Symbol.for("react.memo_cache_sentinel"))
    t3 = /* @__PURE__ */ jsx_dev_runtime215.jsxDEV(ThemedBox_default, {
      flexDirection: "column",
      marginBottom: 1,
      children: [
        /* @__PURE__ */ jsx_dev_runtime215.jsxDEV(ThemedText, {
          bold: !0,
          children: "Install GitHub App"
        }, void 0, !1, void 0, this),
        /* @__PURE__ */ jsx_dev_runtime215.jsxDEV(ThemedText, {
          dimColor: !0,
          children: "Create GitHub Actions workflow"
        }, void 0, !1, void 0, this)
      ]
    }, void 0, !0, void 0, this), $3[6] = t3;
  else
    t3 = $3[6];
  let t4;
  if ($3[7] !== currentWorkflowInstallStep || $3[8] !== progressSteps)
    t4 = /* @__PURE__ */ jsx_dev_runtime215.jsxDEV(jsx_dev_runtime215.Fragment, {
      children: /* @__PURE__ */ jsx_dev_runtime215.jsxDEV(ThemedBox_default, {
        flexDirection: "column",
        borderStyle: "round",
        paddingX: 1,
        children: [
          t3,
          progressSteps.map((stepText, index) => {
            let status = "pending";
            if (index < currentWorkflowInstallStep)
              status = "completed";
            else if (index === currentWorkflowInstallStep)
              status = "in-progress";
            return /* @__PURE__ */ jsx_dev_runtime215.jsxDEV(ThemedBox_default, {
              children: /* @__PURE__ */ jsx_dev_runtime215.jsxDEV(ThemedText, {
                color: status === "completed" ? "success" : status === "in-progress" ? "warning" : void 0,
                children: [
                  status === "completed" ? "\u2713 " : "",
                  stepText,
                  status === "in-progress" ? "\u2026" : ""
                ]
              }, void 0, !0, void 0, this)
            }, index, !1, void 0, this);
          })
        ]
      }, void 0, !0, void 0, this)
    }, void 0, !1, void 0, this), $3[7] = currentWorkflowInstallStep, $3[8] = progressSteps, $3[9] = t4;
  else
    t4 = $3[9];
  return t4;
}
var import_compiler_runtime173, jsx_dev_runtime215;
var init_CreatingStep = __esm(() => {
  init_ink2();
  import_compiler_runtime173 = __toESM(require_react_compiler_runtime_development(), 1), jsx_dev_runtime215 = __toESM(require_react_jsx_dev_runtime_development(), 1);
});
