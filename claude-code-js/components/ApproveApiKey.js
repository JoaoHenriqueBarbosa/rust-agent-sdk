// Original: src/components/ApproveApiKey.tsx
var exports_ApproveApiKey = {};
__export(exports_ApproveApiKey, {
  ApproveApiKey: () => ApproveApiKey
});
function ApproveApiKey(t0) {
  let $3 = import_compiler_runtime365.c(17), {
    customApiKeyTruncated,
    onDone
  } = t0, t1;
  if ($3[0] !== customApiKeyTruncated || $3[1] !== onDone)
    t1 = function(value) {
      bb2:
        switch (value) {
          case "yes": {
            saveGlobalConfig((current_0) => ({
              ...current_0,
              customApiKeyResponses: {
                ...current_0.customApiKeyResponses,
                approved: [...current_0.customApiKeyResponses?.approved ?? [], customApiKeyTruncated]
              }
            })), onDone(!0);
            break bb2;
          }
          case "no":
            saveGlobalConfig((current) => ({
              ...current,
              customApiKeyResponses: {
                ...current.customApiKeyResponses,
                rejected: [...current.customApiKeyResponses?.rejected ?? [], customApiKeyTruncated]
              }
            })), onDone(!1);
        }
    }, $3[0] = customApiKeyTruncated, $3[1] = onDone, $3[2] = t1;
  else
    t1 = $3[2];
  let onChange = t1, t2;
  if ($3[3] !== onChange)
    t2 = () => onChange("no"), $3[3] = onChange, $3[4] = t2;
  else
    t2 = $3[4];
  let t3;
  if ($3[5] === Symbol.for("react.memo_cache_sentinel"))
    t3 = /* @__PURE__ */ jsx_dev_runtime465.jsxDEV(ThemedText, {
      bold: !0,
      children: "ANTHROPIC_API_KEY"
    }, void 0, !1, void 0, this), $3[5] = t3;
  else
    t3 = $3[5];
  let t4;
  if ($3[6] !== customApiKeyTruncated)
    t4 = /* @__PURE__ */ jsx_dev_runtime465.jsxDEV(ThemedText, {
      children: [
        t3,
        /* @__PURE__ */ jsx_dev_runtime465.jsxDEV(ThemedText, {
          children: [
            ": sk-ant-...",
            customApiKeyTruncated
          ]
        }, void 0, !0, void 0, this)
      ]
    }, void 0, !0, void 0, this), $3[6] = customApiKeyTruncated, $3[7] = t4;
  else
    t4 = $3[7];
  let t5;
  if ($3[8] === Symbol.for("react.memo_cache_sentinel"))
    t5 = /* @__PURE__ */ jsx_dev_runtime465.jsxDEV(ThemedText, {
      children: "Do you want to use this API key?"
    }, void 0, !1, void 0, this), $3[8] = t5;
  else
    t5 = $3[8];
  let t6;
  if ($3[9] === Symbol.for("react.memo_cache_sentinel"))
    t6 = {
      label: "Yes",
      value: "yes"
    }, $3[9] = t6;
  else
    t6 = $3[9];
  let t7;
  if ($3[10] === Symbol.for("react.memo_cache_sentinel"))
    t7 = [t6, {
      label: /* @__PURE__ */ jsx_dev_runtime465.jsxDEV(ThemedText, {
        children: [
          "No (",
          /* @__PURE__ */ jsx_dev_runtime465.jsxDEV(ThemedText, {
            bold: !0,
            children: "recommended"
          }, void 0, !1, void 0, this),
          ")"
        ]
      }, void 0, !0, void 0, this),
      value: "no"
    }], $3[10] = t7;
  else
    t7 = $3[10];
  let t8;
  if ($3[11] !== onChange)
    t8 = /* @__PURE__ */ jsx_dev_runtime465.jsxDEV(Select, {
      defaultValue: "no",
      defaultFocusValue: "no",
      options: t7,
      onChange: (value_0) => onChange(value_0),
      onCancel: () => onChange("no")
    }, void 0, !1, void 0, this), $3[11] = onChange, $3[12] = t8;
  else
    t8 = $3[12];
  let t9;
  if ($3[13] !== t2 || $3[14] !== t4 || $3[15] !== t8)
    t9 = /* @__PURE__ */ jsx_dev_runtime465.jsxDEV(Dialog, {
      title: "Detected a custom API key in your environment",
      color: "warning",
      onCancel: t2,
      children: [
        t4,
        t5,
        t8
      ]
    }, void 0, !0, void 0, this), $3[13] = t2, $3[14] = t4, $3[15] = t8, $3[16] = t9;
  else
    t9 = $3[16];
  return t9;
}
var import_compiler_runtime365, jsx_dev_runtime465;
var init_ApproveApiKey = __esm(() => {
  init_ink2();
  init_config4();
  init_CustomSelect();
  init_Dialog();
  import_compiler_runtime365 = __toESM(require_react_compiler_runtime_development(), 1), jsx_dev_runtime465 = __toESM(require_react_jsx_dev_runtime_development(), 1);
});
