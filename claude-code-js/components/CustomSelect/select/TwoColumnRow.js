// function: TwoColumnRow
function TwoColumnRow(t0) {
  let $3 = import_compiler_runtime49.c(5), {
    isFocused,
    children
  } = t0, t1;
  if ($3[0] !== isFocused)
    t1 = {
      line: 0,
      column: 0,
      active: isFocused
    }, $3[0] = isFocused, $3[1] = t1;
  else
    t1 = $3[1];
  let cursorRef = useDeclaredCursor(t1), t2;
  if ($3[2] !== children || $3[3] !== cursorRef)
    t2 = /* @__PURE__ */ jsx_dev_runtime54.jsxDEV(ThemedBox_default, {
      ref: cursorRef,
      flexDirection: "row",
      children
    }, void 0, !1, void 0, this), $3[2] = children, $3[3] = cursorRef, $3[4] = t2;
  else
    t2 = $3[4];
  return t2;
}
