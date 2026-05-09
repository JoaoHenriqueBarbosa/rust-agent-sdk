// Original: src/components/wizard/WizardDialogLayout.tsx
function WizardDialogLayout(t0) {
  let $3 = import_compiler_runtime254.c(11), {
    title: titleOverride,
    color: t1,
    children,
    subtitle,
    footerText
  } = t0, color3 = t1 === void 0 ? "suggestion" : t1, {
    currentStepIndex,
    totalSteps,
    title: providerTitle,
    showStepCounter,
    goBack
  } = useWizard(), title = titleOverride || providerTitle || "Wizard", stepSuffix = showStepCounter !== !1 ? ` (${currentStepIndex + 1}/${totalSteps})` : "", t2 = `${title}${stepSuffix}`, t3;
  if ($3[0] !== children || $3[1] !== color3 || $3[2] !== goBack || $3[3] !== subtitle || $3[4] !== t2)
    t3 = /* @__PURE__ */ jsx_dev_runtime323.jsxDEV(Dialog, {
      title: t2,
      subtitle,
      onCancel: goBack,
      color: color3,
      hideInputGuide: !0,
      isCancelActive: !1,
      children
    }, void 0, !1, void 0, this), $3[0] = children, $3[1] = color3, $3[2] = goBack, $3[3] = subtitle, $3[4] = t2, $3[5] = t3;
  else
    t3 = $3[5];
  let t4;
  if ($3[6] !== footerText)
    t4 = /* @__PURE__ */ jsx_dev_runtime323.jsxDEV(WizardNavigationFooter, {
      instructions: footerText
    }, void 0, !1, void 0, this), $3[6] = footerText, $3[7] = t4;
  else
    t4 = $3[7];
  let t5;
  if ($3[8] !== t3 || $3[9] !== t4)
    t5 = /* @__PURE__ */ jsx_dev_runtime323.jsxDEV(jsx_dev_runtime323.Fragment, {
      children: [
        t3,
        t4
      ]
    }, void 0, !0, void 0, this), $3[8] = t3, $3[9] = t4, $3[10] = t5;
  else
    t5 = $3[10];
  return t5;
}
var import_compiler_runtime254, jsx_dev_runtime323;
var init_WizardDialogLayout = __esm(() => {
  init_Dialog();
  init_useWizard();
  init_WizardNavigationFooter();
  import_compiler_runtime254 = __toESM(require_react_compiler_runtime_development(), 1), jsx_dev_runtime323 = __toESM(require_react_jsx_dev_runtime_development(), 1);
});
