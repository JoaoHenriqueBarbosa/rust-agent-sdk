// Original: src/ink/termio/sgr.ts
function parseParams(str) {
  if (str === "")
    return [{ value: 0, subparams: [], colon: !1 }];
  let result = [], current = { value: null, subparams: [], colon: !1 }, num = "", inSub = !1;
  for (let i4 = 0;i4 <= str.length; i4++) {
    let c3 = str[i4];
    if (c3 === ";" || c3 === void 0) {
      let n5 = num === "" ? null : parseInt(num, 10);
      if (inSub) {
        if (n5 !== null)
          current.subparams.push(n5);
      } else
        current.value = n5;
      result.push(current), current = { value: null, subparams: [], colon: !1 }, num = "", inSub = !1;
    } else if (c3 === ":") {
      let n5 = num === "" ? null : parseInt(num, 10);
      if (!inSub)
        current.value = n5, current.colon = !0, inSub = !0;
      else if (n5 !== null)
        current.subparams.push(n5);
      num = "";
    } else if (c3 >= "0" && c3 <= "9")
      num += c3;
  }
  return result;
}
function parseExtendedColor(params, idx) {
  let p4 = params[idx];
  if (!p4)
    return null;
  if (p4.colon && p4.subparams.length >= 1) {
    if (p4.subparams[0] === 5 && p4.subparams.length >= 2)
      return { index: p4.subparams[1] };
    if (p4.subparams[0] === 2 && p4.subparams.length >= 4) {
      let off = p4.subparams.length >= 5 ? 1 : 0;
      return {
        r: p4.subparams[1 + off],
        g: p4.subparams[2 + off],
        b: p4.subparams[3 + off]
      };
    }
  }
  let next = params[idx + 1];
  if (!next)
    return null;
  if (next.value === 5 && params[idx + 2]?.value !== null && params[idx + 2]?.value !== void 0)
    return { index: params[idx + 2].value };
  if (next.value === 2) {
    let r4 = params[idx + 2]?.value, g = params[idx + 3]?.value, b = params[idx + 4]?.value;
    if (r4 !== null && r4 !== void 0 && g !== null && g !== void 0 && b !== null && b !== void 0)
      return { r: r4, g, b };
  }
  return null;
}
function applySGR(paramStr, style) {
  let params = parseParams(paramStr), s2 = { ...style }, i4 = 0;
  while (i4 < params.length) {
    let p4 = params[i4], code = p4.value ?? 0;
    if (code === 0) {
      s2 = defaultStyle2(), i4++;
      continue;
    }
    if (code === 1) {
      s2.bold = !0, i4++;
      continue;
    }
    if (code === 2) {
      s2.dim = !0, i4++;
      continue;
    }
    if (code === 3) {
      s2.italic = !0, i4++;
      continue;
    }
    if (code === 4) {
      s2.underline = p4.colon ? UNDERLINE_STYLES[p4.subparams[0]] ?? "single" : "single", i4++;
      continue;
    }
    if (code === 5 || code === 6) {
      s2.blink = !0, i4++;
      continue;
    }
    if (code === 7) {
      s2.inverse = !0, i4++;
      continue;
    }
    if (code === 8) {
      s2.hidden = !0, i4++;
      continue;
    }
    if (code === 9) {
      s2.strikethrough = !0, i4++;
      continue;
    }
    if (code === 21) {
      s2.underline = "double", i4++;
      continue;
    }
    if (code === 22) {
      s2.bold = !1, s2.dim = !1, i4++;
      continue;
    }
    if (code === 23) {
      s2.italic = !1, i4++;
      continue;
    }
    if (code === 24) {
      s2.underline = "none", i4++;
      continue;
    }
    if (code === 25) {
      s2.blink = !1, i4++;
      continue;
    }
    if (code === 27) {
      s2.inverse = !1, i4++;
      continue;
    }
    if (code === 28) {
      s2.hidden = !1, i4++;
      continue;
    }
    if (code === 29) {
      s2.strikethrough = !1, i4++;
      continue;
    }
    if (code === 53) {
      s2.overline = !0, i4++;
      continue;
    }
    if (code === 55) {
      s2.overline = !1, i4++;
      continue;
    }
    if (code >= 30 && code <= 37) {
      s2.fg = { type: "named", name: NAMED_COLORS[code - 30] }, i4++;
      continue;
    }
    if (code === 39) {
      s2.fg = { type: "default" }, i4++;
      continue;
    }
    if (code >= 40 && code <= 47) {
      s2.bg = { type: "named", name: NAMED_COLORS[code - 40] }, i4++;
      continue;
    }
    if (code === 49) {
      s2.bg = { type: "default" }, i4++;
      continue;
    }
    if (code >= 90 && code <= 97) {
      s2.fg = { type: "named", name: NAMED_COLORS[code - 90 + 8] }, i4++;
      continue;
    }
    if (code >= 100 && code <= 107) {
      s2.bg = { type: "named", name: NAMED_COLORS[code - 100 + 8] }, i4++;
      continue;
    }
    if (code === 38) {
      let c3 = parseExtendedColor(params, i4);
      if (c3) {
        s2.fg = "index" in c3 ? { type: "indexed", index: c3.index } : { type: "rgb", ...c3 }, i4 += p4.colon ? 1 : ("index" in c3) ? 3 : 5;
        continue;
      }
    }
    if (code === 48) {
      let c3 = parseExtendedColor(params, i4);
      if (c3) {
        s2.bg = "index" in c3 ? { type: "indexed", index: c3.index } : { type: "rgb", ...c3 }, i4 += p4.colon ? 1 : ("index" in c3) ? 3 : 5;
        continue;
      }
    }
    if (code === 58) {
      let c3 = parseExtendedColor(params, i4);
      if (c3) {
        s2.underlineColor = "index" in c3 ? { type: "indexed", index: c3.index } : { type: "rgb", ...c3 }, i4 += p4.colon ? 1 : ("index" in c3) ? 3 : 5;
        continue;
      }
    }
    if (code === 59) {
      s2.underlineColor = { type: "default" }, i4++;
      continue;
    }
    i4++;
  }
  return s2;
}
var NAMED_COLORS, UNDERLINE_STYLES;
var init_sgr = __esm(() => {
  NAMED_COLORS = [
    "black",
    "red",
    "green",
    "yellow",
    "blue",
    "magenta",
    "cyan",
    "white",
    "brightBlack",
    "brightRed",
    "brightGreen",
    "brightYellow",
    "brightBlue",
    "brightMagenta",
    "brightCyan",
    "brightWhite"
  ], UNDERLINE_STYLES = [
    "none",
    "single",
    "double",
    "curly",
    "dotted",
    "dashed"
  ];
});
