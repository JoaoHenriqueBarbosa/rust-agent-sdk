// function: MemoryFileRow
function MemoryFileRow(t0) {
  let $3 = import_compiler_runtime95.c(16), {
    path: path16
  } = t0, [hover, setHover] = import_react72.useState(!1), t1;
  if ($3[0] !== path16)
    t1 = () => void openPath(path16), $3[0] = path16, $3[1] = t1;
  else
    t1 = $3[1];
  let t2, t3;
  if ($3[2] === Symbol.for("react.memo_cache_sentinel"))
    t2 = () => setHover(!0), t3 = () => setHover(!1), $3[2] = t2, $3[3] = t3;
  else
    t2 = $3[2], t3 = $3[3];
  let t4 = !hover, t5;
  if ($3[4] !== path16)
    t5 = basename18(path16), $3[4] = path16, $3[5] = t5;
  else
    t5 = $3[5];
  let t6;
  if ($3[6] !== path16 || $3[7] !== t5)
    t6 = /* @__PURE__ */ jsx_dev_runtime106.jsxDEV(FilePathLink, {
      filePath: path16,
      children: t5
    }, void 0, !1, void 0, this), $3[6] = path16, $3[7] = t5, $3[8] = t6;
  else
    t6 = $3[8];
  let t7;
  if ($3[9] !== hover || $3[10] !== t4 || $3[11] !== t6)
    t7 = /* @__PURE__ */ jsx_dev_runtime106.jsxDEV(ThemedText, {
      dimColor: t4,
      underline: hover,
      children: t6
    }, void 0, !1, void 0, this), $3[9] = hover, $3[10] = t4, $3[11] = t6, $3[12] = t7;
  else
    t7 = $3[12];
  let t8;
  if ($3[13] !== t1 || $3[14] !== t7)
    t8 = /* @__PURE__ */ jsx_dev_runtime106.jsxDEV(MessageResponse, {
      children: /* @__PURE__ */ jsx_dev_runtime106.jsxDEV(ThemedBox_default, {
        onClick: t1,
        onMouseEnter: t2,
        onMouseLeave: t3,
        children: t7
      }, void 0, !1, void 0, this)
    }, void 0, !1, void 0, this), $3[13] = t1, $3[14] = t7, $3[15] = t8;
  else
    t8 = $3[15];
  return t8;
}
