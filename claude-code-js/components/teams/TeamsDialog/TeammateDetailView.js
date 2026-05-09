// function: TeammateDetailView
function TeammateDetailView(t0) {
  let $3 = import_compiler_runtime326.c(39), {
    teammate,
    teamName,
    onCancel
  } = t0, [promptExpanded, setPromptExpanded] = import_react245.useState(!1), cycleModeShortcut = useShortcutDisplay("confirm:cycleMode", "Confirmation", "shift+tab"), themeColor = teammate.color ? AGENT_COLOR_TO_THEME_COLOR[teammate.color] : void 0, t1;
  if ($3[0] === Symbol.for("react.memo_cache_sentinel"))
    t1 = [], $3[0] = t1;
  else
    t1 = $3[0];
  let [teammateTasks, setTeammateTasks] = import_react245.useState(t1), t2, t3;
  if ($3[1] !== teamName || $3[2] !== teammate.agentId || $3[3] !== teammate.name)
    t2 = () => {
      let cancelled = !1;
      return listTasks(teamName).then((allTasks) => {
        if (cancelled)
          return;
        setTeammateTasks(allTasks.filter((task) => task.owner === teammate.agentId || task.owner === teammate.name));
      }), () => {
        cancelled = !0;
      };
    }, t3 = [teamName, teammate.agentId, teammate.name], $3[1] = teamName, $3[2] = teammate.agentId, $3[3] = teammate.name, $3[4] = t2, $3[5] = t3;
  else
    t2 = $3[4], t3 = $3[5];
  import_react245.useEffect(t2, t3);
  let t4;
  if ($3[6] === Symbol.for("react.memo_cache_sentinel"))
    t4 = (input) => {
      if (input === "p")
        setPromptExpanded(_temp196);
    }, $3[6] = t4;
  else
    t4 = $3[6];
  use_input_default(t4);
  let workingPath = teammate.worktreePath || teammate.cwd, subtitleParts;
  if ($3[7] !== teammate.model || $3[8] !== teammate.worktreePath || $3[9] !== workingPath) {
    if (subtitleParts = [], teammate.model)
      subtitleParts.push(teammate.model);
    if (workingPath)
      subtitleParts.push(teammate.worktreePath ? `worktree: ${workingPath}` : workingPath);
    $3[7] = teammate.model, $3[8] = teammate.worktreePath, $3[9] = workingPath, $3[10] = subtitleParts;
  } else
    subtitleParts = $3[10];
  let subtitle = subtitleParts.join(" \xB7 ") || void 0, modeSymbol, t5;
  if ($3[11] !== teammate.mode) {
    let mode = teammate.mode ? permissionModeFromString(teammate.mode) : "default";
    modeSymbol = permissionModeSymbol(mode), t5 = getModeColor(mode), $3[11] = teammate.mode, $3[12] = modeSymbol, $3[13] = t5;
  } else
    modeSymbol = $3[12], t5 = $3[13];
  let modeColor = t5, t6;
  if ($3[14] !== modeColor || $3[15] !== modeSymbol)
    t6 = modeSymbol && /* @__PURE__ */ jsx_dev_runtime422.jsxDEV(ThemedText, {
      color: modeColor,
      children: [
        modeSymbol,
        " "
      ]
    }, void 0, !0, void 0, this), $3[14] = modeColor, $3[15] = modeSymbol, $3[16] = t6;
  else
    t6 = $3[16];
  let t7;
  if ($3[17] !== teammate.name || $3[18] !== themeColor)
    t7 = themeColor ? /* @__PURE__ */ jsx_dev_runtime422.jsxDEV(ThemedText, {
      color: themeColor,
      children: `@${teammate.name}`
    }, void 0, !1, void 0, this) : `@${teammate.name}`, $3[17] = teammate.name, $3[18] = themeColor, $3[19] = t7;
  else
    t7 = $3[19];
  let t8;
  if ($3[20] !== t6 || $3[21] !== t7)
    t8 = /* @__PURE__ */ jsx_dev_runtime422.jsxDEV(jsx_dev_runtime422.Fragment, {
      children: [
        t6,
        t7
      ]
    }, void 0, !0, void 0, this), $3[20] = t6, $3[21] = t7, $3[22] = t8;
  else
    t8 = $3[22];
  let title = t8, t9;
  if ($3[23] !== teammateTasks)
    t9 = teammateTasks.length > 0 && /* @__PURE__ */ jsx_dev_runtime422.jsxDEV(ThemedBox_default, {
      flexDirection: "column",
      children: [
        /* @__PURE__ */ jsx_dev_runtime422.jsxDEV(ThemedText, {
          bold: !0,
          children: "Tasks"
        }, void 0, !1, void 0, this),
        teammateTasks.map(_temp280)
      ]
    }, void 0, !0, void 0, this), $3[23] = teammateTasks, $3[24] = t9;
  else
    t9 = $3[24];
  let t10;
  if ($3[25] !== promptExpanded || $3[26] !== teammate.prompt)
    t10 = teammate.prompt && /* @__PURE__ */ jsx_dev_runtime422.jsxDEV(ThemedBox_default, {
      flexDirection: "column",
      children: [
        /* @__PURE__ */ jsx_dev_runtime422.jsxDEV(ThemedText, {
          bold: !0,
          children: "Prompt"
        }, void 0, !1, void 0, this),
        /* @__PURE__ */ jsx_dev_runtime422.jsxDEV(ThemedText, {
          children: [
            promptExpanded ? teammate.prompt : truncateToWidth(teammate.prompt, 80),
            stringWidth(teammate.prompt) > 80 && !promptExpanded && /* @__PURE__ */ jsx_dev_runtime422.jsxDEV(ThemedText, {
              dimColor: !0,
              children: " (p to expand)"
            }, void 0, !1, void 0, this)
          ]
        }, void 0, !0, void 0, this)
      ]
    }, void 0, !0, void 0, this), $3[25] = promptExpanded, $3[26] = teammate.prompt, $3[27] = t10;
  else
    t10 = $3[27];
  let t11;
  if ($3[28] !== onCancel || $3[29] !== subtitle || $3[30] !== t10 || $3[31] !== t9 || $3[32] !== title)
    t11 = /* @__PURE__ */ jsx_dev_runtime422.jsxDEV(Dialog, {
      title,
      subtitle,
      onCancel,
      color: "background",
      hideInputGuide: !0,
      children: [
        t9,
        t10
      ]
    }, void 0, !0, void 0, this), $3[28] = onCancel, $3[29] = subtitle, $3[30] = t10, $3[31] = t9, $3[32] = title, $3[33] = t11;
  else
    t11 = $3[33];
  let t12;
  if ($3[34] !== cycleModeShortcut)
    t12 = /* @__PURE__ */ jsx_dev_runtime422.jsxDEV(ThemedBox_default, {
      marginLeft: 1,
      children: /* @__PURE__ */ jsx_dev_runtime422.jsxDEV(ThemedText, {
        dimColor: !0,
        children: [
          figures_default.arrowLeft,
          " back \xB7 Esc close \xB7 k kill \xB7 s shutdown",
          getCachedBackend()?.supportsHideShow && " \xB7 h hide/show",
          " \xB7 ",
          cycleModeShortcut,
          " cycle mode"
        ]
      }, void 0, !0, void 0, this)
    }, void 0, !1, void 0, this), $3[34] = cycleModeShortcut, $3[35] = t12;
  else
    t12 = $3[35];
  let t13;
  if ($3[36] !== t11 || $3[37] !== t12)
    t13 = /* @__PURE__ */ jsx_dev_runtime422.jsxDEV(jsx_dev_runtime422.Fragment, {
      children: [
        t11,
        t12
      ]
    }, void 0, !0, void 0, this), $3[36] = t11, $3[37] = t12, $3[38] = t13;
  else
    t13 = $3[38];
  return t13;
}
