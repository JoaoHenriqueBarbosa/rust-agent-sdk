// function: RulesTabContent
function RulesTabContent(props) {
  let $3 = import_compiler_runtime237.c(26), {
    options: options2,
    searchQuery,
    isSearchMode,
    isFocused,
    onSelect,
    onCancel,
    lastFocusedRuleKey,
    cursorOffset,
    onHeaderFocusChange
  } = props, tabWidth = useTabsWidth(), {
    headerFocused,
    focusHeader,
    blurHeader
  } = useTabHeaderFocus(), t0, t1;
  if ($3[0] !== blurHeader || $3[1] !== headerFocused || $3[2] !== isSearchMode)
    t0 = () => {
      if (isSearchMode && headerFocused)
        blurHeader();
    }, t1 = [isSearchMode, headerFocused, blurHeader], $3[0] = blurHeader, $3[1] = headerFocused, $3[2] = isSearchMode, $3[3] = t0, $3[4] = t1;
  else
    t0 = $3[3], t1 = $3[4];
  import_react169.useEffect(t0, t1);
  let t2, t3;
  if ($3[5] !== headerFocused || $3[6] !== onHeaderFocusChange)
    t2 = () => {
      onHeaderFocusChange?.(headerFocused);
    }, t3 = [headerFocused, onHeaderFocusChange], $3[5] = headerFocused, $3[6] = onHeaderFocusChange, $3[7] = t2, $3[8] = t3;
  else
    t2 = $3[7], t3 = $3[8];
  import_react169.useEffect(t2, t3);
  let t4 = isSearchMode && !headerFocused, t5;
  if ($3[9] !== cursorOffset || $3[10] !== isFocused || $3[11] !== searchQuery || $3[12] !== t4 || $3[13] !== tabWidth)
    t5 = /* @__PURE__ */ jsx_dev_runtime299.jsxDEV(ThemedBox_default, {
      marginBottom: 1,
      flexDirection: "column",
      children: /* @__PURE__ */ jsx_dev_runtime299.jsxDEV(SearchBox, {
        query: searchQuery,
        isFocused: t4,
        isTerminalFocused: isFocused,
        width: tabWidth,
        cursorOffset
      }, void 0, !1, void 0, this)
    }, void 0, !1, void 0, this), $3[9] = cursorOffset, $3[10] = isFocused, $3[11] = searchQuery, $3[12] = t4, $3[13] = tabWidth, $3[14] = t5;
  else
    t5 = $3[14];
  let t6 = Math.min(10, options2.length), t7 = isSearchMode || headerFocused, t8;
  if ($3[15] !== focusHeader || $3[16] !== lastFocusedRuleKey || $3[17] !== onCancel || $3[18] !== onSelect || $3[19] !== options2 || $3[20] !== t6 || $3[21] !== t7)
    t8 = /* @__PURE__ */ jsx_dev_runtime299.jsxDEV(Select, {
      options: options2,
      onChange: onSelect,
      onCancel,
      visibleOptionCount: t6,
      isDisabled: t7,
      defaultFocusValue: lastFocusedRuleKey,
      onUpFromFirstItem: focusHeader
    }, void 0, !1, void 0, this), $3[15] = focusHeader, $3[16] = lastFocusedRuleKey, $3[17] = onCancel, $3[18] = onSelect, $3[19] = options2, $3[20] = t6, $3[21] = t7, $3[22] = t8;
  else
    t8 = $3[22];
  let t9;
  if ($3[23] !== t5 || $3[24] !== t8)
    t9 = /* @__PURE__ */ jsx_dev_runtime299.jsxDEV(ThemedBox_default, {
      flexDirection: "column",
      children: [
        t5,
        t8
      ]
    }, void 0, !0, void 0, this), $3[23] = t5, $3[24] = t8, $3[25] = t9;
  else
    t9 = $3[25];
  return t9;
}
