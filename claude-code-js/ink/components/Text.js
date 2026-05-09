// Original: src/ink/components/Text.tsx
function Text(t0) {
  let $3 = import_compiler_runtime5.c(29), {
    color,
    backgroundColor,
    bold: bold2,
    dim: dim2,
    italic: t1,
    underline: t2,
    strikethrough: t3,
    inverse: t4,
    wrap: t5,
    children
  } = t0, italic2 = t1 === void 0 ? !1 : t1, underline2 = t2 === void 0 ? !1 : t2, strikethrough2 = t3 === void 0 ? !1 : t3, inverse2 = t4 === void 0 ? !1 : t4, wrap = t5 === void 0 ? "wrap" : t5;
  if (children === void 0 || children === null)
    return null;
  let t6;
  if ($3[0] !== color)
    t6 = color && {
      color
    }, $3[0] = color, $3[1] = t6;
  else
    t6 = $3[1];
  let t7;
  if ($3[2] !== backgroundColor)
    t7 = backgroundColor && {
      backgroundColor
    }, $3[2] = backgroundColor, $3[3] = t7;
  else
    t7 = $3[3];
  let t8;
  if ($3[4] !== dim2)
    t8 = dim2 && {
      dim: dim2
    }, $3[4] = dim2, $3[5] = t8;
  else
    t8 = $3[5];
  let t9;
  if ($3[6] !== bold2)
    t9 = bold2 && {
      bold: bold2
    }, $3[6] = bold2, $3[7] = t9;
  else
    t9 = $3[7];
  let t10;
  if ($3[8] !== italic2)
    t10 = italic2 && {
      italic: italic2
    }, $3[8] = italic2, $3[9] = t10;
  else
    t10 = $3[9];
  let t11;
  if ($3[10] !== underline2)
    t11 = underline2 && {
      underline: underline2
    }, $3[10] = underline2, $3[11] = t11;
  else
    t11 = $3[11];
  let t12;
  if ($3[12] !== strikethrough2)
    t12 = strikethrough2 && {
      strikethrough: strikethrough2
    }, $3[12] = strikethrough2, $3[13] = t12;
  else
    t12 = $3[13];
  let t13;
  if ($3[14] !== inverse2)
    t13 = inverse2 && {
      inverse: inverse2
    }, $3[14] = inverse2, $3[15] = t13;
  else
    t13 = $3[15];
  let t14;
  if ($3[16] !== t10 || $3[17] !== t11 || $3[18] !== t12 || $3[19] !== t13 || $3[20] !== t6 || $3[21] !== t7 || $3[22] !== t8 || $3[23] !== t9)
    t14 = {
      ...t6,
      ...t7,
      ...t8,
      ...t9,
      ...t10,
      ...t11,
      ...t12,
      ...t13
    }, $3[16] = t10, $3[17] = t11, $3[18] = t12, $3[19] = t13, $3[20] = t6, $3[21] = t7, $3[22] = t8, $3[23] = t9, $3[24] = t14;
  else
    t14 = $3[24];
  let textStyles = t14, t15 = memoizedStylesForWrap[wrap], t16;
  if ($3[25] !== children || $3[26] !== t15 || $3[27] !== textStyles)
    t16 = /* @__PURE__ */ jsx_dev_runtime5.jsxDEV("ink-text", {
      style: t15,
      textStyles,
      children
    }, void 0, !1, void 0, this), $3[25] = children, $3[26] = t15, $3[27] = textStyles, $3[28] = t16;
  else
    t16 = $3[28];
  return t16;
}
var import_compiler_runtime5, jsx_dev_runtime5, memoizedStylesForWrap;
var init_Text = __esm(() => {
  import_compiler_runtime5 = __toESM(require_react_compiler_runtime_development(), 1), jsx_dev_runtime5 = __toESM(require_react_jsx_dev_runtime_development(), 1), memoizedStylesForWrap = {
    wrap: {
      flexGrow: 0,
      flexShrink: 1,
      flexDirection: "row",
      textWrap: "wrap"
    },
    "wrap-trim": {
      flexGrow: 0,
      flexShrink: 1,
      flexDirection: "row",
      textWrap: "wrap-trim"
    },
    end: {
      flexGrow: 0,
      flexShrink: 1,
      flexDirection: "row",
      textWrap: "end"
    },
    middle: {
      flexGrow: 0,
      flexShrink: 1,
      flexDirection: "row",
      textWrap: "middle"
    },
    "truncate-end": {
      flexGrow: 0,
      flexShrink: 1,
      flexDirection: "row",
      textWrap: "truncate-end"
    },
    truncate: {
      flexGrow: 0,
      flexShrink: 1,
      flexDirection: "row",
      textWrap: "truncate"
    },
    "truncate-middle": {
      flexGrow: 0,
      flexShrink: 1,
      flexDirection: "row",
      textWrap: "truncate-middle"
    },
    "truncate-start": {
      flexGrow: 0,
      flexShrink: 1,
      flexDirection: "row",
      textWrap: "truncate-start"
    }
  };
});
