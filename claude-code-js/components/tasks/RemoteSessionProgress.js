// Original: src/components/tasks/RemoteSessionProgress.tsx
function formatReviewStageCounts(stage, found, verified, refuted) {
  if (!stage)
    return `${found} found \xB7 ${verified} verified`;
  if (stage === "synthesizing") {
    let parts = [`${verified} verified`];
    if (refuted > 0)
      parts.push(`${refuted} refuted`);
    return parts.push("deduping"), parts.join(" \xB7 ");
  }
  if (stage === "verifying") {
    let parts = [`${found} found`, `${verified} verified`];
    if (refuted > 0)
      parts.push(`${refuted} refuted`);
    return parts.join(" \xB7 ");
  }
  return found > 0 ? `${found} found` : "finding";
}
function RainbowText(t0) {
  let $3 = import_compiler_runtime222.c(5), {
    text: text2,
    phase: t1
  } = t0, phase = t1 === void 0 ? 0 : t1, t2;
  if ($3[0] !== text2)
    t2 = [...text2], $3[0] = text2, $3[1] = t2;
  else
    t2 = $3[1];
  let t3;
  if ($3[2] !== phase || $3[3] !== t2)
    t3 = /* @__PURE__ */ jsx_dev_runtime282.jsxDEV(jsx_dev_runtime282.Fragment, {
      children: t2.map((ch2, i5) => /* @__PURE__ */ jsx_dev_runtime282.jsxDEV(ThemedText, {
        color: getRainbowColor(i5 + phase),
        children: ch2
      }, i5, !1, void 0, this))
    }, void 0, !1, void 0, this), $3[2] = phase, $3[3] = t2, $3[4] = t3;
  else
    t3 = $3[4];
  return t3;
}
function useSmoothCount(target, time3, snap) {
  let displayed = import_react162.useRef(target), lastTick = import_react162.useRef(time3);
  if (snap || target < displayed.current)
    displayed.current = target;
  else if (target > displayed.current && time3 !== lastTick.current)
    displayed.current += 1, lastTick.current = time3;
  return displayed.current;
}
function ReviewRainbowLine(t0) {
  let $3 = import_compiler_runtime222.c(15), {
    session: session2
  } = t0, reducedMotion = useSettings().prefersReducedMotion ?? !1, p4 = session2.reviewProgress, running = session2.status === "running", [, time3] = useAnimationFrame(running && !reducedMotion ? TICK_MS : null), targetFound = p4?.bugsFound ?? 0, targetVerified = p4?.bugsVerified ?? 0, targetRefuted = p4?.bugsRefuted ?? 0, snap = reducedMotion || !running, found = useSmoothCount(targetFound, time3, snap), verified = useSmoothCount(targetVerified, time3, snap), refuted = useSmoothCount(targetRefuted, time3, snap), phase = Math.floor(time3 / (TICK_MS * 3)) % 7;
  if (session2.status === "completed") {
    let t12;
    if ($3[0] === Symbol.for("react.memo_cache_sentinel"))
      t12 = /* @__PURE__ */ jsx_dev_runtime282.jsxDEV(jsx_dev_runtime282.Fragment, {
        children: [
          /* @__PURE__ */ jsx_dev_runtime282.jsxDEV(ThemedText, {
            color: "background",
            children: [
              DIAMOND_FILLED,
              " "
            ]
          }, void 0, !0, void 0, this),
          /* @__PURE__ */ jsx_dev_runtime282.jsxDEV(RainbowText, {
            text: "ultrareview",
            phase: 0
          }, void 0, !1, void 0, this),
          /* @__PURE__ */ jsx_dev_runtime282.jsxDEV(ThemedText, {
            dimColor: !0,
            children: " ready \xB7 shift+\u2193 to view"
          }, void 0, !1, void 0, this)
        ]
      }, void 0, !0, void 0, this), $3[0] = t12;
    else
      t12 = $3[0];
    return t12;
  }
  if (session2.status === "failed") {
    let t12;
    if ($3[1] === Symbol.for("react.memo_cache_sentinel"))
      t12 = /* @__PURE__ */ jsx_dev_runtime282.jsxDEV(jsx_dev_runtime282.Fragment, {
        children: [
          /* @__PURE__ */ jsx_dev_runtime282.jsxDEV(ThemedText, {
            color: "background",
            children: [
              DIAMOND_FILLED,
              " "
            ]
          }, void 0, !0, void 0, this),
          /* @__PURE__ */ jsx_dev_runtime282.jsxDEV(RainbowText, {
            text: "ultrareview",
            phase: 0
          }, void 0, !1, void 0, this),
          /* @__PURE__ */ jsx_dev_runtime282.jsxDEV(ThemedText, {
            color: "error",
            dimColor: !0,
            children: [
              " \xB7 ",
              "error"
            ]
          }, void 0, !0, void 0, this)
        ]
      }, void 0, !0, void 0, this), $3[1] = t12;
    else
      t12 = $3[1];
    return t12;
  }
  let t1;
  if ($3[2] !== found || $3[3] !== p4 || $3[4] !== refuted || $3[5] !== verified)
    t1 = !p4 ? "setting up" : formatReviewStageCounts(p4.stage, found, verified, refuted), $3[2] = found, $3[3] = p4, $3[4] = refuted, $3[5] = verified, $3[6] = t1;
  else
    t1 = $3[6];
  let tail = t1, t2;
  if ($3[7] === Symbol.for("react.memo_cache_sentinel"))
    t2 = /* @__PURE__ */ jsx_dev_runtime282.jsxDEV(ThemedText, {
      color: "background",
      children: [
        DIAMOND_OPEN,
        " "
      ]
    }, void 0, !0, void 0, this), $3[7] = t2;
  else
    t2 = $3[7];
  let t3 = running ? phase : 0, t4;
  if ($3[8] !== t3)
    t4 = /* @__PURE__ */ jsx_dev_runtime282.jsxDEV(RainbowText, {
      text: "ultrareview",
      phase: t3
    }, void 0, !1, void 0, this), $3[8] = t3, $3[9] = t4;
  else
    t4 = $3[9];
  let t5;
  if ($3[10] !== tail)
    t5 = /* @__PURE__ */ jsx_dev_runtime282.jsxDEV(ThemedText, {
      dimColor: !0,
      children: [
        " \xB7 ",
        tail
      ]
    }, void 0, !0, void 0, this), $3[10] = tail, $3[11] = t5;
  else
    t5 = $3[11];
  let t6;
  if ($3[12] !== t4 || $3[13] !== t5)
    t6 = /* @__PURE__ */ jsx_dev_runtime282.jsxDEV(jsx_dev_runtime282.Fragment, {
      children: [
        t2,
        t4,
        t5
      ]
    }, void 0, !0, void 0, this), $3[12] = t4, $3[13] = t5, $3[14] = t6;
  else
    t6 = $3[14];
  return t6;
}
function RemoteSessionProgress(t0) {
  let $3 = import_compiler_runtime222.c(11), {
    session: session2
  } = t0;
  if (session2.isRemoteReview) {
    let t12;
    if ($3[0] !== session2)
      t12 = /* @__PURE__ */ jsx_dev_runtime282.jsxDEV(ReviewRainbowLine, {
        session: session2
      }, void 0, !1, void 0, this), $3[0] = session2, $3[1] = t12;
    else
      t12 = $3[1];
    return t12;
  }
  if (session2.status === "completed") {
    let t12;
    if ($3[2] === Symbol.for("react.memo_cache_sentinel"))
      t12 = /* @__PURE__ */ jsx_dev_runtime282.jsxDEV(ThemedText, {
        bold: !0,
        color: "success",
        dimColor: !0,
        children: "done"
      }, void 0, !1, void 0, this), $3[2] = t12;
    else
      t12 = $3[2];
    return t12;
  }
  if (session2.status === "failed") {
    let t12;
    if ($3[3] === Symbol.for("react.memo_cache_sentinel"))
      t12 = /* @__PURE__ */ jsx_dev_runtime282.jsxDEV(ThemedText, {
        bold: !0,
        color: "error",
        dimColor: !0,
        children: "error"
      }, void 0, !1, void 0, this), $3[3] = t12;
    else
      t12 = $3[3];
    return t12;
  }
  if (!session2.todoList.length) {
    let t12;
    if ($3[4] !== session2.status)
      t12 = /* @__PURE__ */ jsx_dev_runtime282.jsxDEV(ThemedText, {
        dimColor: !0,
        children: [
          session2.status,
          "\u2026"
        ]
      }, void 0, !0, void 0, this), $3[4] = session2.status, $3[5] = t12;
    else
      t12 = $3[5];
    return t12;
  }
  let t1;
  if ($3[6] !== session2.todoList)
    t1 = count2(session2.todoList, _temp136), $3[6] = session2.todoList, $3[7] = t1;
  else
    t1 = $3[7];
  let completed = t1, total = session2.todoList.length, t2;
  if ($3[8] !== completed || $3[9] !== total)
    t2 = /* @__PURE__ */ jsx_dev_runtime282.jsxDEV(ThemedText, {
      dimColor: !0,
      children: [
        completed,
        "/",
        total
      ]
    }, void 0, !0, void 0, this), $3[8] = completed, $3[9] = total, $3[10] = t2;
  else
    t2 = $3[10];
  return t2;
}
function _temp136(_) {
  return _.status === "completed";
}
var import_compiler_runtime222, import_react162, jsx_dev_runtime282, TICK_MS = 80;
var init_RemoteSessionProgress = __esm(() => {
  init_figures2();
  init_useSettings();
  init_ink2();
  init_thinking();
  import_compiler_runtime222 = __toESM(require_react_compiler_runtime_development(), 1), import_react162 = __toESM(require_react_development(), 1), jsx_dev_runtime282 = __toESM(require_react_jsx_dev_runtime_development(), 1);
});
