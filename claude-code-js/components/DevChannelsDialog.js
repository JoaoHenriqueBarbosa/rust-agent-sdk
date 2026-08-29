// Original: src/components/DevChannelsDialog.tsx
var exports_DevChannelsDialog = {};
__export(exports_DevChannelsDialog, {
  DevChannelsDialog: () => DevChannelsDialog
});
function DevChannelsDialog(t0) {
  let $3 = import_compiler_runtime371.c(14), {
    channels,
    onAccept
  } = t0, t1;
  if ($3[0] !== onAccept)
    t1 = function(value) {
      bb2:
        switch (value) {
          case "accept": {
            onAccept();
            break bb2;
          }
          case "exit":
            gracefulShutdownSync(1);
        }
    }, $3[0] = onAccept, $3[1] = t1;
  else
    t1 = $3[1];
  let onChange = t1, handleEscape = _temp304, t2, t3;
  if ($3[2] === Symbol.for("react.memo_cache_sentinel"))
    t2 = /* @__PURE__ */ jsx_dev_runtime471.jsxDEV(ThemedText, {
      children: "--dangerously-load-development-channels is for local channel development only. Do not use this option to run channels you have downloaded off the internet."
    }, void 0, !1, void 0, this), t3 = /* @__PURE__ */ jsx_dev_runtime471.jsxDEV(ThemedText, {
      children: "Please use --channels to run a list of approved channels."
    }, void 0, !1, void 0, this), $3[2] = t2, $3[3] = t3;
  else
    t2 = $3[2], t3 = $3[3];
  let t4;
  if ($3[4] !== channels)
    t4 = channels.map(_temp2101).join(", "), $3[4] = channels, $3[5] = t4;
  else
    t4 = $3[5];
  let t5;
  if ($3[6] !== t4)
    t5 = /* @__PURE__ */ jsx_dev_runtime471.jsxDEV(ThemedBox_default, {
      flexDirection: "column",
      gap: 1,
      children: [
        t2,
        t3,
        /* @__PURE__ */ jsx_dev_runtime471.jsxDEV(ThemedText, {
          dimColor: !0,
          children: [
            "Channels:",
            " ",
            t4
          ]
        }, void 0, !0, void 0, this)
      ]
    }, void 0, !0, void 0, this), $3[6] = t4, $3[7] = t5;
  else
    t5 = $3[7];
  let t6;
  if ($3[8] === Symbol.for("react.memo_cache_sentinel"))
    t6 = [{
      label: "I am using this for local development",
      value: "accept"
    }, {
      label: "Exit",
      value: "exit"
    }], $3[8] = t6;
  else
    t6 = $3[8];
  let t7;
  if ($3[9] !== onChange)
    t7 = /* @__PURE__ */ jsx_dev_runtime471.jsxDEV(Select, {
      options: t6,
      onChange: (value_0) => onChange(value_0)
    }, void 0, !1, void 0, this), $3[9] = onChange, $3[10] = t7;
  else
    t7 = $3[10];
  let t8;
  if ($3[11] !== t5 || $3[12] !== t7)
    t8 = /* @__PURE__ */ jsx_dev_runtime471.jsxDEV(Dialog, {
      title: "WARNING: Loading development channels",
      color: "error",
      onCancel: handleEscape,
      children: [
        t5,
        t7
      ]
    }, void 0, !0, void 0, this), $3[11] = t5, $3[12] = t7, $3[13] = t8;
  else
    t8 = $3[13];
  return t8;
}
function _temp2101(c3) {
  return c3.kind === "plugin" ? `plugin:${c3.name}@${c3.marketplace}` : `server:${c3.name}`;
}
function _temp304() {
  gracefulShutdownSync(0);
}
var import_compiler_runtime371, jsx_dev_runtime471;
var init_DevChannelsDialog = __esm(() => {
  init_ink2();
  init_gracefulShutdown();
  init_CustomSelect();
  init_Dialog();
  import_compiler_runtime371 = __toESM(require_react_compiler_runtime_development(), 1), jsx_dev_runtime471 = __toESM(require_react_jsx_dev_runtime_development(), 1);
});
