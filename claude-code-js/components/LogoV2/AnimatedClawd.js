// Original: src/components/LogoV2/AnimatedClawd.tsx
function hold(pose, offset, frames) {
  return Array.from({
    length: frames
  }, () => ({
    pose,
    offset
  }));
}
function AnimatedClawd() {
  let $3 = import_compiler_runtime199.c(8), {
    pose,
    bounceOffset,
    onClick
  } = useClawdAnimation(), t0;
  if ($3[0] !== pose)
    t0 = /* @__PURE__ */ jsx_dev_runtime251.jsxDEV(Clawd, {
      pose
    }, void 0, !1, void 0, this), $3[0] = pose, $3[1] = t0;
  else
    t0 = $3[1];
  let t1;
  if ($3[2] !== bounceOffset || $3[3] !== t0)
    t1 = /* @__PURE__ */ jsx_dev_runtime251.jsxDEV(ThemedBox_default, {
      marginTop: bounceOffset,
      flexShrink: 0,
      children: t0
    }, void 0, !1, void 0, this), $3[2] = bounceOffset, $3[3] = t0, $3[4] = t1;
  else
    t1 = $3[4];
  let t2;
  if ($3[5] !== onClick || $3[6] !== t1)
    t2 = /* @__PURE__ */ jsx_dev_runtime251.jsxDEV(ThemedBox_default, {
      height: CLAWD_HEIGHT,
      flexDirection: "column",
      onClick,
      children: t1
    }, void 0, !1, void 0, this), $3[5] = onClick, $3[6] = t1, $3[7] = t2;
  else
    t2 = $3[7];
  return t2;
}
function useClawdAnimation() {
  let [reducedMotion] = import_react142.useState(() => getInitialSettings().prefersReducedMotion ?? !1), [frameIndex, setFrameIndex] = import_react142.useState(-1), sequenceRef = import_react142.useRef(JUMP_WAVE), onClick = () => {
    if (reducedMotion || frameIndex !== -1)
      return;
    sequenceRef.current = CLICK_ANIMATIONS[Math.floor(Math.random() * CLICK_ANIMATIONS.length)], setFrameIndex(0);
  };
  import_react142.useEffect(() => {
    if (frameIndex === -1)
      return;
    if (frameIndex >= sequenceRef.current.length) {
      setFrameIndex(-1);
      return;
    }
    let timer = setTimeout(setFrameIndex, FRAME_MS, incrementFrame);
    return () => clearTimeout(timer);
  }, [frameIndex]);
  let seq = sequenceRef.current, current = frameIndex >= 0 && frameIndex < seq.length ? seq[frameIndex] : IDLE;
  return {
    pose: current.pose,
    bounceOffset: current.offset,
    onClick
  };
}
var import_compiler_runtime199, import_react142, jsx_dev_runtime251, JUMP_WAVE, LOOK_AROUND, CLICK_ANIMATIONS, IDLE, FRAME_MS = 60, incrementFrame = (i5) => i5 + 1, CLAWD_HEIGHT = 3;
var init_AnimatedClawd = __esm(() => {
  init_ink2();
  init_settings2();
  init_Clawd();
  import_compiler_runtime199 = __toESM(require_react_compiler_runtime_development(), 1), import_react142 = __toESM(require_react_development(), 1), jsx_dev_runtime251 = __toESM(require_react_jsx_dev_runtime_development(), 1);
  JUMP_WAVE = [
    ...hold("default", 1, 2),
    ...hold("arms-up", 0, 3),
    ...hold("default", 0, 1),
    ...hold("default", 1, 2),
    ...hold("arms-up", 0, 3),
    ...hold("default", 0, 1)
  ], LOOK_AROUND = [...hold("look-right", 0, 5), ...hold("look-left", 0, 5), ...hold("default", 0, 1)], CLICK_ANIMATIONS = [JUMP_WAVE, LOOK_AROUND], IDLE = {
    pose: "default",
    offset: 0
  };
});
