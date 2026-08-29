// Original: src/components/TagTabs.tsx
function getTabWidth(tab, maxWidth) {
  if (tab === ALL_TAB_LABEL)
    return ALL_TAB_LABEL.length + TAB_PADDING;
  let tagWidth = stringWidth(tab), effectiveTagWidth = maxWidth ? Math.min(tagWidth, maxWidth - TAB_PADDING - HASH_PREFIX_LENGTH) : tagWidth;
  return Math.max(0, effectiveTagWidth) + TAB_PADDING + HASH_PREFIX_LENGTH;
}
function truncateTag(tag2, maxWidth) {
  let availableForTag = maxWidth - TAB_PADDING - HASH_PREFIX_LENGTH;
  if (stringWidth(tag2) <= availableForTag)
    return tag2;
  if (availableForTag <= 1)
    return tag2.charAt(0);
  return truncateToWidth(tag2, availableForTag);
}
function TagTabs({
  tabs,
  selectedIndex,
  availableWidth,
  showAllProjects = !1
}) {
  let resumeLabel = showAllProjects ? "Resume (All Projects)" : "Resume", resumeLabelWidth = resumeLabel.length + 1, rightHintWidth = Math.max(RIGHT_HINT_WIDTH_WITH_COUNT, RIGHT_HINT_WIDTH_NO_COUNT), maxTabsWidth = availableWidth - resumeLabelWidth - rightHintWidth - 2, safeSelectedIndex = Math.max(0, Math.min(selectedIndex, tabs.length - 1)), maxSingleTabWidth = Math.max(20, Math.floor(maxTabsWidth / 2)), tabWidths = tabs.map((tab) => getTabWidth(tab, maxSingleTabWidth)), startIndex = 0, endIndex = tabs.length;
  if (tabWidths.reduce((sum, w2, i5) => sum + w2 + (i5 < tabWidths.length - 1 ? 1 : 0), 0) > maxTabsWidth) {
    let effectiveMaxWidth = maxTabsWidth - LEFT_ARROW_WIDTH, windowWidth = tabWidths[safeSelectedIndex] ?? 0;
    startIndex = safeSelectedIndex, endIndex = safeSelectedIndex + 1;
    while (startIndex > 0 || endIndex < tabs.length) {
      let canExpandLeft = startIndex > 0, canExpandRight = endIndex < tabs.length;
      if (canExpandLeft) {
        let leftWidth = (tabWidths[startIndex - 1] ?? 0) + 1;
        if (windowWidth + leftWidth <= effectiveMaxWidth) {
          startIndex--, windowWidth += leftWidth;
          continue;
        }
      }
      if (canExpandRight) {
        let rightWidth = (tabWidths[endIndex] ?? 0) + 1;
        if (windowWidth + rightWidth <= effectiveMaxWidth) {
          endIndex++, windowWidth += rightWidth;
          continue;
        }
      }
      break;
    }
  }
  let hiddenLeft = startIndex, hiddenRight = tabs.length - endIndex, visibleTabs = tabs.slice(startIndex, endIndex), visibleIndices = visibleTabs.map((_, i_0) => startIndex + i_0);
  return /* @__PURE__ */ jsx_dev_runtime270.jsxDEV(ThemedBox_default, {
    flexDirection: "row",
    gap: 1,
    children: [
      /* @__PURE__ */ jsx_dev_runtime270.jsxDEV(ThemedText, {
        color: "suggestion",
        children: resumeLabel
      }, void 0, !1, void 0, this),
      hiddenLeft > 0 && /* @__PURE__ */ jsx_dev_runtime270.jsxDEV(ThemedText, {
        dimColor: !0,
        children: [
          LEFT_ARROW_PREFIX,
          hiddenLeft
        ]
      }, void 0, !0, void 0, this),
      visibleTabs.map((tab_0, i_1) => {
        let isSelected = visibleIndices[i_1] === safeSelectedIndex, displayText = tab_0 === ALL_TAB_LABEL ? tab_0 : `#${truncateTag(tab_0, maxSingleTabWidth - TAB_PADDING)}`;
        return /* @__PURE__ */ jsx_dev_runtime270.jsxDEV(ThemedText, {
          backgroundColor: isSelected ? "suggestion" : void 0,
          color: isSelected ? "inverseText" : void 0,
          bold: isSelected,
          children: [
            " ",
            displayText,
            " "
          ]
        }, tab_0, !0, void 0, this);
      }),
      hiddenRight > 0 ? /* @__PURE__ */ jsx_dev_runtime270.jsxDEV(ThemedText, {
        dimColor: !0,
        children: [
          RIGHT_HINT_WITH_COUNT_PREFIX,
          hiddenRight,
          RIGHT_HINT_SUFFIX
        ]
      }, void 0, !0, void 0, this) : /* @__PURE__ */ jsx_dev_runtime270.jsxDEV(ThemedText, {
        dimColor: !0,
        children: RIGHT_HINT_NO_COUNT
      }, void 0, !1, void 0, this)
    ]
  }, void 0, !0, void 0, this);
}
var jsx_dev_runtime270, ALL_TAB_LABEL = "All", TAB_PADDING = 2, HASH_PREFIX_LENGTH = 1, LEFT_ARROW_PREFIX = "\u2190 ", RIGHT_HINT_WITH_COUNT_PREFIX = "\u2192", RIGHT_HINT_SUFFIX = " (tab to cycle)", RIGHT_HINT_NO_COUNT = "(tab to cycle)", MAX_OVERFLOW_DIGITS = 2, LEFT_ARROW_WIDTH, RIGHT_HINT_WIDTH_WITH_COUNT, RIGHT_HINT_WIDTH_NO_COUNT;
var init_TagTabs = __esm(() => {
  init_stringWidth();
  init_ink2();
  init_format();
  jsx_dev_runtime270 = __toESM(require_react_jsx_dev_runtime_development(), 1), LEFT_ARROW_WIDTH = LEFT_ARROW_PREFIX.length + MAX_OVERFLOW_DIGITS + 1, RIGHT_HINT_WIDTH_WITH_COUNT = RIGHT_HINT_WITH_COUNT_PREFIX.length + MAX_OVERFLOW_DIGITS + RIGHT_HINT_SUFFIX.length, RIGHT_HINT_WIDTH_NO_COUNT = RIGHT_HINT_NO_COUNT.length;
});
