// Original: src/components/IdeAutoConnectDialog.tsx
function IdeAutoConnectDialog(t0) {
  let $3 = import_compiler_runtime166.c(9), {
    onComplete
  } = t0, t1;
  if ($3[0] !== onComplete)
    t1 = async (value) => {
      let autoConnect = value === "yes";
      saveGlobalConfig((current) => ({
        ...current,
        autoConnectIde: autoConnect,
        hasIdeAutoConnectDialogBeenShown: !0
      })), onComplete();
    }, $3[0] = onComplete, $3[1] = t1;
  else
    t1 = $3[1];
  let handleSelect = t1, t2;
  if ($3[2] === Symbol.for("react.memo_cache_sentinel"))
    t2 = [{
      label: "Yes",
      value: "yes"
    }, {
      label: "No",
      value: "no"
    }], $3[2] = t2;
  else
    t2 = $3[2];
  let options2 = t2, t3;
  if ($3[3] !== handleSelect)
    t3 = /* @__PURE__ */ jsx_dev_runtime208.jsxDEV(Select, {
      options: options2,
      onChange: handleSelect,
      defaultValue: "yes"
    }, void 0, !1, void 0, this), $3[3] = handleSelect, $3[4] = t3;
  else
    t3 = $3[4];
  let t4;
  if ($3[5] === Symbol.for("react.memo_cache_sentinel"))
    t4 = /* @__PURE__ */ jsx_dev_runtime208.jsxDEV(ThemedText, {
      dimColor: !0,
      children: "You can also configure this in /config or with the --ide flag"
    }, void 0, !1, void 0, this), $3[5] = t4;
  else
    t4 = $3[5];
  let t5;
  if ($3[6] !== onComplete || $3[7] !== t3)
    t5 = /* @__PURE__ */ jsx_dev_runtime208.jsxDEV(Dialog, {
      title: "Do you wish to enable auto-connect to IDE?",
      color: "ide",
      onCancel: onComplete,
      children: [
        t3,
        t4
      ]
    }, void 0, !0, void 0, this), $3[6] = onComplete, $3[7] = t3, $3[8] = t5;
  else
    t5 = $3[8];
  return t5;
}
function shouldShowAutoConnectDialog() {
  let config11 = getGlobalConfig();
  return !isSupportedTerminal() && config11.autoConnectIde !== !0 && config11.hasIdeAutoConnectDialogBeenShown !== !0;
}
function IdeDisableAutoConnectDialog(t0) {
  let $3 = import_compiler_runtime166.c(10), {
    onComplete
  } = t0, t1;
  if ($3[0] !== onComplete)
    t1 = (value) => {
      let disableAutoConnect = value === "yes";
      if (disableAutoConnect)
        saveGlobalConfig(_temp96);
      onComplete(disableAutoConnect);
    }, $3[0] = onComplete, $3[1] = t1;
  else
    t1 = $3[1];
  let handleSelect = t1, t2;
  if ($3[2] !== onComplete)
    t2 = () => {
      onComplete(!1);
    }, $3[2] = onComplete, $3[3] = t2;
  else
    t2 = $3[3];
  let handleCancel = t2, t3;
  if ($3[4] === Symbol.for("react.memo_cache_sentinel"))
    t3 = [{
      label: "No",
      value: "no"
    }, {
      label: "Yes",
      value: "yes"
    }], $3[4] = t3;
  else
    t3 = $3[4];
  let options2 = t3, t4;
  if ($3[5] !== handleSelect)
    t4 = /* @__PURE__ */ jsx_dev_runtime208.jsxDEV(Select, {
      options: options2,
      onChange: handleSelect,
      defaultValue: "no"
    }, void 0, !1, void 0, this), $3[5] = handleSelect, $3[6] = t4;
  else
    t4 = $3[6];
  let t5;
  if ($3[7] !== handleCancel || $3[8] !== t4)
    t5 = /* @__PURE__ */ jsx_dev_runtime208.jsxDEV(Dialog, {
      title: "Do you wish to disable auto-connect to IDE?",
      subtitle: "You can also configure this in /config",
      onCancel: handleCancel,
      color: "ide",
      children: t4
    }, void 0, !1, void 0, this), $3[7] = handleCancel, $3[8] = t4, $3[9] = t5;
  else
    t5 = $3[9];
  return t5;
}
function _temp96(current) {
  return {
    ...current,
    autoConnectIde: !1
  };
}
function shouldShowDisableAutoConnectDialog() {
  let config11 = getGlobalConfig();
  return !isSupportedTerminal() && config11.autoConnectIde === !0;
}
var import_compiler_runtime166, jsx_dev_runtime208;
var init_IdeAutoConnectDialog = __esm(() => {
  init_ink2();
  init_config4();
  init_ide();
  init_CustomSelect();
  init_Dialog();
  import_compiler_runtime166 = __toESM(require_react_compiler_runtime_development(), 1), jsx_dev_runtime208 = __toESM(require_react_jsx_dev_runtime_development(), 1);
});
