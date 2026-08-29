// Original: src/components/PromptInput/PromptInputFooterSuggestions.tsx
function getIcon(itemId) {
  if (itemId.startsWith("file-"))
    return "+";
  if (itemId.startsWith("mcp-resource-"))
    return "\u25C7";
  if (itemId.startsWith("agent-"))
    return "*";
  return "+";
}
function isUnifiedSuggestion(itemId) {
  return itemId.startsWith("file-") || itemId.startsWith("mcp-resource-") || itemId.startsWith("agent-");
}
function PromptInputFooterSuggestions(t0) {
  let $3 = import_compiler_runtime126.c(22), {
    suggestions,
    selectedSuggestion,
    maxColumnWidth: maxColumnWidthProp,
    overlay
  } = t0, {
    rows
  } = useTerminalSize(), maxVisibleItems = overlay ? OVERLAY_MAX_ITEMS : Math.min(6, Math.max(1, rows - 3));
  if (suggestions.length === 0)
    return null;
  let t1;
  if ($3[0] !== maxColumnWidthProp || $3[1] !== suggestions)
    t1 = maxColumnWidthProp ?? Math.max(...suggestions.map(_temp58)) + 5, $3[0] = maxColumnWidthProp, $3[1] = suggestions, $3[2] = t1;
  else
    t1 = $3[2];
  let maxColumnWidth = t1, startIndex = Math.max(0, Math.min(selectedSuggestion - Math.floor(maxVisibleItems / 2), suggestions.length - maxVisibleItems)), endIndex = Math.min(startIndex + maxVisibleItems, suggestions.length), T0, t2, t3, t4;
  if ($3[3] !== endIndex || $3[4] !== maxColumnWidth || $3[5] !== overlay || $3[6] !== selectedSuggestion || $3[7] !== startIndex || $3[8] !== suggestions) {
    let visibleItems = suggestions.slice(startIndex, endIndex);
    T0 = ThemedBox_default, t2 = "column", t3 = overlay ? void 0 : "flex-end";
    let t52;
    if ($3[13] !== maxColumnWidth || $3[14] !== selectedSuggestion || $3[15] !== suggestions)
      t52 = (item_0) => /* @__PURE__ */ jsx_dev_runtime159.jsxDEV(SuggestionItemRow, {
        item: item_0,
        maxColumnWidth,
        isSelected: item_0.id === suggestions[selectedSuggestion]?.id
      }, item_0.id, !1, void 0, this), $3[13] = maxColumnWidth, $3[14] = selectedSuggestion, $3[15] = suggestions, $3[16] = t52;
    else
      t52 = $3[16];
    t4 = visibleItems.map(t52), $3[3] = endIndex, $3[4] = maxColumnWidth, $3[5] = overlay, $3[6] = selectedSuggestion, $3[7] = startIndex, $3[8] = suggestions, $3[9] = T0, $3[10] = t2, $3[11] = t3, $3[12] = t4;
  } else
    T0 = $3[9], t2 = $3[10], t3 = $3[11], t4 = $3[12];
  let t5;
  if ($3[17] !== T0 || $3[18] !== t2 || $3[19] !== t3 || $3[20] !== t4)
    t5 = /* @__PURE__ */ jsx_dev_runtime159.jsxDEV(T0, {
      flexDirection: t2,
      justifyContent: t3,
      children: t4
    }, void 0, !1, void 0, this), $3[17] = T0, $3[18] = t2, $3[19] = t3, $3[20] = t4, $3[21] = t5;
  else
    t5 = $3[21];
  return t5;
}
function _temp58(item) {
  return stringWidth(item.displayText);
}
var import_compiler_runtime126, import_react89, jsx_dev_runtime159, OVERLAY_MAX_ITEMS = 5, SuggestionItemRow, PromptInputFooterSuggestions_default;
var init_PromptInputFooterSuggestions = __esm(() => {
  init_useTerminalSize();
  init_stringWidth();
  init_ink2();
  init_format();
  import_compiler_runtime126 = __toESM(require_react_compiler_runtime_development(), 1), import_react89 = __toESM(require_react_development(), 1), jsx_dev_runtime159 = __toESM(require_react_jsx_dev_runtime_development(), 1);
  SuggestionItemRow = import_react89.memo(function(t0) {
    let $3 = import_compiler_runtime126.c(36), {
      item,
      maxColumnWidth,
      isSelected
    } = t0, columns = useTerminalSize().columns;
    if (isUnifiedSuggestion(item.id)) {
      let t12;
      if ($3[0] !== item.id)
        t12 = getIcon(item.id), $3[0] = item.id, $3[1] = t12;
      else
        t12 = $3[1];
      let icon = t12, textColor = isSelected ? "suggestion" : void 0, dimColor = !isSelected, isFile2 = item.id.startsWith("file-"), isMcpResource = item.id.startsWith("mcp-resource-"), separatorWidth = item.description ? 3 : 0, displayText;
      if (isFile2) {
        let t23;
        if ($3[2] !== item.description)
          t23 = item.description ? Math.min(20, stringWidth(item.description)) : 0, $3[2] = item.description, $3[3] = t23;
        else
          t23 = $3[3];
        let descReserve = t23, maxPathLength = columns - 2 - 4 - separatorWidth - descReserve, t32;
        if ($3[4] !== item.displayText || $3[5] !== maxPathLength)
          t32 = truncatePathMiddle(item.displayText, maxPathLength), $3[4] = item.displayText, $3[5] = maxPathLength, $3[6] = t32;
        else
          t32 = $3[6];
        displayText = t32;
      } else if (isMcpResource) {
        let t23;
        if ($3[7] !== item.displayText)
          t23 = truncateToWidth(item.displayText, 30), $3[7] = item.displayText, $3[8] = t23;
        else
          t23 = $3[8];
        displayText = t23;
      } else
        displayText = item.displayText;
      let availableWidth = columns - 2 - stringWidth(displayText) - separatorWidth - 4, lineContent;
      if (item.description) {
        let maxDescLength = Math.max(0, availableWidth), t23;
        if ($3[9] !== item.description || $3[10] !== maxDescLength)
          t23 = truncateToWidth(item.description.replace(/\s+/g, " "), maxDescLength), $3[9] = item.description, $3[10] = maxDescLength, $3[11] = t23;
        else
          t23 = $3[11];
        lineContent = `${icon} ${displayText} \u2013 ${t23}`;
      } else
        lineContent = `${icon} ${displayText}`;
      let t22;
      if ($3[12] !== dimColor || $3[13] !== lineContent || $3[14] !== textColor)
        t22 = /* @__PURE__ */ jsx_dev_runtime159.jsxDEV(ThemedText, {
          color: textColor,
          dimColor,
          wrap: "truncate",
          children: lineContent
        }, void 0, !1, void 0, this), $3[12] = dimColor, $3[13] = lineContent, $3[14] = textColor, $3[15] = t22;
      else
        t22 = $3[15];
      return t22;
    }
    let maxNameWidth = Math.floor(columns * 0.4), displayTextWidth = Math.min(maxColumnWidth ?? stringWidth(item.displayText) + 5, maxNameWidth), textColor_0 = item.color || (isSelected ? "suggestion" : void 0), shouldDim = !isSelected, displayText_0 = item.displayText;
    if (stringWidth(displayText_0) > displayTextWidth - 2) {
      let t12 = displayTextWidth - 2, t22;
      if ($3[16] !== displayText_0 || $3[17] !== t12)
        t22 = truncateToWidth(displayText_0, t12), $3[16] = displayText_0, $3[17] = t12, $3[18] = t22;
      else
        t22 = $3[18];
      displayText_0 = t22;
    }
    let paddedDisplayText = displayText_0 + " ".repeat(Math.max(0, displayTextWidth - stringWidth(displayText_0))), tagText = item.tag ? `[${item.tag}] ` : "", tagWidth = stringWidth(tagText), descriptionWidth = Math.max(0, columns - displayTextWidth - tagWidth - 4), t1;
    if ($3[19] !== descriptionWidth || $3[20] !== item.description)
      t1 = item.description ? truncateToWidth(item.description.replace(/\s+/g, " "), descriptionWidth) : "", $3[19] = descriptionWidth, $3[20] = item.description, $3[21] = t1;
    else
      t1 = $3[21];
    let truncatedDescription = t1, t2;
    if ($3[22] !== paddedDisplayText || $3[23] !== shouldDim || $3[24] !== textColor_0)
      t2 = /* @__PURE__ */ jsx_dev_runtime159.jsxDEV(ThemedText, {
        color: textColor_0,
        dimColor: shouldDim,
        children: paddedDisplayText
      }, void 0, !1, void 0, this), $3[22] = paddedDisplayText, $3[23] = shouldDim, $3[24] = textColor_0, $3[25] = t2;
    else
      t2 = $3[25];
    let t3;
    if ($3[26] !== tagText)
      t3 = tagText ? /* @__PURE__ */ jsx_dev_runtime159.jsxDEV(ThemedText, {
        dimColor: !0,
        children: tagText
      }, void 0, !1, void 0, this) : null, $3[26] = tagText, $3[27] = t3;
    else
      t3 = $3[27];
    let t4 = isSelected ? "suggestion" : void 0, t5 = !isSelected, t6;
    if ($3[28] !== t4 || $3[29] !== t5 || $3[30] !== truncatedDescription)
      t6 = /* @__PURE__ */ jsx_dev_runtime159.jsxDEV(ThemedText, {
        color: t4,
        dimColor: t5,
        children: truncatedDescription
      }, void 0, !1, void 0, this), $3[28] = t4, $3[29] = t5, $3[30] = truncatedDescription, $3[31] = t6;
    else
      t6 = $3[31];
    let t7;
    if ($3[32] !== t2 || $3[33] !== t3 || $3[34] !== t6)
      t7 = /* @__PURE__ */ jsx_dev_runtime159.jsxDEV(ThemedText, {
        wrap: "truncate",
        children: [
          t2,
          t3,
          t6
        ]
      }, void 0, !0, void 0, this), $3[32] = t2, $3[33] = t3, $3[34] = t6, $3[35] = t7;
    else
      t7 = $3[35];
    return t7;
  });
  PromptInputFooterSuggestions_default = import_react89.memo(PromptInputFooterSuggestions);
});
