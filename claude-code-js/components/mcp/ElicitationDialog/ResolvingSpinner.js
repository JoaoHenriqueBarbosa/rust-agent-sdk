// function: ResolvingSpinner
function ResolvingSpinner() {
  let $3 = import_compiler_runtime312.c(4), [frame, setFrame] = import_react220.useState(0), t0, t1;
  if ($3[0] === Symbol.for("react.memo_cache_sentinel"))
    t0 = () => {
      let timer = setInterval(setFrame, 80, advanceSpinnerFrame);
      return () => clearInterval(timer);
    }, t1 = [], $3[0] = t0, $3[1] = t1;
  else
    t0 = $3[0], t1 = $3[1];
  import_react220.useEffect(t0, t1);
  let t2 = RESOLVING_SPINNER_CHARS[frame], t3;
  if ($3[2] !== t2)
    t3 = /* @__PURE__ */ jsx_dev_runtime401.jsxDEV(ThemedText, {
      color: "warning",
      children: t2
    }, void 0, !1, void 0, this), $3[2] = t2, $3[3] = t3;
  else
    t3 = $3[3];
  return t3;
}
