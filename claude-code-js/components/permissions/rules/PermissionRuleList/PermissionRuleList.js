// function: PermissionRuleList
function PermissionRuleList(t0) {
  let $3 = import_compiler_runtime237.c(113), {
    onExit: onExit2,
    initialTab,
    onRetryDenials
  } = t0, t1;
  if ($3[0] === Symbol.for("react.memo_cache_sentinel"))
    t1 = getAutoModeDenials(), $3[0] = t1;
  else
    t1 = $3[0];
  let hasDenials = t1.length > 0, defaultTab = initialTab ?? (hasDenials ? "recent" : "allow"), t2;
  if ($3[1] === Symbol.for("react.memo_cache_sentinel"))
    t2 = [], $3[1] = t2;
  else
    t2 = $3[1];
  let [changes, setChanges] = import_react169.useState(t2), toolPermissionContext = useAppState(_temp146), setAppState = useSetAppState(), isTerminalFocused = useTerminalFocus(), t3;
  if ($3[2] === Symbol.for("react.memo_cache_sentinel"))
    t3 = {
      approved: /* @__PURE__ */ new Set,
      retry: /* @__PURE__ */ new Set,
      denials: []
    }, $3[2] = t3;
  else
    t3 = $3[2];
  let denialStateRef = import_react169.useRef(t3), t4;
  if ($3[3] === Symbol.for("react.memo_cache_sentinel"))
    t4 = (s_0) => {
      denialStateRef.current = s_0;
    }, $3[3] = t4;
  else
    t4 = $3[3];
  let handleDenialStateChange = t4, [selectedRule, setSelectedRule] = import_react169.useState(), [lastFocusedRuleKey, setLastFocusedRuleKey] = import_react169.useState(), [addingRuleToTab, setAddingRuleToTab] = import_react169.useState(null), [validatedRule, setValidatedRule] = import_react169.useState(null), [isAddingWorkspaceDirectory, setIsAddingWorkspaceDirectory] = import_react169.useState(!1), [removingDirectory, setRemovingDirectory] = import_react169.useState(null), [isSearchMode, setIsSearchMode] = import_react169.useState(!1), [headerFocused, setHeaderFocused] = import_react169.useState(!0), t5;
  if ($3[4] === Symbol.for("react.memo_cache_sentinel"))
    t5 = (focused) => {
      setHeaderFocused(focused);
    }, $3[4] = t5;
  else
    t5 = $3[4];
  let handleHeaderFocusChange = t5, map8;
  if ($3[5] !== toolPermissionContext)
    map8 = /* @__PURE__ */ new Map, getAllowRules(toolPermissionContext).forEach((rule) => {
      map8.set(jsonStringify(rule), rule);
    }), $3[5] = toolPermissionContext, $3[6] = map8;
  else
    map8 = $3[6];
  let allowRulesByKey = map8, map_0;
  if ($3[7] !== toolPermissionContext)
    map_0 = /* @__PURE__ */ new Map, getDenyRules(toolPermissionContext).forEach((rule_0) => {
      map_0.set(jsonStringify(rule_0), rule_0);
    }), $3[7] = toolPermissionContext, $3[8] = map_0;
  else
    map_0 = $3[8];
  let denyRulesByKey = map_0, map_1;
  if ($3[9] !== toolPermissionContext)
    map_1 = /* @__PURE__ */ new Map, getAskRules(toolPermissionContext).forEach((rule_1) => {
      map_1.set(jsonStringify(rule_1), rule_1);
    }), $3[9] = toolPermissionContext, $3[10] = map_1;
  else
    map_1 = $3[10];
  let askRulesByKey = map_1, t6;
  if ($3[11] !== allowRulesByKey || $3[12] !== askRulesByKey || $3[13] !== denyRulesByKey)
    t6 = (tab, t72) => {
      let query3 = t72 === void 0 ? "" : t72, rulesByKey = (() => {
        switch (tab) {
          case "allow":
            return allowRulesByKey;
          case "deny":
            return denyRulesByKey;
          case "ask":
            return askRulesByKey;
          case "workspace":
          case "recent":
            return /* @__PURE__ */ new Map;
        }
      })(), options2 = [];
      if (tab !== "workspace" && tab !== "recent" && !query3)
        options2.push({
          label: `Add a new rule${figures_default.ellipsis}`,
          value: "add-new-rule"
        });
      let sortedRuleKeys = Array.from(rulesByKey.keys()).sort((a2, b) => {
        let ruleA = rulesByKey.get(a2), ruleB = rulesByKey.get(b);
        if (ruleA && ruleB) {
          let ruleAString = permissionRuleValueToString(ruleA.ruleValue).toLowerCase(), ruleBString = permissionRuleValueToString(ruleB.ruleValue).toLowerCase();
          return ruleAString.localeCompare(ruleBString);
        }
        return 0;
      }), lowerQuery = query3.toLowerCase();
      for (let ruleKey of sortedRuleKeys) {
        let rule_2 = rulesByKey.get(ruleKey);
        if (rule_2) {
          let ruleString = permissionRuleValueToString(rule_2.ruleValue);
          if (query3 && !ruleString.toLowerCase().includes(lowerQuery))
            continue;
          options2.push({
            label: ruleString,
            value: ruleKey
          });
        }
      }
      return {
        options: options2,
        rulesByKey
      };
    }, $3[11] = allowRulesByKey, $3[12] = askRulesByKey, $3[13] = denyRulesByKey, $3[14] = t6;
  else
    t6 = $3[14];
  let getRulesOptions = t6, exitState = useExitOnCtrlCDWithKeybindings(), isSearchModeActive = !selectedRule && !addingRuleToTab && !validatedRule && !isAddingWorkspaceDirectory && !removingDirectory, t7 = isSearchModeActive && isSearchMode, t8;
  if ($3[15] === Symbol.for("react.memo_cache_sentinel"))
    t8 = () => {
      setIsSearchMode(!1);
    }, $3[15] = t8;
  else
    t8 = $3[15];
  let t9;
  if ($3[16] !== t7)
    t9 = {
      isActive: t7,
      onExit: t8
    }, $3[16] = t7, $3[17] = t9;
  else
    t9 = $3[17];
  let {
    query: searchQuery,
    setQuery: setSearchQuery,
    cursorOffset: searchCursorOffset
  } = useSearchInput(t9), t10;
  if ($3[18] !== isSearchMode || $3[19] !== isSearchModeActive || $3[20] !== setSearchQuery)
    t10 = (e) => {
      if (!isSearchModeActive)
        return;
      if (isSearchMode)
        return;
      if (e.ctrl || e.meta)
        return;
      if (e.key === "/")
        e.preventDefault(), setIsSearchMode(!0), setSearchQuery("");
      else if (e.key.length === 1 && e.key !== "j" && e.key !== "k" && e.key !== "m" && e.key !== "i" && e.key !== "r" && e.key !== " ")
        e.preventDefault(), setIsSearchMode(!0), setSearchQuery(e.key);
    }, $3[18] = isSearchMode, $3[19] = isSearchModeActive, $3[20] = setSearchQuery, $3[21] = t10;
  else
    t10 = $3[21];
  let handleKeyDown = t10, t11;
  if ($3[22] !== getRulesOptions)
    t11 = (selectedValue, tab_0) => {
      let {
        rulesByKey: rulesByKey_0
      } = getRulesOptions(tab_0);
      if (selectedValue === "add-new-rule") {
        setAddingRuleToTab(tab_0);
        return;
      } else {
        setSelectedRule(rulesByKey_0.get(selectedValue));
        return;
      }
    }, $3[22] = getRulesOptions, $3[23] = t11;
  else
    t11 = $3[23];
  let handleToolSelect = t11, t12;
  if ($3[24] === Symbol.for("react.memo_cache_sentinel"))
    t12 = () => {
      setAddingRuleToTab(null);
    }, $3[24] = t12;
  else
    t12 = $3[24];
  let handleRuleInputCancel = t12, t13;
  if ($3[25] === Symbol.for("react.memo_cache_sentinel"))
    t13 = (ruleValue, ruleBehavior) => {
      setValidatedRule({
        ruleValue,
        ruleBehavior
      }), setAddingRuleToTab(null);
    }, $3[25] = t13;
  else
    t13 = $3[25];
  let handleRuleInputSubmit = t13, t14;
  if ($3[26] === Symbol.for("react.memo_cache_sentinel"))
    t14 = (rules2, unreachable) => {
      setValidatedRule(null);
      for (let rule_3 of rules2)
        setChanges((prev) => [...prev, `Added ${rule_3.ruleBehavior} rule ${source_default.bold(permissionRuleValueToString(rule_3.ruleValue))}`]);
      if (unreachable && unreachable.length > 0)
        for (let u5 of unreachable) {
          let severity = u5.shadowType === "deny" ? "blocked" : "shadowed";
          setChanges((prev_0) => [...prev_0, source_default.yellow(`${figures_default.warning} Warning: ${permissionRuleValueToString(u5.rule.ruleValue)} is ${severity}`), source_default.dim(`  ${u5.reason}`), source_default.dim(`  Fix: ${u5.fix}`)]);
        }
    }, $3[26] = t14;
  else
    t14 = $3[26];
  let handleAddRulesSuccess = t14, t15;
  if ($3[27] === Symbol.for("react.memo_cache_sentinel"))
    t15 = () => {
      setValidatedRule(null);
    }, $3[27] = t15;
  else
    t15 = $3[27];
  let handleAddRuleCancel = t15, t16;
  if ($3[28] === Symbol.for("react.memo_cache_sentinel"))
    t16 = () => setIsAddingWorkspaceDirectory(!0), $3[28] = t16;
  else
    t16 = $3[28];
  let handleRequestAddDirectory = t16, t17;
  if ($3[29] === Symbol.for("react.memo_cache_sentinel"))
    t17 = (path25) => setRemovingDirectory(path25), $3[29] = t17;
  else
    t17 = $3[29];
  let handleRequestRemoveDirectory = t17, t18;
  if ($3[30] !== changes || $3[31] !== onExit2 || $3[32] !== onRetryDenials)
    t18 = () => {
      let s_1 = denialStateRef.current, denialsFor = (set3) => Array.from(set3).map((idx) => s_1.denials[idx]).filter(_temp259), retryDenials = denialsFor(s_1.retry);
      if (retryDenials.length > 0) {
        let commands7 = retryDenials.map(_temp336);
        onRetryDenials?.(commands7), onExit2(void 0, {
          shouldQuery: !0,
          metaMessages: [`Permission granted for: ${commands7.join(", ")}. You may now retry ${commands7.length === 1 ? "this command" : "these commands"} if you would like.`]
        });
        return;
      }
      let approvedDenials = denialsFor(s_1.approved);
      if (approvedDenials.length > 0 || changes.length > 0) {
        let approvedMsg = approvedDenials.length > 0 ? [`Approved ${approvedDenials.map(_temp428).join(", ")}`] : [];
        onExit2([...approvedMsg, ...changes].join(`
`));
      } else
        onExit2("Permissions dialog dismissed", {
          display: "system"
        });
    }, $3[30] = changes, $3[31] = onExit2, $3[32] = onRetryDenials, $3[33] = t18;
  else
    t18 = $3[33];
  let handleRulesCancel = t18, t19 = isSearchModeActive && !isSearchMode, t20;
  if ($3[34] !== t19)
    t20 = {
      context: "Settings",
      isActive: t19
    }, $3[34] = t19, $3[35] = t20;
  else
    t20 = $3[35];
  useKeybinding("confirm:no", handleRulesCancel, t20);
  let t21;
  if ($3[36] !== getRulesOptions || $3[37] !== selectedRule || $3[38] !== setAppState || $3[39] !== toolPermissionContext)
    t21 = () => {
      if (!selectedRule)
        return;
      let {
        options: options_0
      } = getRulesOptions(selectedRule.ruleBehavior), selectedKey = jsonStringify(selectedRule), ruleKeys = options_0.filter(_temp519).map(_temp616), currentIndex = ruleKeys.indexOf(selectedKey), nextFocusKey;
      if (currentIndex !== -1) {
        if (currentIndex < ruleKeys.length - 1)
          nextFocusKey = ruleKeys[currentIndex + 1];
        else if (currentIndex > 0)
          nextFocusKey = ruleKeys[currentIndex - 1];
      }
      setLastFocusedRuleKey(nextFocusKey), deletePermissionRule({
        rule: selectedRule,
        initialContext: toolPermissionContext,
        setToolPermissionContext(toolPermissionContext_0) {
          setAppState((prev_1) => ({
            ...prev_1,
            toolPermissionContext: toolPermissionContext_0
          }));
        }
      }), setChanges((prev_2) => [...prev_2, `Deleted ${selectedRule.ruleBehavior} rule ${source_default.bold(permissionRuleValueToString(selectedRule.ruleValue))}`]), setSelectedRule(void 0);
    }, $3[36] = getRulesOptions, $3[37] = selectedRule, $3[38] = setAppState, $3[39] = toolPermissionContext, $3[40] = t21;
  else
    t21 = $3[40];
  let handleDeleteRule = t21;
  if (selectedRule) {
    let t222;
    if ($3[41] === Symbol.for("react.memo_cache_sentinel"))
      t222 = () => setSelectedRule(void 0), $3[41] = t222;
    else
      t222 = $3[41];
    let t232;
    if ($3[42] !== handleDeleteRule || $3[43] !== selectedRule)
      t232 = /* @__PURE__ */ jsx_dev_runtime299.jsxDEV(RuleDetails, {
        rule: selectedRule,
        onDelete: handleDeleteRule,
        onCancel: t222
      }, void 0, !1, void 0, this), $3[42] = handleDeleteRule, $3[43] = selectedRule, $3[44] = t232;
    else
      t232 = $3[44];
    return t232;
  }
  if (addingRuleToTab && addingRuleToTab !== "workspace" && addingRuleToTab !== "recent") {
    let t222;
    if ($3[45] !== addingRuleToTab)
      t222 = /* @__PURE__ */ jsx_dev_runtime299.jsxDEV(PermissionRuleInput, {
        onCancel: handleRuleInputCancel,
        onSubmit: handleRuleInputSubmit,
        ruleBehavior: addingRuleToTab
      }, void 0, !1, void 0, this), $3[45] = addingRuleToTab, $3[46] = t222;
    else
      t222 = $3[46];
    return t222;
  }
  if (validatedRule) {
    let t222;
    if ($3[47] !== validatedRule.ruleValue)
      t222 = [validatedRule.ruleValue], $3[47] = validatedRule.ruleValue, $3[48] = t222;
    else
      t222 = $3[48];
    let t232;
    if ($3[49] !== setAppState)
      t232 = (toolPermissionContext_1) => {
        setAppState((prev_3) => ({
          ...prev_3,
          toolPermissionContext: toolPermissionContext_1
        }));
      }, $3[49] = setAppState, $3[50] = t232;
    else
      t232 = $3[50];
    let t242;
    if ($3[51] !== t222 || $3[52] !== t232 || $3[53] !== toolPermissionContext || $3[54] !== validatedRule.ruleBehavior)
      t242 = /* @__PURE__ */ jsx_dev_runtime299.jsxDEV(AddPermissionRules, {
        onAddRules: handleAddRulesSuccess,
        onCancel: handleAddRuleCancel,
        ruleValues: t222,
        ruleBehavior: validatedRule.ruleBehavior,
        initialContext: toolPermissionContext,
        setToolPermissionContext: t232
      }, void 0, !1, void 0, this), $3[51] = t222, $3[52] = t232, $3[53] = toolPermissionContext, $3[54] = validatedRule.ruleBehavior, $3[55] = t242;
    else
      t242 = $3[55];
    return t242;
  }
  if (isAddingWorkspaceDirectory) {
    let t222;
    if ($3[56] !== setAppState || $3[57] !== toolPermissionContext)
      t222 = (path_0, remember) => {
        let permissionUpdate = {
          type: "addDirectories",
          directories: [path_0],
          destination: remember ? "localSettings" : "session"
        }, updatedContext = applyPermissionUpdate(toolPermissionContext, permissionUpdate);
        if (setAppState((prev_4) => ({
          ...prev_4,
          toolPermissionContext: updatedContext
        })), remember)
          persistPermissionUpdate(permissionUpdate);
        setChanges((prev_5) => [...prev_5, `Added directory ${source_default.bold(path_0)} to workspace${remember ? " and saved to local settings" : " for this session"}`]), setIsAddingWorkspaceDirectory(!1);
      }, $3[56] = setAppState, $3[57] = toolPermissionContext, $3[58] = t222;
    else
      t222 = $3[58];
    let t232;
    if ($3[59] === Symbol.for("react.memo_cache_sentinel"))
      t232 = () => setIsAddingWorkspaceDirectory(!1), $3[59] = t232;
    else
      t232 = $3[59];
    let t242;
    if ($3[60] !== t222 || $3[61] !== toolPermissionContext)
      t242 = /* @__PURE__ */ jsx_dev_runtime299.jsxDEV(AddWorkspaceDirectory, {
        onAddDirectory: t222,
        onCancel: t232,
        permissionContext: toolPermissionContext
      }, void 0, !1, void 0, this), $3[60] = t222, $3[61] = toolPermissionContext, $3[62] = t242;
    else
      t242 = $3[62];
    return t242;
  }
  if (removingDirectory) {
    let t222;
    if ($3[63] !== removingDirectory)
      t222 = () => {
        setChanges((prev_6) => [...prev_6, `Removed directory ${source_default.bold(removingDirectory)} from workspace`]), setRemovingDirectory(null);
      }, $3[63] = removingDirectory, $3[64] = t222;
    else
      t222 = $3[64];
    let t232;
    if ($3[65] === Symbol.for("react.memo_cache_sentinel"))
      t232 = () => setRemovingDirectory(null), $3[65] = t232;
    else
      t232 = $3[65];
    let t242;
    if ($3[66] !== setAppState)
      t242 = (toolPermissionContext_2) => {
        setAppState((prev_7) => ({
          ...prev_7,
          toolPermissionContext: toolPermissionContext_2
        }));
      }, $3[66] = setAppState, $3[67] = t242;
    else
      t242 = $3[67];
    let t252;
    if ($3[68] !== removingDirectory || $3[69] !== t222 || $3[70] !== t242 || $3[71] !== toolPermissionContext)
      t252 = /* @__PURE__ */ jsx_dev_runtime299.jsxDEV(RemoveWorkspaceDirectory, {
        directoryPath: removingDirectory,
        onRemove: t222,
        onCancel: t232,
        permissionContext: toolPermissionContext,
        setPermissionContext: t242
      }, void 0, !1, void 0, this), $3[68] = removingDirectory, $3[69] = t222, $3[70] = t242, $3[71] = toolPermissionContext, $3[72] = t252;
    else
      t252 = $3[72];
    return t252;
  }
  let t22;
  if ($3[73] !== getRulesOptions || $3[74] !== handleRulesCancel || $3[75] !== handleToolSelect || $3[76] !== isSearchMode || $3[77] !== isTerminalFocused || $3[78] !== lastFocusedRuleKey || $3[79] !== searchCursorOffset || $3[80] !== searchQuery)
    t22 = {
      searchQuery,
      isSearchMode,
      isFocused: isTerminalFocused,
      onCancel: handleRulesCancel,
      lastFocusedRuleKey,
      cursorOffset: searchCursorOffset,
      getRulesOptions,
      handleToolSelect,
      onHeaderFocusChange: handleHeaderFocusChange
    }, $3[73] = getRulesOptions, $3[74] = handleRulesCancel, $3[75] = handleToolSelect, $3[76] = isSearchMode, $3[77] = isTerminalFocused, $3[78] = lastFocusedRuleKey, $3[79] = searchCursorOffset, $3[80] = searchQuery, $3[81] = t22;
  else
    t22 = $3[81];
  let sharedRulesProps = t22, isHidden = !!selectedRule || !!addingRuleToTab || !!validatedRule || isAddingWorkspaceDirectory || !!removingDirectory, t23 = !isSearchMode, t24;
  if ($3[82] === Symbol.for("react.memo_cache_sentinel"))
    t24 = /* @__PURE__ */ jsx_dev_runtime299.jsxDEV(Tab, {
      id: "recent",
      title: "Recently denied",
      children: /* @__PURE__ */ jsx_dev_runtime299.jsxDEV(RecentDenialsTab, {
        onHeaderFocusChange: handleHeaderFocusChange,
        onStateChange: handleDenialStateChange
      }, void 0, !1, void 0, this)
    }, void 0, !1, void 0, this), $3[82] = t24;
  else
    t24 = $3[82];
  let t25;
  if ($3[83] !== sharedRulesProps)
    t25 = /* @__PURE__ */ jsx_dev_runtime299.jsxDEV(Tab, {
      id: "allow",
      title: "Allow",
      children: /* @__PURE__ */ jsx_dev_runtime299.jsxDEV(PermissionRulesTab, {
        tab: "allow",
        ...sharedRulesProps
      }, void 0, !1, void 0, this)
    }, void 0, !1, void 0, this), $3[83] = sharedRulesProps, $3[84] = t25;
  else
    t25 = $3[84];
  let t26;
  if ($3[85] !== sharedRulesProps)
    t26 = /* @__PURE__ */ jsx_dev_runtime299.jsxDEV(Tab, {
      id: "ask",
      title: "Ask",
      children: /* @__PURE__ */ jsx_dev_runtime299.jsxDEV(PermissionRulesTab, {
        tab: "ask",
        ...sharedRulesProps
      }, void 0, !1, void 0, this)
    }, void 0, !1, void 0, this), $3[85] = sharedRulesProps, $3[86] = t26;
  else
    t26 = $3[86];
  let t27;
  if ($3[87] !== sharedRulesProps)
    t27 = /* @__PURE__ */ jsx_dev_runtime299.jsxDEV(Tab, {
      id: "deny",
      title: "Deny",
      children: /* @__PURE__ */ jsx_dev_runtime299.jsxDEV(PermissionRulesTab, {
        tab: "deny",
        ...sharedRulesProps
      }, void 0, !1, void 0, this)
    }, void 0, !1, void 0, this), $3[87] = sharedRulesProps, $3[88] = t27;
  else
    t27 = $3[88];
  let t28;
  if ($3[89] === Symbol.for("react.memo_cache_sentinel"))
    t28 = /* @__PURE__ */ jsx_dev_runtime299.jsxDEV(ThemedText, {
      children: "Claude Code can read files in the workspace, and make edits when auto-accept edits is on."
    }, void 0, !1, void 0, this), $3[89] = t28;
  else
    t28 = $3[89];
  let t29;
  if ($3[90] !== onExit2 || $3[91] !== toolPermissionContext)
    t29 = /* @__PURE__ */ jsx_dev_runtime299.jsxDEV(Tab, {
      id: "workspace",
      title: "Workspace",
      children: /* @__PURE__ */ jsx_dev_runtime299.jsxDEV(ThemedBox_default, {
        flexDirection: "column",
        children: [
          t28,
          /* @__PURE__ */ jsx_dev_runtime299.jsxDEV(WorkspaceTab, {
            onExit: onExit2,
            toolPermissionContext,
            onRequestAddDirectory: handleRequestAddDirectory,
            onRequestRemoveDirectory: handleRequestRemoveDirectory,
            onHeaderFocusChange: handleHeaderFocusChange
          }, void 0, !1, void 0, this)
        ]
      }, void 0, !0, void 0, this)
    }, void 0, !1, void 0, this), $3[90] = onExit2, $3[91] = toolPermissionContext, $3[92] = t29;
  else
    t29 = $3[92];
  let t30;
  if ($3[93] !== defaultTab || $3[94] !== isHidden || $3[95] !== t23 || $3[96] !== t25 || $3[97] !== t26 || $3[98] !== t27 || $3[99] !== t29)
    t30 = /* @__PURE__ */ jsx_dev_runtime299.jsxDEV(Tabs, {
      title: "Permissions:",
      color: "permission",
      defaultTab,
      hidden: isHidden,
      initialHeaderFocused: !hasDenials,
      navFromContent: t23,
      children: [
        t24,
        t25,
        t26,
        t27,
        t29
      ]
    }, void 0, !0, void 0, this), $3[93] = defaultTab, $3[94] = isHidden, $3[95] = t23, $3[96] = t25, $3[97] = t26, $3[98] = t27, $3[99] = t29, $3[100] = t30;
  else
    t30 = $3[100];
  let t31;
  if ($3[101] !== defaultTab || $3[102] !== exitState.keyName || $3[103] !== exitState.pending || $3[104] !== headerFocused || $3[105] !== isSearchMode)
    t31 = /* @__PURE__ */ jsx_dev_runtime299.jsxDEV(ThemedBox_default, {
      marginTop: 1,
      paddingLeft: 1,
      children: /* @__PURE__ */ jsx_dev_runtime299.jsxDEV(ThemedText, {
        dimColor: !0,
        children: exitState.pending ? /* @__PURE__ */ jsx_dev_runtime299.jsxDEV(jsx_dev_runtime299.Fragment, {
          children: [
            "Press ",
            exitState.keyName,
            " again to exit"
          ]
        }, void 0, !0, void 0, this) : headerFocused ? /* @__PURE__ */ jsx_dev_runtime299.jsxDEV(jsx_dev_runtime299.Fragment, {
          children: "\u2190/\u2192 tab switch \xB7 \u2193 return \xB7 Esc cancel"
        }, void 0, !1, void 0, this) : isSearchMode ? /* @__PURE__ */ jsx_dev_runtime299.jsxDEV(jsx_dev_runtime299.Fragment, {
          children: "Type to filter \xB7 Enter/\u2193 select \xB7 \u2191 tabs \xB7 Esc clear"
        }, void 0, !1, void 0, this) : hasDenials && defaultTab === "recent" ? /* @__PURE__ */ jsx_dev_runtime299.jsxDEV(jsx_dev_runtime299.Fragment, {
          children: "Enter approve \xB7 r retry \xB7 \u2191\u2193 navigate \xB7 \u2190/\u2192 switch \xB7 Esc cancel"
        }, void 0, !1, void 0, this) : /* @__PURE__ */ jsx_dev_runtime299.jsxDEV(jsx_dev_runtime299.Fragment, {
          children: "\u2191\u2193 navigate \xB7 Enter select \xB7 Type to search \xB7 \u2190/\u2192 switch \xB7 Esc cancel"
        }, void 0, !1, void 0, this)
      }, void 0, !1, void 0, this)
    }, void 0, !1, void 0, this), $3[101] = defaultTab, $3[102] = exitState.keyName, $3[103] = exitState.pending, $3[104] = headerFocused, $3[105] = isSearchMode, $3[106] = t31;
  else
    t31 = $3[106];
  let t32;
  if ($3[107] !== t30 || $3[108] !== t31)
    t32 = /* @__PURE__ */ jsx_dev_runtime299.jsxDEV(Pane, {
      color: "permission",
      children: [
        t30,
        t31
      ]
    }, void 0, !0, void 0, this), $3[107] = t30, $3[108] = t31, $3[109] = t32;
  else
    t32 = $3[109];
  let t33;
  if ($3[110] !== handleKeyDown || $3[111] !== t32)
    t33 = /* @__PURE__ */ jsx_dev_runtime299.jsxDEV(ThemedBox_default, {
      flexDirection: "column",
      onKeyDown: handleKeyDown,
      children: t32
    }, void 0, !1, void 0, this), $3[110] = handleKeyDown, $3[111] = t32, $3[112] = t33;
  else
    t33 = $3[112];
  return t33;
}
