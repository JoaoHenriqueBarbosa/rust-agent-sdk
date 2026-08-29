// function: VirtualItem
function VirtualItem(t0) {
  let $3 = import_compiler_runtime212.c(30), {
    itemKey: k3,
    msg,
    idx,
    measureRef,
    expanded,
    hovered,
    clickable,
    onClickK,
    onEnterK,
    onLeaveK,
    renderItem
  } = t0, t1;
  if ($3[0] !== k3 || $3[1] !== measureRef)
    t1 = measureRef(k3), $3[0] = k3, $3[1] = measureRef, $3[2] = t1;
  else
    t1 = $3[2];
  let t2 = expanded ? "userMessageBackgroundHover" : void 0, t3 = expanded ? 1 : void 0, t4;
  if ($3[3] !== clickable || $3[4] !== msg || $3[5] !== onClickK)
    t4 = clickable ? (e) => onClickK(msg, e.cellIsBlank) : void 0, $3[3] = clickable, $3[4] = msg, $3[5] = onClickK, $3[6] = t4;
  else
    t4 = $3[6];
  let t5;
  if ($3[7] !== clickable || $3[8] !== k3 || $3[9] !== onEnterK)
    t5 = clickable ? () => onEnterK(k3) : void 0, $3[7] = clickable, $3[8] = k3, $3[9] = onEnterK, $3[10] = t5;
  else
    t5 = $3[10];
  let t6;
  if ($3[11] !== clickable || $3[12] !== k3 || $3[13] !== onLeaveK)
    t6 = clickable ? () => onLeaveK(k3) : void 0, $3[11] = clickable, $3[12] = k3, $3[13] = onLeaveK, $3[14] = t6;
  else
    t6 = $3[14];
  let t7 = hovered && !expanded ? "text" : void 0, t8;
  if ($3[15] !== idx || $3[16] !== msg || $3[17] !== renderItem)
    t8 = renderItem(msg, idx), $3[15] = idx, $3[16] = msg, $3[17] = renderItem, $3[18] = t8;
  else
    t8 = $3[18];
  let t9;
  if ($3[19] !== t7 || $3[20] !== t8)
    t9 = /* @__PURE__ */ jsx_dev_runtime267.jsxDEV(TextHoverColorContext.Provider, {
      value: t7,
      children: t8
    }, void 0, !1, void 0, this), $3[19] = t7, $3[20] = t8, $3[21] = t9;
  else
    t9 = $3[21];
  let t10;
  if ($3[22] !== t1 || $3[23] !== t2 || $3[24] !== t3 || $3[25] !== t4 || $3[26] !== t5 || $3[27] !== t6 || $3[28] !== t9)
    t10 = /* @__PURE__ */ jsx_dev_runtime267.jsxDEV(ThemedBox_default, {
      ref: t1,
      flexDirection: "column",
      backgroundColor: t2,
      paddingBottom: t3,
      onClick: t4,
      onMouseEnter: t5,
      onMouseLeave: t6,
      children: t9
    }, void 0, !1, void 0, this), $3[22] = t1, $3[23] = t2, $3[24] = t3, $3[25] = t4, $3[26] = t5, $3[27] = t6, $3[28] = t9, $3[29] = t10;
  else
    t10 = $3[29];
  return t10;
}
