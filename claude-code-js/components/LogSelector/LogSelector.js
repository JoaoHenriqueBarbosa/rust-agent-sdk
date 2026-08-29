// function: LogSelector
function LogSelector(t0) {
  let $3 = import_compiler_runtime216.c(247), {
    logs: logs2,
    maxHeight: t1,
    forceWidth,
    onCancel,
    onSelect,
    onLogsChanged,
    onLoadMore,
    initialSearchQuery,
    showAllProjects: t2,
    onToggleAllProjects,
    onAgenticSearch
  } = t0, maxHeight = t1 === void 0 ? 1 / 0 : t1, showAllProjects = t2 === void 0 ? !1 : t2, terminalSize = useTerminalSize(), columns = forceWidth === void 0 ? terminalSize.columns : forceWidth, exitState = useExitOnCtrlCDWithKeybindings(onCancel), isTerminalFocused = useTerminalFocus(), t3;
  if ($3[0] === Symbol.for("react.memo_cache_sentinel"))
    t3 = isCustomTitleEnabled(), $3[0] = t3;
  else
    t3 = $3[0];
  let isResumeWithRenameEnabled = t3, isDeepSearchEnabled = !1, [themeName] = useTheme(), t4;
  if ($3[1] !== themeName)
    t4 = getTheme(themeName), $3[1] = themeName, $3[2] = t4;
  else
    t4 = $3[2];
  let theme = t4, t5;
  if ($3[3] !== theme.warning)
    t5 = (text2) => applyColor(text2, theme.warning), $3[3] = theme.warning, $3[4] = t5;
  else
    t5 = $3[4];
  let highlightColor = t5, isAgenticSearchEnabled = !1, [currentBranch, setCurrentBranch] = import_react159.default.useState(null), [branchFilterEnabled, setBranchFilterEnabled] = import_react159.default.useState(!1), [showAllWorktrees, setShowAllWorktrees] = import_react159.default.useState(!1), [hasMultipleWorktrees, setHasMultipleWorktrees] = import_react159.default.useState(!1), t6;
  if ($3[5] === Symbol.for("react.memo_cache_sentinel"))
    t6 = getOriginalCwd(), $3[5] = t6;
  else
    t6 = $3[5];
  let currentCwd2 = t6, [renameValue, setRenameValue] = import_react159.default.useState(""), [renameCursorOffset, setRenameCursorOffset] = import_react159.default.useState(0), t7;
  if ($3[6] === Symbol.for("react.memo_cache_sentinel"))
    t7 = /* @__PURE__ */ new Set, $3[6] = t7;
  else
    t7 = $3[6];
  let [expandedGroupSessionIds, setExpandedGroupSessionIds] = import_react159.default.useState(t7), [focusedNode, setFocusedNode] = import_react159.default.useState(null), [focusedIndex, setFocusedIndex] = import_react159.default.useState(1), [viewMode, setViewMode] = import_react159.default.useState("list"), [previewLog, setPreviewLog] = import_react159.default.useState(null), prevFocusedIdRef = import_react159.default.useRef(null), [selectedTagIndex, setSelectedTagIndex] = import_react159.default.useState(0), t8;
  if ($3[7] === Symbol.for("react.memo_cache_sentinel"))
    t8 = {
      status: "idle"
    }, $3[7] = t8;
  else
    t8 = $3[7];
  let [agenticSearchState, setAgenticSearchState] = import_react159.default.useState(t8), [isAgenticSearchOptionFocused, setIsAgenticSearchOptionFocused] = import_react159.default.useState(!1), agenticSearchAbortRef = import_react159.default.useRef(null), t9 = viewMode === "search" && agenticSearchState.status !== "searching", t10, t11, t12;
  if ($3[8] === Symbol.for("react.memo_cache_sentinel"))
    t10 = () => {
      setViewMode("list"), logEvent("tengu_session_search_toggled", {
        enabled: !1
      });
    }, t11 = () => {
      setViewMode("list"), logEvent("tengu_session_search_toggled", {
        enabled: !1
      });
    }, t12 = ["n"], $3[8] = t10, $3[9] = t11, $3[10] = t12;
  else
    t10 = $3[8], t11 = $3[9], t12 = $3[10];
  let t13 = initialSearchQuery || "", t14;
  if ($3[11] !== t13 || $3[12] !== t9)
    t14 = {
      isActive: t9,
      onExit: t10,
      onExitUp: t11,
      passthroughCtrlKeys: t12,
      initialQuery: t13
    }, $3[11] = t13, $3[12] = t9, $3[13] = t14;
  else
    t14 = $3[13];
  let {
    query: searchQuery,
    setQuery: setSearchQuery,
    cursorOffset: searchCursorOffset
  } = useSearchInput(t14), deferredSearchQuery = import_react159.default.useDeferredValue(searchQuery), [debouncedDeepSearchQuery, setDebouncedDeepSearchQuery] = import_react159.default.useState(""), t15, t16;
  if ($3[14] !== deferredSearchQuery)
    t15 = () => {
      if (!deferredSearchQuery) {
        setDebouncedDeepSearchQuery("");
        return;
      }
      let timeoutId = setTimeout(setDebouncedDeepSearchQuery, 300, deferredSearchQuery);
      return () => clearTimeout(timeoutId);
    }, t16 = [deferredSearchQuery], $3[14] = deferredSearchQuery, $3[15] = t15, $3[16] = t16;
  else
    t15 = $3[15], t16 = $3[16];
  import_react159.default.useEffect(t15, t16);
  let [deepSearchResults, setDeepSearchResults] = import_react159.default.useState(null), [isSearching, setIsSearching] = import_react159.default.useState(!1), t17, t18;
  if ($3[17] === Symbol.for("react.memo_cache_sentinel"))
    t17 = () => {
      getBranch().then((branch) => setCurrentBranch(branch)), getWorktreePaths(currentCwd2).then((paths2) => {
        setHasMultipleWorktrees(paths2.length > 1);
      });
    }, t18 = [currentCwd2], $3[17] = t17, $3[18] = t18;
  else
    t17 = $3[17], t18 = $3[18];
  import_react159.default.useEffect(t17, t18);
  let searchableTextByLog = new Map(logs2.map(_temp130)), t19;
  t19 = null;
  let t20;
  if ($3[19] !== logs2)
    t20 = getUniqueTags(logs2), $3[19] = logs2, $3[20] = t20;
  else
    t20 = $3[20];
  let uniqueTags = t20, hasTags = uniqueTags.length > 0, t21;
  if ($3[21] !== hasTags || $3[22] !== uniqueTags)
    t21 = hasTags ? ["All", ...uniqueTags] : [], $3[21] = hasTags, $3[22] = uniqueTags, $3[23] = t21;
  else
    t21 = $3[23];
  let tagTabs = t21, effectiveTagIndex = tagTabs.length > 0 && selectedTagIndex < tagTabs.length ? selectedTagIndex : 0, selectedTab = tagTabs[effectiveTagIndex], tagFilter = selectedTab === "All" ? void 0 : selectedTab, tagTabsLines = hasTags ? 1 : 0, filtered = logs2;
  if (isResumeWithRenameEnabled) {
    let t222;
    if ($3[24] !== logs2)
      t222 = logs2.filter(_temp249), $3[24] = logs2, $3[25] = t222;
    else
      t222 = $3[25];
    filtered = t222;
  }
  if (tagFilter !== void 0) {
    let t222;
    if ($3[26] !== filtered || $3[27] !== tagFilter) {
      let t232;
      if ($3[29] !== tagFilter)
        t232 = (log_2) => log_2.tag === tagFilter, $3[29] = tagFilter, $3[30] = t232;
      else
        t232 = $3[30];
      t222 = filtered.filter(t232), $3[26] = filtered, $3[27] = tagFilter, $3[28] = t222;
    } else
      t222 = $3[28];
    filtered = t222;
  }
  if (branchFilterEnabled && currentBranch) {
    let t222;
    if ($3[31] !== currentBranch || $3[32] !== filtered) {
      let t232;
      if ($3[34] !== currentBranch)
        t232 = (log_3) => log_3.gitBranch === currentBranch, $3[34] = currentBranch, $3[35] = t232;
      else
        t232 = $3[35];
      t222 = filtered.filter(t232), $3[31] = currentBranch, $3[32] = filtered, $3[33] = t222;
    } else
      t222 = $3[33];
    filtered = t222;
  }
  if (hasMultipleWorktrees && !showAllWorktrees) {
    let t222;
    if ($3[36] !== filtered) {
      let t232;
      if ($3[38] === Symbol.for("react.memo_cache_sentinel"))
        t232 = (log_4) => log_4.projectPath === currentCwd2, $3[38] = t232;
      else
        t232 = $3[38];
      t222 = filtered.filter(t232), $3[36] = filtered, $3[37] = t222;
    } else
      t222 = $3[37];
    filtered = t222;
  }
  let baseFilteredLogs = filtered, t22;
  bb0: {
    if (!searchQuery) {
      t22 = baseFilteredLogs;
      break bb0;
    }
    let t232;
    if ($3[39] !== baseFilteredLogs || $3[40] !== searchQuery) {
      let query3 = searchQuery.toLowerCase();
      t232 = baseFilteredLogs.filter((log_5) => {
        let displayedTitle = getLogDisplayTitle(log_5).toLowerCase(), branch_0 = (log_5.gitBranch || "").toLowerCase(), tag2 = (log_5.tag || "").toLowerCase(), prInfo = log_5.prNumber ? `pr #${log_5.prNumber} ${log_5.prRepository || ""}`.toLowerCase() : "";
        return displayedTitle.includes(query3) || branch_0.includes(query3) || tag2.includes(query3) || prInfo.includes(query3);
      }), $3[39] = baseFilteredLogs, $3[40] = searchQuery, $3[41] = t232;
    } else
      t232 = $3[41];
    t22 = t232;
  }
  let titleFilteredLogs = t22, t23, t24;
  if ($3[42] !== debouncedDeepSearchQuery || $3[43] !== deferredSearchQuery)
    t23 = () => {}, t24 = [deferredSearchQuery, debouncedDeepSearchQuery, !1], $3[42] = debouncedDeepSearchQuery, $3[43] = deferredSearchQuery, $3[44] = t23, $3[45] = t24;
  else
    t23 = $3[44], t24 = $3[45];
  import_react159.default.useEffect(t23, t24);
  let t25, t26;
  if ($3[46] !== debouncedDeepSearchQuery)
    t25 = () => {
      setDeepSearchResults(null), setIsSearching(!1);
      return;
    }, t26 = [debouncedDeepSearchQuery, null, !1], $3[46] = debouncedDeepSearchQuery, $3[47] = t25, $3[48] = t26;
  else
    t25 = $3[47], t26 = $3[48];
  import_react159.default.useEffect(t25, t26);
  let filtered_0, snippetMap;
  if ($3[49] !== debouncedDeepSearchQuery || $3[50] !== deepSearchResults || $3[51] !== titleFilteredLogs) {
    if (snippetMap = /* @__PURE__ */ new Map, filtered_0 = titleFilteredLogs, deepSearchResults && debouncedDeepSearchQuery && deepSearchResults.query === debouncedDeepSearchQuery) {
      for (let result of deepSearchResults.results)
        if (result.searchableText) {
          let snippet = extractSnippet(result.searchableText, debouncedDeepSearchQuery, SNIPPET_CONTEXT_CHARS);
          if (snippet)
            snippetMap.set(result.log, snippet);
        }
      let t272;
      if ($3[54] !== filtered_0)
        t272 = new Set(filtered_0.map(_temp615)), $3[54] = filtered_0, $3[55] = t272;
      else
        t272 = $3[55];
      let titleMatchIds = t272, t282;
      if ($3[56] !== deepSearchResults.results || $3[57] !== filtered_0 || $3[58] !== titleMatchIds) {
        let t292;
        if ($3[60] !== titleMatchIds)
          t292 = (log_7) => !titleMatchIds.has(log_7.messages[0]?.uuid), $3[60] = titleMatchIds, $3[61] = t292;
        else
          t292 = $3[61];
        let transcriptOnlyMatches = deepSearchResults.results.map(_temp714).filter(t292);
        t282 = [...filtered_0, ...transcriptOnlyMatches], $3[56] = deepSearchResults.results, $3[57] = filtered_0, $3[58] = titleMatchIds, $3[59] = t282;
      } else
        t282 = $3[59];
      filtered_0 = t282;
    }
    $3[49] = debouncedDeepSearchQuery, $3[50] = deepSearchResults, $3[51] = titleFilteredLogs, $3[52] = filtered_0, $3[53] = snippetMap;
  } else
    filtered_0 = $3[52], snippetMap = $3[53];
  let t27;
  if ($3[62] !== filtered_0 || $3[63] !== snippetMap)
    t27 = {
      filteredLogs: filtered_0,
      snippets: snippetMap
    }, $3[62] = filtered_0, $3[63] = snippetMap, $3[64] = t27;
  else
    t27 = $3[64];
  let {
    filteredLogs,
    snippets
  } = t27, t28;
  bb1: {
    if (agenticSearchState.status === "results" && agenticSearchState.results.length > 0) {
      t28 = agenticSearchState.results;
      break bb1;
    }
    t28 = filteredLogs;
  }
  let displayedLogs = t28, maxLabelWidth = Math.max(30, columns - 4), t29;
  bb2: {
    if (!isResumeWithRenameEnabled) {
      let t303;
      if ($3[65] === Symbol.for("react.memo_cache_sentinel"))
        t303 = [], $3[65] = t303;
      else
        t303 = $3[65];
      t29 = t303;
      break bb2;
    }
    let t302;
    if ($3[66] !== displayedLogs || $3[67] !== highlightColor || $3[68] !== maxLabelWidth || $3[69] !== showAllProjects || $3[70] !== snippets) {
      let sessionGroups = groupLogsBySessionId(displayedLogs);
      t302 = Array.from(sessionGroups.entries()).map((t312) => {
        let [sessionId, groupLogs] = t312, latestLog = groupLogs[0], indexInFiltered = displayedLogs.indexOf(latestLog), snippet_0 = snippets.get(latestLog), snippetStr = snippet_0 ? formatSnippet(snippet_0, highlightColor) : null;
        if (groupLogs.length === 1) {
          let metadata = buildLogMetadata(latestLog, {
            showProjectPath: showAllProjects
          });
          return {
            id: `log:${sessionId}:0`,
            value: {
              log: latestLog,
              indexInFiltered
            },
            label: buildLogLabel(latestLog, maxLabelWidth),
            description: snippetStr ? `${metadata}
  ${snippetStr}` : metadata,
            dimDescription: !0
          };
        }
        let forkCount = groupLogs.length - 1, children = groupLogs.slice(1).map((log_8, index) => {
          let childIndexInFiltered = displayedLogs.indexOf(log_8), childSnippet = snippets.get(log_8), childSnippetStr = childSnippet ? formatSnippet(childSnippet, highlightColor) : null, childMetadata = buildLogMetadata(log_8, {
            isChild: !0,
            showProjectPath: showAllProjects
          });
          return {
            id: `log:${sessionId}:${index + 1}`,
            value: {
              log: log_8,
              indexInFiltered: childIndexInFiltered
            },
            label: buildLogLabel(log_8, maxLabelWidth, {
              isChild: !0
            }),
            description: childSnippetStr ? `${childMetadata}
      ${childSnippetStr}` : childMetadata,
            dimDescription: !0
          };
        }), parentMetadata = buildLogMetadata(latestLog, {
          showProjectPath: showAllProjects
        });
        return {
          id: `group:${sessionId}`,
          value: {
            log: latestLog,
            indexInFiltered
          },
          label: buildLogLabel(latestLog, maxLabelWidth, {
            isGroupHeader: !0,
            forkCount
          }),
          description: snippetStr ? `${parentMetadata}
  ${snippetStr}` : parentMetadata,
          dimDescription: !0,
          children
        };
      }), $3[66] = displayedLogs, $3[67] = highlightColor, $3[68] = maxLabelWidth, $3[69] = showAllProjects, $3[70] = snippets, $3[71] = t302;
    } else
      t302 = $3[71];
    t29 = t302;
  }
  let treeNodes = t29, t30;
  bb3: {
    if (isResumeWithRenameEnabled) {
      let t313;
      if ($3[72] === Symbol.for("react.memo_cache_sentinel"))
        t313 = [], $3[72] = t313;
      else
        t313 = $3[72];
      t30 = t313;
      break bb3;
    }
    let t312;
    if ($3[73] !== displayedLogs || $3[74] !== highlightColor || $3[75] !== maxLabelWidth || $3[76] !== showAllProjects || $3[77] !== snippets) {
      let t322;
      if ($3[79] !== highlightColor || $3[80] !== maxLabelWidth || $3[81] !== showAllProjects || $3[82] !== snippets)
        t322 = (log_9, index_0) => {
          let summaryWithSidechain = getLogDisplayTitle(log_9) + (log_9.isSidechain ? " (sidechain)" : ""), summary = normalizeAndTruncateToWidth(summaryWithSidechain, maxLabelWidth), baseDescription = formatLogMetadata(log_9), projectSuffix = showAllProjects && log_9.projectPath ? ` \xB7 ${log_9.projectPath}` : "", snippet_1 = snippets.get(log_9), snippetStr_0 = snippet_1 ? formatSnippet(snippet_1, highlightColor) : null;
          return {
            label: summary,
            description: snippetStr_0 ? `${baseDescription}${projectSuffix}
  ${snippetStr_0}` : baseDescription + projectSuffix,
            dimDescription: !0,
            value: index_0.toString()
          };
        }, $3[79] = highlightColor, $3[80] = maxLabelWidth, $3[81] = showAllProjects, $3[82] = snippets, $3[83] = t322;
      else
        t322 = $3[83];
      t312 = displayedLogs.map(t322), $3[73] = displayedLogs, $3[74] = highlightColor, $3[75] = maxLabelWidth, $3[76] = showAllProjects, $3[77] = snippets, $3[78] = t312;
    } else
      t312 = $3[78];
    t30 = t312;
  }
  let flatOptions = t30, focusedLog = focusedNode?.value.log ?? null, t31;
  if ($3[84] !== displayedLogs || $3[85] !== expandedGroupSessionIds || $3[86] !== focusedLog)
    t31 = () => {
      if (!isResumeWithRenameEnabled || !focusedLog)
        return "";
      let sessionId_0 = getSessionIdFromLog(focusedLog);
      if (!sessionId_0)
        return "";
      let sessionLogs = displayedLogs.filter((log_10) => getSessionIdFromLog(log_10) === sessionId_0);
      if (!(sessionLogs.length > 1))
        return "";
      let isExpanded = expandedGroupSessionIds.has(sessionId_0);
      if (sessionLogs.indexOf(focusedLog) > 0)
        return "\u2190 to collapse";
      return isExpanded ? "\u2190 to collapse" : "\u2192 to expand";
    }, $3[84] = displayedLogs, $3[85] = expandedGroupSessionIds, $3[86] = focusedLog, $3[87] = t31;
  else
    t31 = $3[87];
  let getExpandCollapseHint = t31, t32;
  if ($3[88] !== focusedLog || $3[89] !== onLogsChanged || $3[90] !== renameValue)
    t32 = async () => {
      let sessionId_1 = focusedLog ? getSessionIdFromLog(focusedLog) : void 0;
      if (!focusedLog || !sessionId_1) {
        setViewMode("list"), setRenameValue("");
        return;
      }
      if (renameValue.trim()) {
        if (await saveCustomTitle(sessionId_1, renameValue.trim(), focusedLog.fullPath), isResumeWithRenameEnabled && onLogsChanged)
          onLogsChanged();
      }
      setViewMode("list"), setRenameValue("");
    }, $3[88] = focusedLog, $3[89] = onLogsChanged, $3[90] = renameValue, $3[91] = t32;
  else
    t32 = $3[91];
  let handleRenameSubmit = t32, t33;
  if ($3[92] === Symbol.for("react.memo_cache_sentinel"))
    t33 = () => {
      setViewMode("list"), logEvent("tengu_session_search_toggled", {
        enabled: !1
      });
    }, $3[92] = t33;
  else
    t33 = $3[92];
  let exitSearchMode = t33, t34;
  if ($3[93] === Symbol.for("react.memo_cache_sentinel"))
    t34 = () => {
      setViewMode("search"), logEvent("tengu_session_search_toggled", {
        enabled: !0
      });
    }, $3[93] = t34;
  else
    t34 = $3[93];
  let enterSearchMode = t34, t35;
  if ($3[94] !== logs2 || $3[95] !== onAgenticSearch || $3[96] !== searchQuery)
    t35 = async () => {
      searchQuery.trim();
      return;
    }, $3[94] = logs2, $3[95] = onAgenticSearch, $3[96] = searchQuery, $3[97] = t35;
  else
    t35 = $3[97];
  let handleAgenticSearch = t35, t36;
  if ($3[98] !== agenticSearchState.query || $3[99] !== agenticSearchState.status || $3[100] !== searchQuery)
    t36 = () => {
      if (agenticSearchState.status !== "idle" && agenticSearchState.status !== "searching") {
        if (agenticSearchState.status === "results" && agenticSearchState.query !== searchQuery || agenticSearchState.status === "error")
          setAgenticSearchState({
            status: "idle"
          });
      }
    }, $3[98] = agenticSearchState.query, $3[99] = agenticSearchState.status, $3[100] = searchQuery, $3[101] = t36;
  else
    t36 = $3[101];
  let t37;
  if ($3[102] !== agenticSearchState || $3[103] !== searchQuery)
    t37 = [searchQuery, agenticSearchState], $3[102] = agenticSearchState, $3[103] = searchQuery, $3[104] = t37;
  else
    t37 = $3[104];
  import_react159.default.useEffect(t36, t37);
  let t38, t39;
  if ($3[105] === Symbol.for("react.memo_cache_sentinel"))
    t38 = () => () => {
      agenticSearchAbortRef.current?.abort();
    }, t39 = [], $3[105] = t38, $3[106] = t39;
  else
    t38 = $3[105], t39 = $3[106];
  import_react159.default.useEffect(t38, t39);
  let prevAgenticStatusRef = import_react159.default.useRef(agenticSearchState.status), t40;
  if ($3[107] !== agenticSearchState.status || $3[108] !== displayedLogs[0] || $3[109] !== displayedLogs.length || $3[110] !== treeNodes)
    t40 = () => {
      let prevStatus = prevAgenticStatusRef.current;
      if (prevAgenticStatusRef.current = agenticSearchState.status, prevStatus === "searching" && agenticSearchState.status === "results") {
        if (isResumeWithRenameEnabled && treeNodes.length > 0)
          setFocusedNode(treeNodes[0]);
        else if (!isResumeWithRenameEnabled && displayedLogs.length > 0) {
          let firstLog = displayedLogs[0];
          setFocusedNode({
            id: "0",
            value: {
              log: firstLog,
              indexInFiltered: 0
            },
            label: ""
          });
        }
      }
    }, $3[107] = agenticSearchState.status, $3[108] = displayedLogs[0], $3[109] = displayedLogs.length, $3[110] = treeNodes, $3[111] = t40;
  else
    t40 = $3[111];
  let t41;
  if ($3[112] !== agenticSearchState.status || $3[113] !== displayedLogs || $3[114] !== treeNodes)
    t41 = [agenticSearchState.status, isResumeWithRenameEnabled, treeNodes, displayedLogs], $3[112] = agenticSearchState.status, $3[113] = displayedLogs, $3[114] = treeNodes, $3[115] = t41;
  else
    t41 = $3[115];
  import_react159.default.useEffect(t40, t41);
  let t42;
  if ($3[116] !== displayedLogs)
    t42 = (value) => {
      let index_1 = parseInt(value, 10), log_11 = displayedLogs[index_1];
      if (!log_11 || prevFocusedIdRef.current === index_1.toString())
        return;
      prevFocusedIdRef.current = index_1.toString(), setFocusedNode({
        id: index_1.toString(),
        value: {
          log: log_11,
          indexInFiltered: index_1
        },
        label: ""
      }), setFocusedIndex(index_1 + 1);
    }, $3[116] = displayedLogs, $3[117] = t42;
  else
    t42 = $3[117];
  let handleFlatOptionsSelectFocus = t42, t43;
  if ($3[118] !== displayedLogs)
    t43 = (node2) => {
      setFocusedNode(node2);
      let index_2 = displayedLogs.findIndex((log_12) => getSessionIdFromLog(log_12) === getSessionIdFromLog(node2.value.log));
      if (index_2 >= 0)
        setFocusedIndex(index_2 + 1);
    }, $3[118] = displayedLogs, $3[119] = t43;
  else
    t43 = $3[119];
  let handleTreeSelectFocus = t43, t44;
  if ($3[120] === Symbol.for("react.memo_cache_sentinel"))
    t44 = () => {
      agenticSearchAbortRef.current?.abort(), setAgenticSearchState({
        status: "idle"
      }), logEvent("tengu_agentic_search_cancelled", {});
    }, $3[120] = t44;
  else
    t44 = $3[120];
  let t45 = viewMode !== "preview" && agenticSearchState.status === "searching", t46;
  if ($3[121] !== t45)
    t46 = {
      context: "Confirmation",
      isActive: t45
    }, $3[121] = t45, $3[122] = t46;
  else
    t46 = $3[122];
  useKeybinding("confirm:no", t44, t46);
  let t47;
  if ($3[123] === Symbol.for("react.memo_cache_sentinel"))
    t47 = () => {
      setViewMode("list"), setRenameValue("");
    }, $3[123] = t47;
  else
    t47 = $3[123];
  let t48 = viewMode === "rename" && agenticSearchState.status !== "searching", t49;
  if ($3[124] !== t48)
    t49 = {
      context: "Settings",
      isActive: t48
    }, $3[124] = t48, $3[125] = t49;
  else
    t49 = $3[125];
  useKeybinding("confirm:no", t47, t49);
  let t50;
  if ($3[126] !== onCancel || $3[127] !== setSearchQuery)
    t50 = () => {
      setSearchQuery(""), setIsAgenticSearchOptionFocused(!1), onCancel?.();
    }, $3[126] = onCancel, $3[127] = setSearchQuery, $3[128] = t50;
  else
    t50 = $3[128];
  let t51 = viewMode !== "preview" && viewMode !== "rename" && viewMode !== "search" && isAgenticSearchOptionFocused && agenticSearchState.status !== "searching", t52;
  if ($3[129] !== t51)
    t52 = {
      context: "Confirmation",
      isActive: t51
    }, $3[129] = t51, $3[130] = t52;
  else
    t52 = $3[130];
  useKeybinding("confirm:no", t50, t52);
  let t53;
  if ($3[131] !== agenticSearchState.status || $3[132] !== branchFilterEnabled || $3[133] !== focusedLog || $3[134] !== handleAgenticSearch || $3[135] !== hasMultipleWorktrees || $3[136] !== hasTags || $3[137] !== isAgenticSearchOptionFocused || $3[138] !== onAgenticSearch || $3[139] !== onToggleAllProjects || $3[140] !== searchQuery || $3[141] !== setSearchQuery || $3[142] !== showAllProjects || $3[143] !== showAllWorktrees || $3[144] !== tagTabs || $3[145] !== uniqueTags || $3[146] !== viewMode)
    t53 = (input, key3) => {
      if (viewMode === "preview")
        return;
      if (agenticSearchState.status === "searching")
        return;
      if (viewMode === "rename")
        ;
      else if (viewMode === "search") {
        if (input.toLowerCase() === "n" && key3.ctrl)
          exitSearchMode();
        else if (key3.return || key3.downArrow)
          searchQuery.trim();
      } else {
        if (isAgenticSearchOptionFocused) {
          if (key3.return) {
            handleAgenticSearch(), setIsAgenticSearchOptionFocused(!1);
            return;
          } else if (key3.downArrow) {
            setIsAgenticSearchOptionFocused(!1);
            return;
          } else if (key3.upArrow) {
            setViewMode("search"), setIsAgenticSearchOptionFocused(!1);
            return;
          }
        }
        if (hasTags && key3.tab) {
          let offset = key3.shift ? -1 : 1;
          setSelectedTagIndex((prev) => {
            let newIndex = ((prev < tagTabs.length ? prev : 0) + tagTabs.length + offset) % tagTabs.length, newTab = tagTabs[newIndex];
            return logEvent("tengu_session_tag_filter_changed", {
              is_all: newTab === "All",
              tag_count: uniqueTags.length
            }), newIndex;
          });
          return;
        }
        let keyIsNotCtrlOrMeta = !key3.ctrl && !key3.meta, lowerInput = input.toLowerCase();
        if (lowerInput === "a" && key3.ctrl && onToggleAllProjects)
          onToggleAllProjects(), logEvent("tengu_session_all_projects_toggled", {
            enabled: !showAllProjects
          });
        else if (lowerInput === "b" && key3.ctrl) {
          let newEnabled = !branchFilterEnabled;
          setBranchFilterEnabled(newEnabled), logEvent("tengu_session_branch_filter_toggled", {
            enabled: newEnabled
          });
        } else if (lowerInput === "w" && key3.ctrl && hasMultipleWorktrees) {
          let newValue = !showAllWorktrees;
          setShowAllWorktrees(newValue), logEvent("tengu_session_worktree_filter_toggled", {
            enabled: newValue
          });
        } else if (lowerInput === "/" && keyIsNotCtrlOrMeta)
          setViewMode("search"), logEvent("tengu_session_search_toggled", {
            enabled: !0
          });
        else if (lowerInput === "r" && key3.ctrl && focusedLog)
          setViewMode("rename"), setRenameValue(""), logEvent("tengu_session_rename_started", {});
        else if (lowerInput === "v" && key3.ctrl && focusedLog)
          setPreviewLog(focusedLog), setViewMode("preview"), logEvent("tengu_session_preview_opened", {
            messageCount: focusedLog.messageCount
          });
        else if (focusedLog && keyIsNotCtrlOrMeta && input.length > 0 && !/^\s+$/.test(input))
          setViewMode("search"), setSearchQuery(input), logEvent("tengu_session_search_toggled", {
            enabled: !0
          });
      }
    }, $3[131] = agenticSearchState.status, $3[132] = branchFilterEnabled, $3[133] = focusedLog, $3[134] = handleAgenticSearch, $3[135] = hasMultipleWorktrees, $3[136] = hasTags, $3[137] = isAgenticSearchOptionFocused, $3[138] = onAgenticSearch, $3[139] = onToggleAllProjects, $3[140] = searchQuery, $3[141] = setSearchQuery, $3[142] = showAllProjects, $3[143] = showAllWorktrees, $3[144] = tagTabs, $3[145] = uniqueTags, $3[146] = viewMode, $3[147] = t53;
  else
    t53 = $3[147];
  let t54;
  if ($3[148] === Symbol.for("react.memo_cache_sentinel"))
    t54 = {
      isActive: !0
    }, $3[148] = t54;
  else
    t54 = $3[148];
  use_input_default(t53, t54);
  let filterIndicators;
  if ($3[149] !== branchFilterEnabled || $3[150] !== currentBranch || $3[151] !== hasMultipleWorktrees || $3[152] !== showAllWorktrees) {
    if (filterIndicators = [], branchFilterEnabled && currentBranch)
      filterIndicators.push(currentBranch);
    if (hasMultipleWorktrees && !showAllWorktrees)
      filterIndicators.push("current worktree");
    $3[149] = branchFilterEnabled, $3[150] = currentBranch, $3[151] = hasMultipleWorktrees, $3[152] = showAllWorktrees, $3[153] = filterIndicators;
  } else
    filterIndicators = $3[153];
  let headerLines = 8 + (filterIndicators.length > 0 && viewMode !== "search" ? 1 : 0) + tagTabsLines, visibleCount = Math.max(1, Math.floor((maxHeight - headerLines - 2) / 3)), t55, t56;
  if ($3[154] !== displayedLogs.length || $3[155] !== focusedIndex || $3[156] !== onLoadMore || $3[157] !== visibleCount)
    t55 = () => {
      if (!onLoadMore)
        return;
      let buffer = visibleCount * 2;
      if (focusedIndex + buffer >= displayedLogs.length)
        onLoadMore(visibleCount * 3);
    }, t56 = [focusedIndex, visibleCount, displayedLogs.length, onLoadMore], $3[154] = displayedLogs.length, $3[155] = focusedIndex, $3[156] = onLoadMore, $3[157] = visibleCount, $3[158] = t55, $3[159] = t56;
  else
    t55 = $3[158], t56 = $3[159];
  if (import_react159.default.useEffect(t55, t56), logs2.length === 0)
    return null;
  if (viewMode === "preview" && previewLog && isResumeWithRenameEnabled) {
    let t572;
    if ($3[160] === Symbol.for("react.memo_cache_sentinel"))
      t572 = () => {
        setViewMode("list"), setPreviewLog(null);
      }, $3[160] = t572;
    else
      t572 = $3[160];
    let t582;
    if ($3[161] !== onSelect || $3[162] !== previewLog)
      t582 = /* @__PURE__ */ jsx_dev_runtime272.jsxDEV(SessionPreview, {
        log: previewLog,
        onExit: t572,
        onSelect
      }, void 0, !1, void 0, this), $3[161] = onSelect, $3[162] = previewLog, $3[163] = t582;
    else
      t582 = $3[163];
    return t582;
  }
  let t57 = maxHeight - 1, t58;
  if ($3[164] === Symbol.for("react.memo_cache_sentinel"))
    t58 = /* @__PURE__ */ jsx_dev_runtime272.jsxDEV(ThemedBox_default, {
      flexShrink: 0,
      children: /* @__PURE__ */ jsx_dev_runtime272.jsxDEV(Divider, {
        color: "suggestion"
      }, void 0, !1, void 0, this)
    }, void 0, !1, void 0, this), $3[164] = t58;
  else
    t58 = $3[164];
  let t59;
  if ($3[165] === Symbol.for("react.memo_cache_sentinel"))
    t59 = /* @__PURE__ */ jsx_dev_runtime272.jsxDEV(ThemedBox_default, {
      flexShrink: 0,
      children: /* @__PURE__ */ jsx_dev_runtime272.jsxDEV(ThemedText, {
        children: " "
      }, void 0, !1, void 0, this)
    }, void 0, !1, void 0, this), $3[165] = t59;
  else
    t59 = $3[165];
  let t60;
  if ($3[166] !== columns || $3[167] !== displayedLogs.length || $3[168] !== effectiveTagIndex || $3[169] !== focusedIndex || $3[170] !== hasTags || $3[171] !== showAllProjects || $3[172] !== tagTabs || $3[173] !== viewMode || $3[174] !== visibleCount)
    t60 = hasTags ? /* @__PURE__ */ jsx_dev_runtime272.jsxDEV(TagTabs, {
      tabs: tagTabs,
      selectedIndex: effectiveTagIndex,
      availableWidth: columns,
      showAllProjects
    }, void 0, !1, void 0, this) : /* @__PURE__ */ jsx_dev_runtime272.jsxDEV(ThemedBox_default, {
      flexShrink: 0,
      children: /* @__PURE__ */ jsx_dev_runtime272.jsxDEV(ThemedText, {
        bold: !0,
        color: "suggestion",
        children: [
          "Resume Session",
          viewMode === "list" && displayedLogs.length > visibleCount && /* @__PURE__ */ jsx_dev_runtime272.jsxDEV(ThemedText, {
            dimColor: !0,
            children: [
              " ",
              "(",
              focusedIndex,
              " of ",
              displayedLogs.length,
              ")"
            ]
          }, void 0, !0, void 0, this)
        ]
      }, void 0, !0, void 0, this)
    }, void 0, !1, void 0, this), $3[166] = columns, $3[167] = displayedLogs.length, $3[168] = effectiveTagIndex, $3[169] = focusedIndex, $3[170] = hasTags, $3[171] = showAllProjects, $3[172] = tagTabs, $3[173] = viewMode, $3[174] = visibleCount, $3[175] = t60;
  else
    t60 = $3[175];
  let t61 = viewMode === "search", t62;
  if ($3[176] !== isTerminalFocused || $3[177] !== searchCursorOffset || $3[178] !== searchQuery || $3[179] !== t61)
    t62 = /* @__PURE__ */ jsx_dev_runtime272.jsxDEV(SearchBox, {
      query: searchQuery,
      isFocused: t61,
      isTerminalFocused,
      cursorOffset: searchCursorOffset
    }, void 0, !1, void 0, this), $3[176] = isTerminalFocused, $3[177] = searchCursorOffset, $3[178] = searchQuery, $3[179] = t61, $3[180] = t62;
  else
    t62 = $3[180];
  let t63;
  if ($3[181] !== filterIndicators || $3[182] !== viewMode)
    t63 = filterIndicators.length > 0 && viewMode !== "search" && /* @__PURE__ */ jsx_dev_runtime272.jsxDEV(ThemedBox_default, {
      flexShrink: 0,
      paddingLeft: 2,
      children: /* @__PURE__ */ jsx_dev_runtime272.jsxDEV(ThemedText, {
        dimColor: !0,
        children: /* @__PURE__ */ jsx_dev_runtime272.jsxDEV(Byline, {
          children: filterIndicators
        }, void 0, !1, void 0, this)
      }, void 0, !1, void 0, this)
    }, void 0, !1, void 0, this), $3[181] = filterIndicators, $3[182] = viewMode, $3[183] = t63;
  else
    t63 = $3[183];
  let t64;
  if ($3[184] === Symbol.for("react.memo_cache_sentinel"))
    t64 = /* @__PURE__ */ jsx_dev_runtime272.jsxDEV(ThemedBox_default, {
      flexShrink: 0,
      children: /* @__PURE__ */ jsx_dev_runtime272.jsxDEV(ThemedText, {
        children: " "
      }, void 0, !1, void 0, this)
    }, void 0, !1, void 0, this), $3[184] = t64;
  else
    t64 = $3[184];
  let t65;
  if ($3[185] !== agenticSearchState.status)
    t65 = agenticSearchState.status === "searching" && /* @__PURE__ */ jsx_dev_runtime272.jsxDEV(ThemedBox_default, {
      paddingLeft: 1,
      flexShrink: 0,
      children: [
        /* @__PURE__ */ jsx_dev_runtime272.jsxDEV(Spinner, {}, void 0, !1, void 0, this),
        /* @__PURE__ */ jsx_dev_runtime272.jsxDEV(ThemedText, {
          children: " Searching\u2026"
        }, void 0, !1, void 0, this)
      ]
    }, void 0, !0, void 0, this), $3[185] = agenticSearchState.status, $3[186] = t65;
  else
    t65 = $3[186];
  let t66;
  if ($3[187] !== agenticSearchState.results || $3[188] !== agenticSearchState.status)
    t66 = agenticSearchState.status === "results" && agenticSearchState.results.length > 0 && /* @__PURE__ */ jsx_dev_runtime272.jsxDEV(ThemedBox_default, {
      paddingLeft: 1,
      marginBottom: 1,
      flexShrink: 0,
      children: /* @__PURE__ */ jsx_dev_runtime272.jsxDEV(ThemedText, {
        dimColor: !0,
        italic: !0,
        children: "Claude found these results:"
      }, void 0, !1, void 0, this)
    }, void 0, !1, void 0, this), $3[187] = agenticSearchState.results, $3[188] = agenticSearchState.status, $3[189] = t66;
  else
    t66 = $3[189];
  let t67;
  if ($3[190] !== agenticSearchState.results || $3[191] !== agenticSearchState.status || $3[192] !== filteredLogs)
    t67 = agenticSearchState.status === "results" && agenticSearchState.results.length === 0 && filteredLogs.length === 0 && /* @__PURE__ */ jsx_dev_runtime272.jsxDEV(ThemedBox_default, {
      paddingLeft: 1,
      marginBottom: 1,
      flexShrink: 0,
      children: /* @__PURE__ */ jsx_dev_runtime272.jsxDEV(ThemedText, {
        dimColor: !0,
        italic: !0,
        children: "No matching sessions found."
      }, void 0, !1, void 0, this)
    }, void 0, !1, void 0, this), $3[190] = agenticSearchState.results, $3[191] = agenticSearchState.status, $3[192] = filteredLogs, $3[193] = t67;
  else
    t67 = $3[193];
  let t68;
  if ($3[194] !== agenticSearchState.status || $3[195] !== filteredLogs)
    t68 = agenticSearchState.status === "error" && filteredLogs.length === 0 && /* @__PURE__ */ jsx_dev_runtime272.jsxDEV(ThemedBox_default, {
      paddingLeft: 1,
      marginBottom: 1,
      flexShrink: 0,
      children: /* @__PURE__ */ jsx_dev_runtime272.jsxDEV(ThemedText, {
        dimColor: !0,
        italic: !0,
        children: "No matching sessions found."
      }, void 0, !1, void 0, this)
    }, void 0, !1, void 0, this), $3[194] = agenticSearchState.status, $3[195] = filteredLogs, $3[196] = t68;
  else
    t68 = $3[196];
  let t69;
  if ($3[197] !== agenticSearchState.status || $3[198] !== isAgenticSearchOptionFocused || $3[199] !== onAgenticSearch || $3[200] !== searchQuery)
    t69 = Boolean(searchQuery.trim()) && onAgenticSearch && !1, $3[197] = agenticSearchState.status, $3[198] = isAgenticSearchOptionFocused, $3[199] = onAgenticSearch, $3[200] = searchQuery, $3[201] = t69;
  else
    t69 = $3[201];
  let t70;
  if ($3[202] !== agenticSearchState.status || $3[203] !== branchFilterEnabled || $3[204] !== columns || $3[205] !== displayedLogs || $3[206] !== expandedGroupSessionIds || $3[207] !== flatOptions || $3[208] !== focusedLog || $3[209] !== focusedNode?.id || $3[210] !== handleFlatOptionsSelectFocus || $3[211] !== handleRenameSubmit || $3[212] !== handleTreeSelectFocus || $3[213] !== isAgenticSearchOptionFocused || $3[214] !== onCancel || $3[215] !== onSelect || $3[216] !== renameCursorOffset || $3[217] !== renameValue || $3[218] !== treeNodes || $3[219] !== viewMode || $3[220] !== visibleCount)
    t70 = agenticSearchState.status === "searching" ? null : viewMode === "rename" && focusedLog ? /* @__PURE__ */ jsx_dev_runtime272.jsxDEV(ThemedBox_default, {
      paddingLeft: 2,
      flexDirection: "column",
      children: [
        /* @__PURE__ */ jsx_dev_runtime272.jsxDEV(ThemedText, {
          bold: !0,
          children: "Rename session:"
        }, void 0, !1, void 0, this),
        /* @__PURE__ */ jsx_dev_runtime272.jsxDEV(ThemedBox_default, {
          paddingTop: 1,
          children: /* @__PURE__ */ jsx_dev_runtime272.jsxDEV(TextInput, {
            value: renameValue,
            onChange: setRenameValue,
            onSubmit: handleRenameSubmit,
            placeholder: getLogDisplayTitle(focusedLog, "Enter new session name"),
            columns,
            cursorOffset: renameCursorOffset,
            onChangeCursorOffset: setRenameCursorOffset,
            showCursor: !0
          }, void 0, !1, void 0, this)
        }, void 0, !1, void 0, this)
      ]
    }, void 0, !0, void 0, this) : isResumeWithRenameEnabled ? /* @__PURE__ */ jsx_dev_runtime272.jsxDEV(TreeSelect, {
      nodes: treeNodes,
      onSelect: (node_0) => {
        onSelect(node_0.value.log);
      },
      onFocus: handleTreeSelectFocus,
      onCancel,
      focusNodeId: focusedNode?.id,
      visibleOptionCount: visibleCount,
      layout: "expanded",
      isDisabled: viewMode === "search" || isAgenticSearchOptionFocused,
      hideIndexes: !1,
      isNodeExpanded: (nodeId) => {
        if (viewMode === "search" || branchFilterEnabled)
          return !0;
        let sessionId_2 = typeof nodeId === "string" && nodeId.startsWith("group:") ? nodeId.substring(6) : null;
        return sessionId_2 ? expandedGroupSessionIds.has(sessionId_2) : !1;
      },
      onExpand: (nodeId_0) => {
        let sessionId_3 = typeof nodeId_0 === "string" && nodeId_0.startsWith("group:") ? nodeId_0.substring(6) : null;
        if (sessionId_3)
          setExpandedGroupSessionIds((prev_0) => new Set(prev_0).add(sessionId_3)), logEvent("tengu_session_group_expanded", {});
      },
      onCollapse: (nodeId_1) => {
        let sessionId_4 = typeof nodeId_1 === "string" && nodeId_1.startsWith("group:") ? nodeId_1.substring(6) : null;
        if (sessionId_4)
          setExpandedGroupSessionIds((prev_1) => {
            let newSet = new Set(prev_1);
            return newSet.delete(sessionId_4), newSet;
          });
      },
      onUpFromFirstItem: enterSearchMode
    }, void 0, !1, void 0, this) : /* @__PURE__ */ jsx_dev_runtime272.jsxDEV(Select, {
      options: flatOptions,
      onChange: (value_0) => {
        let itemIndex = parseInt(value_0, 10), log_13 = displayedLogs[itemIndex];
        if (log_13)
          onSelect(log_13);
      },
      visibleOptionCount: visibleCount,
      onCancel,
      onFocus: handleFlatOptionsSelectFocus,
      defaultFocusValue: focusedNode?.id.toString(),
      layout: "expanded",
      isDisabled: viewMode === "search" || isAgenticSearchOptionFocused,
      onUpFromFirstItem: enterSearchMode
    }, void 0, !1, void 0, this), $3[202] = agenticSearchState.status, $3[203] = branchFilterEnabled, $3[204] = columns, $3[205] = displayedLogs, $3[206] = expandedGroupSessionIds, $3[207] = flatOptions, $3[208] = focusedLog, $3[209] = focusedNode?.id, $3[210] = handleFlatOptionsSelectFocus, $3[211] = handleRenameSubmit, $3[212] = handleTreeSelectFocus, $3[213] = isAgenticSearchOptionFocused, $3[214] = onCancel, $3[215] = onSelect, $3[216] = renameCursorOffset, $3[217] = renameValue, $3[218] = treeNodes, $3[219] = viewMode, $3[220] = visibleCount, $3[221] = t70;
  else
    t70 = $3[221];
  let t71;
  if ($3[222] !== agenticSearchState.status || $3[223] !== currentBranch || $3[224] !== exitState.keyName || $3[225] !== exitState.pending || $3[226] !== getExpandCollapseHint || $3[227] !== hasMultipleWorktrees || $3[228] !== isAgenticSearchOptionFocused || $3[229] !== isSearching || $3[230] !== onToggleAllProjects || $3[231] !== showAllProjects || $3[232] !== showAllWorktrees || $3[233] !== viewMode)
    t71 = /* @__PURE__ */ jsx_dev_runtime272.jsxDEV(ThemedBox_default, {
      paddingLeft: 2,
      children: exitState.pending ? /* @__PURE__ */ jsx_dev_runtime272.jsxDEV(ThemedText, {
        dimColor: !0,
        children: [
          "Press ",
          exitState.keyName,
          " again to exit"
        ]
      }, void 0, !0, void 0, this) : viewMode === "rename" ? /* @__PURE__ */ jsx_dev_runtime272.jsxDEV(ThemedText, {
        dimColor: !0,
        children: /* @__PURE__ */ jsx_dev_runtime272.jsxDEV(Byline, {
          children: [
            /* @__PURE__ */ jsx_dev_runtime272.jsxDEV(KeyboardShortcutHint, {
              shortcut: "Enter",
              action: "save"
            }, void 0, !1, void 0, this),
            /* @__PURE__ */ jsx_dev_runtime272.jsxDEV(ConfigurableShortcutHint, {
              action: "confirm:no",
              context: "Confirmation",
              fallback: "Esc",
              description: "cancel"
            }, void 0, !1, void 0, this)
          ]
        }, void 0, !0, void 0, this)
      }, void 0, !1, void 0, this) : agenticSearchState.status === "searching" ? /* @__PURE__ */ jsx_dev_runtime272.jsxDEV(ThemedText, {
        dimColor: !0,
        children: /* @__PURE__ */ jsx_dev_runtime272.jsxDEV(Byline, {
          children: [
            /* @__PURE__ */ jsx_dev_runtime272.jsxDEV(ThemedText, {
              children: "Searching with Claude\u2026"
            }, void 0, !1, void 0, this),
            /* @__PURE__ */ jsx_dev_runtime272.jsxDEV(ConfigurableShortcutHint, {
              action: "confirm:no",
              context: "Confirmation",
              fallback: "Esc",
              description: "cancel"
            }, void 0, !1, void 0, this)
          ]
        }, void 0, !0, void 0, this)
      }, void 0, !1, void 0, this) : isAgenticSearchOptionFocused ? /* @__PURE__ */ jsx_dev_runtime272.jsxDEV(ThemedText, {
        dimColor: !0,
        children: /* @__PURE__ */ jsx_dev_runtime272.jsxDEV(Byline, {
          children: [
            /* @__PURE__ */ jsx_dev_runtime272.jsxDEV(KeyboardShortcutHint, {
              shortcut: "Enter",
              action: "search"
            }, void 0, !1, void 0, this),
            /* @__PURE__ */ jsx_dev_runtime272.jsxDEV(KeyboardShortcutHint, {
              shortcut: "\u2193",
              action: "skip"
            }, void 0, !1, void 0, this),
            /* @__PURE__ */ jsx_dev_runtime272.jsxDEV(ConfigurableShortcutHint, {
              action: "confirm:no",
              context: "Confirmation",
              fallback: "Esc",
              description: "cancel"
            }, void 0, !1, void 0, this)
          ]
        }, void 0, !0, void 0, this)
      }, void 0, !1, void 0, this) : viewMode === "search" ? /* @__PURE__ */ jsx_dev_runtime272.jsxDEV(ThemedText, {
        dimColor: !0,
        children: /* @__PURE__ */ jsx_dev_runtime272.jsxDEV(Byline, {
          children: [
            /* @__PURE__ */ jsx_dev_runtime272.jsxDEV(ThemedText, {
              children: "Type to Search"
            }, void 0, !1, void 0, this),
            /* @__PURE__ */ jsx_dev_runtime272.jsxDEV(KeyboardShortcutHint, {
              shortcut: "Enter",
              action: "select"
            }, void 0, !1, void 0, this),
            /* @__PURE__ */ jsx_dev_runtime272.jsxDEV(ConfigurableShortcutHint, {
              action: "confirm:no",
              context: "Confirmation",
              fallback: "Esc",
              description: "clear"
            }, void 0, !1, void 0, this)
          ]
        }, void 0, !0, void 0, this)
      }, void 0, !1, void 0, this) : /* @__PURE__ */ jsx_dev_runtime272.jsxDEV(ThemedText, {
        dimColor: !0,
        children: /* @__PURE__ */ jsx_dev_runtime272.jsxDEV(Byline, {
          children: [
            onToggleAllProjects && /* @__PURE__ */ jsx_dev_runtime272.jsxDEV(KeyboardShortcutHint, {
              shortcut: "Ctrl+A",
              action: `show ${showAllProjects ? "current dir" : "all projects"}`
            }, void 0, !1, void 0, this),
            currentBranch && /* @__PURE__ */ jsx_dev_runtime272.jsxDEV(KeyboardShortcutHint, {
              shortcut: "Ctrl+B",
              action: "toggle branch"
            }, void 0, !1, void 0, this),
            hasMultipleWorktrees && /* @__PURE__ */ jsx_dev_runtime272.jsxDEV(KeyboardShortcutHint, {
              shortcut: "Ctrl+W",
              action: `show ${showAllWorktrees ? "current worktree" : "all worktrees"}`
            }, void 0, !1, void 0, this),
            /* @__PURE__ */ jsx_dev_runtime272.jsxDEV(KeyboardShortcutHint, {
              shortcut: "Ctrl+V",
              action: "preview"
            }, void 0, !1, void 0, this),
            /* @__PURE__ */ jsx_dev_runtime272.jsxDEV(KeyboardShortcutHint, {
              shortcut: "Ctrl+R",
              action: "rename"
            }, void 0, !1, void 0, this),
            /* @__PURE__ */ jsx_dev_runtime272.jsxDEV(ThemedText, {
              children: "Type to search"
            }, void 0, !1, void 0, this),
            /* @__PURE__ */ jsx_dev_runtime272.jsxDEV(ConfigurableShortcutHint, {
              action: "confirm:no",
              context: "Confirmation",
              fallback: "Esc",
              description: "cancel"
            }, void 0, !1, void 0, this),
            getExpandCollapseHint() && /* @__PURE__ */ jsx_dev_runtime272.jsxDEV(ThemedText, {
              children: getExpandCollapseHint()
            }, void 0, !1, void 0, this)
          ]
        }, void 0, !0, void 0, this)
      }, void 0, !1, void 0, this)
    }, void 0, !1, void 0, this), $3[222] = agenticSearchState.status, $3[223] = currentBranch, $3[224] = exitState.keyName, $3[225] = exitState.pending, $3[226] = getExpandCollapseHint, $3[227] = hasMultipleWorktrees, $3[228] = isAgenticSearchOptionFocused, $3[229] = isSearching, $3[230] = onToggleAllProjects, $3[231] = showAllProjects, $3[232] = showAllWorktrees, $3[233] = viewMode, $3[234] = t71;
  else
    t71 = $3[234];
  let t72;
  if ($3[235] !== t57 || $3[236] !== t60 || $3[237] !== t62 || $3[238] !== t63 || $3[239] !== t65 || $3[240] !== t66 || $3[241] !== t67 || $3[242] !== t68 || $3[243] !== t69 || $3[244] !== t70 || $3[245] !== t71)
    t72 = /* @__PURE__ */ jsx_dev_runtime272.jsxDEV(ThemedBox_default, {
      flexDirection: "column",
      height: t57,
      children: [
        t58,
        t59,
        t60,
        t62,
        t63,
        t64,
        t65,
        t66,
        t67,
        t68,
        t69,
        t70,
        t71
      ]
    }, void 0, !0, void 0, this), $3[235] = t57, $3[236] = t60, $3[237] = t62, $3[238] = t63, $3[239] = t65, $3[240] = t66, $3[241] = t67, $3[242] = t68, $3[243] = t69, $3[244] = t70, $3[245] = t71, $3[246] = t72;
  else
    t72 = $3[246];
  return t72;
}
