// Original: src/components/Spinner/utils.ts
function getDefaultCharacters() {
  if (process.env.TERM === "xterm-ghostty")
    return ["\xB7", "\u2722", "\u2733", "\u2736", "\u273B", "*"];
  return process.platform === "darwin" ? ["\xB7", "\u2722", "\u2733", "\u2736", "\u273B", "\u273D"] : ["\xB7", "\u2722", "*", "\u2736", "\u273B", "\u273D"];
}
function interpolateColor(color1, color2, t2) {
  return {
    r: Math.round(color1.r + (color2.r - color1.r) * t2),
    g: Math.round(color1.g + (color2.g - color1.g) * t2),
    b: Math.round(color1.b + (color2.b - color1.b) * t2)
  };
}
function toRGBColor(color2) {
  return `rgb(${color2.r},${color2.g},${color2.b})`;
}
function hueToRgb(hue) {
  let h4 = (hue % 360 + 360) % 360, s2 = 0.7, l3 = 0.6, c3 = (1 - Math.abs(0.19999999999999996)) * 0.7, x4 = c3 * (1 - Math.abs(h4 / 60 % 2 - 1)), m4 = 0.6 - c3 / 2, r4 = 0, g = 0, b = 0;
  if (h4 < 60)
    r4 = c3, g = x4;
  else if (h4 < 120)
    r4 = x4, g = c3;
  else if (h4 < 180)
    g = c3, b = x4;
  else if (h4 < 240)
    g = x4, b = c3;
  else if (h4 < 300)
    r4 = x4, b = c3;
  else
    r4 = c3, b = x4;
  return {
    r: Math.round((r4 + m4) * 255),
    g: Math.round((g + m4) * 255),
    b: Math.round((b + m4) * 255)
  };
}
function parseRGB(colorStr) {
  let cached3 = RGB_CACHE.get(colorStr);
  if (cached3 !== void 0)
    return cached3;
  let match = colorStr.match(/rgb\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*\)/), result = match ? {
    r: parseInt(match[1], 10),
    g: parseInt(match[2], 10),
    b: parseInt(match[3], 10)
  } : null;
  return RGB_CACHE.set(colorStr, result), result;
}
var RGB_CACHE;
var init_utils10 = __esm(() => {
  RGB_CACHE = /* @__PURE__ */ new Map;
});
