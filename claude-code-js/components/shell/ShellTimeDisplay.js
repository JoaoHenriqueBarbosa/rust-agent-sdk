// Original: src/components/shell/ShellTimeDisplay.tsx
function ShellTimeDisplay(t0) {
  let $3 = import_compiler_runtime71.c(10), {
    elapsedTimeSeconds,
    timeoutMs
  } = t0;
  if (elapsedTimeSeconds === void 0 && !timeoutMs)
    return null;
  let t1;
  if ($3[0] !== timeoutMs)
    t1 = timeoutMs ? formatDuration(timeoutMs, {
      hideTrailingZeros: !0
    }) : void 0, $3[0] = timeoutMs, $3[1] = t1;
  else
    t1 = $3[1];
  let timeout = t1;
  if (elapsedTimeSeconds === void 0) {
    let t22 = `(timeout ${timeout})`, t32;
    if ($3[2] !== t22)
      t32 = /* @__PURE__ */ jsx_dev_runtime81.jsxDEV(ThemedText, {
        dimColor: !0,
        children: t22
      }, void 0, !1, void 0, this), $3[2] = t22, $3[3] = t32;
    else
      t32 = $3[3];
    return t32;
  }
  let t2 = elapsedTimeSeconds * 1000, t3;
  if ($3[4] !== t2)
    t3 = formatDuration(t2), $3[4] = t2, $3[5] = t3;
  else
    t3 = $3[5];
  let elapsed = t3;
  if (timeout) {
    let t42 = `(${elapsed} \xB7 timeout ${timeout})`, t52;
    if ($3[6] !== t42)
      t52 = /* @__PURE__ */ jsx_dev_runtime81.jsxDEV(ThemedText, {
        dimColor: !0,
        children: t42
      }, void 0, !1, void 0, this), $3[6] = t42, $3[7] = t52;
    else
      t52 = $3[7];
    return t52;
  }
  let t4 = `(${elapsed})`, t5;
  if ($3[8] !== t4)
    t5 = /* @__PURE__ */ jsx_dev_runtime81.jsxDEV(ThemedText, {
      dimColor: !0,
      children: t4
    }, void 0, !1, void 0, this), $3[8] = t4, $3[9] = t5;
  else
    t5 = $3[9];
  return t5;
}
var import_compiler_runtime71, jsx_dev_runtime81;
var init_ShellTimeDisplay = __esm(() => {
  init_ink2();
  init_format();
  import_compiler_runtime71 = __toESM(require_react_compiler_runtime_development(), 1), jsx_dev_runtime81 = __toESM(require_react_jsx_dev_runtime_development(), 1);
});
