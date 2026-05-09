// Original: src/utils/ansiToSvg.ts
function parseAnsi(text2) {
  let lines2 = [], rawLines = text2.split(`
`);
  for (let line of rawLines) {
    let spans = [], currentColor = DEFAULT_FG, bold2 = !1, i5 = 0;
    while (i5 < line.length) {
      if (line[i5] === "\x1B" && line[i5 + 1] === "[") {
        let j4 = i5 + 2;
        while (j4 < line.length && !/[A-Za-z]/.test(line[j4]))
          j4++;
        if (line[j4] === "m") {
          let codes = line.slice(i5 + 2, j4).split(";").map(Number), k3 = 0;
          while (k3 < codes.length) {
            let code = codes[k3];
            if (code === 0)
              currentColor = DEFAULT_FG, bold2 = !1;
            else if (code === 1)
              bold2 = !0;
            else if (code >= 30 && code <= 37)
              currentColor = ANSI_COLORS[code] || DEFAULT_FG;
            else if (code >= 90 && code <= 97)
              currentColor = ANSI_COLORS[code] || DEFAULT_FG;
            else if (code === 39)
              currentColor = DEFAULT_FG;
            else if (code === 38) {
              if (codes[k3 + 1] === 5 && codes[k3 + 2] !== void 0) {
                let colorIndex2 = codes[k3 + 2];
                currentColor = get256Color(colorIndex2), k3 += 2;
              } else if (codes[k3 + 1] === 2 && codes[k3 + 2] !== void 0 && codes[k3 + 3] !== void 0 && codes[k3 + 4] !== void 0)
                currentColor = {
                  r: codes[k3 + 2],
                  g: codes[k3 + 3],
                  b: codes[k3 + 4]
                }, k3 += 4;
            }
            k3++;
          }
        }
        i5 = j4 + 1;
        continue;
      }
      let textStart = i5;
      while (i5 < line.length && line[i5] !== "\x1B")
        i5++;
      let spanText = line.slice(textStart, i5);
      if (spanText)
        spans.push({ text: spanText, color: currentColor, bold: bold2 });
    }
    if (spans.length === 0)
      spans.push({ text: "", color: DEFAULT_FG, bold: !1 });
    lines2.push(spans);
  }
  return lines2;
}
function get256Color(index) {
  if (index < 16)
    return [
      { r: 0, g: 0, b: 0 },
      { r: 128, g: 0, b: 0 },
      { r: 0, g: 128, b: 0 },
      { r: 128, g: 128, b: 0 },
      { r: 0, g: 0, b: 128 },
      { r: 128, g: 0, b: 128 },
      { r: 0, g: 128, b: 128 },
      { r: 192, g: 192, b: 192 },
      { r: 128, g: 128, b: 128 },
      { r: 255, g: 0, b: 0 },
      { r: 0, g: 255, b: 0 },
      { r: 255, g: 255, b: 0 },
      { r: 0, g: 0, b: 255 },
      { r: 255, g: 0, b: 255 },
      { r: 0, g: 255, b: 255 },
      { r: 255, g: 255, b: 255 }
    ][index] || DEFAULT_FG;
  if (index < 232) {
    let i5 = index - 16, r4 = Math.floor(i5 / 36), g = Math.floor(i5 % 36 / 6), b = i5 % 6;
    return {
      r: r4 === 0 ? 0 : 55 + r4 * 40,
      g: g === 0 ? 0 : 55 + g * 40,
      b: b === 0 ? 0 : 55 + b * 40
    };
  }
  let gray2 = (index - 232) * 10 + 8;
  return { r: gray2, g: gray2, b: gray2 };
}
var ANSI_COLORS, DEFAULT_FG, DEFAULT_BG;
var init_ansiToSvg = __esm(() => {
  ANSI_COLORS = {
    30: { r: 0, g: 0, b: 0 },
    31: { r: 205, g: 49, b: 49 },
    32: { r: 13, g: 188, b: 121 },
    33: { r: 229, g: 229, b: 16 },
    34: { r: 36, g: 114, b: 200 },
    35: { r: 188, g: 63, b: 188 },
    36: { r: 17, g: 168, b: 205 },
    37: { r: 229, g: 229, b: 229 },
    90: { r: 102, g: 102, b: 102 },
    91: { r: 241, g: 76, b: 76 },
    92: { r: 35, g: 209, b: 139 },
    93: { r: 245, g: 245, b: 67 },
    94: { r: 59, g: 142, b: 234 },
    95: { r: 214, g: 112, b: 214 },
    96: { r: 41, g: 184, b: 219 },
    97: { r: 255, g: 255, b: 255 }
  }, DEFAULT_FG = { r: 229, g: 229, b: 229 }, DEFAULT_BG = { r: 30, g: 30, b: 30 };
});
