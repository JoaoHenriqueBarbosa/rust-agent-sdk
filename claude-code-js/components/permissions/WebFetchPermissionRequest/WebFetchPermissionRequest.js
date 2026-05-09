// Original: src/components/permissions/WebFetchPermissionRequest/WebFetchPermissionRequest.tsx
function inputToPermissionRuleContent(input) {
  try {
    let parsedInput = WebFetchTool.inputSchema.safeParse(input);
    if (!parsedInput.success)
      return `input:${input.toString()}`;
    let {
      url: url3
    } = parsedInput.data;
    return `domain:${new URL(url3).hostname}`;
  } catch {
    return `input:${input.toString()}`;
  }
}
function WebFetchPermissionRequest(t0) {
  let $3 = import_compiler_runtime310.c(41), {
    toolUseConfirm,
    onDone,
    onReject,
    verbose,
    workerBadge
  } = t0, [theme2] = useTheme(), {
    url: url3
  } = toolUseConfirm.input, t1;
  if ($3[0] !== url3)
    t1 = new URL(url3), $3[0] = url3, $3[1] = t1;
  else
    t1 = $3[1];
  let hostname2 = t1.hostname, t2;
  if ($3[2] === Symbol.for("react.memo_cache_sentinel"))
    t2 = {
      completion_type: "tool_use_single",
      language_name: "none"
    }, $3[2] = t2;
  else
    t2 = $3[2];
  usePermissionRequestLogging(toolUseConfirm, t2);
  let t3;
  if ($3[3] === Symbol.for("react.memo_cache_sentinel"))
    t3 = shouldShowAlwaysAllowOptions(), $3[3] = t3;
  else
    t3 = $3[3];
  let showAlwaysAllowOptions = t3, t4;
  if ($3[4] === Symbol.for("react.memo_cache_sentinel"))
    t4 = {
      label: "Yes",
      value: "yes"
    }, $3[4] = t4;
  else
    t4 = $3[4];
  let result;
  if ($3[5] !== hostname2) {
    if (result = [t4], showAlwaysAllowOptions) {
      let t53 = /* @__PURE__ */ jsx_dev_runtime399.jsxDEV(ThemedText, {
        bold: !0,
        children: hostname2
      }, void 0, !1, void 0, this), t62;
      if ($3[7] !== t53)
        t62 = {
          label: /* @__PURE__ */ jsx_dev_runtime399.jsxDEV(ThemedText, {
            children: [
              "Yes, and don't ask again for ",
              t53
            ]
          }, void 0, !0, void 0, this),
          value: "yes-dont-ask-again-domain"
        }, $3[7] = t53, $3[8] = t62;
      else
        t62 = $3[8];
      result.push(t62);
    }
    let t52;
    if ($3[9] === Symbol.for("react.memo_cache_sentinel"))
      t52 = {
        label: /* @__PURE__ */ jsx_dev_runtime399.jsxDEV(ThemedText, {
          children: [
            "No, and tell Claude what to do differently ",
            /* @__PURE__ */ jsx_dev_runtime399.jsxDEV(ThemedText, {
              bold: !0,
              children: "(esc)"
            }, void 0, !1, void 0, this)
          ]
        }, void 0, !0, void 0, this),
        value: "no"
      }, $3[9] = t52;
    else
      t52 = $3[9];
    result.push(t52), $3[5] = hostname2, $3[6] = result;
  } else
    result = $3[6];
  let options2 = result, t5;
  if ($3[10] !== onDone || $3[11] !== onReject || $3[12] !== toolUseConfirm)
    t5 = function(newValue) {
      bb8:
        switch (newValue) {
          case "yes": {
            logUnaryPermissionEvent("tool_use_single", toolUseConfirm, "accept"), toolUseConfirm.onAllow(toolUseConfirm.input, []), onDone();
            break bb8;
          }
          case "yes-dont-ask-again-domain": {
            logUnaryPermissionEvent("tool_use_single", toolUseConfirm, "accept");
            let ruleContent = inputToPermissionRuleContent(toolUseConfirm.input), ruleValue = {
              toolName: toolUseConfirm.tool.name,
              ruleContent
            };
            toolUseConfirm.onAllow(toolUseConfirm.input, [{
              type: "addRules",
              rules: [ruleValue],
              behavior: "allow",
              destination: "localSettings"
            }]), onDone();
            break bb8;
          }
          case "no":
            logUnaryPermissionEvent("tool_use_single", toolUseConfirm, "reject"), toolUseConfirm.onReject(), onReject(), onDone();
        }
    }, $3[10] = onDone, $3[11] = onReject, $3[12] = toolUseConfirm, $3[13] = t5;
  else
    t5 = $3[13];
  let onChange = t5, t6;
  if ($3[14] !== theme2 || $3[15] !== toolUseConfirm.input || $3[16] !== verbose)
    t6 = WebFetchTool.renderToolUseMessage(toolUseConfirm.input, {
      theme: theme2,
      verbose
    }), $3[14] = theme2, $3[15] = toolUseConfirm.input, $3[16] = verbose, $3[17] = t6;
  else
    t6 = $3[17];
  let t7;
  if ($3[18] !== t6)
    t7 = /* @__PURE__ */ jsx_dev_runtime399.jsxDEV(ThemedText, {
      children: t6
    }, void 0, !1, void 0, this), $3[18] = t6, $3[19] = t7;
  else
    t7 = $3[19];
  let t8;
  if ($3[20] !== toolUseConfirm.description)
    t8 = /* @__PURE__ */ jsx_dev_runtime399.jsxDEV(ThemedText, {
      dimColor: !0,
      children: toolUseConfirm.description
    }, void 0, !1, void 0, this), $3[20] = toolUseConfirm.description, $3[21] = t8;
  else
    t8 = $3[21];
  let t9;
  if ($3[22] !== t7 || $3[23] !== t8)
    t9 = /* @__PURE__ */ jsx_dev_runtime399.jsxDEV(ThemedBox_default, {
      flexDirection: "column",
      paddingX: 2,
      paddingY: 1,
      children: [
        t7,
        t8
      ]
    }, void 0, !0, void 0, this), $3[22] = t7, $3[23] = t8, $3[24] = t9;
  else
    t9 = $3[24];
  let t10;
  if ($3[25] !== toolUseConfirm.permissionResult)
    t10 = /* @__PURE__ */ jsx_dev_runtime399.jsxDEV(PermissionRuleExplanation, {
      permissionResult: toolUseConfirm.permissionResult,
      toolType: "tool"
    }, void 0, !1, void 0, this), $3[25] = toolUseConfirm.permissionResult, $3[26] = t10;
  else
    t10 = $3[26];
  let t11;
  if ($3[27] === Symbol.for("react.memo_cache_sentinel"))
    t11 = /* @__PURE__ */ jsx_dev_runtime399.jsxDEV(ThemedText, {
      children: "Do you want to allow Claude to fetch this content?"
    }, void 0, !1, void 0, this), $3[27] = t11;
  else
    t11 = $3[27];
  let t12;
  if ($3[28] !== onChange)
    t12 = () => onChange("no"), $3[28] = onChange, $3[29] = t12;
  else
    t12 = $3[29];
  let t13;
  if ($3[30] !== onChange || $3[31] !== options2 || $3[32] !== t12)
    t13 = /* @__PURE__ */ jsx_dev_runtime399.jsxDEV(Select, {
      options: options2,
      onChange,
      onCancel: t12
    }, void 0, !1, void 0, this), $3[30] = onChange, $3[31] = options2, $3[32] = t12, $3[33] = t13;
  else
    t13 = $3[33];
  let t14;
  if ($3[34] !== t10 || $3[35] !== t13)
    t14 = /* @__PURE__ */ jsx_dev_runtime399.jsxDEV(ThemedBox_default, {
      flexDirection: "column",
      children: [
        t10,
        t11,
        t13
      ]
    }, void 0, !0, void 0, this), $3[34] = t10, $3[35] = t13, $3[36] = t14;
  else
    t14 = $3[36];
  let t15;
  if ($3[37] !== t14 || $3[38] !== t9 || $3[39] !== workerBadge)
    t15 = /* @__PURE__ */ jsx_dev_runtime399.jsxDEV(PermissionDialog, {
      title: "Fetch",
      workerBadge,
      children: [
        t9,
        t14
      ]
    }, void 0, !0, void 0, this), $3[37] = t14, $3[38] = t9, $3[39] = workerBadge, $3[40] = t15;
  else
    t15 = $3[40];
  return t15;
}
var import_compiler_runtime310, jsx_dev_runtime399;
var init_WebFetchPermissionRequest = __esm(() => {
  init_ink2();
  init_WebFetchTool();
  init_permissionsLoader();
  init_select();
  init_hooks6();
  init_PermissionDialog();
  init_PermissionRuleExplanation();
  init_utils18();
  import_compiler_runtime310 = __toESM(require_react_compiler_runtime_development(), 1), jsx_dev_runtime399 = __toESM(require_react_jsx_dev_runtime_development(), 1);
});
