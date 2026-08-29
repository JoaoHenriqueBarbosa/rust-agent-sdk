// Original: src/components/Spinner/GlimmerMessage.tsx
function GlimmerMessage(t0) {
  let $3 = import_compiler_runtime56.c(75), {
    message,
    mode,
    messageColor,
    glimmerIndex,
    flashOpacity,
    shimmerColor,
    stalledIntensity: t1
  } = t0, stalledIntensity = t1 === void 0 ? 0 : t1, [themeName] = useTheme(), messageWidth, segments, t2;
  if ($3[0] !== flashOpacity || $3[1] !== message || $3[2] !== messageColor || $3[3] !== mode || $3[4] !== shimmerColor || $3[5] !== stalledIntensity || $3[6] !== themeName) {
    t2 = Symbol.for("react.early_return_sentinel");
    bb0: {
      let theme = getTheme(themeName), segs;
      if ($3[10] !== message) {
        segs = [];
        for (let {
          segment
        } of getGraphemeSegmenter().segment(message))
          segs.push({
            segment,
            width: stringWidth(segment)
          });
        $3[10] = message, $3[11] = segs;
      } else
        segs = $3[11];
      let t32;
      if ($3[12] !== message)
        t32 = stringWidth(message), $3[12] = message, $3[13] = t32;
      else
        t32 = $3[13];
      let t42;
      if ($3[14] !== segs || $3[15] !== t32)
        t42 = {
          segments: segs,
          messageWidth: t32
        }, $3[14] = segs, $3[15] = t32, $3[16] = t42;
      else
        t42 = $3[16];
      if ({
        segments,
        messageWidth
      } = t42, !message) {
        t2 = null;
        break bb0;
      }
      if (stalledIntensity > 0) {
        let baseColorStr = theme[messageColor], baseRGB = baseColorStr ? parseRGB(baseColorStr) : null;
        if (baseRGB) {
          let interpolated = interpolateColor(baseRGB, ERROR_RED, stalledIntensity), color2 = toRGBColor(interpolated), t53;
          if ($3[17] !== color2)
            t53 = /* @__PURE__ */ jsx_dev_runtime64.jsxDEV(ThemedText, {
              color: color2,
              children: " "
            }, void 0, !1, void 0, this), $3[17] = color2, $3[18] = t53;
          else
            t53 = $3[18];
          t2 = /* @__PURE__ */ jsx_dev_runtime64.jsxDEV(jsx_dev_runtime64.Fragment, {
            children: [
              /* @__PURE__ */ jsx_dev_runtime64.jsxDEV(ThemedText, {
                color: color2,
                children: message
              }, void 0, !1, void 0, this),
              t53
            ]
          }, void 0, !0, void 0, this);
          break bb0;
        }
        let color_0 = stalledIntensity > 0.5 ? "error" : messageColor, t52;
        if ($3[19] !== color_0 || $3[20] !== message)
          t52 = /* @__PURE__ */ jsx_dev_runtime64.jsxDEV(ThemedText, {
            color: color_0,
            children: message
          }, void 0, !1, void 0, this), $3[19] = color_0, $3[20] = message, $3[21] = t52;
        else
          t52 = $3[21];
        let t62;
        if ($3[22] !== color_0)
          t62 = /* @__PURE__ */ jsx_dev_runtime64.jsxDEV(ThemedText, {
            color: color_0,
            children: " "
          }, void 0, !1, void 0, this), $3[22] = color_0, $3[23] = t62;
        else
          t62 = $3[23];
        let t72;
        if ($3[24] !== t52 || $3[25] !== t62)
          t72 = /* @__PURE__ */ jsx_dev_runtime64.jsxDEV(jsx_dev_runtime64.Fragment, {
            children: [
              t52,
              t62
            ]
          }, void 0, !0, void 0, this), $3[24] = t52, $3[25] = t62, $3[26] = t72;
        else
          t72 = $3[26];
        t2 = t72;
        break bb0;
      }
      if (mode === "tool-use") {
        let baseColorStr_0 = theme[messageColor], shimmerColorStr = theme[shimmerColor], baseRGB_0 = baseColorStr_0 ? parseRGB(baseColorStr_0) : null, shimmerRGB = shimmerColorStr ? parseRGB(shimmerColorStr) : null;
        if (baseRGB_0 && shimmerRGB) {
          let interpolated_0 = interpolateColor(baseRGB_0, shimmerRGB, flashOpacity), t53 = /* @__PURE__ */ jsx_dev_runtime64.jsxDEV(ThemedText, {
            color: toRGBColor(interpolated_0),
            children: message
          }, void 0, !1, void 0, this), t63;
          if ($3[27] !== messageColor)
            t63 = /* @__PURE__ */ jsx_dev_runtime64.jsxDEV(ThemedText, {
              color: messageColor,
              children: " "
            }, void 0, !1, void 0, this), $3[27] = messageColor, $3[28] = t63;
          else
            t63 = $3[28];
          let t73;
          if ($3[29] !== t53 || $3[30] !== t63)
            t73 = /* @__PURE__ */ jsx_dev_runtime64.jsxDEV(jsx_dev_runtime64.Fragment, {
              children: [
                t53,
                t63
              ]
            }, void 0, !0, void 0, this), $3[29] = t53, $3[30] = t63, $3[31] = t73;
          else
            t73 = $3[31];
          t2 = t73;
          break bb0;
        }
        let color_1 = flashOpacity > 0.5 ? shimmerColor : messageColor, t52;
        if ($3[32] !== color_1 || $3[33] !== message)
          t52 = /* @__PURE__ */ jsx_dev_runtime64.jsxDEV(ThemedText, {
            color: color_1,
            children: message
          }, void 0, !1, void 0, this), $3[32] = color_1, $3[33] = message, $3[34] = t52;
        else
          t52 = $3[34];
        let t62;
        if ($3[35] !== messageColor)
          t62 = /* @__PURE__ */ jsx_dev_runtime64.jsxDEV(ThemedText, {
            color: messageColor,
            children: " "
          }, void 0, !1, void 0, this), $3[35] = messageColor, $3[36] = t62;
        else
          t62 = $3[36];
        let t72;
        if ($3[37] !== t52 || $3[38] !== t62)
          t72 = /* @__PURE__ */ jsx_dev_runtime64.jsxDEV(jsx_dev_runtime64.Fragment, {
            children: [
              t52,
              t62
            ]
          }, void 0, !0, void 0, this), $3[37] = t52, $3[38] = t62, $3[39] = t72;
        else
          t72 = $3[39];
        t2 = t72;
        break bb0;
      }
    }
    $3[0] = flashOpacity, $3[1] = message, $3[2] = messageColor, $3[3] = mode, $3[4] = shimmerColor, $3[5] = stalledIntensity, $3[6] = themeName, $3[7] = messageWidth, $3[8] = segments, $3[9] = t2;
  } else
    messageWidth = $3[7], segments = $3[8], t2 = $3[9];
  if (t2 !== Symbol.for("react.early_return_sentinel"))
    return t2;
  let shimmerStart = glimmerIndex - 1, shimmerEnd = glimmerIndex + 1;
  if (shimmerStart >= messageWidth || shimmerEnd < 0) {
    let t32;
    if ($3[40] !== message || $3[41] !== messageColor)
      t32 = /* @__PURE__ */ jsx_dev_runtime64.jsxDEV(ThemedText, {
        color: messageColor,
        children: message
      }, void 0, !1, void 0, this), $3[40] = message, $3[41] = messageColor, $3[42] = t32;
    else
      t32 = $3[42];
    let t42;
    if ($3[43] !== messageColor)
      t42 = /* @__PURE__ */ jsx_dev_runtime64.jsxDEV(ThemedText, {
        color: messageColor,
        children: " "
      }, void 0, !1, void 0, this), $3[43] = messageColor, $3[44] = t42;
    else
      t42 = $3[44];
    let t52;
    if ($3[45] !== t32 || $3[46] !== t42)
      t52 = /* @__PURE__ */ jsx_dev_runtime64.jsxDEV(jsx_dev_runtime64.Fragment, {
        children: [
          t32,
          t42
        ]
      }, void 0, !0, void 0, this), $3[45] = t32, $3[46] = t42, $3[47] = t52;
    else
      t52 = $3[47];
    return t52;
  }
  let clampedStart = Math.max(0, shimmerStart), colPos = 0, before = "", shim = "", after = "";
  if ($3[48] !== after || $3[49] !== before || $3[50] !== clampedStart || $3[51] !== colPos || $3[52] !== segments || $3[53] !== shim || $3[54] !== shimmerEnd) {
    for (let {
      segment: segment_0,
      width
    } of segments) {
      if (colPos + width <= clampedStart)
        before = before + segment_0;
      else if (colPos > shimmerEnd)
        after = after + segment_0;
      else
        shim = shim + segment_0;
      colPos = colPos + width;
    }
    $3[48] = after, $3[49] = before, $3[50] = clampedStart, $3[51] = colPos, $3[52] = segments, $3[53] = shim, $3[54] = shimmerEnd, $3[55] = before, $3[56] = after, $3[57] = shim, $3[58] = colPos;
  } else
    before = $3[55], after = $3[56], shim = $3[57], colPos = $3[58];
  let t3;
  if ($3[59] !== before || $3[60] !== messageColor)
    t3 = before && /* @__PURE__ */ jsx_dev_runtime64.jsxDEV(ThemedText, {
      color: messageColor,
      children: before
    }, void 0, !1, void 0, this), $3[59] = before, $3[60] = messageColor, $3[61] = t3;
  else
    t3 = $3[61];
  let t4;
  if ($3[62] !== shim || $3[63] !== shimmerColor)
    t4 = /* @__PURE__ */ jsx_dev_runtime64.jsxDEV(ThemedText, {
      color: shimmerColor,
      children: shim
    }, void 0, !1, void 0, this), $3[62] = shim, $3[63] = shimmerColor, $3[64] = t4;
  else
    t4 = $3[64];
  let t5;
  if ($3[65] !== after || $3[66] !== messageColor)
    t5 = after && /* @__PURE__ */ jsx_dev_runtime64.jsxDEV(ThemedText, {
      color: messageColor,
      children: after
    }, void 0, !1, void 0, this), $3[65] = after, $3[66] = messageColor, $3[67] = t5;
  else
    t5 = $3[67];
  let t6;
  if ($3[68] !== messageColor)
    t6 = /* @__PURE__ */ jsx_dev_runtime64.jsxDEV(ThemedText, {
      color: messageColor,
      children: " "
    }, void 0, !1, void 0, this), $3[68] = messageColor, $3[69] = t6;
  else
    t6 = $3[69];
  let t7;
  if ($3[70] !== t3 || $3[71] !== t4 || $3[72] !== t5 || $3[73] !== t6)
    t7 = /* @__PURE__ */ jsx_dev_runtime64.jsxDEV(jsx_dev_runtime64.Fragment, {
      children: [
        t3,
        t4,
        t5,
        t6
      ]
    }, void 0, !0, void 0, this), $3[70] = t3, $3[71] = t4, $3[72] = t5, $3[73] = t6, $3[74] = t7;
  else
    t7 = $3[74];
  return t7;
}
var import_compiler_runtime56, jsx_dev_runtime64, ERROR_RED;
var init_GlimmerMessage = __esm(() => {
  init_stringWidth();
  init_ink2();
  init_intl();
  init_theme();
  init_utils10();
  import_compiler_runtime56 = __toESM(require_react_compiler_runtime_development(), 1), jsx_dev_runtime64 = __toESM(require_react_jsx_dev_runtime_development(), 1), ERROR_RED = {
    r: 171,
    g: 43,
    b: 63
  };
});
