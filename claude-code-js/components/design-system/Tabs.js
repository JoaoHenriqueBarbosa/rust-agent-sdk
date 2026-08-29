// Original: src/components/design-system/Tabs.tsx
function Tabs(t0) {
  let $3 = import_compiler_runtime133.c(25), {
    title,
    color: color3,
    defaultTab,
    children,
    hidden: hidden2,
    useFullWidth,
    selectedTab: controlledSelectedTab,
    onTabChange,
    banner,
    disableNavigation,
    initialHeaderFocused: t1,
    contentHeight,
    navFromContent: t2
  } = t0, initialHeaderFocused = t1 === void 0 ? !0 : t1, navFromContent = t2 === void 0 ? !1 : t2, {
    columns: terminalWidth
  } = useTerminalSize(), tabs = children.map(_temp66), defaultTabIndex = defaultTab ? tabs.findIndex((tab) => defaultTab === tab[0]) : 0, isControlled = controlledSelectedTab !== void 0, [internalSelectedTab, setInternalSelectedTab] = import_react97.useState(defaultTabIndex !== -1 ? defaultTabIndex : 0), controlledTabIndex = isControlled ? tabs.findIndex((tab_0) => tab_0[0] === controlledSelectedTab) : -1, selectedTabIndex = isControlled ? controlledTabIndex !== -1 ? controlledTabIndex : 0 : internalSelectedTab, modalScrollRef = useModalScrollRef(), [headerFocused, setHeaderFocused] = import_react97.useState(initialHeaderFocused), t3;
  if ($3[0] === Symbol.for("react.memo_cache_sentinel"))
    t3 = () => setHeaderFocused(!0), $3[0] = t3;
  else
    t3 = $3[0];
  let focusHeader = t3, t4;
  if ($3[1] === Symbol.for("react.memo_cache_sentinel"))
    t4 = () => setHeaderFocused(!1), $3[1] = t4;
  else
    t4 = $3[1];
  let blurHeader = t4, [optInCount, setOptInCount] = import_react97.useState(0), t5;
  if ($3[2] === Symbol.for("react.memo_cache_sentinel"))
    t5 = () => {
      return setOptInCount(_temp215), () => setOptInCount(_temp312);
    }, $3[2] = t5;
  else
    t5 = $3[2];
  let registerOptIn = t5, optedIn = optInCount > 0, handleTabChange = (offset) => {
    let newIndex = (selectedTabIndex + tabs.length + offset) % tabs.length, newTabId = tabs[newIndex]?.[0];
    if (isControlled && onTabChange && newTabId)
      onTabChange(newTabId);
    else
      setInternalSelectedTab(newIndex);
    setHeaderFocused(!0);
  }, t6 = !hidden2 && !disableNavigation && headerFocused, t7;
  if ($3[3] !== t6)
    t7 = {
      context: "Tabs",
      isActive: t6
    }, $3[3] = t6, $3[4] = t7;
  else
    t7 = $3[4];
  useKeybindings({
    "tabs:next": () => handleTabChange(1),
    "tabs:previous": () => handleTabChange(-1)
  }, t7);
  let t8;
  if ($3[5] !== headerFocused || $3[6] !== hidden2 || $3[7] !== optedIn)
    t8 = (e) => {
      if (!headerFocused || !optedIn || hidden2)
        return;
      if (e.key === "down")
        e.preventDefault(), setHeaderFocused(!1);
    }, $3[5] = headerFocused, $3[6] = hidden2, $3[7] = optedIn, $3[8] = t8;
  else
    t8 = $3[8];
  let handleKeyDown = t8, t9 = navFromContent && !headerFocused && optedIn && !hidden2 && !disableNavigation, t10;
  if ($3[9] !== t9)
    t10 = {
      context: "Tabs",
      isActive: t9
    }, $3[9] = t9, $3[10] = t10;
  else
    t10 = $3[10];
  useKeybindings({
    "tabs:next": () => {
      handleTabChange(1), setHeaderFocused(!0);
    },
    "tabs:previous": () => {
      handleTabChange(-1), setHeaderFocused(!0);
    }
  }, t10);
  let titleWidth = title ? stringWidth(title) + 1 : 0, tabsWidth = tabs.reduce(_temp410, 0), usedWidth = titleWidth + tabsWidth, spacerWidth = useFullWidth ? Math.max(0, terminalWidth - usedWidth) : 0, contentWidth = useFullWidth ? terminalWidth : void 0, T0 = ThemedBox_default, t11 = "column", t12 = 0, t13 = !0, t14 = modalScrollRef ? 0 : void 0, t15 = !hidden2 && /* @__PURE__ */ jsx_dev_runtime170.jsxDEV(ThemedBox_default, {
    flexDirection: "row",
    gap: 1,
    flexShrink: modalScrollRef ? 0 : void 0,
    children: [
      title !== void 0 && /* @__PURE__ */ jsx_dev_runtime170.jsxDEV(ThemedText, {
        bold: !0,
        color: color3,
        children: title
      }, void 0, !1, void 0, this),
      tabs.map((t16, i5) => {
        let [id, title_0] = t16, isCurrent = selectedTabIndex === i5, hasColorCursor = color3 && isCurrent && headerFocused;
        return /* @__PURE__ */ jsx_dev_runtime170.jsxDEV(ThemedText, {
          backgroundColor: hasColorCursor ? color3 : void 0,
          color: hasColorCursor ? "inverseText" : void 0,
          inverse: isCurrent && !hasColorCursor,
          bold: isCurrent,
          children: [
            " ",
            title_0,
            " "
          ]
        }, id, !0, void 0, this);
      }),
      spacerWidth > 0 && /* @__PURE__ */ jsx_dev_runtime170.jsxDEV(ThemedText, {
        children: " ".repeat(spacerWidth)
      }, void 0, !1, void 0, this)
    ]
  }, void 0, !0, void 0, this), t17;
  if ($3[11] !== children || $3[12] !== contentHeight || $3[13] !== contentWidth || $3[14] !== hidden2 || $3[15] !== modalScrollRef || $3[16] !== selectedTabIndex)
    t17 = modalScrollRef ? /* @__PURE__ */ jsx_dev_runtime170.jsxDEV(ThemedBox_default, {
      width: contentWidth,
      marginTop: hidden2 ? 0 : 1,
      flexShrink: 0,
      children: /* @__PURE__ */ jsx_dev_runtime170.jsxDEV(ScrollBox_default, {
        ref: modalScrollRef,
        flexDirection: "column",
        flexShrink: 0,
        children
      }, selectedTabIndex, !1, void 0, this)
    }, void 0, !1, void 0, this) : /* @__PURE__ */ jsx_dev_runtime170.jsxDEV(ThemedBox_default, {
      width: contentWidth,
      marginTop: hidden2 ? 0 : 1,
      height: contentHeight,
      overflowY: contentHeight !== void 0 ? "hidden" : void 0,
      children
    }, void 0, !1, void 0, this), $3[11] = children, $3[12] = contentHeight, $3[13] = contentWidth, $3[14] = hidden2, $3[15] = modalScrollRef, $3[16] = selectedTabIndex, $3[17] = t17;
  else
    t17 = $3[17];
  let t18;
  if ($3[18] !== T0 || $3[19] !== banner || $3[20] !== handleKeyDown || $3[21] !== t14 || $3[22] !== t15 || $3[23] !== t17)
    t18 = /* @__PURE__ */ jsx_dev_runtime170.jsxDEV(T0, {
      flexDirection: t11,
      tabIndex: t12,
      autoFocus: t13,
      onKeyDown: handleKeyDown,
      flexShrink: t14,
      children: [
        t15,
        banner,
        t17
      ]
    }, void 0, !0, void 0, this), $3[18] = T0, $3[19] = banner, $3[20] = handleKeyDown, $3[21] = t14, $3[22] = t15, $3[23] = t17, $3[24] = t18;
  else
    t18 = $3[24];
  return /* @__PURE__ */ jsx_dev_runtime170.jsxDEV(TabsContext.Provider, {
    value: {
      selectedTab: tabs[selectedTabIndex][0],
      width: contentWidth,
      headerFocused,
      focusHeader,
      blurHeader,
      registerOptIn
    },
    children: t18
  }, void 0, !1, void 0, this);
}
function _temp410(sum, t0) {
  let [, tabTitle] = t0;
  return sum + (tabTitle ? stringWidth(tabTitle) : 0) + 2 + 1;
}
function _temp312(n_0) {
  return n_0 - 1;
}
function _temp215(n5) {
  return n5 + 1;
}
function _temp66(child) {
  return [child.props.id ?? child.props.title, child.props.title];
}
function Tab(t0) {
  let $3 = import_compiler_runtime133.c(4), {
    title,
    id,
    children
  } = t0, {
    selectedTab,
    width
  } = import_react97.useContext(TabsContext), insideModal = useIsInsideModal();
  if (selectedTab !== (id ?? title))
    return null;
  let t1 = insideModal ? 0 : void 0, t2;
  if ($3[0] !== children || $3[1] !== t1 || $3[2] !== width)
    t2 = /* @__PURE__ */ jsx_dev_runtime170.jsxDEV(ThemedBox_default, {
      width,
      flexShrink: t1,
      children
    }, void 0, !1, void 0, this), $3[0] = children, $3[1] = t1, $3[2] = width, $3[3] = t2;
  else
    t2 = $3[3];
  return t2;
}
function useTabsWidth() {
  let {
    width
  } = import_react97.useContext(TabsContext);
  return width;
}
function useTabHeaderFocus() {
  let $3 = import_compiler_runtime133.c(6), {
    headerFocused,
    focusHeader,
    blurHeader,
    registerOptIn
  } = import_react97.useContext(TabsContext), t0;
  if ($3[0] !== registerOptIn)
    t0 = [registerOptIn], $3[0] = registerOptIn, $3[1] = t0;
  else
    t0 = $3[1];
  import_react97.useEffect(registerOptIn, t0);
  let t1;
  if ($3[2] !== blurHeader || $3[3] !== focusHeader || $3[4] !== headerFocused)
    t1 = {
      headerFocused,
      focusHeader,
      blurHeader
    }, $3[2] = blurHeader, $3[3] = focusHeader, $3[4] = headerFocused, $3[5] = t1;
  else
    t1 = $3[5];
  return t1;
}
var import_compiler_runtime133, import_react97, jsx_dev_runtime170, TabsContext;
var init_Tabs = __esm(() => {
  init_modalContext();
  init_useTerminalSize();
  init_ScrollBox();
  init_stringWidth();
  init_ink2();
  init_useKeybinding();
  import_compiler_runtime133 = __toESM(require_react_compiler_runtime_development(), 1), import_react97 = __toESM(require_react_development(), 1), jsx_dev_runtime170 = __toESM(require_react_jsx_dev_runtime_development(), 1), TabsContext = import_react97.createContext({
    selectedTab: void 0,
    width: void 0,
    headerFocused: !1,
    focusHeader: () => {},
    blurHeader: () => {},
    registerOptIn: () => () => {}
  });
});
