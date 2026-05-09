// Original: src/components/permissions/SkillPermissionRequest/SkillPermissionRequest.tsx
function SkillPermissionRequest(props) {
  let $3 = import_compiler_runtime309.c(51), {
    toolUseConfirm,
    onDone,
    onReject,
    workerBadge
  } = props, parseInput = _temp191, t0;
  if ($3[0] !== toolUseConfirm.input)
    t0 = parseInput(toolUseConfirm.input), $3[0] = toolUseConfirm.input, $3[1] = t0;
  else
    t0 = $3[1];
  let skill = t0, commandObj = toolUseConfirm.permissionResult.behavior === "ask" && toolUseConfirm.permissionResult.metadata && "command" in toolUseConfirm.permissionResult.metadata ? toolUseConfirm.permissionResult.metadata.command : void 0, t1;
  if ($3[2] === Symbol.for("react.memo_cache_sentinel"))
    t1 = {
      completion_type: "tool_use_single",
      language_name: "none"
    }, $3[2] = t1;
  else
    t1 = $3[2];
  usePermissionRequestLogging(toolUseConfirm, t1);
  let t2;
  if ($3[3] === Symbol.for("react.memo_cache_sentinel"))
    t2 = getOriginalCwd(), $3[3] = t2;
  else
    t2 = $3[3];
  let originalCwd = t2, t3;
  if ($3[4] === Symbol.for("react.memo_cache_sentinel"))
    t3 = shouldShowAlwaysAllowOptions(), $3[4] = t3;
  else
    t3 = $3[4];
  let showAlwaysAllowOptions = t3, t4;
  if ($3[5] === Symbol.for("react.memo_cache_sentinel"))
    t4 = [{
      label: "Yes",
      value: "yes",
      feedbackConfig: {
        type: "accept"
      }
    }], $3[5] = t4;
  else
    t4 = $3[5];
  let baseOptions = t4, alwaysAllowOptions;
  if ($3[6] !== skill) {
    if (alwaysAllowOptions = [], showAlwaysAllowOptions) {
      let t52 = /* @__PURE__ */ jsx_dev_runtime398.jsxDEV(ThemedText, {
        bold: !0,
        children: skill
      }, void 0, !1, void 0, this), t62;
      if ($3[8] === Symbol.for("react.memo_cache_sentinel"))
        t62 = /* @__PURE__ */ jsx_dev_runtime398.jsxDEV(ThemedText, {
          bold: !0,
          children: originalCwd
        }, void 0, !1, void 0, this), $3[8] = t62;
      else
        t62 = $3[8];
      let t72;
      if ($3[9] !== t52)
        t72 = {
          label: /* @__PURE__ */ jsx_dev_runtime398.jsxDEV(ThemedText, {
            children: [
              "Yes, and don't ask again for ",
              t52,
              " in",
              " ",
              t62
            ]
          }, void 0, !0, void 0, this),
          value: "yes-exact"
        }, $3[9] = t52, $3[10] = t72;
      else
        t72 = $3[10];
      alwaysAllowOptions.push(t72);
      let spaceIndex = skill.indexOf(" ");
      if (spaceIndex > 0) {
        let t82 = skill.substring(0, spaceIndex) + ":*", t92;
        if ($3[11] !== t82)
          t92 = /* @__PURE__ */ jsx_dev_runtime398.jsxDEV(ThemedText, {
            bold: !0,
            children: t82
          }, void 0, !1, void 0, this), $3[11] = t82, $3[12] = t92;
        else
          t92 = $3[12];
        let t102;
        if ($3[13] === Symbol.for("react.memo_cache_sentinel"))
          t102 = /* @__PURE__ */ jsx_dev_runtime398.jsxDEV(ThemedText, {
            bold: !0,
            children: originalCwd
          }, void 0, !1, void 0, this), $3[13] = t102;
        else
          t102 = $3[13];
        let t112;
        if ($3[14] !== t92)
          t112 = {
            label: /* @__PURE__ */ jsx_dev_runtime398.jsxDEV(ThemedText, {
              children: [
                "Yes, and don't ask again for",
                " ",
                t92,
                " commands in",
                " ",
                t102
              ]
            }, void 0, !0, void 0, this),
            value: "yes-prefix"
          }, $3[14] = t92, $3[15] = t112;
        else
          t112 = $3[15];
        alwaysAllowOptions.push(t112);
      }
    }
    $3[6] = skill, $3[7] = alwaysAllowOptions;
  } else
    alwaysAllowOptions = $3[7];
  let t5;
  if ($3[16] === Symbol.for("react.memo_cache_sentinel"))
    t5 = {
      label: "No",
      value: "no",
      feedbackConfig: {
        type: "reject"
      }
    }, $3[16] = t5;
  else
    t5 = $3[16];
  let noOption = t5, t6;
  if ($3[17] !== alwaysAllowOptions)
    t6 = [...baseOptions, ...alwaysAllowOptions, noOption], $3[17] = alwaysAllowOptions, $3[18] = t6;
  else
    t6 = $3[18];
  let options2 = t6, t7;
  if ($3[19] !== toolUseConfirm.tool.name)
    t7 = sanitizeToolNameForAnalytics(toolUseConfirm.tool.name), $3[19] = toolUseConfirm.tool.name, $3[20] = t7;
  else
    t7 = $3[20];
  let t8 = toolUseConfirm.tool.isMcp ?? !1, t9;
  if ($3[21] !== t7 || $3[22] !== t8)
    t9 = {
      toolName: t7,
      isMcp: t8
    }, $3[21] = t7, $3[22] = t8, $3[23] = t9;
  else
    t9 = $3[23];
  let toolAnalyticsContext = t9, t10;
  if ($3[24] !== onDone || $3[25] !== onReject || $3[26] !== skill || $3[27] !== toolUseConfirm)
    t10 = (value, feedback2) => {
      bb33:
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
            break bb33;
          }
          case "yes-exact": {
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
                toolName: SKILL_TOOL_NAME,
                ruleContent: skill
              }],
              behavior: "allow",
              destination: "localSettings"
            }]), onDone();
            break bb33;
          }
          case "yes-prefix": {
            logUnaryEvent({
              completion_type: "tool_use_single",
              event: "accept",
              metadata: {
                language_name: "none",
                message_id: toolUseConfirm.assistantMessage.message.id,
                platform: env3.platform
              }
            });
            let spaceIndex_0 = skill.indexOf(" "), commandPrefix_0 = spaceIndex_0 > 0 ? skill.substring(0, spaceIndex_0) : skill;
            toolUseConfirm.onAllow(toolUseConfirm.input, [{
              type: "addRules",
              rules: [{
                toolName: SKILL_TOOL_NAME,
                ruleContent: `${commandPrefix_0}:*`
              }],
              behavior: "allow",
              destination: "localSettings"
            }]), onDone();
            break bb33;
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
    }, $3[24] = onDone, $3[25] = onReject, $3[26] = skill, $3[27] = toolUseConfirm, $3[28] = t10;
  else
    t10 = $3[28];
  let handleSelect = t10, t11;
  if ($3[29] !== onDone || $3[30] !== onReject || $3[31] !== toolUseConfirm)
    t11 = () => {
      logUnaryEvent({
        completion_type: "tool_use_single",
        event: "reject",
        metadata: {
          language_name: "none",
          message_id: toolUseConfirm.assistantMessage.message.id,
          platform: env3.platform
        }
      }), toolUseConfirm.onReject(), onReject(), onDone();
    }, $3[29] = onDone, $3[30] = onReject, $3[31] = toolUseConfirm, $3[32] = t11;
  else
    t11 = $3[32];
  let handleCancel = t11, t12 = `Use skill "${skill}"?`, t13;
  if ($3[33] === Symbol.for("react.memo_cache_sentinel"))
    t13 = /* @__PURE__ */ jsx_dev_runtime398.jsxDEV(ThemedText, {
      children: "Claude may use instructions, code, or files from this Skill."
    }, void 0, !1, void 0, this), $3[33] = t13;
  else
    t13 = $3[33];
  let t14 = commandObj?.description, t15;
  if ($3[34] !== t14)
    t15 = /* @__PURE__ */ jsx_dev_runtime398.jsxDEV(ThemedBox_default, {
      flexDirection: "column",
      paddingX: 2,
      paddingY: 1,
      children: /* @__PURE__ */ jsx_dev_runtime398.jsxDEV(ThemedText, {
        dimColor: !0,
        children: t14
      }, void 0, !1, void 0, this)
    }, void 0, !1, void 0, this), $3[34] = t14, $3[35] = t15;
  else
    t15 = $3[35];
  let t16;
  if ($3[36] !== toolUseConfirm.permissionResult)
    t16 = /* @__PURE__ */ jsx_dev_runtime398.jsxDEV(PermissionRuleExplanation, {
      permissionResult: toolUseConfirm.permissionResult,
      toolType: "tool"
    }, void 0, !1, void 0, this), $3[36] = toolUseConfirm.permissionResult, $3[37] = t16;
  else
    t16 = $3[37];
  let t17;
  if ($3[38] !== handleCancel || $3[39] !== handleSelect || $3[40] !== options2 || $3[41] !== toolAnalyticsContext)
    t17 = /* @__PURE__ */ jsx_dev_runtime398.jsxDEV(PermissionPrompt, {
      options: options2,
      onSelect: handleSelect,
      onCancel: handleCancel,
      toolAnalyticsContext
    }, void 0, !1, void 0, this), $3[38] = handleCancel, $3[39] = handleSelect, $3[40] = options2, $3[41] = toolAnalyticsContext, $3[42] = t17;
  else
    t17 = $3[42];
  let t18;
  if ($3[43] !== t16 || $3[44] !== t17)
    t18 = /* @__PURE__ */ jsx_dev_runtime398.jsxDEV(ThemedBox_default, {
      flexDirection: "column",
      children: [
        t16,
        t17
      ]
    }, void 0, !0, void 0, this), $3[43] = t16, $3[44] = t17, $3[45] = t18;
  else
    t18 = $3[45];
  let t19;
  if ($3[46] !== t12 || $3[47] !== t15 || $3[48] !== t18 || $3[49] !== workerBadge)
    t19 = /* @__PURE__ */ jsx_dev_runtime398.jsxDEV(PermissionDialog, {
      title: t12,
      workerBadge,
      children: [
        t13,
        t15,
        t18
      ]
    }, void 0, !0, void 0, this), $3[46] = t12, $3[47] = t15, $3[48] = t18, $3[49] = workerBadge, $3[50] = t19;
  else
    t19 = $3[50];
  return t19;
}
function _temp191(input) {
  let result = SkillTool.inputSchema.safeParse(input);
  if (!result.success)
    return logError2(Error(`Failed to parse skill tool input: ${result.error.message}`)), "";
  return result.data.skill;
}
var import_compiler_runtime309, jsx_dev_runtime398;
var init_SkillPermissionRequest = __esm(() => {
  init_log3();
  init_state();
  init_ink2();
  init_metadata();
  init_SkillTool();
  init_env();
  init_permissionsLoader();
  init_unaryLogging();
  init_hooks6();
  init_PermissionDialog();
  init_PermissionPrompt();
  init_PermissionRuleExplanation();
  import_compiler_runtime309 = __toESM(require_react_compiler_runtime_development(), 1), jsx_dev_runtime398 = __toESM(require_react_jsx_dev_runtime_development(), 1);
});
