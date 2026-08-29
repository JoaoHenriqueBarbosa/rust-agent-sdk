// Original: src/components/memory/MemoryFileSelector.tsx
import { mkdir as mkdir26 } from "fs/promises";
import { join as join114 } from "path";
function MemoryFileSelector(t0) {
  let $3 = import_compiler_runtime160.c(58), {
    onSelect,
    onCancel
  } = t0, existingMemoryFiles = import_react114.use(getMemoryFiles()), userMemoryPath = join114(getClaudeConfigHomeDir(), "CLAUDE.md"), projectMemoryPath = join114(getOriginalCwd(), "CLAUDE.md"), hasUserMemory = existingMemoryFiles.some((f) => f.path === userMemoryPath), hasProjectMemory = existingMemoryFiles.some((f_0) => f_0.path === projectMemoryPath), allMemoryFiles = [...existingMemoryFiles.filter(_temp90).map(_temp230), ...hasUserMemory ? [] : [{
    path: userMemoryPath,
    type: "User",
    content: "",
    exists: !1
  }], ...hasProjectMemory ? [] : [{
    path: projectMemoryPath,
    type: "Project",
    content: "",
    exists: !1
  }]], depths = /* @__PURE__ */ new Map, memoryOptions = allMemoryFiles.map((file2) => {
    let displayPath = getDisplayPath(file2.path), existsLabel = file2.exists ? "" : " (new)", depth = file2.parent ? (depths.get(file2.parent) ?? 0) + 1 : 0;
    depths.set(file2.path, depth);
    let indent = depth > 0 ? "  ".repeat(depth - 1) : "", label;
    if (file2.type === "User" && !file2.isNested && file2.path === userMemoryPath)
      label = "User memory";
    else if (file2.type === "Project" && !file2.isNested && file2.path === projectMemoryPath)
      label = "Project memory";
    else if (depth > 0)
      label = `${indent}L ${displayPath}${existsLabel}`;
    else
      label = `${displayPath}`;
    let description, isGit = projectIsInGitRepo(getOriginalCwd());
    if (file2.type === "User" && !file2.isNested)
      description = "Saved in ~/.claude/CLAUDE.md";
    else if (file2.type === "Project" && !file2.isNested && file2.path === projectMemoryPath)
      description = `${isGit ? "Checked in at" : "Saved in"} ./CLAUDE.md`;
    else if (file2.parent)
      description = "@-imported";
    else if (file2.isNested)
      description = "dynamically loaded";
    else
      description = "";
    return {
      label,
      value: file2.path,
      description
    };
  }), folderOptions = [], agentDefinitions = useAppState(_temp322);
  if (isAutoMemoryEnabled()) {
    let t110;
    if ($3[0] === Symbol.for("react.memo_cache_sentinel"))
      t110 = {
        label: "Open auto-memory folder",
        value: `${OPEN_FOLDER_PREFIX}${getAutoMemPath()}`,
        description: ""
      }, $3[0] = t110;
    else
      t110 = $3[0];
    folderOptions.push(t110);
    for (let agent of agentDefinitions.activeAgents)
      if (agent.memory) {
        let agentDir = getAgentMemoryDir(agent.agentType, agent.memory);
        folderOptions.push({
          label: `Open ${source_default.bold(agent.agentType)} agent memory`,
          value: `${OPEN_FOLDER_PREFIX}${agentDir}`,
          description: `${agent.memory} scope`
        });
      }
  }
  memoryOptions.push(...folderOptions);
  let t1;
  if ($3[2] !== memoryOptions)
    t1 = lastSelectedPath && memoryOptions.some(_temp419) ? lastSelectedPath : memoryOptions[0]?.value || "", $3[2] = memoryOptions, $3[3] = t1;
  else
    t1 = $3[3];
  let initialPath = t1, [autoMemoryOn, setAutoMemoryOn] = import_react114.useState(isAutoMemoryEnabled), [autoDreamOn, setAutoDreamOn] = import_react114.useState(isAutoDreamEnabled), [showDreamRow] = import_react114.useState(isAutoMemoryEnabled), isDreamRunning = useAppState(_temp612), [lastDreamAt, setLastDreamAt] = import_react114.useState(null), t2;
  if ($3[4] !== showDreamRow)
    t2 = () => {
      if (!showDreamRow)
        return;
      readLastConsolidatedAt().then(setLastDreamAt);
    }, $3[4] = showDreamRow, $3[5] = t2;
  else
    t2 = $3[5];
  let t3;
  if ($3[6] !== isDreamRunning || $3[7] !== showDreamRow)
    t3 = [showDreamRow, isDreamRunning], $3[6] = isDreamRunning, $3[7] = showDreamRow, $3[8] = t3;
  else
    t3 = $3[8];
  import_react114.useEffect(t2, t3);
  let t4;
  if ($3[9] !== isDreamRunning || $3[10] !== lastDreamAt)
    t4 = isDreamRunning ? "running" : lastDreamAt === null ? "" : lastDreamAt === 0 ? "never" : `last ran ${formatRelativeTimeAgo(new Date(lastDreamAt))}`, $3[9] = isDreamRunning, $3[10] = lastDreamAt, $3[11] = t4;
  else
    t4 = $3[11];
  let dreamStatus = t4, [focusedToggle, setFocusedToggle] = import_react114.useState(null), toggleFocused = focusedToggle !== null, lastToggleIndex = showDreamRow ? 1 : 0, t5;
  if ($3[12] !== autoMemoryOn)
    t5 = function() {
      let newValue = !autoMemoryOn;
      updateSettingsForSource("userSettings", {
        autoMemoryEnabled: newValue
      }), setAutoMemoryOn(newValue), logEvent("tengu_auto_memory_toggled", {
        enabled: newValue
      });
    }, $3[12] = autoMemoryOn, $3[13] = t5;
  else
    t5 = $3[13];
  let handleToggleAutoMemory = t5, t6;
  if ($3[14] !== autoDreamOn)
    t6 = function() {
      let newValue_0 = !autoDreamOn;
      updateSettingsForSource("userSettings", {
        autoDreamEnabled: newValue_0
      }), setAutoDreamOn(newValue_0), logEvent("tengu_auto_dream_toggled", {
        enabled: newValue_0
      });
    }, $3[14] = autoDreamOn, $3[15] = t6;
  else
    t6 = $3[15];
  let handleToggleAutoDream = t6;
  useExitOnCtrlCDWithKeybindings();
  let t7;
  if ($3[16] === Symbol.for("react.memo_cache_sentinel"))
    t7 = {
      context: "Confirmation"
    }, $3[16] = t7;
  else
    t7 = $3[16];
  useKeybinding("confirm:no", onCancel, t7);
  let t8;
  if ($3[17] !== focusedToggle || $3[18] !== handleToggleAutoDream || $3[19] !== handleToggleAutoMemory)
    t8 = () => {
      if (focusedToggle === 0)
        handleToggleAutoMemory();
      else if (focusedToggle === 1)
        handleToggleAutoDream();
    }, $3[17] = focusedToggle, $3[18] = handleToggleAutoDream, $3[19] = handleToggleAutoMemory, $3[20] = t8;
  else
    t8 = $3[20];
  let t9;
  if ($3[21] !== toggleFocused)
    t9 = {
      context: "Confirmation",
      isActive: toggleFocused
    }, $3[21] = toggleFocused, $3[22] = t9;
  else
    t9 = $3[22];
  useKeybinding("confirm:yes", t8, t9);
  let t10;
  if ($3[23] !== lastToggleIndex)
    t10 = () => {
      setFocusedToggle((prev) => prev !== null && prev < lastToggleIndex ? prev + 1 : null);
    }, $3[23] = lastToggleIndex, $3[24] = t10;
  else
    t10 = $3[24];
  let t11;
  if ($3[25] !== toggleFocused)
    t11 = {
      context: "Select",
      isActive: toggleFocused
    }, $3[25] = toggleFocused, $3[26] = t11;
  else
    t11 = $3[26];
  useKeybinding("select:next", t10, t11);
  let t12;
  if ($3[27] === Symbol.for("react.memo_cache_sentinel"))
    t12 = () => {
      setFocusedToggle(_temp712);
    }, $3[27] = t12;
  else
    t12 = $3[27];
  let t13;
  if ($3[28] !== toggleFocused)
    t13 = {
      context: "Select",
      isActive: toggleFocused
    }, $3[28] = toggleFocused, $3[29] = t13;
  else
    t13 = $3[29];
  useKeybinding("select:previous", t12, t13);
  let t14 = focusedToggle === 0, t15 = autoMemoryOn ? "on" : "off", t16;
  if ($3[30] !== t15)
    t16 = /* @__PURE__ */ jsx_dev_runtime200.jsxDEV(ThemedText, {
      children: [
        "Auto-memory: ",
        t15
      ]
    }, void 0, !0, void 0, this), $3[30] = t15, $3[31] = t16;
  else
    t16 = $3[31];
  let t17;
  if ($3[32] !== t14 || $3[33] !== t16)
    t17 = /* @__PURE__ */ jsx_dev_runtime200.jsxDEV(ListItem, {
      isFocused: t14,
      children: t16
    }, void 0, !1, void 0, this), $3[32] = t14, $3[33] = t16, $3[34] = t17;
  else
    t17 = $3[34];
  let t18;
  if ($3[35] !== autoDreamOn || $3[36] !== dreamStatus || $3[37] !== focusedToggle || $3[38] !== isDreamRunning || $3[39] !== showDreamRow)
    t18 = showDreamRow && /* @__PURE__ */ jsx_dev_runtime200.jsxDEV(ListItem, {
      isFocused: focusedToggle === 1,
      styled: !1,
      children: /* @__PURE__ */ jsx_dev_runtime200.jsxDEV(ThemedText, {
        color: focusedToggle === 1 ? "suggestion" : void 0,
        children: [
          "Auto-dream: ",
          autoDreamOn ? "on" : "off",
          dreamStatus && /* @__PURE__ */ jsx_dev_runtime200.jsxDEV(ThemedText, {
            dimColor: !0,
            children: [
              " \xB7 ",
              dreamStatus
            ]
          }, void 0, !0, void 0, this),
          !isDreamRunning && autoDreamOn && /* @__PURE__ */ jsx_dev_runtime200.jsxDEV(ThemedText, {
            dimColor: !0,
            children: " \xB7 /dream to run"
          }, void 0, !1, void 0, this)
        ]
      }, void 0, !0, void 0, this)
    }, void 0, !1, void 0, this), $3[35] = autoDreamOn, $3[36] = dreamStatus, $3[37] = focusedToggle, $3[38] = isDreamRunning, $3[39] = showDreamRow, $3[40] = t18;
  else
    t18 = $3[40];
  let t19;
  if ($3[41] !== t17 || $3[42] !== t18)
    t19 = /* @__PURE__ */ jsx_dev_runtime200.jsxDEV(ThemedBox_default, {
      flexDirection: "column",
      marginBottom: 1,
      children: [
        t17,
        t18
      ]
    }, void 0, !0, void 0, this), $3[41] = t17, $3[42] = t18, $3[43] = t19;
  else
    t19 = $3[43];
  let t20;
  if ($3[44] !== onSelect)
    t20 = (value) => {
      if (value.startsWith(OPEN_FOLDER_PREFIX)) {
        let folderPath = value.slice(OPEN_FOLDER_PREFIX.length);
        mkdir26(folderPath, {
          recursive: !0
        }).catch(_temp89).then(() => openPath(folderPath));
        return;
      }
      lastSelectedPath = value, onSelect(value);
    }, $3[44] = onSelect, $3[45] = t20;
  else
    t20 = $3[45];
  let t21;
  if ($3[46] !== lastToggleIndex)
    t21 = () => setFocusedToggle(lastToggleIndex), $3[46] = lastToggleIndex, $3[47] = t21;
  else
    t21 = $3[47];
  let t22;
  if ($3[48] !== initialPath || $3[49] !== memoryOptions || $3[50] !== onCancel || $3[51] !== t20 || $3[52] !== t21 || $3[53] !== toggleFocused)
    t22 = /* @__PURE__ */ jsx_dev_runtime200.jsxDEV(Select, {
      defaultFocusValue: initialPath,
      options: memoryOptions,
      isDisabled: toggleFocused,
      onChange: t20,
      onCancel,
      onUpFromFirstItem: t21
    }, void 0, !1, void 0, this), $3[48] = initialPath, $3[49] = memoryOptions, $3[50] = onCancel, $3[51] = t20, $3[52] = t21, $3[53] = toggleFocused, $3[54] = t22;
  else
    t22 = $3[54];
  let t23;
  if ($3[55] !== t19 || $3[56] !== t22)
    t23 = /* @__PURE__ */ jsx_dev_runtime200.jsxDEV(ThemedBox_default, {
      flexDirection: "column",
      width: "100%",
      children: [
        t19,
        t22
      ]
    }, void 0, !0, void 0, this), $3[55] = t19, $3[56] = t22, $3[57] = t23;
  else
    t23 = $3[57];
  return t23;
}
function _temp89() {}
function _temp712(prev_0) {
  return prev_0 !== null && prev_0 > 0 ? prev_0 - 1 : prev_0;
}
function _temp612(s_0) {
  return Object.values(s_0.tasks).some(_temp514);
}
function _temp514(t2) {
  return t2.type === "dream" && t2.status === "running";
}
function _temp419(opt) {
  return opt.value === lastSelectedPath;
}
function _temp322(s2) {
  return s2.agentDefinitions;
}
function _temp230(f_2) {
  return {
    ...f_2,
    exists: !0
  };
}
function _temp90(f_1) {
  return f_1.type !== "AutoMem" && f_1.type !== "TeamMem";
}
var import_compiler_runtime160, import_react114, jsx_dev_runtime200, lastSelectedPath, OPEN_FOLDER_PREFIX = "__open_folder__";
var init_MemoryFileSelector = __esm(() => {
  init_source();
  init_state();
  init_useExitOnCtrlCDWithKeybindings();
  init_ink2();
  init_useKeybinding();
  init_paths();
  init_config11();
  init_consolidationLock();
  init_AppState();
  init_agentMemory();
  init_browser();
  init_claudemd();
  init_envUtils();
  init_file();
  init_format();
  init_versions2();
  init_settings2();
  init_CustomSelect();
  init_ListItem();
  import_compiler_runtime160 = __toESM(require_react_compiler_runtime_development(), 1), import_react114 = __toESM(require_react_development(), 1), jsx_dev_runtime200 = __toESM(require_react_jsx_dev_runtime_development(), 1);
});
