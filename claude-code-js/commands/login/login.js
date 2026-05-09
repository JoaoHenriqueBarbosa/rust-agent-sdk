// Original: src/commands/login/login.tsx
var exports_login = {};
__export(exports_login, {
  call: () => call2,
  Login: () => Login
});
async function call2(onDone, context6) {
  return /* @__PURE__ */ jsx_dev_runtime72.jsxDEV(Login, {
    onDone: async (success2) => {
      if (context6.onChangeAPIKey(), context6.setMessages(stripSignatureBlocks), success2) {
        resetCostState(), refreshRemoteManagedSettings(), refreshPolicyLimits(), resetUserCache(), resetBypassPermissionsCheck();
        let appState = context6.getAppState();
        checkAndDisableBypassPermissionsIfNeeded(appState.toolPermissionContext, context6.setAppState), context6.setAppState((prev) => ({
          ...prev,
          authVersion: prev.authVersion + 1
        }));
      }
      onDone(success2 ? "Login successful" : "Login interrupted");
    }
  }, void 0, !1, void 0, this);
}
function Login(props) {
  let $3 = import_compiler_runtime63.c(12), mainLoopModel = useMainLoopModel(), t0;
  if ($3[0] !== mainLoopModel || $3[1] !== props)
    t0 = () => props.onDone(!1, mainLoopModel), $3[0] = mainLoopModel, $3[1] = props, $3[2] = t0;
  else
    t0 = $3[2];
  let t1;
  if ($3[3] !== mainLoopModel || $3[4] !== props)
    t1 = () => props.onDone(!0, mainLoopModel), $3[3] = mainLoopModel, $3[4] = props, $3[5] = t1;
  else
    t1 = $3[5];
  let t2;
  if ($3[6] !== props.startingMessage || $3[7] !== t1)
    t2 = /* @__PURE__ */ jsx_dev_runtime72.jsxDEV(ConsoleOAuthFlow, {
      onDone: t1,
      startingMessage: props.startingMessage
    }, void 0, !1, void 0, this), $3[6] = props.startingMessage, $3[7] = t1, $3[8] = t2;
  else
    t2 = $3[8];
  let t3;
  if ($3[9] !== t0 || $3[10] !== t2)
    t3 = /* @__PURE__ */ jsx_dev_runtime72.jsxDEV(Dialog, {
      title: "Login",
      onCancel: t0,
      color: "permission",
      inputGuide: _temp16,
      children: t2
    }, void 0, !1, void 0, this), $3[9] = t0, $3[10] = t2, $3[11] = t3;
  else
    t3 = $3[11];
  return t3;
}
function _temp16(exitState) {
  return exitState.pending ? /* @__PURE__ */ jsx_dev_runtime72.jsxDEV(ThemedText, {
    children: [
      "Press ",
      exitState.keyName,
      " again to exit"
    ]
  }, void 0, !0, void 0, this) : /* @__PURE__ */ jsx_dev_runtime72.jsxDEV(ConfigurableShortcutHint, {
    action: "confirm:no",
    context: "Confirmation",
    fallback: "Esc",
    description: "cancel"
  }, void 0, !1, void 0, this);
}
var import_compiler_runtime63, jsx_dev_runtime72;
var init_login = __esm(() => {
  init_state();
  init_ConfigurableShortcutHint();
  init_ConsoleOAuthFlow();
  init_Dialog();
  init_useMainLoopModel();
  init_ink2();
  init_policyLimits();
  init_remoteManagedSettings();
  init_messages3();
  init_bypassPermissionsKillswitch();
  init_user();
  import_compiler_runtime63 = __toESM(require_react_compiler_runtime_development(), 1), jsx_dev_runtime72 = __toESM(require_react_jsx_dev_runtime_development(), 1);
});
