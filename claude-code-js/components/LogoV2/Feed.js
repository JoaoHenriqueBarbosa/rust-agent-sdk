// Original: src/components/LogoV2/Feed.tsx
function calculateFeedWidth(config11) {
  let {
    title,
    lines: lines2,
    footer,
    emptyMessage,
    customContent
  } = config11, maxWidth = stringWidth(title);
  if (customContent !== void 0)
    maxWidth = Math.max(maxWidth, customContent.width);
  else if (lines2.length === 0 && emptyMessage)
    maxWidth = Math.max(maxWidth, stringWidth(emptyMessage));
  else {
    let maxTimestampWidth = Math.max(0, ...lines2.map((line) => line.timestamp ? stringWidth(line.timestamp) : 0));
    for (let line of lines2) {
      let timestampWidth = maxTimestampWidth > 0 ? maxTimestampWidth : 0, lineWidth2 = stringWidth(line.text) + (timestampWidth > 0 ? timestampWidth + 2 : 0);
      maxWidth = Math.max(maxWidth, lineWidth2);
    }
  }
  if (footer)
    maxWidth = Math.max(maxWidth, stringWidth(footer));
  return maxWidth;
}
function Feed(t0) {
  let $3 = import_compiler_runtime197.c(15), {
    config: config11,
    actualWidth
  } = t0, {
    title,
    lines: lines2,
    footer,
    emptyMessage,
    customContent
  } = config11, t1;
  if ($3[0] !== lines2)
    t1 = Math.max(0, ...lines2.map(_temp116)), $3[0] = lines2, $3[1] = t1;
  else
    t1 = $3[1];
  let maxTimestampWidth = t1, t2;
  if ($3[2] !== title)
    t2 = /* @__PURE__ */ jsx_dev_runtime248.jsxDEV(ThemedText, {
      bold: !0,
      color: "claude",
      children: title
    }, void 0, !1, void 0, this), $3[2] = title, $3[3] = t2;
  else
    t2 = $3[3];
  let t3;
  if ($3[4] !== actualWidth || $3[5] !== customContent || $3[6] !== emptyMessage || $3[7] !== footer || $3[8] !== lines2 || $3[9] !== maxTimestampWidth)
    t3 = customContent ? /* @__PURE__ */ jsx_dev_runtime248.jsxDEV(jsx_dev_runtime248.Fragment, {
      children: [
        customContent.content,
        footer && /* @__PURE__ */ jsx_dev_runtime248.jsxDEV(ThemedText, {
          dimColor: !0,
          italic: !0,
          children: truncate(footer, actualWidth)
        }, void 0, !1, void 0, this)
      ]
    }, void 0, !0, void 0, this) : lines2.length === 0 && emptyMessage ? /* @__PURE__ */ jsx_dev_runtime248.jsxDEV(ThemedText, {
      dimColor: !0,
      children: truncate(emptyMessage, actualWidth)
    }, void 0, !1, void 0, this) : /* @__PURE__ */ jsx_dev_runtime248.jsxDEV(jsx_dev_runtime248.Fragment, {
      children: [
        lines2.map((line_0, index) => {
          let textWidth = Math.max(10, actualWidth - (maxTimestampWidth > 0 ? maxTimestampWidth + 2 : 0));
          return /* @__PURE__ */ jsx_dev_runtime248.jsxDEV(ThemedText, {
            children: [
              maxTimestampWidth > 0 && /* @__PURE__ */ jsx_dev_runtime248.jsxDEV(jsx_dev_runtime248.Fragment, {
                children: [
                  /* @__PURE__ */ jsx_dev_runtime248.jsxDEV(ThemedText, {
                    dimColor: !0,
                    children: (line_0.timestamp || "").padEnd(maxTimestampWidth)
                  }, void 0, !1, void 0, this),
                  "  "
                ]
              }, void 0, !0, void 0, this),
              /* @__PURE__ */ jsx_dev_runtime248.jsxDEV(ThemedText, {
                children: truncate(line_0.text, textWidth)
              }, void 0, !1, void 0, this)
            ]
          }, index, !0, void 0, this);
        }),
        footer && /* @__PURE__ */ jsx_dev_runtime248.jsxDEV(ThemedText, {
          dimColor: !0,
          italic: !0,
          children: truncate(footer, actualWidth)
        }, void 0, !1, void 0, this)
      ]
    }, void 0, !0, void 0, this), $3[4] = actualWidth, $3[5] = customContent, $3[6] = emptyMessage, $3[7] = footer, $3[8] = lines2, $3[9] = maxTimestampWidth, $3[10] = t3;
  else
    t3 = $3[10];
  let t4;
  if ($3[11] !== actualWidth || $3[12] !== t2 || $3[13] !== t3)
    t4 = /* @__PURE__ */ jsx_dev_runtime248.jsxDEV(ThemedBox_default, {
      flexDirection: "column",
      width: actualWidth,
      children: [
        t2,
        t3
      ]
    }, void 0, !0, void 0, this), $3[11] = actualWidth, $3[12] = t2, $3[13] = t3, $3[14] = t4;
  else
    t4 = $3[14];
  return t4;
}
function _temp116(line) {
  return line.timestamp ? stringWidth(line.timestamp) : 0;
}
var import_compiler_runtime197, jsx_dev_runtime248;
var init_Feed = __esm(() => {
  init_stringWidth();
  init_ink2();
  init_format();
  import_compiler_runtime197 = __toESM(require_react_compiler_runtime_development(), 1), jsx_dev_runtime248 = __toESM(require_react_jsx_dev_runtime_development(), 1);
});
