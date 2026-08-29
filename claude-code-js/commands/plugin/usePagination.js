// Original: src/commands/plugin/usePagination.ts
function usePagination2({
  totalItems,
  maxVisible = DEFAULT_MAX_VISIBLE,
  selectedIndex = 0
}) {
  let needsPagination = totalItems > maxVisible, scrollOffsetRef = import_react133.useRef(0), scrollOffset = import_react133.useMemo(() => {
    if (!needsPagination)
      return 0;
    let prevOffset = scrollOffsetRef.current;
    if (selectedIndex < prevOffset)
      return scrollOffsetRef.current = selectedIndex, selectedIndex;
    if (selectedIndex >= prevOffset + maxVisible) {
      let newOffset = selectedIndex - maxVisible + 1;
      return scrollOffsetRef.current = newOffset, newOffset;
    }
    let maxOffset = Math.max(0, totalItems - maxVisible), clampedOffset = Math.min(prevOffset, maxOffset);
    return scrollOffsetRef.current = clampedOffset, clampedOffset;
  }, [selectedIndex, maxVisible, needsPagination, totalItems]), startIndex = scrollOffset, endIndex = Math.min(scrollOffset + maxVisible, totalItems), getVisibleItems = import_react133.useCallback((items) => {
    if (!needsPagination)
      return items;
    return items.slice(startIndex, endIndex);
  }, [needsPagination, startIndex, endIndex]), toActualIndex = import_react133.useCallback((visibleIndex) => {
    return startIndex + visibleIndex;
  }, [startIndex]), isOnCurrentPage = import_react133.useCallback((actualIndex) => {
    return actualIndex >= startIndex && actualIndex < endIndex;
  }, [startIndex, endIndex]), goToPage = import_react133.useCallback((_page) => {}, []), nextPage = import_react133.useCallback(() => {}, []), prevPage = import_react133.useCallback(() => {}, []), handleSelectionChange = import_react133.useCallback((newIndex, setSelectedIndex) => {
    let clampedIndex = Math.max(0, Math.min(newIndex, totalItems - 1));
    setSelectedIndex(clampedIndex);
  }, [totalItems]), handlePageNavigation = import_react133.useCallback((_direction, _setSelectedIndex) => {
    return !1;
  }, []), totalPages = Math.max(1, Math.ceil(totalItems / maxVisible));
  return {
    currentPage: Math.floor(scrollOffset / maxVisible),
    totalPages,
    startIndex,
    endIndex,
    needsPagination,
    pageSize: maxVisible,
    getVisibleItems,
    toActualIndex,
    isOnCurrentPage,
    goToPage,
    nextPage,
    prevPage,
    handleSelectionChange,
    handlePageNavigation,
    scrollPosition: {
      current: selectedIndex + 1,
      total: totalItems,
      canScrollUp: scrollOffset > 0,
      canScrollDown: scrollOffset + maxVisible < totalItems
    }
  };
}
var import_react133, DEFAULT_MAX_VISIBLE = 5;
var init_usePagination = __esm(() => {
  import_react133 = __toESM(require_react_development(), 1);
});
