// Original: src/components/LogoV2/EmergencyTip.tsx
function EmergencyTip() {
  let tip = import_react145.useMemo(getTipOfFeed, []), lastShownTip = import_react145.useMemo(() => getGlobalConfig().lastShownEmergencyTip, []), shouldShow = tip.tip && tip.tip !== lastShownTip;
  if (import_react145.useEffect(() => {
    if (shouldShow)
      saveGlobalConfig((current) => {
        if (current.lastShownEmergencyTip === tip.tip)
          return current;
        return {
          ...current,
          lastShownEmergencyTip: tip.tip
        };
      });
  }, [shouldShow, tip.tip]), !shouldShow)
    return null;
  return /* @__PURE__ */ jsx_dev_runtime254.jsxDEV(ThemedBox_default, {
    paddingLeft: 2,
    flexDirection: "column",
    children: /* @__PURE__ */ jsx_dev_runtime254.jsxDEV(ThemedText, {
      ...tip.color === "warning" ? {
        color: "warning"
      } : tip.color === "error" ? {
        color: "error"
      } : {
        dimColor: !0
      },
      children: tip.tip
    }, void 0, !1, void 0, this)
  }, void 0, !1, void 0, this);
}
function getTipOfFeed() {
  return DEFAULT_TIP;
}
var import_react145, jsx_dev_runtime254, DEFAULT_TIP;
var init_EmergencyTip = __esm(() => {
  init_ink2();
  init_config4();
  import_react145 = __toESM(require_react_development(), 1), jsx_dev_runtime254 = __toESM(require_react_jsx_dev_runtime_development(), 1);
  DEFAULT_TIP = {
    tip: "",
    color: "dim"
  };
});
