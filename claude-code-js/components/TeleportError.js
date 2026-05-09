// Original: src/components/TeleportError.tsx
function TeleportError(t0) {
  let $3 = import_compiler_runtime105.c(18), {
    onComplete,
    errorsToIgnore: t1
  } = t0, errorsToIgnore = t1 === void 0 ? EMPTY_ERRORS_TO_IGNORE : t1, [currentError, setCurrentError] = import_react75.useState(null), [isLoggingIn, setIsLoggingIn] = import_react75.useState(!1), t2;
  if ($3[0] !== errorsToIgnore || $3[1] !== onComplete)
    t2 = async () => {
      let currentErrors = await getTeleportErrors(), filteredErrors = new Set(Array.from(currentErrors).filter((error44) => !errorsToIgnore.has(error44)));
      if (filteredErrors.size === 0) {
        onComplete();
        return;
      }
      if (filteredErrors.has("needsLogin"))
        setCurrentError("needsLogin");
      else if (filteredErrors.has("needsGitStash"))
        setCurrentError("needsGitStash");
    }, $3[0] = errorsToIgnore, $3[1] = onComplete, $3[2] = t2;
  else
    t2 = $3[2];
  let checkErrors = t2, t3, t4;
  if ($3[3] !== checkErrors)
    t3 = () => {
      checkErrors();
    }, t4 = [checkErrors], $3[3] = checkErrors, $3[4] = t3, $3[5] = t4;
  else
    t3 = $3[4], t4 = $3[5];
  import_react75.useEffect(t3, t4);
  let onCancel = _temp39, t5;
  if ($3[6] !== checkErrors)
    t5 = () => {
      setIsLoggingIn(!1), checkErrors();
    }, $3[6] = checkErrors, $3[7] = t5;
  else
    t5 = $3[7];
  let handleLoginComplete = t5, t6;
  if ($3[8] === Symbol.for("react.memo_cache_sentinel"))
    t6 = () => {
      setIsLoggingIn(!0);
    }, $3[8] = t6;
  else
    t6 = $3[8];
  let handleLoginWithClaudeAI = t6, t7;
  if ($3[9] === Symbol.for("react.memo_cache_sentinel"))
    t7 = (value) => {
      if (value === "login")
        handleLoginWithClaudeAI();
      else
        onCancel();
    }, $3[9] = t7;
  else
    t7 = $3[9];
  let handleLoginDialogSelect = t7, t8;
  if ($3[10] !== checkErrors)
    t8 = () => {
      checkErrors();
    }, $3[10] = checkErrors, $3[11] = t8;
  else
    t8 = $3[11];
  let handleStashComplete = t8;
  if (!currentError)
    return null;
  switch (currentError) {
    case "needsGitStash": {
      let t9;
      if ($3[12] !== handleStashComplete)
        t9 = /* @__PURE__ */ jsx_dev_runtime118.jsxDEV(TeleportStash, {
          onStashAndContinue: handleStashComplete,
          onCancel
        }, void 0, !1, void 0, this), $3[12] = handleStashComplete, $3[13] = t9;
      else
        t9 = $3[13];
      return t9;
    }
    case "needsLogin": {
      if (isLoggingIn) {
        let t92;
        if ($3[14] !== handleLoginComplete)
          t92 = /* @__PURE__ */ jsx_dev_runtime118.jsxDEV(ConsoleOAuthFlow, {
            onDone: handleLoginComplete,
            mode: "login",
            forceLoginMethod: "claudeai"
          }, void 0, !1, void 0, this), $3[14] = handleLoginComplete, $3[15] = t92;
        else
          t92 = $3[15];
        return t92;
      }
      let t9;
      if ($3[16] === Symbol.for("react.memo_cache_sentinel"))
        t9 = /* @__PURE__ */ jsx_dev_runtime118.jsxDEV(ThemedBox_default, {
          flexDirection: "column",
          children: [
            /* @__PURE__ */ jsx_dev_runtime118.jsxDEV(ThemedText, {
              dimColor: !0,
              children: "Teleport requires a Claude.ai account."
            }, void 0, !1, void 0, this),
            /* @__PURE__ */ jsx_dev_runtime118.jsxDEV(ThemedText, {
              dimColor: !0,
              children: "Your Claude Pro/Max subscription will be used by Claude Code."
            }, void 0, !1, void 0, this)
          ]
        }, void 0, !0, void 0, this), $3[16] = t9;
      else
        t9 = $3[16];
      let t10;
      if ($3[17] === Symbol.for("react.memo_cache_sentinel"))
        t10 = /* @__PURE__ */ jsx_dev_runtime118.jsxDEV(Dialog, {
          title: "Log in to Claude",
          onCancel,
          children: [
            t9,
            /* @__PURE__ */ jsx_dev_runtime118.jsxDEV(Select, {
              options: [{
                label: "Login with Claude account",
                value: "login"
              }, {
                label: "Exit",
                value: "exit"
              }],
              onChange: handleLoginDialogSelect
            }, void 0, !1, void 0, this)
          ]
        }, void 0, !0, void 0, this), $3[17] = t10;
      else
        t10 = $3[17];
      return t10;
    }
  }
}
function _temp39() {
  gracefulShutdownSync(0);
}
async function getTeleportErrors() {
  let errors8 = /* @__PURE__ */ new Set, [needsLogin, isGitClean] = await Promise.all([checkNeedsClaudeAiLogin(), checkIsGitClean()]);
  if (needsLogin)
    errors8.add("needsLogin");
  if (!isGitClean)
    errors8.add("needsGitStash");
  return errors8;
}
var import_compiler_runtime105, import_react75, jsx_dev_runtime118, EMPTY_ERRORS_TO_IGNORE;
var init_TeleportError = __esm(() => {
  init_preconditions();
  init_gracefulShutdown();
  init_ink2();
  init_ConsoleOAuthFlow();
  init_CustomSelect();
  init_Dialog();
  init_TeleportStash();
  import_compiler_runtime105 = __toESM(require_react_compiler_runtime_development(), 1), import_react75 = __toESM(require_react_development(), 1), jsx_dev_runtime118 = __toESM(require_react_jsx_dev_runtime_development(), 1), EMPTY_ERRORS_TO_IGNORE = /* @__PURE__ */ new Set;
});
