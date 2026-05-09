// Original: src/components/BypassPermissionsModeDialog.tsx
var exports_BypassPermissionsModeDialog = {};
__export(exports_BypassPermissionsModeDialog, {
  BypassPermissionsModeDialog: () => BypassPermissionsModeDialog
});
function BypassPermissionsModeDialog(t0) {
  let $3 = import_compiler_runtime370.c(7), {
    onAccept
  } = t0, t1;
  if ($3[0] === Symbol.for("react.memo_cache_sentinel"))
    t1 = [], $3[0] = t1;
  else
    t1 = $3[0];
  import_react309.default.useEffect(_temp303, t1);
  let t2;
  if ($3[1] !== onAccept)
    t2 = function(value) {
      bb3:
        switch (value) {
          case "accept": {
            logEvent("tengu_bypass_permissions_mode_dialog_accept", {}), updateSettingsForSource("userSettings", {
              skipDangerousModePermissionPrompt: !0
            }), onAccept();
            break bb3;
          }
          case "decline":
            gracefulShutdownSync(1);
        }
    }, $3[1] = onAccept, $3[2] = t2;
  else
    t2 = $3[2];
  let onChange = t2, handleEscape = _temp2100, t3;
  if ($3[3] === Symbol.for("react.memo_cache_sentinel"))
    t3 = /* @__PURE__ */ jsx_dev_runtime470.jsxDEV(ThemedBox_default, {
      flexDirection: "column",
      gap: 1,
      children: [
        /* @__PURE__ */ jsx_dev_runtime470.jsxDEV(ThemedText, {
          children: [
            "In Bypass Permissions mode, Claude Code will not ask for your approval before running potentially dangerous commands.",
            /* @__PURE__ */ jsx_dev_runtime470.jsxDEV(Newline, {}, void 0, !1, void 0, this),
            "This mode should only be used in a sandboxed container/VM that has restricted internet access and can easily be restored if damaged."
          ]
        }, void 0, !0, void 0, this),
        /* @__PURE__ */ jsx_dev_runtime470.jsxDEV(ThemedText, {
          children: "By proceeding, you accept all responsibility for actions taken while running in Bypass Permissions mode."
        }, void 0, !1, void 0, this),
        /* @__PURE__ */ jsx_dev_runtime470.jsxDEV(Link, {
          url: "https://code.claude.com/docs/en/security"
        }, void 0, !1, void 0, this)
      ]
    }, void 0, !0, void 0, this), $3[3] = t3;
  else
    t3 = $3[3];
  let t4;
  if ($3[4] === Symbol.for("react.memo_cache_sentinel"))
    t4 = [{
      label: "No, exit",
      value: "decline"
    }, {
      label: "Yes, I accept",
      value: "accept"
    }], $3[4] = t4;
  else
    t4 = $3[4];
  let t5;
  if ($3[5] !== onChange)
    t5 = /* @__PURE__ */ jsx_dev_runtime470.jsxDEV(Dialog, {
      title: "WARNING: Claude Code running in Bypass Permissions mode",
      color: "error",
      onCancel: handleEscape,
      children: [
        t3,
        /* @__PURE__ */ jsx_dev_runtime470.jsxDEV(Select, {
          options: t4,
          onChange: (value_0) => onChange(value_0)
        }, void 0, !1, void 0, this)
      ]
    }, void 0, !0, void 0, this), $3[5] = onChange, $3[6] = t5;
  else
    t5 = $3[6];
  return t5;
}
function _temp2100() {
  gracefulShutdownSync(0);
}
function _temp303() {
  logEvent("tengu_bypass_permissions_mode_dialog_shown", {});
}
var import_compiler_runtime370, import_react309, jsx_dev_runtime470;
var init_BypassPermissionsModeDialog = __esm(() => {
  init_ink2();
  init_gracefulShutdown();
  init_settings2();
  init_CustomSelect();
  init_Dialog();
  import_compiler_runtime370 = __toESM(require_react_compiler_runtime_development(), 1), import_react309 = __toESM(require_react_development(), 1), jsx_dev_runtime470 = __toESM(require_react_jsx_dev_runtime_development(), 1);
});
