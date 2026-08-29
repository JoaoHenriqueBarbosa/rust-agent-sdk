// Original: src/components/Spinner/SpinnerGlyph.tsx
function SpinnerGlyph(t0) {
  let $3 = import_compiler_runtime58.c(9), {
    frame,
    messageColor,
    stalledIntensity: t1,
    reducedMotion: t2,
    time: t3
  } = t0, stalledIntensity = t1 === void 0 ? 0 : t1, reducedMotion = t2 === void 0 ? !1 : t2, time3 = t3 === void 0 ? 0 : t3, [themeName] = useTheme(), theme = getTheme(themeName);
  if (reducedMotion) {
    let isDim = Math.floor(time3 / (REDUCED_MOTION_CYCLE_MS / 2)) % 2 === 1, t42;
    if ($3[0] !== isDim || $3[1] !== messageColor)
      t42 = /* @__PURE__ */ jsx_dev_runtime66.jsxDEV(ThemedBox_default, {
        flexWrap: "wrap",
        height: 1,
        width: 2,
        children: /* @__PURE__ */ jsx_dev_runtime66.jsxDEV(ThemedText, {
          color: messageColor,
          dimColor: isDim,
          children: REDUCED_MOTION_DOT
        }, void 0, !1, void 0, this)
      }, void 0, !1, void 0, this), $3[0] = isDim, $3[1] = messageColor, $3[2] = t42;
    else
      t42 = $3[2];
    return t42;
  }
  let spinnerChar = SPINNER_FRAMES[frame % SPINNER_FRAMES.length];
  if (stalledIntensity > 0) {
    let baseColorStr = theme[messageColor], baseRGB = baseColorStr ? parseRGB(baseColorStr) : null;
    if (baseRGB) {
      let interpolated = interpolateColor(baseRGB, ERROR_RED2, stalledIntensity);
      return /* @__PURE__ */ jsx_dev_runtime66.jsxDEV(ThemedBox_default, {
        flexWrap: "wrap",
        height: 1,
        width: 2,
        children: /* @__PURE__ */ jsx_dev_runtime66.jsxDEV(ThemedText, {
          color: toRGBColor(interpolated),
          children: spinnerChar
        }, void 0, !1, void 0, this)
      }, void 0, !1, void 0, this);
    }
    let color2 = stalledIntensity > 0.5 ? "error" : messageColor, t42;
    if ($3[3] !== color2 || $3[4] !== spinnerChar)
      t42 = /* @__PURE__ */ jsx_dev_runtime66.jsxDEV(ThemedBox_default, {
        flexWrap: "wrap",
        height: 1,
        width: 2,
        children: /* @__PURE__ */ jsx_dev_runtime66.jsxDEV(ThemedText, {
          color: color2,
          children: spinnerChar
        }, void 0, !1, void 0, this)
      }, void 0, !1, void 0, this), $3[3] = color2, $3[4] = spinnerChar, $3[5] = t42;
    else
      t42 = $3[5];
    return t42;
  }
  let t4;
  if ($3[6] !== messageColor || $3[7] !== spinnerChar)
    t4 = /* @__PURE__ */ jsx_dev_runtime66.jsxDEV(ThemedBox_default, {
      flexWrap: "wrap",
      height: 1,
      width: 2,
      children: /* @__PURE__ */ jsx_dev_runtime66.jsxDEV(ThemedText, {
        color: messageColor,
        children: spinnerChar
      }, void 0, !1, void 0, this)
    }, void 0, !1, void 0, this), $3[6] = messageColor, $3[7] = spinnerChar, $3[8] = t4;
  else
    t4 = $3[8];
  return t4;
}
var import_compiler_runtime58, jsx_dev_runtime66, DEFAULT_CHARACTERS, SPINNER_FRAMES, REDUCED_MOTION_DOT = "\u25CF", REDUCED_MOTION_CYCLE_MS = 2000, ERROR_RED2;
var init_SpinnerGlyph = __esm(() => {
  init_ink2();
  init_theme();
  init_utils10();
  import_compiler_runtime58 = __toESM(require_react_compiler_runtime_development(), 1), jsx_dev_runtime66 = __toESM(require_react_jsx_dev_runtime_development(), 1), DEFAULT_CHARACTERS = getDefaultCharacters(), SPINNER_FRAMES = [...DEFAULT_CHARACTERS, ...[...DEFAULT_CHARACTERS].reverse()], ERROR_RED2 = {
    r: 171,
    g: 43,
    b: 63
  };
});
