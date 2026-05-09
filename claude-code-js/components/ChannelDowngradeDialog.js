// Original: src/components/ChannelDowngradeDialog.tsx
function ChannelDowngradeDialog(t0) {
  let $3 = import_compiler_runtime138.c(17), {
    currentVersion,
    onChoice
  } = t0, t1;
  if ($3[0] !== onChoice)
    t1 = function(value) {
      onChoice(value);
    }, $3[0] = onChoice, $3[1] = t1;
  else
    t1 = $3[1];
  let handleSelect = t1, t2;
  if ($3[2] !== onChoice)
    t2 = function() {
      onChoice("cancel");
    }, $3[2] = onChoice, $3[3] = t2;
  else
    t2 = $3[3];
  let handleCancel = t2, t3;
  if ($3[4] !== currentVersion)
    t3 = /* @__PURE__ */ jsx_dev_runtime175.jsxDEV(ThemedText, {
      children: [
        "The stable channel may have an older version than what you're currently running (",
        currentVersion,
        ")."
      ]
    }, void 0, !0, void 0, this), $3[4] = currentVersion, $3[5] = t3;
  else
    t3 = $3[5];
  let t4;
  if ($3[6] === Symbol.for("react.memo_cache_sentinel"))
    t4 = /* @__PURE__ */ jsx_dev_runtime175.jsxDEV(ThemedText, {
      dimColor: !0,
      children: "How would you like to handle this?"
    }, void 0, !1, void 0, this), $3[6] = t4;
  else
    t4 = $3[6];
  let t5;
  if ($3[7] === Symbol.for("react.memo_cache_sentinel"))
    t5 = {
      label: "Allow possible downgrade to stable version",
      value: "downgrade"
    }, $3[7] = t5;
  else
    t5 = $3[7];
  let t6 = `Stay on current version (${currentVersion}) until stable catches up`, t7;
  if ($3[8] !== t6)
    t7 = [t5, {
      label: t6,
      value: "stay"
    }], $3[8] = t6, $3[9] = t7;
  else
    t7 = $3[9];
  let t8;
  if ($3[10] !== handleSelect || $3[11] !== t7)
    t8 = /* @__PURE__ */ jsx_dev_runtime175.jsxDEV(Select, {
      options: t7,
      onChange: handleSelect
    }, void 0, !1, void 0, this), $3[10] = handleSelect, $3[11] = t7, $3[12] = t8;
  else
    t8 = $3[12];
  let t9;
  if ($3[13] !== handleCancel || $3[14] !== t3 || $3[15] !== t8)
    t9 = /* @__PURE__ */ jsx_dev_runtime175.jsxDEV(Dialog, {
      title: "Switch to Stable Channel",
      onCancel: handleCancel,
      color: "permission",
      hideBorder: !0,
      hideInputGuide: !0,
      children: [
        t3,
        t4,
        t8
      ]
    }, void 0, !0, void 0, this), $3[13] = handleCancel, $3[14] = t3, $3[15] = t8, $3[16] = t9;
  else
    t9 = $3[16];
  return t9;
}
var import_compiler_runtime138, jsx_dev_runtime175;
var init_ChannelDowngradeDialog = __esm(() => {
  init_ink2();
  init_CustomSelect();
  init_Dialog();
  import_compiler_runtime138 = __toESM(require_react_compiler_runtime_development(), 1), jsx_dev_runtime175 = __toESM(require_react_jsx_dev_runtime_development(), 1);
});
