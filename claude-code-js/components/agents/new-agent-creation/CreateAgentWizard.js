// Original: src/components/agents/new-agent-creation/CreateAgentWizard.tsx
function CreateAgentWizard(t0) {
  let $3 = import_compiler_runtime265.c(17), {
    tools,
    existingAgents,
    onComplete,
    onCancel
  } = t0, t1;
  if ($3[0] !== existingAgents)
    t1 = () => /* @__PURE__ */ jsx_dev_runtime336.jsxDEV(TypeStep, {
      existingAgents
    }, void 0, !1, void 0, this), $3[0] = existingAgents, $3[1] = t1;
  else
    t1 = $3[1];
  let t2;
  if ($3[2] !== tools)
    t2 = () => /* @__PURE__ */ jsx_dev_runtime336.jsxDEV(ToolsStep, {
      tools
    }, void 0, !1, void 0, this), $3[2] = tools, $3[3] = t2;
  else
    t2 = $3[3];
  let t3;
  if ($3[4] === Symbol.for("react.memo_cache_sentinel"))
    t3 = isAutoMemoryEnabled() ? [MemoryStep] : [], $3[4] = t3;
  else
    t3 = $3[4];
  let t4;
  if ($3[5] !== existingAgents || $3[6] !== onComplete || $3[7] !== tools)
    t4 = () => /* @__PURE__ */ jsx_dev_runtime336.jsxDEV(ConfirmStepWrapper, {
      tools,
      existingAgents,
      onComplete
    }, void 0, !1, void 0, this), $3[5] = existingAgents, $3[6] = onComplete, $3[7] = tools, $3[8] = t4;
  else
    t4 = $3[8];
  let t5;
  if ($3[9] !== t1 || $3[10] !== t2 || $3[11] !== t4)
    t5 = [LocationStep, MethodStep, GenerateStep, t1, PromptStep, DescriptionStep, t2, ModelStep, ColorStep, ...t3, t4], $3[9] = t1, $3[10] = t2, $3[11] = t4, $3[12] = t5;
  else
    t5 = $3[12];
  let steps = t5, t6;
  if ($3[13] === Symbol.for("react.memo_cache_sentinel"))
    t6 = {}, $3[13] = t6;
  else
    t6 = $3[13];
  let t7;
  if ($3[14] !== onCancel || $3[15] !== steps)
    t7 = /* @__PURE__ */ jsx_dev_runtime336.jsxDEV(WizardProvider, {
      steps,
      initialData: t6,
      onComplete: _temp160,
      onCancel,
      title: "Create new agent",
      showStepCounter: !1
    }, void 0, !1, void 0, this), $3[14] = onCancel, $3[15] = steps, $3[16] = t7;
  else
    t7 = $3[16];
  return t7;
}
function _temp160() {}
var import_compiler_runtime265, jsx_dev_runtime336;
var init_CreateAgentWizard = __esm(() => {
  init_paths();
  init_wizard();
  init_ColorStep();
  init_ConfirmStepWrapper();
  init_DescriptionStep();
  init_GenerateStep();
  init_LocationStep();
  init_MemoryStep();
  init_MethodStep();
  init_ModelStep();
  init_PromptStep();
  init_ToolsStep();
  init_TypeStep();
  import_compiler_runtime265 = __toESM(require_react_compiler_runtime_development(), 1), jsx_dev_runtime336 = __toESM(require_react_jsx_dev_runtime_development(), 1);
});
