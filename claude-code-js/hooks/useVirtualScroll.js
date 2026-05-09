// Original: src/hooks/useVirtualScroll.ts
function useVirtualScroll(scrollRef, itemKeys, columns) {
  let heightCache = import_react152.useRef(/* @__PURE__ */ new Map), offsetVersionRef = import_react152.useRef(0), lastScrollTopRef = import_react152.useRef(0), offsetsRef = import_react152.useRef({
    arr: new Float64Array(0),
    version: -1,
    n: -1
  }), itemRefs = import_react152.useRef(/* @__PURE__ */ new Map), refCache = import_react152.useRef(/* @__PURE__ */ new Map), prevColumns = import_react152.useRef(columns), skipMeasurementRef = import_react152.useRef(!1), prevRangeRef = import_react152.useRef(null), freezeRendersRef = import_react152.useRef(0);
  if (prevColumns.current !== columns) {
    let ratio = prevColumns.current / columns;
    prevColumns.current = columns;
    for (let [k3, h4] of heightCache.current)
      heightCache.current.set(k3, Math.max(1, Math.round(h4 * ratio)));
    offsetVersionRef.current++, skipMeasurementRef.current = !0, freezeRendersRef.current = 2;
  }
  let frozenRange = freezeRendersRef.current > 0 ? prevRangeRef.current : null, listOriginRef = import_react152.useRef(0), spacerRef = import_react152.useRef(null), subscribe2 = import_react152.useCallback((listener2) => scrollRef.current?.subscribe(listener2) ?? NOOP_UNSUB, [scrollRef]);
  import_react152.useSyncExternalStore(subscribe2, () => {
    let s2 = scrollRef.current;
    if (!s2)
      return NaN;
    let target = s2.getScrollTop() + s2.getPendingDelta(), bin = Math.floor(target / SCROLL_QUANTUM);
    return s2.isSticky() ? ~bin : bin;
  });
  let scrollTop = scrollRef.current?.getScrollTop() ?? -1, pendingDelta = scrollRef.current?.getPendingDelta() ?? 0, viewportH = scrollRef.current?.getViewportHeight() ?? 0, isSticky = scrollRef.current?.isSticky() ?? !0;
  import_react152.useMemo(() => {
    let live = new Set(itemKeys), dirty = !1;
    for (let k3 of heightCache.current.keys())
      if (!live.has(k3))
        heightCache.current.delete(k3), dirty = !0;
    for (let k3 of refCache.current.keys())
      if (!live.has(k3))
        refCache.current.delete(k3);
    if (dirty)
      offsetVersionRef.current++;
  }, [itemKeys]);
  let n5 = itemKeys.length;
  if (offsetsRef.current.version !== offsetVersionRef.current || offsetsRef.current.n !== n5) {
    let arr = offsetsRef.current.arr.length >= n5 + 1 ? offsetsRef.current.arr : new Float64Array(n5 + 1);
    arr[0] = 0;
    for (let i5 = 0;i5 < n5; i5++)
      arr[i5 + 1] = arr[i5] + (heightCache.current.get(itemKeys[i5]) ?? DEFAULT_ESTIMATE);
    offsetsRef.current = { arr, version: offsetVersionRef.current, n: n5 };
  }
  let offsets = offsetsRef.current.arr, totalHeight = offsets[n5], start, end;
  if (frozenRange)
    [start, end] = frozenRange, start = Math.min(start, n5), end = Math.min(end, n5);
  else if (viewportH === 0 || scrollTop < 0)
    start = Math.max(0, n5 - COLD_START_COUNT), end = n5;
  else {
    if (isSticky) {
      let budget = viewportH + OVERSCAN_ROWS;
      start = n5;
      while (start > 0 && totalHeight - offsets[start - 1] < budget)
        start--;
      end = n5;
    } else {
      let listOrigin2 = listOriginRef.current, MAX_SPAN_ROWS = viewportH * 3, rawLo = Math.min(scrollTop, scrollTop + pendingDelta), rawHi = Math.max(scrollTop, scrollTop + pendingDelta), span = rawHi - rawLo, clampedLo = span > MAX_SPAN_ROWS ? pendingDelta < 0 ? rawHi - MAX_SPAN_ROWS : rawLo : rawLo, clampedHi = clampedLo + Math.min(span, MAX_SPAN_ROWS), effLo = Math.max(0, clampedLo - listOrigin2), effHi = clampedHi - listOrigin2, lo = effLo - OVERSCAN_ROWS;
      {
        let l3 = 0, r4 = n5;
        while (l3 < r4) {
          let m4 = l3 + r4 >> 1;
          if (offsets[m4 + 1] <= lo)
            l3 = m4 + 1;
          else
            r4 = m4;
        }
        start = l3;
      }
      {
        let p4 = prevRangeRef.current;
        if (p4 && p4[0] < start)
          for (let i5 = p4[0];i5 < Math.min(start, p4[1]); i5++) {
            let k3 = itemKeys[i5];
            if (itemRefs.current.has(k3) && !heightCache.current.has(k3)) {
              start = i5;
              break;
            }
          }
      }
      let needed2 = viewportH + 2 * OVERSCAN_ROWS, maxEnd = Math.min(n5, start + MAX_MOUNTED_ITEMS), coverage2 = 0;
      end = start;
      while (end < maxEnd && (coverage2 < needed2 || offsets[end] < effHi + viewportH + OVERSCAN_ROWS))
        coverage2 += heightCache.current.get(itemKeys[end]) ?? PESSIMISTIC_HEIGHT, end++;
    }
    let needed = viewportH + 2 * OVERSCAN_ROWS, minStart = Math.max(0, end - MAX_MOUNTED_ITEMS), coverage = 0;
    for (let i5 = start;i5 < end; i5++)
      coverage += heightCache.current.get(itemKeys[i5]) ?? PESSIMISTIC_HEIGHT;
    while (start > minStart && coverage < needed)
      start--, coverage += heightCache.current.get(itemKeys[start]) ?? PESSIMISTIC_HEIGHT;
    let prev = prevRangeRef.current, scrollVelocity = Math.abs(scrollTop - lastScrollTopRef.current) + Math.abs(pendingDelta);
    if (prev && scrollVelocity > viewportH * 2) {
      let [pS, pE] = prev;
      if (start < pS - SLIDE_STEP)
        start = pS - SLIDE_STEP;
      if (end > pE + SLIDE_STEP)
        end = pE + SLIDE_STEP;
      if (start > end)
        end = Math.min(start + SLIDE_STEP, n5);
    }
    lastScrollTopRef.current = scrollTop;
  }
  if (freezeRendersRef.current > 0)
    freezeRendersRef.current--;
  else
    prevRangeRef.current = [start, end];
  let dStart = import_react152.useDeferredValue(start), dEnd = import_react152.useDeferredValue(end), effStart = start < dStart ? dStart : start, effEnd = end > dEnd ? dEnd : end;
  if (effStart > effEnd || isSticky)
    effStart = start, effEnd = end;
  if (pendingDelta > 0)
    effEnd = end;
  if (effEnd - effStart > MAX_MOUNTED_ITEMS) {
    let mid = (offsets[effStart] + offsets[effEnd]) / 2;
    if (scrollTop - listOriginRef.current < mid)
      effEnd = effStart + MAX_MOUNTED_ITEMS;
    else
      effStart = effEnd - MAX_MOUNTED_ITEMS;
  }
  let listOrigin = listOriginRef.current, effTopSpacer = offsets[effStart], clampMin = effStart === 0 ? 0 : effTopSpacer + listOrigin, clampMax = effEnd === n5 ? 1 / 0 : Math.max(effTopSpacer, offsets[effEnd] - viewportH) + listOrigin;
  import_react152.useLayoutEffect(() => {
    if (isSticky)
      scrollRef.current?.setClampBounds(void 0, void 0);
    else
      scrollRef.current?.setClampBounds(clampMin, clampMax);
  }), import_react152.useLayoutEffect(() => {
    let spacerYoga = spacerRef.current?.yogaNode;
    if (spacerYoga && spacerYoga.getComputedWidth() > 0)
      listOriginRef.current = spacerYoga.getComputedTop();
    if (skipMeasurementRef.current) {
      skipMeasurementRef.current = !1;
      return;
    }
    let anyChanged = !1;
    for (let [key3, el] of itemRefs.current) {
      let yoga = el.yogaNode;
      if (!yoga)
        continue;
      let h4 = yoga.getComputedHeight(), prev = heightCache.current.get(key3);
      if (h4 > 0) {
        if (prev !== h4)
          heightCache.current.set(key3, h4), anyChanged = !0;
      } else if (yoga.getComputedWidth() > 0 && prev !== 0)
        heightCache.current.set(key3, 0), anyChanged = !0;
    }
    if (anyChanged)
      offsetVersionRef.current++;
  });
  let measureRef = import_react152.useCallback((key3) => {
    let fn = refCache.current.get(key3);
    if (!fn)
      fn = (el) => {
        if (el)
          itemRefs.current.set(key3, el);
        else {
          let yoga = itemRefs.current.get(key3)?.yogaNode;
          if (yoga && !skipMeasurementRef.current) {
            let h4 = yoga.getComputedHeight();
            if ((h4 > 0 || yoga.getComputedWidth() > 0) && heightCache.current.get(key3) !== h4)
              heightCache.current.set(key3, h4), offsetVersionRef.current++;
          }
          itemRefs.current.delete(key3);
        }
      }, refCache.current.set(key3, fn);
    return fn;
  }, []), getItemTop = import_react152.useCallback((index) => {
    let yoga = itemRefs.current.get(itemKeys[index])?.yogaNode;
    if (!yoga || yoga.getComputedWidth() === 0)
      return -1;
    return yoga.getComputedTop();
  }, [itemKeys]), getItemElement = import_react152.useCallback((index) => itemRefs.current.get(itemKeys[index]) ?? null, [itemKeys]), getItemHeight = import_react152.useCallback((index) => heightCache.current.get(itemKeys[index]), [itemKeys]), scrollToIndex = import_react152.useCallback((i5) => {
    let o5 = offsetsRef.current;
    if (i5 < 0 || i5 >= o5.n)
      return;
    scrollRef.current?.scrollTo(o5.arr[i5] + listOriginRef.current);
  }, [scrollRef]), effBottomSpacer = totalHeight - offsets[effEnd];
  return {
    range: [effStart, effEnd],
    topSpacer: effTopSpacer,
    bottomSpacer: effBottomSpacer,
    measureRef,
    spacerRef,
    offsets,
    getItemTop,
    getItemElement,
    getItemHeight,
    scrollToIndex
  };
}
var import_react152, DEFAULT_ESTIMATE = 3, OVERSCAN_ROWS = 80, COLD_START_COUNT = 30, SCROLL_QUANTUM, PESSIMISTIC_HEIGHT = 1, MAX_MOUNTED_ITEMS = 300, SLIDE_STEP = 25, NOOP_UNSUB = () => {};
var init_useVirtualScroll = __esm(() => {
  import_react152 = __toESM(require_react_development(), 1), SCROLL_QUANTUM = OVERSCAN_ROWS >> 1;
});
