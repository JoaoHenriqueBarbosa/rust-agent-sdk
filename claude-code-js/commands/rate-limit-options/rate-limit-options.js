// Original: src/commands/rate-limit-options/rate-limit-options.tsx
var exports_rate_limit_options = {};
__export(exports_rate_limit_options, {
  call: () => call65
});
function RateLimitOptionsMenu(t0) {
  let $3 = import_compiler_runtime276.c(25), {
    onDone,
    context: context7
  } = t0, [subCommandJSX, setSubCommandJSX] = import_react191.useState(null), claudeAiLimits = useClaudeAiLimits(), t1;
  if ($3[0] === Symbol.for("react.memo_cache_sentinel"))
    t1 = getSubscriptionType(), $3[0] = t1;
  else
    t1 = $3[0];
  let subscriptionType = t1, t2;
  if ($3[1] === Symbol.for("react.memo_cache_sentinel"))
    t2 = getRateLimitTier(), $3[1] = t2;
  else
    t2 = $3[1];
  let rateLimitTier = t2, hasExtraUsageEnabled = getOauthAccountInfo()?.hasExtraUsageEnabled === !0, isMax20x = subscriptionType === "max" && rateLimitTier === "default_claude_max_20x", isTeamOrEnterprise = subscriptionType === "team" || subscriptionType === "enterprise", buyFirst = !1, t3;
  bb0: {
    let actionOptions;
    if ($3[2] !== claudeAiLimits.overageDisabledReason || $3[3] !== claudeAiLimits.overageStatus) {
      if (actionOptions = [], extraUsage.isEnabled()) {
        let hasBillingAccess = hasClaudeAiBillingAccess(), needsToRequestFromAdmin = isTeamOrEnterprise && !hasBillingAccess, isOrgSpendCapDepleted = claudeAiLimits.overageDisabledReason === "out_of_credits" || claudeAiLimits.overageDisabledReason === "org_level_disabled_until" || claudeAiLimits.overageDisabledReason === "org_service_zero_credit_limit";
        if (needsToRequestFromAdmin && isOrgSpendCapDepleted)
          ;
        else {
          let isOverageState = claudeAiLimits.overageStatus === "rejected" || claudeAiLimits.overageStatus === "allowed_warning", label;
          if (needsToRequestFromAdmin)
            label = isOverageState ? "Request more" : "Request extra usage";
          else
            label = hasExtraUsageEnabled ? "Add funds to continue with extra usage" : "Switch to extra usage";
          let t43;
          if ($3[5] !== label)
            t43 = {
              label,
              value: "extra-usage"
            }, $3[5] = label, $3[6] = t43;
          else
            t43 = $3[6];
          actionOptions.push(t43);
        }
      }
      if (!isMax20x && !isTeamOrEnterprise && upgrade_default.isEnabled()) {
        let t43;
        if ($3[7] === Symbol.for("react.memo_cache_sentinel"))
          t43 = {
            label: "Upgrade your plan",
            value: "upgrade"
          }, $3[7] = t43;
        else
          t43 = $3[7];
        actionOptions.push(t43);
      }
      $3[2] = claudeAiLimits.overageDisabledReason, $3[3] = claudeAiLimits.overageStatus, $3[4] = actionOptions;
    } else
      actionOptions = $3[4];
    let t42;
    if ($3[8] === Symbol.for("react.memo_cache_sentinel"))
      t42 = {
        label: "Stop and wait for limit to reset",
        value: "cancel"
      }, $3[8] = t42;
    else
      t42 = $3[8];
    let cancelOption = t42;
    if (buyFirst) {
      let t53;
      if ($3[9] !== actionOptions)
        t53 = [...actionOptions, cancelOption], $3[9] = actionOptions, $3[10] = t53;
      else
        t53 = $3[10];
      t3 = t53;
      break bb0;
    }
    let t52;
    if ($3[11] !== actionOptions)
      t52 = [cancelOption, ...actionOptions], $3[11] = actionOptions, $3[12] = t52;
    else
      t52 = $3[12];
    t3 = t52;
  }
  let options2 = t3, t4;
  if ($3[13] !== onDone)
    t4 = function() {
      logEvent("tengu_rate_limit_options_menu_cancel", {}), onDone(void 0, {
        display: "skip"
      });
    }, $3[13] = onDone, $3[14] = t4;
  else
    t4 = $3[14];
  let handleCancel = t4, t5;
  if ($3[15] !== context7 || $3[16] !== handleCancel || $3[17] !== onDone)
    t5 = function(value) {
      if (value === "upgrade")
        logEvent("tengu_rate_limit_options_menu_select_upgrade", {}), call64(onDone, context7).then((jsx) => {
          if (jsx)
            setSubCommandJSX(jsx);
        });
      else if (value === "extra-usage")
        logEvent("tengu_rate_limit_options_menu_select_extra_usage", {}), call3(onDone, context7).then((jsx_0) => {
          if (jsx_0)
            setSubCommandJSX(jsx_0);
        });
      else if (value === "cancel")
        handleCancel();
    }, $3[15] = context7, $3[16] = handleCancel, $3[17] = onDone, $3[18] = t5;
  else
    t5 = $3[18];
  let handleSelect = t5;
  if (subCommandJSX)
    return subCommandJSX;
  let t6;
  if ($3[19] !== handleSelect || $3[20] !== options2)
    t6 = /* @__PURE__ */ jsx_dev_runtime357.jsxDEV(Select, {
      options: options2,
      onChange: handleSelect,
      visibleOptionCount: options2.length
    }, void 0, !1, void 0, this), $3[19] = handleSelect, $3[20] = options2, $3[21] = t6;
  else
    t6 = $3[21];
  let t7;
  if ($3[22] !== handleCancel || $3[23] !== t6)
    t7 = /* @__PURE__ */ jsx_dev_runtime357.jsxDEV(Dialog, {
      title: "What do you want to do?",
      onCancel: handleCancel,
      color: "suggestion",
      children: t6
    }, void 0, !1, void 0, this), $3[22] = handleCancel, $3[23] = t6, $3[24] = t7;
  else
    t7 = $3[24];
  return t7;
}
async function call65(onDone, context7) {
  return /* @__PURE__ */ jsx_dev_runtime357.jsxDEV(RateLimitOptionsMenu, {
    onDone,
    context: context7
  }, void 0, !1, void 0, this);
}
var import_compiler_runtime276, import_react191, jsx_dev_runtime357;
var init_rate_limit_options = __esm(() => {
  init_select();
  init_Dialog();
  init_claudeAiLimitsHook();
  init_auth14();
  init_billing();
  init_extra_usage();
  init_extra_usage2();
  init_upgrade2();
  init_upgrade();
  import_compiler_runtime276 = __toESM(require_react_compiler_runtime_development(), 1), import_react191 = __toESM(require_react_development(), 1), jsx_dev_runtime357 = __toESM(require_react_jsx_dev_runtime_development(), 1);
});
