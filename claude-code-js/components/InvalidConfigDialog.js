// Original: src/components/InvalidConfigDialog.tsx
var exports_InvalidConfigDialog = {};
__export(exports_InvalidConfigDialog, {
  showInvalidConfigDialog: () => showInvalidConfigDialog
});
function InvalidConfigDialog(t0) {
  let $3 = import_compiler_runtime279.c(19), {
    filePath,
    errorDescription,
    onExit: onExit2,
    onReset
  } = t0, t1;
  if ($3[0] !== onExit2 || $3[1] !== onReset)
    t1 = (value) => {
      if (value === "exit")
        onExit2();
      else
        onReset();
    }, $3[0] = onExit2, $3[1] = onReset, $3[2] = t1;
  else
    t1 = $3[2];
  let handleSelect = t1, t2;
  if ($3[3] !== filePath)
    t2 = /* @__PURE__ */ jsx_dev_runtime362.jsxDEV(ThemedText, {
      children: [
        "The configuration file at ",
        /* @__PURE__ */ jsx_dev_runtime362.jsxDEV(ThemedText, {
          bold: !0,
          children: filePath
        }, void 0, !1, void 0, this),
        " contains invalid JSON."
      ]
    }, void 0, !0, void 0, this), $3[3] = filePath, $3[4] = t2;
  else
    t2 = $3[4];
  let t3;
  if ($3[5] !== errorDescription)
    t3 = /* @__PURE__ */ jsx_dev_runtime362.jsxDEV(ThemedText, {
      children: errorDescription
    }, void 0, !1, void 0, this), $3[5] = errorDescription, $3[6] = t3;
  else
    t3 = $3[6];
  let t4;
  if ($3[7] !== t2 || $3[8] !== t3)
    t4 = /* @__PURE__ */ jsx_dev_runtime362.jsxDEV(ThemedBox_default, {
      flexDirection: "column",
      gap: 1,
      children: [
        t2,
        t3
      ]
    }, void 0, !0, void 0, this), $3[7] = t2, $3[8] = t3, $3[9] = t4;
  else
    t4 = $3[9];
  let t5;
  if ($3[10] === Symbol.for("react.memo_cache_sentinel"))
    t5 = /* @__PURE__ */ jsx_dev_runtime362.jsxDEV(ThemedText, {
      bold: !0,
      children: "Choose an option:"
    }, void 0, !1, void 0, this), $3[10] = t5;
  else
    t5 = $3[10];
  let t6;
  if ($3[11] === Symbol.for("react.memo_cache_sentinel"))
    t6 = [{
      label: "Exit and fix manually",
      value: "exit"
    }, {
      label: "Reset with default configuration",
      value: "reset"
    }], $3[11] = t6;
  else
    t6 = $3[11];
  let t7;
  if ($3[12] !== handleSelect || $3[13] !== onExit2)
    t7 = /* @__PURE__ */ jsx_dev_runtime362.jsxDEV(ThemedBox_default, {
      flexDirection: "column",
      children: [
        t5,
        /* @__PURE__ */ jsx_dev_runtime362.jsxDEV(Select, {
          options: t6,
          onChange: handleSelect,
          onCancel: onExit2
        }, void 0, !1, void 0, this)
      ]
    }, void 0, !0, void 0, this), $3[12] = handleSelect, $3[13] = onExit2, $3[14] = t7;
  else
    t7 = $3[14];
  let t8;
  if ($3[15] !== onExit2 || $3[16] !== t4 || $3[17] !== t7)
    t8 = /* @__PURE__ */ jsx_dev_runtime362.jsxDEV(Dialog, {
      title: "Configuration Error",
      color: "error",
      onCancel: onExit2,
      children: [
        t4,
        t7
      ]
    }, void 0, !0, void 0, this), $3[15] = onExit2, $3[16] = t4, $3[17] = t7, $3[18] = t8;
  else
    t8 = $3[18];
  return t8;
}
async function showInvalidConfigDialog({
  error: error44
}) {
  let renderOptions = {
    ...getBaseRenderOptions(!1),
    theme: SAFE_ERROR_THEME_NAME
  };
  await new Promise(async (resolve45) => {
    let {
      unmount
    } = await render(/* @__PURE__ */ jsx_dev_runtime362.jsxDEV(AppStateProvider, {
      children: /* @__PURE__ */ jsx_dev_runtime362.jsxDEV(KeybindingSetup, {
        children: /* @__PURE__ */ jsx_dev_runtime362.jsxDEV(InvalidConfigDialog, {
          filePath: error44.filePath,
          errorDescription: error44.message,
          onExit: () => {
            unmount(), resolve45(), process.exit(1);
          },
          onReset: () => {
            writeFileSync_DEPRECATED(error44.filePath, jsonStringify(error44.defaultConfig, null, 2), {
              flush: !1,
              encoding: "utf8"
            }), unmount(), resolve45(), process.exit(0);
          }
        }, void 0, !1, void 0, this)
      }, void 0, !1, void 0, this)
    }, void 0, !1, void 0, this), renderOptions);
  });
}
var import_compiler_runtime279, jsx_dev_runtime362, SAFE_ERROR_THEME_NAME = "dark";
var init_InvalidConfigDialog = __esm(() => {
  init_ink2();
  init_KeybindingProviderSetup();
  init_AppState();
  init_renderOptions();
  init_slowOperations();
  init_CustomSelect();
  init_Dialog();
  import_compiler_runtime279 = __toESM(require_react_compiler_runtime_development(), 1), jsx_dev_runtime362 = __toESM(require_react_jsx_dev_runtime_development(), 1);
});
