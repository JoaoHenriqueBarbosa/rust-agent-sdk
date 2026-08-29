// function: Stats
function Stats(t0) {
  let $3 = import_compiler_runtime278.c(4), {
    onClose
  } = t0, t1;
  if ($3[0] === Symbol.for("react.memo_cache_sentinel"))
    t1 = createAllTimeStatsPromise(), $3[0] = t1;
  else
    t1 = $3[0];
  let allTimePromise = t1, t2;
  if ($3[1] === Symbol.for("react.memo_cache_sentinel"))
    t2 = /* @__PURE__ */ jsx_dev_runtime359.jsxDEV(ThemedBox_default, {
      marginTop: 1,
      children: [
        /* @__PURE__ */ jsx_dev_runtime359.jsxDEV(Spinner, {}, void 0, !1, void 0, this),
        /* @__PURE__ */ jsx_dev_runtime359.jsxDEV(ThemedText, {
          children: " Loading your Claude Code stats\u2026"
        }, void 0, !1, void 0, this)
      ]
    }, void 0, !0, void 0, this), $3[1] = t2;
  else
    t2 = $3[1];
  let t3;
  if ($3[2] !== onClose)
    t3 = /* @__PURE__ */ jsx_dev_runtime359.jsxDEV(import_react192.Suspense, {
      fallback: t2,
      children: /* @__PURE__ */ jsx_dev_runtime359.jsxDEV(StatsContent, {
        allTimePromise,
        onClose
      }, void 0, !1, void 0, this)
    }, void 0, !1, void 0, this), $3[2] = onClose, $3[3] = t3;
  else
    t3 = $3[3];
  return t3;
}
