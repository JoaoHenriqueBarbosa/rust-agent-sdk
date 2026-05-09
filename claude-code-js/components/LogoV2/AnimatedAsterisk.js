// Original: src/components/LogoV2/AnimatedAsterisk.tsx
function AnimatedAsterisk({
  char = TEARDROP_ASTERISK
}) {
  let [reducedMotion] = import_react146.useState(() => getInitialSettings().prefersReducedMotion ?? !1), [done, setDone] = import_react146.useState(reducedMotion), startTimeRef = import_react146.useRef(null), [ref, time3] = useAnimationFrame(done ? null : 50);
  if (import_react146.useEffect(() => {
    if (done)
      return;
    let t2 = setTimeout(setDone, TOTAL_ANIMATION_MS, !0);
    return () => clearTimeout(t2);
  }, [done]), done)
    return /* @__PURE__ */ jsx_dev_runtime255.jsxDEV(ThemedBox_default, {
      ref,
      children: /* @__PURE__ */ jsx_dev_runtime255.jsxDEV(ThemedText, {
        color: SETTLED_GREY,
        children: char
      }, void 0, !1, void 0, this)
    }, void 0, !1, void 0, this);
  if (startTimeRef.current === null)
    startTimeRef.current = time3;
  let hue = (time3 - startTimeRef.current) / SWEEP_DURATION_MS * 360 % 360;
  return /* @__PURE__ */ jsx_dev_runtime255.jsxDEV(ThemedBox_default, {
    ref,
    children: /* @__PURE__ */ jsx_dev_runtime255.jsxDEV(ThemedText, {
      color: toRGBColor(hueToRgb(hue)),
      children: char
    }, void 0, !1, void 0, this)
  }, void 0, !1, void 0, this);
}
var import_react146, jsx_dev_runtime255, SWEEP_DURATION_MS = 1500, SWEEP_COUNT = 2, TOTAL_ANIMATION_MS, SETTLED_GREY;
var init_AnimatedAsterisk = __esm(() => {
  init_figures2();
  init_ink2();
  init_settings2();
  init_utils10();
  import_react146 = __toESM(require_react_development(), 1), jsx_dev_runtime255 = __toESM(require_react_jsx_dev_runtime_development(), 1), TOTAL_ANIMATION_MS = SWEEP_DURATION_MS * SWEEP_COUNT, SETTLED_GREY = toRGBColor({
    r: 153,
    g: 153,
    b: 153
  });
});
