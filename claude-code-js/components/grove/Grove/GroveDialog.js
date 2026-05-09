// function: GroveDialog
function GroveDialog(t0) {
  let $3 = import_compiler_runtime241.c(34), {
    showIfAlreadyViewed,
    location,
    onDone
  } = t0, [shouldShowDialog, setShouldShowDialog] = import_react172.useState(null), [groveConfig, setGroveConfig] = import_react172.useState(null), t1, t2;
  if ($3[0] !== location || $3[1] !== onDone || $3[2] !== showIfAlreadyViewed)
    t1 = () => {
      (async function() {
        let [settingsResult, configResult] = await Promise.all([getGroveSettings(), getGroveNoticeConfig()]), config11 = configResult.success ? configResult.data : null;
        setGroveConfig(config11);
        let shouldShow = calculateShouldShowGrove(settingsResult, configResult, showIfAlreadyViewed);
        if (setShouldShowDialog(shouldShow), !shouldShow) {
          onDone("skip_rendering");
          return;
        }
        markGroveNoticeViewed(), logEvent("tengu_grove_policy_viewed", {
          location,
          dismissable: config11?.notice_is_grace_period
        });
      })();
    }, t2 = [showIfAlreadyViewed, location, onDone], $3[0] = location, $3[1] = onDone, $3[2] = showIfAlreadyViewed, $3[3] = t1, $3[4] = t2;
  else
    t1 = $3[3], t2 = $3[4];
  if (import_react172.useEffect(t1, t2), shouldShowDialog === null)
    return null;
  if (!shouldShowDialog)
    return null;
  let t3;
  if ($3[5] !== groveConfig?.notice_is_grace_period || $3[6] !== onDone)
    t3 = async function(value) {
      bb21:
        switch (value) {
          case "accept_opt_in": {
            await updateGroveSettings(!0), logEvent("tengu_grove_policy_submitted", {
              state: !0,
              dismissable: groveConfig?.notice_is_grace_period
            });
            break bb21;
          }
          case "accept_opt_out": {
            await updateGroveSettings(!1), logEvent("tengu_grove_policy_submitted", {
              state: !1,
              dismissable: groveConfig?.notice_is_grace_period
            });
            break bb21;
          }
          case "defer": {
            logEvent("tengu_grove_policy_dismissed", {
              state: !0
            });
            break bb21;
          }
          case "escape":
            logEvent("tengu_grove_policy_escaped", {});
        }
      onDone(value);
    }, $3[5] = groveConfig?.notice_is_grace_period, $3[6] = onDone, $3[7] = t3;
  else
    t3 = $3[7];
  let onChange = t3, t4;
  if ($3[8] !== groveConfig?.domain_excluded)
    t4 = groveConfig?.domain_excluded ? [{
      label: "Accept terms \xB7 Help improve Claude: OFF (for emails with your domain)",
      value: "accept_opt_out"
    }] : [{
      label: "Accept terms \xB7 Help improve Claude: ON",
      value: "accept_opt_in"
    }, {
      label: "Accept terms \xB7 Help improve Claude: OFF",
      value: "accept_opt_out"
    }], $3[8] = groveConfig?.domain_excluded, $3[9] = t4;
  else
    t4 = $3[9];
  let acceptOptions = t4, t5;
  if ($3[10] !== groveConfig?.notice_is_grace_period || $3[11] !== onChange)
    t5 = function() {
      if (groveConfig?.notice_is_grace_period) {
        onChange("defer");
        return;
      }
      onChange("escape");
    }, $3[10] = groveConfig?.notice_is_grace_period, $3[11] = onChange, $3[12] = t5;
  else
    t5 = $3[12];
  let handleCancel = t5, t6;
  if ($3[13] !== groveConfig?.notice_is_grace_period)
    t6 = /* @__PURE__ */ jsx_dev_runtime306.jsxDEV(ThemedBox_default, {
      flexDirection: "column",
      gap: 1,
      flexGrow: 1,
      children: groveConfig?.notice_is_grace_period ? /* @__PURE__ */ jsx_dev_runtime306.jsxDEV(GracePeriodContentBody, {}, void 0, !1, void 0, this) : /* @__PURE__ */ jsx_dev_runtime306.jsxDEV(PostGracePeriodContentBody, {}, void 0, !1, void 0, this)
    }, void 0, !1, void 0, this), $3[13] = groveConfig?.notice_is_grace_period, $3[14] = t6;
  else
    t6 = $3[14];
  let t7;
  if ($3[15] === Symbol.for("react.memo_cache_sentinel"))
    t7 = /* @__PURE__ */ jsx_dev_runtime306.jsxDEV(ThemedBox_default, {
      flexShrink: 0,
      children: /* @__PURE__ */ jsx_dev_runtime306.jsxDEV(ThemedText, {
        color: "professionalBlue",
        children: NEW_TERMS_ASCII
      }, void 0, !1, void 0, this)
    }, void 0, !1, void 0, this), $3[15] = t7;
  else
    t7 = $3[15];
  let t8;
  if ($3[16] !== t6)
    t8 = /* @__PURE__ */ jsx_dev_runtime306.jsxDEV(ThemedBox_default, {
      flexDirection: "row",
      children: [
        t6,
        t7
      ]
    }, void 0, !0, void 0, this), $3[16] = t6, $3[17] = t8;
  else
    t8 = $3[17];
  let t9;
  if ($3[18] === Symbol.for("react.memo_cache_sentinel"))
    t9 = /* @__PURE__ */ jsx_dev_runtime306.jsxDEV(ThemedBox_default, {
      flexDirection: "column",
      children: [
        /* @__PURE__ */ jsx_dev_runtime306.jsxDEV(ThemedText, {
          bold: !0,
          children: "Please select how you'd like to continue"
        }, void 0, !1, void 0, this),
        /* @__PURE__ */ jsx_dev_runtime306.jsxDEV(ThemedText, {
          children: "Your choice takes effect immediately upon confirmation."
        }, void 0, !1, void 0, this)
      ]
    }, void 0, !0, void 0, this), $3[18] = t9;
  else
    t9 = $3[18];
  let t10;
  if ($3[19] !== groveConfig?.notice_is_grace_period)
    t10 = groveConfig?.notice_is_grace_period ? [{
      label: "Not now",
      value: "defer"
    }] : [], $3[19] = groveConfig?.notice_is_grace_period, $3[20] = t10;
  else
    t10 = $3[20];
  let t11;
  if ($3[21] !== acceptOptions || $3[22] !== t10)
    t11 = [...acceptOptions, ...t10], $3[21] = acceptOptions, $3[22] = t10, $3[23] = t11;
  else
    t11 = $3[23];
  let t12;
  if ($3[24] !== onChange)
    t12 = (value_0) => onChange(value_0), $3[24] = onChange, $3[25] = t12;
  else
    t12 = $3[25];
  let t13;
  if ($3[26] !== handleCancel || $3[27] !== t11 || $3[28] !== t12)
    t13 = /* @__PURE__ */ jsx_dev_runtime306.jsxDEV(ThemedBox_default, {
      flexDirection: "column",
      gap: 1,
      children: [
        t9,
        /* @__PURE__ */ jsx_dev_runtime306.jsxDEV(Select, {
          options: t11,
          onChange: t12,
          onCancel: handleCancel
        }, void 0, !1, void 0, this)
      ]
    }, void 0, !0, void 0, this), $3[26] = handleCancel, $3[27] = t11, $3[28] = t12, $3[29] = t13;
  else
    t13 = $3[29];
  let t14;
  if ($3[30] !== handleCancel || $3[31] !== t13 || $3[32] !== t8)
    t14 = /* @__PURE__ */ jsx_dev_runtime306.jsxDEV(Dialog, {
      title: "Updates to Consumer Terms and Policies",
      color: "professionalBlue",
      onCancel: handleCancel,
      inputGuide: _temp148,
      children: [
        t8,
        t13
      ]
    }, void 0, !0, void 0, this), $3[30] = handleCancel, $3[31] = t13, $3[32] = t8, $3[33] = t14;
  else
    t14 = $3[33];
  return t14;
}
