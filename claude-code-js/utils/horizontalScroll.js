// Original: src/utils/horizontalScroll.ts
function calculateHorizontalScrollWindow(itemWidths, availableWidth, arrowWidth, selectedIdx, firstItemHasSeparator = !0) {
  let totalItems = itemWidths.length;
  if (totalItems === 0)
    return {
      startIndex: 0,
      endIndex: 0,
      showLeftArrow: !1,
      showRightArrow: !1
    };
  let clampedSelected = Math.max(0, Math.min(selectedIdx, totalItems - 1));
  if (itemWidths.reduce((sum, w2) => sum + w2, 0) <= availableWidth)
    return {
      startIndex: 0,
      endIndex: totalItems,
      showLeftArrow: !1,
      showRightArrow: !1
    };
  let cumulativeWidths = [0];
  for (let i5 = 0;i5 < totalItems; i5++)
    cumulativeWidths.push(cumulativeWidths[i5] + itemWidths[i5]);
  function rangeWidth(start, end) {
    let baseWidth = cumulativeWidths[end] - cumulativeWidths[start];
    if (firstItemHasSeparator && start > 0)
      return baseWidth - 1;
    return baseWidth;
  }
  function getEffectiveWidth(start, end) {
    let width = availableWidth;
    if (start > 0)
      width -= arrowWidth;
    if (end < totalItems)
      width -= arrowWidth;
    return width;
  }
  let startIndex = 0, endIndex = 1;
  while (endIndex < totalItems && rangeWidth(startIndex, endIndex + 1) <= getEffectiveWidth(startIndex, endIndex + 1))
    endIndex++;
  if (clampedSelected >= startIndex && clampedSelected < endIndex)
    return {
      startIndex,
      endIndex,
      showLeftArrow: startIndex > 0,
      showRightArrow: endIndex < totalItems
    };
  if (clampedSelected >= endIndex) {
    endIndex = clampedSelected + 1, startIndex = clampedSelected;
    while (startIndex > 0 && rangeWidth(startIndex - 1, endIndex) <= getEffectiveWidth(startIndex - 1, endIndex))
      startIndex--;
  } else {
    startIndex = clampedSelected, endIndex = clampedSelected + 1;
    while (endIndex < totalItems && rangeWidth(startIndex, endIndex + 1) <= getEffectiveWidth(startIndex, endIndex + 1))
      endIndex++;
  }
  return {
    startIndex,
    endIndex,
    showLeftArrow: startIndex > 0,
    showRightArrow: endIndex < totalItems
  };
}
