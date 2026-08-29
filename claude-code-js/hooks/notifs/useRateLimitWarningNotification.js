// Original: src/hooks/notifs/useRateLimitWarningNotification.tsx
function useRateLimitWarningNotification(model) {
  let $3 = import_compiler_runtime353.c(17), {
    addNotification
  } = useNotifications(), claudeAiLimits = useClaudeAiLimits(), t0;
  if ($3[0] !== claudeAiLimits || $3[1] !== model)
    t0 = getRateLimitWarning(claudeAiLimits, model), $3[0] = claudeAiLimits, $3[1] = model, $3[2] = t0;
  else
    t0 = $3[2];
  let rateLimitWarning = t0, t1;
  if ($3[3] !== claudeAiLimits)
    t1 = getUsingOverageText(claudeAiLimits), $3[3] = claudeAiLimits, $3[4] = t1;
  else
    t1 = $3[4];
  let usingOverageText = t1, shownWarningRef = import_react291.useRef(null), t2;
  if ($3[5] === Symbol.for("react.memo_cache_sentinel"))
    t2 = getSubscriptionType(), $3[5] = t2;
  else
    t2 = $3[5];
  let subscriptionType = t2, t3;
  if ($3[6] === Symbol.for("react.memo_cache_sentinel"))
    t3 = hasClaudeAiBillingAccess(), $3[6] = t3;
  else
    t3 = $3[6];
  let hasBillingAccess = t3, isTeamOrEnterprise = subscriptionType === "team" || subscriptionType === "enterprise", [hasShownOverageNotification, setHasShownOverageNotification] = import_react291.useState(!1), t4, t5;
  if ($3[7] !== addNotification || $3[8] !== claudeAiLimits.isUsingOverage || $3[9] !== hasShownOverageNotification || $3[10] !== usingOverageText)
    t4 = () => {
      if (getIsRemoteMode())
        return;
      if (claudeAiLimits.isUsingOverage && !hasShownOverageNotification && (!isTeamOrEnterprise || hasBillingAccess))
        addNotification({
          key: "limit-reached",
          text: usingOverageText,
          priority: "immediate"
        }), setHasShownOverageNotification(!0);
      else if (!claudeAiLimits.isUsingOverage && hasShownOverageNotification)
        setHasShownOverageNotification(!1);
    }, t5 = [claudeAiLimits.isUsingOverage, usingOverageText, hasShownOverageNotification, addNotification, hasBillingAccess, isTeamOrEnterprise], $3[7] = addNotification, $3[8] = claudeAiLimits.isUsingOverage, $3[9] = hasShownOverageNotification, $3[10] = usingOverageText, $3[11] = t4, $3[12] = t5;
  else
    t4 = $3[11], t5 = $3[12];
  import_react291.useEffect(t4, t5);
  let t6, t7;
  if ($3[13] !== addNotification || $3[14] !== rateLimitWarning)
    t6 = () => {
      if (getIsRemoteMode())
        return;
      if (rateLimitWarning && rateLimitWarning !== shownWarningRef.current)
        shownWarningRef.current = rateLimitWarning, addNotification({
          key: "rate-limit-warning",
          jsx: /* @__PURE__ */ jsx_dev_runtime452.jsxDEV(ThemedText, {
            children: /* @__PURE__ */ jsx_dev_runtime452.jsxDEV(ThemedText, {
              color: "warning",
              children: rateLimitWarning
            }, void 0, !1, void 0, this)
          }, void 0, !1, void 0, this),
          priority: "high"
        });
    }, t7 = [rateLimitWarning, addNotification], $3[13] = addNotification, $3[14] = rateLimitWarning, $3[15] = t6, $3[16] = t7;
  else
    t6 = $3[15], t7 = $3[16];
  import_react291.useEffect(t6, t7);
}
var import_compiler_runtime353, import_react291, jsx_dev_runtime452;
var init_useRateLimitWarningNotification = __esm(() => {
  init_notifications();
  init_ink2();
  init_claudeAiLimits();
  init_claudeAiLimitsHook();
  init_auth14();
  init_billing();
  init_state();
  import_compiler_runtime353 = __toESM(require_react_compiler_runtime_development(), 1), import_react291 = __toESM(require_react_development(), 1), jsx_dev_runtime452 = __toESM(require_react_jsx_dev_runtime_development(), 1);
});
