// Original: src/components/wizard/WizardProvider.tsx
function WizardProvider(t0) {
  let $3 = import_compiler_runtime253.c(38), {
    steps,
    initialData: t1,
    onComplete,
    onCancel,
    children,
    title,
    showStepCounter: t2
  } = t0, t3;
  if ($3[0] !== t1)
    t3 = t1 === void 0 ? {} : t1, $3[0] = t1, $3[1] = t3;
  else
    t3 = $3[1];
  let initialData = t3, showStepCounter = t2 === void 0 ? !0 : t2, [currentStepIndex, setCurrentStepIndex] = import_react178.useState(0), [wizardData, setWizardData] = import_react178.useState(initialData), [isCompleted, setIsCompleted] = import_react178.useState(!1), t4;
  if ($3[2] === Symbol.for("react.memo_cache_sentinel"))
    t4 = [], $3[2] = t4;
  else
    t4 = $3[2];
  let [navigationHistory, setNavigationHistory] = import_react178.useState(t4);
  useExitOnCtrlCDWithKeybindings();
  let t5, t6;
  if ($3[3] !== isCompleted || $3[4] !== onComplete || $3[5] !== wizardData)
    t5 = () => {
      if (isCompleted)
        setNavigationHistory([]), onComplete(wizardData);
    }, t6 = [isCompleted, wizardData, onComplete], $3[3] = isCompleted, $3[4] = onComplete, $3[5] = wizardData, $3[6] = t5, $3[7] = t6;
  else
    t5 = $3[6], t6 = $3[7];
  import_react178.useEffect(t5, t6);
  let t7;
  if ($3[8] !== currentStepIndex || $3[9] !== navigationHistory || $3[10] !== steps.length)
    t7 = () => {
      if (currentStepIndex < steps.length - 1) {
        if (navigationHistory.length > 0)
          setNavigationHistory((prev) => [...prev, currentStepIndex]);
        setCurrentStepIndex(_temp158);
      } else
        setIsCompleted(!0);
    }, $3[8] = currentStepIndex, $3[9] = navigationHistory, $3[10] = steps.length, $3[11] = t7;
  else
    t7 = $3[11];
  let goNext = t7, t8;
  if ($3[12] !== currentStepIndex || $3[13] !== navigationHistory || $3[14] !== onCancel)
    t8 = () => {
      if (navigationHistory.length > 0) {
        let previousStep = navigationHistory[navigationHistory.length - 1];
        if (previousStep !== void 0)
          setNavigationHistory(_temp268), setCurrentStepIndex(previousStep);
      } else if (currentStepIndex > 0)
        setCurrentStepIndex(_temp342);
      else if (onCancel)
        onCancel();
    }, $3[12] = currentStepIndex, $3[13] = navigationHistory, $3[14] = onCancel, $3[15] = t8;
  else
    t8 = $3[15];
  let goBack = t8, t9;
  if ($3[16] !== currentStepIndex || $3[17] !== steps.length)
    t9 = (index) => {
      if (index >= 0 && index < steps.length)
        setNavigationHistory((prev_3) => [...prev_3, currentStepIndex]), setCurrentStepIndex(index);
    }, $3[16] = currentStepIndex, $3[17] = steps.length, $3[18] = t9;
  else
    t9 = $3[18];
  let goToStep = t9, t10;
  if ($3[19] !== onCancel)
    t10 = () => {
      if (setNavigationHistory([]), onCancel)
        onCancel();
    }, $3[19] = onCancel, $3[20] = t10;
  else
    t10 = $3[20];
  let cancel = t10, t11;
  if ($3[21] === Symbol.for("react.memo_cache_sentinel"))
    t11 = (updates) => {
      setWizardData((prev_4) => ({
        ...prev_4,
        ...updates
      }));
    }, $3[21] = t11;
  else
    t11 = $3[21];
  let updateWizardData = t11, t12;
  if ($3[22] !== cancel || $3[23] !== currentStepIndex || $3[24] !== goBack || $3[25] !== goNext || $3[26] !== goToStep || $3[27] !== showStepCounter || $3[28] !== steps.length || $3[29] !== title || $3[30] !== wizardData)
    t12 = {
      currentStepIndex,
      totalSteps: steps.length,
      wizardData,
      setWizardData,
      updateWizardData,
      goNext,
      goBack,
      goToStep,
      cancel,
      title,
      showStepCounter
    }, $3[22] = cancel, $3[23] = currentStepIndex, $3[24] = goBack, $3[25] = goNext, $3[26] = goToStep, $3[27] = showStepCounter, $3[28] = steps.length, $3[29] = title, $3[30] = wizardData, $3[31] = t12;
  else
    t12 = $3[31];
  let contextValue = t12, CurrentStepComponent = steps[currentStepIndex];
  if (!CurrentStepComponent || isCompleted)
    return null;
  let t13;
  if ($3[32] !== CurrentStepComponent || $3[33] !== children)
    t13 = children || /* @__PURE__ */ jsx_dev_runtime321.jsxDEV(CurrentStepComponent, {}, void 0, !1, void 0, this), $3[32] = CurrentStepComponent, $3[33] = children, $3[34] = t13;
  else
    t13 = $3[34];
  let t14;
  if ($3[35] !== contextValue || $3[36] !== t13)
    t14 = /* @__PURE__ */ jsx_dev_runtime321.jsxDEV(WizardContext.Provider, {
      value: contextValue,
      children: t13
    }, void 0, !1, void 0, this), $3[35] = contextValue, $3[36] = t13, $3[37] = t14;
  else
    t14 = $3[37];
  return t14;
}
function _temp342(prev_2) {
  return prev_2 - 1;
}
function _temp268(prev_1) {
  return prev_1.slice(0, -1);
}
function _temp158(prev_0) {
  return prev_0 + 1;
}
var import_compiler_runtime253, import_react178, jsx_dev_runtime321, WizardContext;
var init_WizardProvider = __esm(() => {
  init_useExitOnCtrlCDWithKeybindings();
  import_compiler_runtime253 = __toESM(require_react_compiler_runtime_development(), 1), import_react178 = __toESM(require_react_development(), 1), jsx_dev_runtime321 = __toESM(require_react_jsx_dev_runtime_development(), 1), WizardContext = import_react178.createContext(null);
});
