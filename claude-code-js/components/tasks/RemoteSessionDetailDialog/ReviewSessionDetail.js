// function: ReviewSessionDetail
function ReviewSessionDetail(t0) {
  let $3 = import_compiler_runtime227.c(56), {
    session: session2,
    onDone,
    onBack,
    onKill
  } = t0, completed = session2.status === "completed", running = session2.status === "running" || session2.status === "pending", [confirmingStop, setConfirmingStop] = import_react163.useState(!1), elapsedTime = useElapsedTime(session2.startTime, running, 1000, 0, session2.endTime), t1;
  if ($3[0] !== onDone)
    t1 = () => onDone("Remote session details dismissed", {
      display: "system"
    }), $3[0] = onDone, $3[1] = t1;
  else
    t1 = $3[1];
  let handleClose = t1, goBackOrClose = onBack ?? handleClose, t2;
  if ($3[2] !== session2.sessionId)
    t2 = getRemoteTaskSessionUrl(session2.sessionId), $3[2] = session2.sessionId, $3[3] = t2;
  else
    t2 = $3[3];
  let sessionUrl = t2, statusLabel = completed ? "ready" : running ? "running" : session2.status;
  if (confirmingStop) {
    let t32;
    if ($3[4] === Symbol.for("react.memo_cache_sentinel"))
      t32 = () => setConfirmingStop(!1), $3[4] = t32;
    else
      t32 = $3[4];
    let t42;
    if ($3[5] === Symbol.for("react.memo_cache_sentinel"))
      t42 = /* @__PURE__ */ jsx_dev_runtime287.jsxDEV(ThemedText, {
        dimColor: !0,
        children: "This archives the remote session and stops local tracking. The review will not complete and any findings so far are discarded."
      }, void 0, !1, void 0, this), $3[5] = t42;
    else
      t42 = $3[5];
    let t52;
    if ($3[6] === Symbol.for("react.memo_cache_sentinel"))
      t52 = {
        label: "Stop ultrareview",
        value: "stop"
      }, $3[6] = t52;
    else
      t52 = $3[6];
    let t62;
    if ($3[7] === Symbol.for("react.memo_cache_sentinel"))
      t62 = [t52, {
        label: "Back",
        value: "back"
      }], $3[7] = t62;
    else
      t62 = $3[7];
    let t72;
    if ($3[8] !== goBackOrClose || $3[9] !== onKill)
      t72 = /* @__PURE__ */ jsx_dev_runtime287.jsxDEV(Dialog, {
        title: "Stop ultrareview?",
        onCancel: t32,
        color: "background",
        children: /* @__PURE__ */ jsx_dev_runtime287.jsxDEV(ThemedBox_default, {
          flexDirection: "column",
          gap: 1,
          children: [
            t42,
            /* @__PURE__ */ jsx_dev_runtime287.jsxDEV(Select, {
              options: t62,
              onChange: (v2) => {
                if (v2 === "stop")
                  onKill?.(), goBackOrClose();
                else
                  setConfirmingStop(!1);
              }
            }, void 0, !1, void 0, this)
          ]
        }, void 0, !0, void 0, this)
      }, void 0, !1, void 0, this), $3[8] = goBackOrClose, $3[9] = onKill, $3[10] = t72;
    else
      t72 = $3[10];
    return t72;
  }
  let t3;
  if ($3[11] !== completed || $3[12] !== onKill || $3[13] !== running)
    t3 = completed ? [{
      label: "Open in Claude Code on the web",
      value: "open"
    }, {
      label: "Dismiss",
      value: "dismiss"
    }] : [{
      label: "Open in Claude Code on the web",
      value: "open"
    }, ...onKill && running ? [{
      label: "Stop ultrareview",
      value: "stop"
    }] : [], {
      label: "Back",
      value: "back"
    }], $3[11] = completed, $3[12] = onKill, $3[13] = running, $3[14] = t3;
  else
    t3 = $3[14];
  let options2 = t3, t4;
  if ($3[15] !== goBackOrClose || $3[16] !== handleClose || $3[17] !== onDone || $3[18] !== sessionUrl)
    t4 = (action2) => {
      bb45:
        switch (action2) {
          case "open": {
            openBrowser(sessionUrl), onDone();
            break bb45;
          }
          case "stop": {
            setConfirmingStop(!0);
            break bb45;
          }
          case "back": {
            goBackOrClose();
            break bb45;
          }
          case "dismiss":
            handleClose();
        }
    }, $3[15] = goBackOrClose, $3[16] = handleClose, $3[17] = onDone, $3[18] = sessionUrl, $3[19] = t4;
  else
    t4 = $3[19];
  let handleSelect = t4, t5 = completed ? DIAMOND_FILLED : DIAMOND_OPEN, t6;
  if ($3[20] !== t5)
    t6 = /* @__PURE__ */ jsx_dev_runtime287.jsxDEV(ThemedText, {
      color: "background",
      children: [
        t5,
        " "
      ]
    }, void 0, !0, void 0, this), $3[20] = t5, $3[21] = t6;
  else
    t6 = $3[21];
  let t7;
  if ($3[22] === Symbol.for("react.memo_cache_sentinel"))
    t7 = /* @__PURE__ */ jsx_dev_runtime287.jsxDEV(ThemedText, {
      bold: !0,
      children: "ultrareview"
    }, void 0, !1, void 0, this), $3[22] = t7;
  else
    t7 = $3[22];
  let t8;
  if ($3[23] !== elapsedTime || $3[24] !== statusLabel)
    t8 = /* @__PURE__ */ jsx_dev_runtime287.jsxDEV(ThemedText, {
      dimColor: !0,
      children: [
        " \xB7 ",
        elapsedTime,
        " \xB7 ",
        statusLabel
      ]
    }, void 0, !0, void 0, this), $3[23] = elapsedTime, $3[24] = statusLabel, $3[25] = t8;
  else
    t8 = $3[25];
  let t9;
  if ($3[26] !== t6 || $3[27] !== t8)
    t9 = /* @__PURE__ */ jsx_dev_runtime287.jsxDEV(ThemedText, {
      children: [
        t6,
        t7,
        t8
      ]
    }, void 0, !0, void 0, this), $3[26] = t6, $3[27] = t8, $3[28] = t9;
  else
    t9 = $3[28];
  let t10 = session2.reviewProgress?.stage, t11 = !!session2.reviewProgress, t12;
  if ($3[29] !== completed || $3[30] !== t10 || $3[31] !== t11)
    t12 = /* @__PURE__ */ jsx_dev_runtime287.jsxDEV(StagePipeline, {
      stage: t10,
      completed,
      hasProgress: t11
    }, void 0, !1, void 0, this), $3[29] = completed, $3[30] = t10, $3[31] = t11, $3[32] = t12;
  else
    t12 = $3[32];
  let t13;
  if ($3[33] !== session2)
    t13 = reviewCountsLine(session2), $3[33] = session2, $3[34] = t13;
  else
    t13 = $3[34];
  let t14;
  if ($3[35] !== t13)
    t14 = /* @__PURE__ */ jsx_dev_runtime287.jsxDEV(ThemedText, {
      children: t13
    }, void 0, !1, void 0, this), $3[35] = t13, $3[36] = t14;
  else
    t14 = $3[36];
  let t15;
  if ($3[37] !== sessionUrl)
    t15 = /* @__PURE__ */ jsx_dev_runtime287.jsxDEV(ThemedText, {
      dimColor: !0,
      children: sessionUrl
    }, void 0, !1, void 0, this), $3[37] = sessionUrl, $3[38] = t15;
  else
    t15 = $3[38];
  let t16;
  if ($3[39] !== sessionUrl || $3[40] !== t15)
    t16 = /* @__PURE__ */ jsx_dev_runtime287.jsxDEV(Link, {
      url: sessionUrl,
      children: t15
    }, void 0, !1, void 0, this), $3[39] = sessionUrl, $3[40] = t15, $3[41] = t16;
  else
    t16 = $3[41];
  let t17;
  if ($3[42] !== t14 || $3[43] !== t16)
    t17 = /* @__PURE__ */ jsx_dev_runtime287.jsxDEV(ThemedBox_default, {
      flexDirection: "column",
      children: [
        t14,
        t16
      ]
    }, void 0, !0, void 0, this), $3[42] = t14, $3[43] = t16, $3[44] = t17;
  else
    t17 = $3[44];
  let t18;
  if ($3[45] !== handleSelect || $3[46] !== options2)
    t18 = /* @__PURE__ */ jsx_dev_runtime287.jsxDEV(Select, {
      options: options2,
      onChange: handleSelect
    }, void 0, !1, void 0, this), $3[45] = handleSelect, $3[46] = options2, $3[47] = t18;
  else
    t18 = $3[47];
  let t19;
  if ($3[48] !== t12 || $3[49] !== t17 || $3[50] !== t18)
    t19 = /* @__PURE__ */ jsx_dev_runtime287.jsxDEV(ThemedBox_default, {
      flexDirection: "column",
      gap: 1,
      children: [
        t12,
        t17,
        t18
      ]
    }, void 0, !0, void 0, this), $3[48] = t12, $3[49] = t17, $3[50] = t18, $3[51] = t19;
  else
    t19 = $3[51];
  let t20;
  if ($3[52] !== goBackOrClose || $3[53] !== t19 || $3[54] !== t9)
    t20 = /* @__PURE__ */ jsx_dev_runtime287.jsxDEV(Dialog, {
      title: t9,
      onCancel: goBackOrClose,
      color: "background",
      inputGuide: _temp138,
      children: t19
    }, void 0, !1, void 0, this), $3[52] = goBackOrClose, $3[53] = t19, $3[54] = t9, $3[55] = t20;
  else
    t20 = $3[55];
  return t20;
}
