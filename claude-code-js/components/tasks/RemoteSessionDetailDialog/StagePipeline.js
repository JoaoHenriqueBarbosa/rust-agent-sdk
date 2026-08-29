// function: StagePipeline
function StagePipeline(t0) {
  let $3 = import_compiler_runtime227.c(15), {
    stage,
    completed,
    hasProgress
  } = t0, t1;
  if ($3[0] !== stage)
    t1 = stage ? STAGES.indexOf(stage) : -1, $3[0] = stage, $3[1] = t1;
  else
    t1 = $3[1];
  let currentIdx = t1, inSetup = !completed && !hasProgress, t2;
  if ($3[2] !== inSetup)
    t2 = inSetup ? /* @__PURE__ */ jsx_dev_runtime287.jsxDEV(ThemedText, {
      color: "background",
      children: "Setup"
    }, void 0, !1, void 0, this) : /* @__PURE__ */ jsx_dev_runtime287.jsxDEV(ThemedText, {
      dimColor: !0,
      children: "Setup"
    }, void 0, !1, void 0, this), $3[2] = inSetup, $3[3] = t2;
  else
    t2 = $3[3];
  let t3;
  if ($3[4] === Symbol.for("react.memo_cache_sentinel"))
    t3 = /* @__PURE__ */ jsx_dev_runtime287.jsxDEV(ThemedText, {
      dimColor: !0,
      children: " \u2192 "
    }, void 0, !1, void 0, this), $3[4] = t3;
  else
    t3 = $3[4];
  let t4;
  if ($3[5] !== completed || $3[6] !== currentIdx || $3[7] !== inSetup)
    t4 = STAGES.map((s2, i5) => {
      let isCurrent = !completed && !inSetup && i5 === currentIdx;
      return /* @__PURE__ */ jsx_dev_runtime287.jsxDEV(import_react163.default.Fragment, {
        children: [
          i5 > 0 && /* @__PURE__ */ jsx_dev_runtime287.jsxDEV(ThemedText, {
            dimColor: !0,
            children: " \u2192 "
          }, void 0, !1, void 0, this),
          isCurrent ? /* @__PURE__ */ jsx_dev_runtime287.jsxDEV(ThemedText, {
            color: "background",
            children: STAGE_LABELS[s2]
          }, void 0, !1, void 0, this) : /* @__PURE__ */ jsx_dev_runtime287.jsxDEV(ThemedText, {
            dimColor: !0,
            children: STAGE_LABELS[s2]
          }, void 0, !1, void 0, this)
        ]
      }, s2, !0, void 0, this);
    }), $3[5] = completed, $3[6] = currentIdx, $3[7] = inSetup, $3[8] = t4;
  else
    t4 = $3[8];
  let t5;
  if ($3[9] !== completed)
    t5 = completed && /* @__PURE__ */ jsx_dev_runtime287.jsxDEV(ThemedText, {
      color: "success",
      children: " \u2713"
    }, void 0, !1, void 0, this), $3[9] = completed, $3[10] = t5;
  else
    t5 = $3[10];
  let t6;
  if ($3[11] !== t2 || $3[12] !== t4 || $3[13] !== t5)
    t6 = /* @__PURE__ */ jsx_dev_runtime287.jsxDEV(ThemedText, {
      children: [
        t2,
        t3,
        t4,
        t5
      ]
    }, void 0, !0, void 0, this), $3[11] = t2, $3[12] = t4, $3[13] = t5, $3[14] = t6;
  else
    t6 = $3[14];
  return t6;
}
