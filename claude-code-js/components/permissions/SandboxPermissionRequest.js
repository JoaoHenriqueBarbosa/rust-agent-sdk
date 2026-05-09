// Original: src/components/permissions/SandboxPermissionRequest.tsx
function SandboxPermissionRequest(t0) {
  let $3 = import_compiler_runtime343.c(22), {
    hostPattern: t1,
    onUserResponse
  } = t0, {
    host
  } = t1, t2;
  if ($3[0] !== onUserResponse)
    t2 = function(value) {
      bb4:
        switch (value) {
          case "yes": {
            onUserResponse({
              allow: !0,
              persistToSettings: !1
            });
            break bb4;
          }
          case "yes-dont-ask-again": {
            onUserResponse({
              allow: !0,
              persistToSettings: !0
            });
            break bb4;
          }
          case "no":
            onUserResponse({
              allow: !1,
              persistToSettings: !1
            });
        }
    }, $3[0] = onUserResponse, $3[1] = t2;
  else
    t2 = $3[1];
  let onSelect = t2, t3;
  if ($3[2] === Symbol.for("react.memo_cache_sentinel"))
    t3 = shouldAllowManagedSandboxDomainsOnly(), $3[2] = t3;
  else
    t3 = $3[2];
  let managedDomainsOnly = t3, t4;
  if ($3[3] === Symbol.for("react.memo_cache_sentinel"))
    t4 = {
      label: "Yes",
      value: "yes"
    }, $3[3] = t4;
  else
    t4 = $3[3];
  let t5;
  if ($3[4] !== host)
    t5 = !managedDomainsOnly ? [{
      label: /* @__PURE__ */ jsx_dev_runtime442.jsxDEV(ThemedText, {
        children: [
          "Yes, and don't ask again for ",
          /* @__PURE__ */ jsx_dev_runtime442.jsxDEV(ThemedText, {
            bold: !0,
            children: host
          }, void 0, !1, void 0, this)
        ]
      }, void 0, !0, void 0, this),
      value: "yes-dont-ask-again"
    }] : [], $3[4] = host, $3[5] = t5;
  else
    t5 = $3[5];
  let t6;
  if ($3[6] === Symbol.for("react.memo_cache_sentinel"))
    t6 = {
      label: /* @__PURE__ */ jsx_dev_runtime442.jsxDEV(ThemedText, {
        children: [
          "No, and tell Claude what to do differently ",
          /* @__PURE__ */ jsx_dev_runtime442.jsxDEV(ThemedText, {
            bold: !0,
            children: "(esc)"
          }, void 0, !1, void 0, this)
        ]
      }, void 0, !0, void 0, this),
      value: "no"
    }, $3[6] = t6;
  else
    t6 = $3[6];
  let t7;
  if ($3[7] !== t5)
    t7 = [t4, ...t5, t6], $3[7] = t5, $3[8] = t7;
  else
    t7 = $3[8];
  let options2 = t7, t8;
  if ($3[9] === Symbol.for("react.memo_cache_sentinel"))
    t8 = /* @__PURE__ */ jsx_dev_runtime442.jsxDEV(ThemedText, {
      dimColor: !0,
      children: "Host:"
    }, void 0, !1, void 0, this), $3[9] = t8;
  else
    t8 = $3[9];
  let t9;
  if ($3[10] !== host)
    t9 = /* @__PURE__ */ jsx_dev_runtime442.jsxDEV(ThemedBox_default, {
      children: [
        t8,
        /* @__PURE__ */ jsx_dev_runtime442.jsxDEV(ThemedText, {
          children: [
            " ",
            host
          ]
        }, void 0, !0, void 0, this)
      ]
    }, void 0, !0, void 0, this), $3[10] = host, $3[11] = t9;
  else
    t9 = $3[11];
  let t10;
  if ($3[12] === Symbol.for("react.memo_cache_sentinel"))
    t10 = /* @__PURE__ */ jsx_dev_runtime442.jsxDEV(ThemedBox_default, {
      marginTop: 1,
      children: /* @__PURE__ */ jsx_dev_runtime442.jsxDEV(ThemedText, {
        children: "Do you want to allow this connection?"
      }, void 0, !1, void 0, this)
    }, void 0, !1, void 0, this), $3[12] = t10;
  else
    t10 = $3[12];
  let t11;
  if ($3[13] !== onUserResponse)
    t11 = () => {
      onUserResponse({
        allow: !1,
        persistToSettings: !1
      });
    }, $3[13] = onUserResponse, $3[14] = t11;
  else
    t11 = $3[14];
  let t12;
  if ($3[15] !== onSelect || $3[16] !== options2 || $3[17] !== t11)
    t12 = /* @__PURE__ */ jsx_dev_runtime442.jsxDEV(ThemedBox_default, {
      children: /* @__PURE__ */ jsx_dev_runtime442.jsxDEV(Select, {
        options: options2,
        onChange: onSelect,
        onCancel: t11
      }, void 0, !1, void 0, this)
    }, void 0, !1, void 0, this), $3[15] = onSelect, $3[16] = options2, $3[17] = t11, $3[18] = t12;
  else
    t12 = $3[18];
  let t13;
  if ($3[19] !== t12 || $3[20] !== t9)
    t13 = /* @__PURE__ */ jsx_dev_runtime442.jsxDEV(PermissionDialog, {
      title: "Network request outside of sandbox",
      children: /* @__PURE__ */ jsx_dev_runtime442.jsxDEV(ThemedBox_default, {
        flexDirection: "column",
        paddingX: 2,
        paddingY: 1,
        children: [
          t9,
          t10,
          t12
        ]
      }, void 0, !0, void 0, this)
    }, void 0, !1, void 0, this), $3[19] = t12, $3[20] = t9, $3[21] = t13;
  else
    t13 = $3[21];
  return t13;
}
var import_compiler_runtime343, jsx_dev_runtime442;
var init_SandboxPermissionRequest = __esm(() => {
  init_ink2();
  init_sandbox_adapter();
  init_select();
  init_PermissionDialog();
  import_compiler_runtime343 = __toESM(require_react_compiler_runtime_development(), 1), jsx_dev_runtime442 = __toESM(require_react_jsx_dev_runtime_development(), 1);
});
