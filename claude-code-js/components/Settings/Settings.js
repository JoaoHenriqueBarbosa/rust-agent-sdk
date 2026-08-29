// Original: src/components/Settings/Settings.tsx
function Settings(t0) {
  let $3 = import_compiler_runtime145.c(25), {
    onClose,
    context: context6,
    defaultTab
  } = t0, [selectedTab, setSelectedTab] = import_react107.useState(defaultTab), [tabsHidden, setTabsHidden] = import_react107.useState(!1), [configOwnsEsc, setConfigOwnsEsc] = import_react107.useState(!1), [gatesOwnsEsc, setGatesOwnsEsc] = import_react107.useState(!1), insideModal = useIsInsideModal(), {
    rows
  } = useModalOrTerminalSize(useTerminalSize()), contentHeight = insideModal ? rows + 1 : Math.max(15, Math.min(Math.floor(rows * 0.8), 30)), [diagnosticsPromise] = import_react107.useState(_temp220);
  useExitOnCtrlCDWithKeybindings();
  let t1;
  if ($3[0] !== onClose || $3[1] !== tabsHidden)
    t1 = () => {
      if (tabsHidden)
        return;
      onClose("Status dialog dismissed", {
        display: "system"
      });
    }, $3[0] = onClose, $3[1] = tabsHidden, $3[2] = t1;
  else
    t1 = $3[2];
  let handleEscape = t1, t2 = !tabsHidden && !(selectedTab === "Config" && configOwnsEsc) && !(selectedTab === "Gates" && gatesOwnsEsc), t3;
  if ($3[3] !== t2)
    t3 = {
      context: "Settings",
      isActive: t2
    }, $3[3] = t2, $3[4] = t3;
  else
    t3 = $3[4];
  useKeybinding("confirm:no", handleEscape, t3);
  let t4;
  if ($3[5] !== context6 || $3[6] !== diagnosticsPromise)
    t4 = /* @__PURE__ */ jsx_dev_runtime182.jsxDEV(Tab, {
      title: "Status",
      children: /* @__PURE__ */ jsx_dev_runtime182.jsxDEV(Status2, {
        context: context6,
        diagnosticsPromise
      }, void 0, !1, void 0, this)
    }, "status", !1, void 0, this), $3[5] = context6, $3[6] = diagnosticsPromise, $3[7] = t4;
  else
    t4 = $3[7];
  let t5;
  if ($3[8] !== contentHeight || $3[9] !== context6 || $3[10] !== onClose)
    t5 = /* @__PURE__ */ jsx_dev_runtime182.jsxDEV(Tab, {
      title: "Config",
      children: /* @__PURE__ */ jsx_dev_runtime182.jsxDEV(import_react107.Suspense, {
        fallback: null,
        children: /* @__PURE__ */ jsx_dev_runtime182.jsxDEV(Config, {
          context: context6,
          onClose,
          setTabsHidden,
          onIsSearchModeChange: setConfigOwnsEsc,
          contentHeight
        }, void 0, !1, void 0, this)
      }, void 0, !1, void 0, this)
    }, "config", !1, void 0, this), $3[8] = contentHeight, $3[9] = context6, $3[10] = onClose, $3[11] = t5;
  else
    t5 = $3[11];
  let t6;
  if ($3[12] === Symbol.for("react.memo_cache_sentinel"))
    t6 = /* @__PURE__ */ jsx_dev_runtime182.jsxDEV(Tab, {
      title: "Usage",
      children: /* @__PURE__ */ jsx_dev_runtime182.jsxDEV(Usage, {}, void 0, !1, void 0, this)
    }, "usage", !1, void 0, this), $3[12] = t6;
  else
    t6 = $3[12];
  let t7;
  if ($3[13] !== contentHeight)
    t7 = [], $3[13] = contentHeight, $3[14] = t7;
  else
    t7 = $3[14];
  let t8;
  if ($3[15] !== t4 || $3[16] !== t5 || $3[17] !== t7)
    t8 = [t4, t5, t6, ...t7], $3[15] = t4, $3[16] = t5, $3[17] = t7, $3[18] = t8;
  else
    t8 = $3[18];
  let tabs = t8, t9 = defaultTab !== "Config" && defaultTab !== "Gates", t10 = tabsHidden || insideModal ? void 0 : contentHeight, t11;
  if ($3[19] !== selectedTab || $3[20] !== t10 || $3[21] !== t9 || $3[22] !== tabs || $3[23] !== tabsHidden)
    t11 = /* @__PURE__ */ jsx_dev_runtime182.jsxDEV(Pane, {
      color: "permission",
      children: /* @__PURE__ */ jsx_dev_runtime182.jsxDEV(Tabs, {
        color: "permission",
        selectedTab,
        onTabChange: setSelectedTab,
        hidden: tabsHidden,
        initialHeaderFocused: t9,
        contentHeight: t10,
        children: tabs
      }, void 0, !1, void 0, this)
    }, void 0, !1, void 0, this), $3[19] = selectedTab, $3[20] = t10, $3[21] = t9, $3[22] = tabs, $3[23] = tabsHidden, $3[24] = t11;
  else
    t11 = $3[24];
  return t11;
}
function _temp220() {
  return buildDiagnostics().catch(_temp74);
}
function _temp74() {
  return [];
}
var import_compiler_runtime145, import_react107, jsx_dev_runtime182;
var init_Settings = __esm(() => {
  init_useKeybinding();
  init_useExitOnCtrlCDWithKeybindings();
  init_useTerminalSize();
  init_modalContext();
  init_Pane();
  init_Tabs();
  init_Status();
  init_Config();
  init_Usage();
  import_compiler_runtime145 = __toESM(require_react_compiler_runtime_development(), 1), import_react107 = __toESM(require_react_development(), 1), jsx_dev_runtime182 = __toESM(require_react_jsx_dev_runtime_development(), 1);
});
