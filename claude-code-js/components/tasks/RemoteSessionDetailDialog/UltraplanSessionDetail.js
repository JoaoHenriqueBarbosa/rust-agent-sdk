// function: UltraplanSessionDetail
function UltraplanSessionDetail(t0) {
  let $3 = import_compiler_runtime227.c(70), {
    session: session2,
    onDone,
    onBack,
    onKill
  } = t0, running = session2.status === "running" || session2.status === "pending", phase = session2.ultraplanPhase, statusText = running ? phase ? PHASE_LABEL[phase] : "running" : session2.status, elapsedTime = useElapsedTime(session2.startTime, running, 1000, 0, session2.endTime), spawns = 0, calls = 0, lastBlock = null;
  for (let msg of session2.log) {
    if (msg.type !== "assistant")
      continue;
    for (let block2 of msg.message.content) {
      if (block2.type !== "tool_use")
        continue;
      if (calls++, lastBlock = block2, block2.name === AGENT_TOOL_NAME || block2.name === LEGACY_AGENT_TOOL_NAME)
        spawns++;
    }
  }
  let t1 = 1 + spawns, t2;
  if ($3[0] !== lastBlock)
    t2 = lastBlock ? formatToolUseSummary(lastBlock.name, lastBlock.input) : null, $3[0] = lastBlock, $3[1] = t2;
  else
    t2 = $3[1];
  let t3;
  if ($3[2] !== calls || $3[3] !== t1 || $3[4] !== t2)
    t3 = {
      agentsWorking: t1,
      toolCalls: calls,
      lastToolCall: t2
    }, $3[2] = calls, $3[3] = t1, $3[4] = t2, $3[5] = t3;
  else
    t3 = $3[5];
  let {
    agentsWorking,
    toolCalls,
    lastToolCall
  } = t3, t4;
  if ($3[6] !== session2.sessionId)
    t4 = getRemoteTaskSessionUrl(session2.sessionId), $3[6] = session2.sessionId, $3[7] = t4;
  else
    t4 = $3[7];
  let sessionUrl = t4, t5;
  if ($3[8] !== onBack || $3[9] !== onDone)
    t5 = onBack ?? (() => onDone("Remote session details dismissed", {
      display: "system"
    })), $3[8] = onBack, $3[9] = onDone, $3[10] = t5;
  else
    t5 = $3[10];
  let goBackOrClose = t5, [confirmingStop, setConfirmingStop] = import_react163.useState(!1);
  if (confirmingStop) {
    let t62;
    if ($3[11] === Symbol.for("react.memo_cache_sentinel"))
      t62 = () => setConfirmingStop(!1), $3[11] = t62;
    else
      t62 = $3[11];
    let t72;
    if ($3[12] === Symbol.for("react.memo_cache_sentinel"))
      t72 = /* @__PURE__ */ jsx_dev_runtime287.jsxDEV(ThemedText, {
        dimColor: !0,
        children: "This will terminate the Claude Code on the web session."
      }, void 0, !1, void 0, this), $3[12] = t72;
    else
      t72 = $3[12];
    let t82;
    if ($3[13] === Symbol.for("react.memo_cache_sentinel"))
      t82 = {
        label: "Terminate session",
        value: "stop"
      }, $3[13] = t82;
    else
      t82 = $3[13];
    let t92;
    if ($3[14] === Symbol.for("react.memo_cache_sentinel"))
      t92 = [t82, {
        label: "Back",
        value: "back"
      }], $3[14] = t92;
    else
      t92 = $3[14];
    let t102;
    if ($3[15] !== goBackOrClose || $3[16] !== onKill)
      t102 = /* @__PURE__ */ jsx_dev_runtime287.jsxDEV(Dialog, {
        title: "Stop ultraplan?",
        onCancel: t62,
        color: "background",
        children: /* @__PURE__ */ jsx_dev_runtime287.jsxDEV(ThemedBox_default, {
          flexDirection: "column",
          gap: 1,
          children: [
            t72,
            /* @__PURE__ */ jsx_dev_runtime287.jsxDEV(Select, {
              options: t92,
              onChange: (v2) => {
                if (v2 === "stop")
                  onKill?.(), goBackOrClose();
                else
                  setConfirmingStop(!1);
              }
            }, void 0, !1, void 0, this)
          ]
        }, void 0, !0, void 0, this)
      }, void 0, !1, void 0, this), $3[15] = goBackOrClose, $3[16] = onKill, $3[17] = t102;
    else
      t102 = $3[17];
    return t102;
  }
  let t6 = phase === "plan_ready" ? DIAMOND_FILLED : DIAMOND_OPEN, t7;
  if ($3[18] !== t6)
    t7 = /* @__PURE__ */ jsx_dev_runtime287.jsxDEV(ThemedText, {
      color: "background",
      children: [
        t6,
        " "
      ]
    }, void 0, !0, void 0, this), $3[18] = t6, $3[19] = t7;
  else
    t7 = $3[19];
  let t8;
  if ($3[20] === Symbol.for("react.memo_cache_sentinel"))
    t8 = /* @__PURE__ */ jsx_dev_runtime287.jsxDEV(ThemedText, {
      bold: !0,
      children: "ultraplan"
    }, void 0, !1, void 0, this), $3[20] = t8;
  else
    t8 = $3[20];
  let t9;
  if ($3[21] !== elapsedTime || $3[22] !== statusText)
    t9 = /* @__PURE__ */ jsx_dev_runtime287.jsxDEV(ThemedText, {
      dimColor: !0,
      children: [
        " \xB7 ",
        elapsedTime,
        " \xB7 ",
        statusText
      ]
    }, void 0, !0, void 0, this), $3[21] = elapsedTime, $3[22] = statusText, $3[23] = t9;
  else
    t9 = $3[23];
  let t10;
  if ($3[24] !== t7 || $3[25] !== t9)
    t10 = /* @__PURE__ */ jsx_dev_runtime287.jsxDEV(ThemedText, {
      children: [
        t7,
        t8,
        t9
      ]
    }, void 0, !0, void 0, this), $3[24] = t7, $3[25] = t9, $3[26] = t10;
  else
    t10 = $3[26];
  let t11;
  if ($3[27] !== phase)
    t11 = phase === "plan_ready" && /* @__PURE__ */ jsx_dev_runtime287.jsxDEV(ThemedText, {
      color: "success",
      children: [
        figures_default.tick,
        " "
      ]
    }, void 0, !0, void 0, this), $3[27] = phase, $3[28] = t11;
  else
    t11 = $3[28];
  let t12;
  if ($3[29] !== agentsWorking)
    t12 = plural(agentsWorking, "agent"), $3[29] = agentsWorking, $3[30] = t12;
  else
    t12 = $3[30];
  let t13 = phase ? AGENT_VERB[phase] : "working", t14;
  if ($3[31] !== toolCalls)
    t14 = plural(toolCalls, "call"), $3[31] = toolCalls, $3[32] = t14;
  else
    t14 = $3[32];
  let t15;
  if ($3[33] !== agentsWorking || $3[34] !== t11 || $3[35] !== t12 || $3[36] !== t13 || $3[37] !== t14 || $3[38] !== toolCalls)
    t15 = /* @__PURE__ */ jsx_dev_runtime287.jsxDEV(ThemedText, {
      children: [
        t11,
        agentsWorking,
        " ",
        t12,
        " ",
        t13,
        " \xB7 ",
        toolCalls,
        " tool",
        " ",
        t14
      ]
    }, void 0, !0, void 0, this), $3[33] = agentsWorking, $3[34] = t11, $3[35] = t12, $3[36] = t13, $3[37] = t14, $3[38] = toolCalls, $3[39] = t15;
  else
    t15 = $3[39];
  let t16;
  if ($3[40] !== lastToolCall)
    t16 = lastToolCall && /* @__PURE__ */ jsx_dev_runtime287.jsxDEV(ThemedText, {
      dimColor: !0,
      children: lastToolCall
    }, void 0, !1, void 0, this), $3[40] = lastToolCall, $3[41] = t16;
  else
    t16 = $3[41];
  let t17;
  if ($3[42] !== sessionUrl)
    t17 = /* @__PURE__ */ jsx_dev_runtime287.jsxDEV(ThemedText, {
      dimColor: !0,
      children: sessionUrl
    }, void 0, !1, void 0, this), $3[42] = sessionUrl, $3[43] = t17;
  else
    t17 = $3[43];
  let t18;
  if ($3[44] !== sessionUrl || $3[45] !== t17)
    t18 = /* @__PURE__ */ jsx_dev_runtime287.jsxDEV(Link, {
      url: sessionUrl,
      children: t17
    }, void 0, !1, void 0, this), $3[44] = sessionUrl, $3[45] = t17, $3[46] = t18;
  else
    t18 = $3[46];
  let t19;
  if ($3[47] === Symbol.for("react.memo_cache_sentinel"))
    t19 = {
      label: "Review in Claude Code on the web",
      value: "open"
    }, $3[47] = t19;
  else
    t19 = $3[47];
  let t20;
  if ($3[48] !== onKill || $3[49] !== running)
    t20 = onKill && running ? [{
      label: "Stop ultraplan",
      value: "stop"
    }] : [], $3[48] = onKill, $3[49] = running, $3[50] = t20;
  else
    t20 = $3[50];
  let t21;
  if ($3[51] === Symbol.for("react.memo_cache_sentinel"))
    t21 = {
      label: "Back",
      value: "back"
    }, $3[51] = t21;
  else
    t21 = $3[51];
  let t22;
  if ($3[52] !== t20)
    t22 = [t19, ...t20, t21], $3[52] = t20, $3[53] = t22;
  else
    t22 = $3[53];
  let t23;
  if ($3[54] !== goBackOrClose || $3[55] !== onDone || $3[56] !== sessionUrl)
    t23 = (v_0) => {
      switch (v_0) {
        case "open": {
          openBrowser(sessionUrl), onDone();
          return;
        }
        case "stop": {
          setConfirmingStop(!0);
          return;
        }
        case "back": {
          goBackOrClose();
          return;
        }
      }
    }, $3[54] = goBackOrClose, $3[55] = onDone, $3[56] = sessionUrl, $3[57] = t23;
  else
    t23 = $3[57];
  let t24;
  if ($3[58] !== t22 || $3[59] !== t23)
    t24 = /* @__PURE__ */ jsx_dev_runtime287.jsxDEV(Select, {
      options: t22,
      onChange: t23
    }, void 0, !1, void 0, this), $3[58] = t22, $3[59] = t23, $3[60] = t24;
  else
    t24 = $3[60];
  let t25;
  if ($3[61] !== t15 || $3[62] !== t16 || $3[63] !== t18 || $3[64] !== t24)
    t25 = /* @__PURE__ */ jsx_dev_runtime287.jsxDEV(ThemedBox_default, {
      flexDirection: "column",
      gap: 1,
      children: [
        t15,
        t16,
        t18,
        t24
      ]
    }, void 0, !0, void 0, this), $3[61] = t15, $3[62] = t16, $3[63] = t18, $3[64] = t24, $3[65] = t25;
  else
    t25 = $3[65];
  let t26;
  if ($3[66] !== goBackOrClose || $3[67] !== t10 || $3[68] !== t25)
    t26 = /* @__PURE__ */ jsx_dev_runtime287.jsxDEV(Dialog, {
      title: t10,
      onCancel: goBackOrClose,
      color: "background",
      children: t25
    }, void 0, !1, void 0, this), $3[66] = goBackOrClose, $3[67] = t10, $3[68] = t25, $3[69] = t26;
  else
    t26 = $3[69];
  return t26;
}
