// Original: src/components/permissions/FallbackPermissionRequest.tsx
function FallbackPermissionRequest(t0) {
  let $3 = import_compiler_runtime302.c(58), {
    toolUseConfirm,
    onDone,
    onReject,
    workerBadge
  } = t0, [theme2] = useTheme(), originalUserFacingName, t1;
  if ($3[0] !== toolUseConfirm.input || $3[1] !== toolUseConfirm.tool)
    originalUserFacingName = toolUseConfirm.tool.userFacingName(toolUseConfirm.input), t1 = originalUserFacingName.endsWith(" (MCP)") ? originalUserFacingName.slice(0, -6) : originalUserFacingName, $3[0] = toolUseConfirm.input, $3[1] = toolUseConfirm.tool, $3[2] = originalUserFacingName, $3[3] = t1;
  else
    originalUserFacingName = $3[2], t1 = $3[3];
  let userFacingName8 = t1, t2;
  if ($3[4] === Symbol.for("react.memo_cache_sentinel"))
    t2 = {
      completion_type: "tool_use_single",
      language_name: "none"
    }, $3[4] = t2;
  else
    t2 = $3[4];
  usePermissionRequestLogging(toolUseConfirm, t2);
  let t3;
  if ($3[5] !== onDone || $3[6] !== onReject || $3[7] !== toolUseConfirm)
    t3 = (value, feedback2) => {
      bb8:
        switch (value) {
          case "yes": {
            logUnaryEvent({
              completion_type: "tool_use_single",
              event: "accept",
              metadata: {
                language_name: "none",
                message_id: toolUseConfirm.assistantMessage.message.id,
                platform: env3.platform
              }
            }), toolUseConfirm.onAllow(toolUseConfirm.input, [], feedback2), onDone();
            break bb8;
          }
          case "yes-dont-ask-again": {
            logUnaryEvent({
              completion_type: "tool_use_single",
              event: "accept",
              metadata: {
                language_name: "none",
                message_id: toolUseConfirm.assistantMessage.message.id,
                platform: env3.platform
              }
            }), toolUseConfirm.onAllow(toolUseConfirm.input, [{
              type: "addRules",
              rules: [{
                toolName: toolUseConfirm.tool.name
              }],
              behavior: "allow",
              destination: "localSettings"
            }]), onDone();
            break bb8;
          }
          case "no":
            logUnaryEvent({
              completion_type: "tool_use_single",
              event: "reject",
              metadata: {
                language_name: "none",
                message_id: toolUseConfirm.assistantMessage.message.id,
                platform: env3.platform
              }
            }), toolUseConfirm.onReject(feedback2), onReject(), onDone();
        }
    }, $3[5] = onDone, $3[6] = onReject, $3[7] = toolUseConfirm, $3[8] = t3;
  else
    t3 = $3[8];
  let handleSelect = t3, t4;
  if ($3[9] !== onDone || $3[10] !== onReject || $3[11] !== toolUseConfirm)
    t4 = () => {
      logUnaryEvent({
        completion_type: "tool_use_single",
        event: "reject",
        metadata: {
          language_name: "none",
          message_id: toolUseConfirm.assistantMessage.message.id,
          platform: env3.platform
        }
      }), toolUseConfirm.onReject(), onReject(), onDone();
    }, $3[9] = onDone, $3[10] = onReject, $3[11] = toolUseConfirm, $3[12] = t4;
  else
    t4 = $3[12];
  let handleCancel = t4, t5;
  if ($3[13] === Symbol.for("react.memo_cache_sentinel"))
    t5 = getOriginalCwd(), $3[13] = t5;
  else
    t5 = $3[13];
  let originalCwd = t5, t6;
  if ($3[14] === Symbol.for("react.memo_cache_sentinel"))
    t6 = shouldShowAlwaysAllowOptions(), $3[14] = t6;
  else
    t6 = $3[14];
  let showAlwaysAllowOptions = t6, t7;
  if ($3[15] === Symbol.for("react.memo_cache_sentinel"))
    t7 = {
      label: "Yes",
      value: "yes",
      feedbackConfig: {
        type: "accept"
      }
    }, $3[15] = t7;
  else
    t7 = $3[15];
  let result;
  if ($3[16] !== userFacingName8) {
    if (result = [t7], showAlwaysAllowOptions) {
      let t83 = /* @__PURE__ */ jsx_dev_runtime390.jsxDEV(ThemedText, {
        bold: !0,
        children: userFacingName8
      }, void 0, !1, void 0, this), t92;
      if ($3[18] === Symbol.for("react.memo_cache_sentinel"))
        t92 = /* @__PURE__ */ jsx_dev_runtime390.jsxDEV(ThemedText, {
          bold: !0,
          children: originalCwd
        }, void 0, !1, void 0, this), $3[18] = t92;
      else
        t92 = $3[18];
      let t102;
      if ($3[19] !== t83)
        t102 = {
          label: /* @__PURE__ */ jsx_dev_runtime390.jsxDEV(ThemedText, {
            children: [
              "Yes, and don't ask again for ",
              t83,
              " ",
              "commands in ",
              t92
            ]
          }, void 0, !0, void 0, this),
          value: "yes-dont-ask-again"
        }, $3[19] = t83, $3[20] = t102;
      else
        t102 = $3[20];
      result.push(t102);
    }
    let t82;
    if ($3[21] === Symbol.for("react.memo_cache_sentinel"))
      t82 = {
        label: "No",
        value: "no",
        feedbackConfig: {
          type: "reject"
        }
      }, $3[21] = t82;
    else
      t82 = $3[21];
    result.push(t82), $3[16] = userFacingName8, $3[17] = result;
  } else
    result = $3[17];
  let options2 = result, t8;
  if ($3[22] !== toolUseConfirm.tool.name)
    t8 = sanitizeToolNameForAnalytics(toolUseConfirm.tool.name), $3[22] = toolUseConfirm.tool.name, $3[23] = t8;
  else
    t8 = $3[23];
  let t9 = toolUseConfirm.tool.isMcp ?? !1, t10;
  if ($3[24] !== t8 || $3[25] !== t9)
    t10 = {
      toolName: t8,
      isMcp: t9
    }, $3[24] = t8, $3[25] = t9, $3[26] = t10;
  else
    t10 = $3[26];
  let toolAnalyticsContext = t10, t11;
  if ($3[27] !== theme2 || $3[28] !== toolUseConfirm.input || $3[29] !== toolUseConfirm.tool)
    t11 = toolUseConfirm.tool.renderToolUseMessage(toolUseConfirm.input, {
      theme: theme2,
      verbose: !0
    }), $3[27] = theme2, $3[28] = toolUseConfirm.input, $3[29] = toolUseConfirm.tool, $3[30] = t11;
  else
    t11 = $3[30];
  let t12;
  if ($3[31] !== originalUserFacingName)
    t12 = originalUserFacingName.endsWith(" (MCP)") ? /* @__PURE__ */ jsx_dev_runtime390.jsxDEV(ThemedText, {
      dimColor: !0,
      children: " (MCP)"
    }, void 0, !1, void 0, this) : "", $3[31] = originalUserFacingName, $3[32] = t12;
  else
    t12 = $3[32];
  let t13;
  if ($3[33] !== t11 || $3[34] !== t12 || $3[35] !== userFacingName8)
    t13 = /* @__PURE__ */ jsx_dev_runtime390.jsxDEV(ThemedText, {
      children: [
        userFacingName8,
        "(",
        t11,
        ")",
        t12
      ]
    }, void 0, !0, void 0, this), $3[33] = t11, $3[34] = t12, $3[35] = userFacingName8, $3[36] = t13;
  else
    t13 = $3[36];
  let t14;
  if ($3[37] !== toolUseConfirm.description)
    t14 = truncateToLines(toolUseConfirm.description, 3), $3[37] = toolUseConfirm.description, $3[38] = t14;
  else
    t14 = $3[38];
  let t15;
  if ($3[39] !== t14)
    t15 = /* @__PURE__ */ jsx_dev_runtime390.jsxDEV(ThemedText, {
      dimColor: !0,
      children: t14
    }, void 0, !1, void 0, this), $3[39] = t14, $3[40] = t15;
  else
    t15 = $3[40];
  let t16;
  if ($3[41] !== t13 || $3[42] !== t15)
    t16 = /* @__PURE__ */ jsx_dev_runtime390.jsxDEV(ThemedBox_default, {
      flexDirection: "column",
      paddingX: 2,
      paddingY: 1,
      children: [
        t13,
        t15
      ]
    }, void 0, !0, void 0, this), $3[41] = t13, $3[42] = t15, $3[43] = t16;
  else
    t16 = $3[43];
  let t17;
  if ($3[44] !== toolUseConfirm.permissionResult)
    t17 = /* @__PURE__ */ jsx_dev_runtime390.jsxDEV(PermissionRuleExplanation, {
      permissionResult: toolUseConfirm.permissionResult,
      toolType: "tool"
    }, void 0, !1, void 0, this), $3[44] = toolUseConfirm.permissionResult, $3[45] = t17;
  else
    t17 = $3[45];
  let t18;
  if ($3[46] !== handleCancel || $3[47] !== handleSelect || $3[48] !== options2 || $3[49] !== toolAnalyticsContext)
    t18 = /* @__PURE__ */ jsx_dev_runtime390.jsxDEV(PermissionPrompt, {
      options: options2,
      onSelect: handleSelect,
      onCancel: handleCancel,
      toolAnalyticsContext
    }, void 0, !1, void 0, this), $3[46] = handleCancel, $3[47] = handleSelect, $3[48] = options2, $3[49] = toolAnalyticsContext, $3[50] = t18;
  else
    t18 = $3[50];
  let t19;
  if ($3[51] !== t17 || $3[52] !== t18)
    t19 = /* @__PURE__ */ jsx_dev_runtime390.jsxDEV(ThemedBox_default, {
      flexDirection: "column",
      children: [
        t17,
        t18
      ]
    }, void 0, !0, void 0, this), $3[51] = t17, $3[52] = t18, $3[53] = t19;
  else
    t19 = $3[53];
  let t20;
  if ($3[54] !== t16 || $3[55] !== t19 || $3[56] !== workerBadge)
    t20 = /* @__PURE__ */ jsx_dev_runtime390.jsxDEV(PermissionDialog, {
      title: "Tool use",
      workerBadge,
      children: [
        t16,
        t19
      ]
    }, void 0, !0, void 0, this), $3[54] = t16, $3[55] = t19, $3[56] = workerBadge, $3[57] = t20;
  else
    t20 = $3[57];
  return t20;
}
var import_compiler_runtime302, jsx_dev_runtime390;
var init_FallbackPermissionRequest = __esm(() => {
  init_state();
  init_ink2();
  init_metadata();
  init_env();
  init_permissionsLoader();
  init_unaryLogging();
  init_hooks6();
  init_PermissionDialog();
  init_PermissionPrompt();
  init_PermissionRuleExplanation();
  import_compiler_runtime302 = __toESM(require_react_compiler_runtime_development(), 1), jsx_dev_runtime390 = __toESM(require_react_jsx_dev_runtime_development(), 1);
});
