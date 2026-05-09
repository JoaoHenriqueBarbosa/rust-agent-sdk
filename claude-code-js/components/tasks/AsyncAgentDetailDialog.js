// Original: src/components/tasks/AsyncAgentDetailDialog.tsx
function AsyncAgentDetailDialog(t0) {
  let $3 = import_compiler_runtime221.c(54), {
    agent,
    onDone,
    onKillAgent,
    onBack
  } = t0, [theme] = useTheme(), t1;
  if ($3[0] === Symbol.for("react.memo_cache_sentinel"))
    t1 = getTools(getEmptyToolPermissionContext()), $3[0] = t1;
  else
    t1 = $3[0];
  let tools = t1, elapsedTime = useElapsedTime(agent.startTime, agent.status === "running", 1000, agent.totalPausedMs ?? 0), t2;
  if ($3[1] !== onDone)
    t2 = {
      "confirm:yes": onDone
    }, $3[1] = onDone, $3[2] = t2;
  else
    t2 = $3[2];
  let t3;
  if ($3[3] === Symbol.for("react.memo_cache_sentinel"))
    t3 = {
      context: "Confirmation"
    }, $3[3] = t3;
  else
    t3 = $3[3];
  useKeybindings(t2, t3);
  let t4;
  if ($3[4] !== agent.status || $3[5] !== onBack || $3[6] !== onDone || $3[7] !== onKillAgent)
    t4 = (e) => {
      if (e.key === " ")
        e.preventDefault(), onDone();
      else if (e.key === "left" && onBack)
        e.preventDefault(), onBack();
      else if (e.key === "x" && agent.status === "running" && onKillAgent)
        e.preventDefault(), onKillAgent();
    }, $3[4] = agent.status, $3[5] = onBack, $3[6] = onDone, $3[7] = onKillAgent, $3[8] = t4;
  else
    t4 = $3[8];
  let handleKeyDown = t4, t5;
  if ($3[9] !== agent.prompt)
    t5 = extractTag(agent.prompt, "plan"), $3[9] = agent.prompt, $3[10] = t5;
  else
    t5 = $3[10];
  let planContent = t5, displayPrompt = agent.prompt.length > 300 ? agent.prompt.substring(0, 297) + "\u2026" : agent.prompt, tokenCount = agent.result?.totalTokens ?? agent.progress?.tokenCount, toolUseCount = agent.result?.totalToolUseCount ?? agent.progress?.toolUseCount, t6 = agent.selectedAgent?.agentType ?? "agent", t7 = agent.description || "Async agent", t8;
  if ($3[11] !== t6 || $3[12] !== t7)
    t8 = /* @__PURE__ */ jsx_dev_runtime281.jsxDEV(ThemedText, {
      children: [
        t6,
        " \u203A",
        " ",
        t7
      ]
    }, void 0, !0, void 0, this), $3[11] = t6, $3[12] = t7, $3[13] = t8;
  else
    t8 = $3[13];
  let title = t8, t9;
  if ($3[14] !== agent.status)
    t9 = agent.status !== "running" && /* @__PURE__ */ jsx_dev_runtime281.jsxDEV(ThemedText, {
      color: getTaskStatusColor(agent.status),
      children: [
        getTaskStatusIcon(agent.status),
        " ",
        agent.status === "completed" ? "Completed" : agent.status === "failed" ? "Failed" : "Stopped",
        " \xB7 "
      ]
    }, void 0, !0, void 0, this), $3[14] = agent.status, $3[15] = t9;
  else
    t9 = $3[15];
  let t10;
  if ($3[16] !== tokenCount)
    t10 = tokenCount !== void 0 && tokenCount > 0 && /* @__PURE__ */ jsx_dev_runtime281.jsxDEV(jsx_dev_runtime281.Fragment, {
      children: [
        " \xB7 ",
        formatNumber(tokenCount),
        " tokens"
      ]
    }, void 0, !0, void 0, this), $3[16] = tokenCount, $3[17] = t10;
  else
    t10 = $3[17];
  let t11;
  if ($3[18] !== toolUseCount)
    t11 = toolUseCount !== void 0 && toolUseCount > 0 && /* @__PURE__ */ jsx_dev_runtime281.jsxDEV(jsx_dev_runtime281.Fragment, {
      children: [
        " ",
        "\xB7 ",
        toolUseCount,
        " ",
        toolUseCount === 1 ? "tool" : "tools"
      ]
    }, void 0, !0, void 0, this), $3[18] = toolUseCount, $3[19] = t11;
  else
    t11 = $3[19];
  let t12;
  if ($3[20] !== elapsedTime || $3[21] !== t10 || $3[22] !== t11)
    t12 = /* @__PURE__ */ jsx_dev_runtime281.jsxDEV(ThemedText, {
      dimColor: !0,
      children: [
        elapsedTime,
        t10,
        t11
      ]
    }, void 0, !0, void 0, this), $3[20] = elapsedTime, $3[21] = t10, $3[22] = t11, $3[23] = t12;
  else
    t12 = $3[23];
  let t13;
  if ($3[24] !== t12 || $3[25] !== t9)
    t13 = /* @__PURE__ */ jsx_dev_runtime281.jsxDEV(ThemedText, {
      children: [
        t9,
        t12
      ]
    }, void 0, !0, void 0, this), $3[24] = t12, $3[25] = t9, $3[26] = t13;
  else
    t13 = $3[26];
  let subtitle = t13, t14;
  if ($3[27] !== agent.status || $3[28] !== onBack || $3[29] !== onKillAgent)
    t14 = (exitState) => exitState.pending ? /* @__PURE__ */ jsx_dev_runtime281.jsxDEV(ThemedText, {
      children: [
        "Press ",
        exitState.keyName,
        " again to exit"
      ]
    }, void 0, !0, void 0, this) : /* @__PURE__ */ jsx_dev_runtime281.jsxDEV(Byline, {
      children: [
        onBack && /* @__PURE__ */ jsx_dev_runtime281.jsxDEV(KeyboardShortcutHint, {
          shortcut: "\u2190",
          action: "go back"
        }, void 0, !1, void 0, this),
        /* @__PURE__ */ jsx_dev_runtime281.jsxDEV(KeyboardShortcutHint, {
          shortcut: "Esc/Enter/Space",
          action: "close"
        }, void 0, !1, void 0, this),
        agent.status === "running" && onKillAgent && /* @__PURE__ */ jsx_dev_runtime281.jsxDEV(KeyboardShortcutHint, {
          shortcut: "x",
          action: "stop"
        }, void 0, !1, void 0, this)
      ]
    }, void 0, !0, void 0, this), $3[27] = agent.status, $3[28] = onBack, $3[29] = onKillAgent, $3[30] = t14;
  else
    t14 = $3[30];
  let t15;
  if ($3[31] !== agent.progress || $3[32] !== agent.status || $3[33] !== theme)
    t15 = agent.status === "running" && agent.progress?.recentActivities && agent.progress.recentActivities.length > 0 && /* @__PURE__ */ jsx_dev_runtime281.jsxDEV(ThemedBox_default, {
      flexDirection: "column",
      children: [
        /* @__PURE__ */ jsx_dev_runtime281.jsxDEV(ThemedText, {
          bold: !0,
          dimColor: !0,
          children: "Progress"
        }, void 0, !1, void 0, this),
        agent.progress.recentActivities.map((activity, i5) => /* @__PURE__ */ jsx_dev_runtime281.jsxDEV(ThemedText, {
          dimColor: i5 < agent.progress.recentActivities.length - 1,
          wrap: "truncate-end",
          children: [
            i5 === agent.progress.recentActivities.length - 1 ? "\u203A " : "  ",
            renderToolActivity(activity, tools, theme)
          ]
        }, i5, !0, void 0, this))
      ]
    }, void 0, !0, void 0, this), $3[31] = agent.progress, $3[32] = agent.status, $3[33] = theme, $3[34] = t15;
  else
    t15 = $3[34];
  let t16;
  if ($3[35] !== displayPrompt || $3[36] !== planContent)
    t16 = planContent ? /* @__PURE__ */ jsx_dev_runtime281.jsxDEV(ThemedBox_default, {
      marginTop: 1,
      children: /* @__PURE__ */ jsx_dev_runtime281.jsxDEV(UserPlanMessage, {
        addMargin: !1,
        planContent
      }, void 0, !1, void 0, this)
    }, void 0, !1, void 0, this) : /* @__PURE__ */ jsx_dev_runtime281.jsxDEV(ThemedBox_default, {
      flexDirection: "column",
      marginTop: 1,
      children: [
        /* @__PURE__ */ jsx_dev_runtime281.jsxDEV(ThemedText, {
          bold: !0,
          dimColor: !0,
          children: "Prompt"
        }, void 0, !1, void 0, this),
        /* @__PURE__ */ jsx_dev_runtime281.jsxDEV(ThemedText, {
          wrap: "wrap",
          children: displayPrompt
        }, void 0, !1, void 0, this)
      ]
    }, void 0, !0, void 0, this), $3[35] = displayPrompt, $3[36] = planContent, $3[37] = t16;
  else
    t16 = $3[37];
  let t17;
  if ($3[38] !== agent.error || $3[39] !== agent.status)
    t17 = agent.status === "failed" && agent.error && /* @__PURE__ */ jsx_dev_runtime281.jsxDEV(ThemedBox_default, {
      flexDirection: "column",
      marginTop: 1,
      children: [
        /* @__PURE__ */ jsx_dev_runtime281.jsxDEV(ThemedText, {
          bold: !0,
          color: "error",
          children: "Error"
        }, void 0, !1, void 0, this),
        /* @__PURE__ */ jsx_dev_runtime281.jsxDEV(ThemedText, {
          color: "error",
          wrap: "wrap",
          children: agent.error
        }, void 0, !1, void 0, this)
      ]
    }, void 0, !0, void 0, this), $3[38] = agent.error, $3[39] = agent.status, $3[40] = t17;
  else
    t17 = $3[40];
  let t18;
  if ($3[41] !== t15 || $3[42] !== t16 || $3[43] !== t17)
    t18 = /* @__PURE__ */ jsx_dev_runtime281.jsxDEV(ThemedBox_default, {
      flexDirection: "column",
      children: [
        t15,
        t16,
        t17
      ]
    }, void 0, !0, void 0, this), $3[41] = t15, $3[42] = t16, $3[43] = t17, $3[44] = t18;
  else
    t18 = $3[44];
  let t19;
  if ($3[45] !== onDone || $3[46] !== subtitle || $3[47] !== t14 || $3[48] !== t18 || $3[49] !== title)
    t19 = /* @__PURE__ */ jsx_dev_runtime281.jsxDEV(Dialog, {
      title,
      subtitle,
      onCancel: onDone,
      color: "background",
      inputGuide: t14,
      children: t18
    }, void 0, !1, void 0, this), $3[45] = onDone, $3[46] = subtitle, $3[47] = t14, $3[48] = t18, $3[49] = title, $3[50] = t19;
  else
    t19 = $3[50];
  let t20;
  if ($3[51] !== handleKeyDown || $3[52] !== t19)
    t20 = /* @__PURE__ */ jsx_dev_runtime281.jsxDEV(ThemedBox_default, {
      flexDirection: "column",
      tabIndex: 0,
      autoFocus: !0,
      onKeyDown: handleKeyDown,
      children: t19
    }, void 0, !1, void 0, this), $3[51] = handleKeyDown, $3[52] = t19, $3[53] = t20;
  else
    t20 = $3[53];
  return t20;
}
var import_compiler_runtime221, jsx_dev_runtime281;
var init_AsyncAgentDetailDialog = __esm(() => {
  init_useElapsedTime();
  init_ink2();
  init_useKeybinding();
  init_Tool();
  init_tools2();
  init_format();
  init_messages3();
  init_Byline();
  init_Dialog();
  init_KeyboardShortcutHint();
  init_UserPlanMessage();
  init_renderToolActivity();
  init_taskStatusUtils();
  import_compiler_runtime221 = __toESM(require_react_compiler_runtime_development(), 1), jsx_dev_runtime281 = __toESM(require_react_jsx_dev_runtime_development(), 1);
});
