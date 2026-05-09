// Original: src/commands/model/model.tsx
var exports_model = {};
__export(exports_model, {
  call: () => call60
});
function ModelPickerWrapper(t0) {
  let $3 = import_compiler_runtime273.c(17), {
    onDone
  } = t0, mainLoopModel = useAppState(_temp167), mainLoopModelForSession = useAppState(_temp273), isFastMode = useAppState(_temp347), setAppState = useSetAppState(), t1;
  if ($3[0] !== mainLoopModel || $3[1] !== onDone)
    t1 = function() {
      logEvent("tengu_model_command_menu", {
        action: "cancel"
      });
      let displayModel = renderModelLabel(mainLoopModel);
      onDone(`Kept model as ${source_default.bold(displayModel)}`, {
        display: "system"
      });
    }, $3[0] = mainLoopModel, $3[1] = onDone, $3[2] = t1;
  else
    t1 = $3[2];
  let handleCancel = t1, t2;
  if ($3[3] !== isFastMode || $3[4] !== mainLoopModel || $3[5] !== onDone || $3[6] !== setAppState)
    t2 = function(model, effort) {
      logEvent("tengu_model_command_menu", {
        action: model,
        from_model: mainLoopModel,
        to_model: model
      }), setAppState((prev) => ({
        ...prev,
        mainLoopModel: model,
        mainLoopModelForSession: null
      }));
      let message = `Set model to ${source_default.bold(renderModelLabel(model))}`;
      if (effort !== void 0)
        message = message + ` with ${source_default.bold(effort)} effort`;
      let wasFastModeToggledOn = void 0;
      if (isFastModeEnabled()) {
        if (clearFastModeCooldown(), !isFastModeSupportedByModel(model) && isFastMode)
          setAppState(_temp436), wasFastModeToggledOn = !1;
        else if (isFastModeSupportedByModel(model) && isFastModeAvailable() && isFastMode)
          message = message + " \xB7 Fast mode ON", wasFastModeToggledOn = !0;
      }
      if (isBilledAsExtraUsage(model, wasFastModeToggledOn === !0, isOpus1mMergeEnabled()))
        message = message + " \xB7 Billed as extra usage";
      if (wasFastModeToggledOn === !1)
        message = message + " \xB7 Fast mode OFF";
      onDone(message);
    }, $3[3] = isFastMode, $3[4] = mainLoopModel, $3[5] = onDone, $3[6] = setAppState, $3[7] = t2;
  else
    t2 = $3[7];
  let handleSelect = t2, t3;
  if ($3[8] !== isFastMode || $3[9] !== mainLoopModel)
    t3 = isFastModeEnabled() && isFastMode && isFastModeSupportedByModel(mainLoopModel) && isFastModeAvailable(), $3[8] = isFastMode, $3[9] = mainLoopModel, $3[10] = t3;
  else
    t3 = $3[10];
  let t4;
  if ($3[11] !== handleCancel || $3[12] !== handleSelect || $3[13] !== mainLoopModel || $3[14] !== mainLoopModelForSession || $3[15] !== t3)
    t4 = /* @__PURE__ */ jsx_dev_runtime352.jsxDEV(ModelPicker, {
      initial: mainLoopModel,
      sessionModel: mainLoopModelForSession,
      onSelect: handleSelect,
      onCancel: handleCancel,
      isStandaloneCommand: !0,
      showFastModeNotice: t3
    }, void 0, !1, void 0, this), $3[11] = handleCancel, $3[12] = handleSelect, $3[13] = mainLoopModel, $3[14] = mainLoopModelForSession, $3[15] = t3, $3[16] = t4;
  else
    t4 = $3[16];
  return t4;
}
function _temp436(prev_0) {
  return {
    ...prev_0,
    fastMode: !1
  };
}
function _temp347(s_1) {
  return s_1.fastMode;
}
function _temp273(s_0) {
  return s_0.mainLoopModelForSession;
}
function _temp167(s2) {
  return s2.mainLoopModel;
}
function SetModelAndClose({
  args,
  onDone
}) {
  let isFastMode = useAppState((s2) => s2.fastMode), setAppState = useSetAppState(), model = args === "default" ? null : args;
  return React108.useEffect(() => {
    async function handleModelChange() {
      if (model && !isModelAllowed(model)) {
        onDone(`Model '${model}' is not available. Your organization restricts model selection.`, {
          display: "system"
        });
        return;
      }
      if (model && isOpus1mUnavailable(model)) {
        onDone("Opus 4.6 with 1M context is not available for your account. Learn more: https://code.claude.com/docs/en/model-config#extended-context-with-1m", {
          display: "system"
        });
        return;
      }
      if (model && isSonnet1mUnavailable(model)) {
        onDone("Sonnet 4.6 with 1M context is not available for your account. Learn more: https://code.claude.com/docs/en/model-config#extended-context-with-1m", {
          display: "system"
        });
        return;
      }
      if (!model) {
        setModel(null);
        return;
      }
      if (isKnownAlias(model)) {
        setModel(model);
        return;
      }
      try {
        let {
          valid,
          error: error_0
        } = await validateModel(model);
        if (valid)
          setModel(model);
        else
          onDone(error_0 || `Model '${model}' not found`, {
            display: "system"
          });
      } catch (error44) {
        onDone(`Failed to validate model: ${error44.message}`, {
          display: "system"
        });
      }
    }
    function setModel(modelValue) {
      setAppState((prev) => ({
        ...prev,
        mainLoopModel: modelValue,
        mainLoopModelForSession: null
      }));
      let message = `Set model to ${source_default.bold(renderModelLabel(modelValue))}`, wasFastModeToggledOn = void 0;
      if (isFastModeEnabled()) {
        if (clearFastModeCooldown(), !isFastModeSupportedByModel(modelValue) && isFastMode)
          setAppState((prev_0) => ({
            ...prev_0,
            fastMode: !1
          })), wasFastModeToggledOn = !1;
        else if (isFastModeSupportedByModel(modelValue) && isFastMode)
          message += " \xB7 Fast mode ON", wasFastModeToggledOn = !0;
      }
      if (isBilledAsExtraUsage(modelValue, wasFastModeToggledOn === !0, isOpus1mMergeEnabled()))
        message += " \xB7 Billed as extra usage";
      if (wasFastModeToggledOn === !1)
        message += " \xB7 Fast mode OFF";
      onDone(message);
    }
    handleModelChange();
  }, [model, onDone, setAppState]), null;
}
function isKnownAlias(model) {
  return MODEL_ALIASES.includes(model.toLowerCase().trim());
}
function isOpus1mUnavailable(model) {
  let m4 = model.toLowerCase();
  return !checkOpus1mAccess() && !isOpus1mMergeEnabled() && m4.includes("opus") && m4.includes("[1m]");
}
function isSonnet1mUnavailable(model) {
  let m4 = model.toLowerCase();
  return !checkSonnet1mAccess() && (m4.includes("sonnet[1m]") || m4.includes("sonnet-4-6[1m]"));
}
function ShowModelAndClose(t0) {
  let {
    onDone
  } = t0, mainLoopModel = useAppState(_temp718), mainLoopModelForSession = useAppState(_temp815), effortValue = useAppState(_temp913), displayModel = renderModelLabel(mainLoopModel), effortInfo = effortValue !== void 0 ? ` (effort: ${effortValue})` : "";
  if (mainLoopModelForSession)
    onDone(`Current model: ${source_default.bold(renderModelLabel(mainLoopModelForSession))} (session override from plan mode)
Base model: ${displayModel}${effortInfo}`);
  else
    onDone(`Current model: ${displayModel}${effortInfo}`);
  return null;
}
function _temp913(s_1) {
  return s_1.effortValue;
}
function _temp815(s_0) {
  return s_0.mainLoopModelForSession;
}
function _temp718(s2) {
  return s2.mainLoopModel;
}
function renderModelLabel(model) {
  let rendered = renderDefaultModelSetting(model ?? getDefaultMainLoopModelSetting());
  return model === null ? `${rendered} (default)` : rendered;
}
var import_compiler_runtime273, React108, jsx_dev_runtime352, call60 = async (onDone, _context, args) => {
  if (args = args?.trim() || "", COMMON_INFO_ARGS.includes(args))
    return logEvent("tengu_model_command_inline_help", {
      args
    }), /* @__PURE__ */ jsx_dev_runtime352.jsxDEV(ShowModelAndClose, {
      onDone
    }, void 0, !1, void 0, this);
  if (COMMON_HELP_ARGS.includes(args)) {
    onDone("Run /model to open the model selection menu, or /model [modelName] to set the model.", {
      display: "system"
    });
    return;
  }
  if (args)
    return logEvent("tengu_model_command_inline", {
      args
    }), /* @__PURE__ */ jsx_dev_runtime352.jsxDEV(SetModelAndClose, {
      args,
      onDone
    }, void 0, !1, void 0, this);
  return /* @__PURE__ */ jsx_dev_runtime352.jsxDEV(ModelPickerWrapper, {
    onDone
  }, void 0, !1, void 0, this);
};
var init_model2 = __esm(() => {
  init_source();
  init_ModelPicker();
  init_xml();
  init_AppState();
  init_extraUsage();
  init_fastMode();
  init_aliases();
  init_check1mAccess();
  init_model();
  init_modelAllowlist();
  init_validateModel();
  import_compiler_runtime273 = __toESM(require_react_compiler_runtime_development(), 1), React108 = __toESM(require_react_development(), 1), jsx_dev_runtime352 = __toESM(require_react_jsx_dev_runtime_development(), 1);
});
