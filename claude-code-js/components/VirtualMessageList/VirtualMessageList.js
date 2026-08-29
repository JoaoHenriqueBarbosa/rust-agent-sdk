// function: VirtualMessageList
function VirtualMessageList({
  messages,
  scrollRef,
  columns,
  itemKey,
  renderItem,
  onItemClick,
  isItemClickable,
  isItemExpanded,
  extractSearchText = defaultExtractSearchText,
  trackStickyPrompt,
  selectedIndex,
  cursorNavRef,
  setCursor,
  jumpRef,
  onSearchMatchesChange,
  scanElement,
  setPositions
}) {
  let keysRef = import_react155.useRef([]), prevMessagesRef = import_react155.useRef(messages), prevItemKeyRef = import_react155.useRef(itemKey);
  if (prevItemKeyRef.current !== itemKey || messages.length < keysRef.current.length || messages[0] !== prevMessagesRef.current[0])
    keysRef.current = messages.map((m4) => itemKey(m4));
  else
    for (let i5 = keysRef.current.length;i5 < messages.length; i5++)
      keysRef.current.push(itemKey(messages[i5]));
  prevMessagesRef.current = messages, prevItemKeyRef.current = itemKey;
  let keys3 = keysRef.current, {
    range,
    topSpacer,
    bottomSpacer,
    measureRef,
    spacerRef,
    offsets,
    getItemTop,
    getItemElement,
    getItemHeight,
    scrollToIndex
  } = useVirtualScroll(scrollRef, keys3, columns), [start, end] = range, isVisible = import_react155.useCallback((i5) => {
    if (getItemHeight(i5) === 0)
      return !1;
    return isNavigableMessage(messages[i5]);
  }, [getItemHeight, messages]);
  import_react155.useImperativeHandle(cursorNavRef, () => {
    let select2 = (m4) => setCursor?.({
      uuid: m4.uuid,
      msgType: m4.type,
      expanded: !1,
      toolName: toolCallOf(m4)?.name
    }), selIdx = selectedIndex ?? -1, scan = (from, dir, pred = isVisible) => {
      for (let i5 = from;i5 >= 0 && i5 < messages.length; i5 += dir)
        if (pred(i5))
          return select2(messages[i5]), !0;
      return !1;
    }, isUser = (i5) => isVisible(i5) && messages[i5].type === "user";
    return {
      enterCursor: () => scan(messages.length - 1, -1, isUser),
      navigatePrev: () => scan(selIdx - 1, -1),
      navigateNext: () => {
        if (scan(selIdx + 1, 1))
          return;
        scrollRef.current?.scrollToBottom(), setCursor?.(null);
      },
      navigatePrevUser: () => scan(selIdx - 1, -1, isUser),
      navigateNextUser: () => scan(selIdx + 1, 1, isUser),
      navigateTop: () => scan(0, 1),
      navigateBottom: () => scan(messages.length - 1, -1),
      getSelected: () => selIdx >= 0 ? messages[selIdx] ?? null : null
    };
  }, [messages, selectedIndex, setCursor, isVisible]);
  let jumpState = import_react155.useRef({
    offsets,
    start,
    getItemElement,
    getItemTop,
    messages,
    scrollToIndex
  });
  jumpState.current = {
    offsets,
    start,
    getItemElement,
    getItemTop,
    messages,
    scrollToIndex
  }, import_react155.useEffect(() => {
    if (selectedIndex === void 0)
      return;
    let s2 = jumpState.current, el = s2.getItemElement(selectedIndex);
    if (el)
      scrollRef.current?.scrollToElement(el, 1);
    else
      s2.scrollToIndex(selectedIndex);
  }, [selectedIndex, scrollRef]);
  let scanRequestRef = import_react155.useRef(null), elementPositions = import_react155.useRef({
    msgIdx: -1,
    positions: []
  }), startPtrRef = import_react155.useRef(-1), phantomBurstRef = import_react155.useRef(0), pendingStepRef = import_react155.useRef(0), stepRef = import_react155.useRef(() => {}), highlightRef = import_react155.useRef(() => {}), searchState = import_react155.useRef({
    matches: [],
    ptr: 0,
    screenOrd: 0,
    prefixSum: []
  }), searchAnchor = import_react155.useRef(-1), indexWarmed = import_react155.useRef(!1);
  function targetFor(i5) {
    let top = jumpState.current.getItemTop(i5);
    return Math.max(0, top - HEADROOM);
  }
  function highlight(ord) {
    let s2 = scrollRef.current, {
      msgIdx,
      positions
    } = elementPositions.current;
    if (!s2 || positions.length === 0 || msgIdx < 0) {
      setPositions?.(null);
      return;
    }
    let idx = Math.max(0, Math.min(ord, positions.length - 1)), p4 = positions[idx], top = jumpState.current.getItemTop(msgIdx), vpTop = s2.getViewportTop(), lo = top - s2.getScrollTop(), vp = s2.getViewportHeight(), screenRow = vpTop + lo + p4.row;
    if (screenRow < vpTop || screenRow >= vpTop + vp)
      s2.scrollTo(Math.max(0, top + p4.row - HEADROOM)), lo = top - s2.getScrollTop(), screenRow = vpTop + lo + p4.row;
    setPositions?.({
      positions,
      rowOffset: vpTop + lo,
      currentIdx: idx
    });
    let st = searchState.current, total = st.prefixSum.at(-1) ?? 0, current = (st.prefixSum[st.ptr] ?? 0) + idx + 1;
    onSearchMatchesChange?.(total, current), logForDebugging(`highlight(i=${msgIdx}, ord=${idx}/${positions.length}): pos={row:${p4.row},col:${p4.col}} lo=${lo} screenRow=${screenRow} badge=${current}/${total}`);
  }
  highlightRef.current = highlight;
  let [seekGen, setSeekGen] = import_react155.useState(0), bumpSeek = import_react155.useCallback(() => setSeekGen((g) => g + 1), []);
  import_react155.useEffect(() => {
    let req = scanRequestRef.current;
    if (!req)
      return;
    let {
      idx,
      wantLast,
      tries
    } = req, s2 = scrollRef.current;
    if (!s2)
      return;
    let {
      getItemElement: getItemElement2,
      getItemTop: getItemTop2,
      scrollToIndex: scrollToIndex2
    } = jumpState.current, el = getItemElement2(idx), h4 = el?.yogaNode?.getComputedHeight() ?? 0;
    if (!el || h4 === 0) {
      if (tries > 1) {
        scanRequestRef.current = null, logForDebugging(`seek(i=${idx}): no mount after scrollToIndex, skip`), stepRef.current(wantLast ? -1 : 1);
        return;
      }
      scanRequestRef.current = {
        idx,
        wantLast,
        tries: tries + 1
      }, scrollToIndex2(idx), bumpSeek();
      return;
    }
    scanRequestRef.current = null, s2.scrollTo(Math.max(0, getItemTop2(idx) - HEADROOM));
    let positions = scanElement?.(el) ?? [];
    if (elementPositions.current = {
      msgIdx: idx,
      positions
    }, logForDebugging(`seek(i=${idx} t=${tries}): ${positions.length} positions`), positions.length === 0) {
      if (++phantomBurstRef.current > 20) {
        phantomBurstRef.current = 0;
        return;
      }
      stepRef.current(wantLast ? -1 : 1);
      return;
    }
    phantomBurstRef.current = 0;
    let ord = wantLast ? positions.length - 1 : 0;
    searchState.current.screenOrd = ord, startPtrRef.current = -1, highlightRef.current(ord);
    let pending = pendingStepRef.current;
    if (pending)
      pendingStepRef.current = 0, stepRef.current(pending);
  }, [seekGen]);
  function jump(i5, wantLast) {
    let s2 = scrollRef.current;
    if (!s2)
      return;
    let js = jumpState.current, {
      getItemElement: getItemElement2,
      scrollToIndex: scrollToIndex2
    } = js;
    if (i5 < 0 || i5 >= js.messages.length)
      return;
    setPositions?.(null), elementPositions.current = {
      msgIdx: -1,
      positions: []
    }, scanRequestRef.current = {
      idx: i5,
      wantLast,
      tries: 0
    };
    let el = getItemElement2(i5), h4 = el?.yogaNode?.getComputedHeight() ?? 0;
    if (el && h4 > 0)
      s2.scrollTo(targetFor(i5));
    else
      scrollToIndex2(i5);
    bumpSeek();
  }
  function step(delta) {
    let st = searchState.current, {
      matches: matches2,
      prefixSum
    } = st, total = prefixSum.at(-1) ?? 0;
    if (matches2.length === 0)
      return;
    if (scanRequestRef.current) {
      pendingStepRef.current = delta;
      return;
    }
    if (startPtrRef.current < 0)
      startPtrRef.current = st.ptr;
    let {
      positions
    } = elementPositions.current, newOrd = st.screenOrd + delta;
    if (newOrd >= 0 && newOrd < positions.length) {
      st.screenOrd = newOrd, highlight(newOrd), startPtrRef.current = -1;
      return;
    }
    let ptr = (st.ptr + delta + matches2.length) % matches2.length;
    if (ptr === startPtrRef.current) {
      setPositions?.(null), startPtrRef.current = -1, logForDebugging(`step: wraparound at ptr=${ptr}, all ${matches2.length} msgs phantoms`);
      return;
    }
    st.ptr = ptr, st.screenOrd = 0, jump(matches2[ptr], delta < 0);
    let placeholder = delta < 0 ? prefixSum[ptr + 1] ?? total : prefixSum[ptr] + 1;
    onSearchMatchesChange?.(total, placeholder);
  }
  stepRef.current = step, import_react155.useImperativeHandle(jumpRef, () => ({
    jumpToIndex: (i5) => {
      let s2 = scrollRef.current;
      if (s2)
        s2.scrollTo(targetFor(i5));
    },
    setSearchQuery: (q4) => {
      scanRequestRef.current = null, elementPositions.current = {
        msgIdx: -1,
        positions: []
      }, startPtrRef.current = -1, setPositions?.(null);
      let lq = q4.toLowerCase(), matches2 = [], prefixSum = [0];
      if (lq) {
        let msgs = jumpState.current.messages;
        for (let i5 = 0;i5 < msgs.length; i5++) {
          let text2 = extractSearchText(msgs[i5]), pos = text2.indexOf(lq), cnt = 0;
          while (pos >= 0)
            cnt++, pos = text2.indexOf(lq, pos + lq.length);
          if (cnt > 0)
            matches2.push(i5), prefixSum.push(prefixSum.at(-1) + cnt);
        }
      }
      let total = prefixSum.at(-1), ptr = 0, s2 = scrollRef.current, {
        offsets: offsets2,
        start: start2,
        getItemTop: getItemTop2
      } = jumpState.current, firstTop = getItemTop2(start2), origin2 = firstTop >= 0 ? firstTop - offsets2[start2] : 0;
      if (matches2.length > 0 && s2) {
        let curTop = searchAnchor.current >= 0 ? searchAnchor.current : s2.getScrollTop(), best = 1 / 0;
        for (let k3 = 0;k3 < matches2.length; k3++) {
          let d = Math.abs(origin2 + offsets2[matches2[k3]] - curTop);
          if (d <= best)
            best = d, ptr = k3;
        }
        logForDebugging(`setSearchQuery('${q4}'): ${matches2.length} msgs \xB7 ptr=${ptr} msgIdx=${matches2[ptr]} curTop=${curTop} origin=${origin2}`);
      }
      if (searchState.current = {
        matches: matches2,
        ptr,
        screenOrd: 0,
        prefixSum
      }, matches2.length > 0)
        jump(matches2[ptr], !0);
      else if (searchAnchor.current >= 0 && s2)
        s2.scrollTo(searchAnchor.current);
      onSearchMatchesChange?.(total, matches2.length > 0 ? prefixSum[ptr + 1] ?? total : 0);
    },
    nextMatch: () => step(1),
    prevMatch: () => step(-1),
    setAnchor: () => {
      let s2 = scrollRef.current;
      if (s2)
        searchAnchor.current = s2.getScrollTop();
    },
    disarmSearch: () => {
      setPositions?.(null), scanRequestRef.current = null, elementPositions.current = {
        msgIdx: -1,
        positions: []
      }, startPtrRef.current = -1;
    },
    warmSearchIndex: async () => {
      if (indexWarmed.current)
        return 0;
      let msgs = jumpState.current.messages, CHUNK = 500, workMs = 0, wallStart = performance.now();
      for (let i5 = 0;i5 < msgs.length; i5 += CHUNK) {
        await sleep3(0);
        let t0 = performance.now(), end2 = Math.min(i5 + CHUNK, msgs.length);
        for (let j4 = i5;j4 < end2; j4++)
          extractSearchText(msgs[j4]);
        workMs += performance.now() - t0;
      }
      let wallMs = Math.round(performance.now() - wallStart);
      return logForDebugging(`warmSearchIndex: ${msgs.length} msgs \xB7 work=${Math.round(workMs)}ms wall=${wallMs}ms chunks=${Math.ceil(msgs.length / CHUNK)}`), indexWarmed.current = !0, Math.round(workMs);
    }
  }), [scrollRef]);
  let [hoveredKey, setHoveredKey] = import_react155.useState(null), handlersRef = import_react155.useRef({
    onItemClick,
    setHoveredKey
  });
  handlersRef.current = {
    onItemClick,
    setHoveredKey
  };
  let onClickK = import_react155.useCallback((msg, cellIsBlank) => {
    let h4 = handlersRef.current;
    if (!cellIsBlank && h4.onItemClick)
      h4.onItemClick(msg);
  }, []), onEnterK = import_react155.useCallback((k3) => {
    handlersRef.current.setHoveredKey(k3);
  }, []), onLeaveK = import_react155.useCallback((k3) => {
    handlersRef.current.setHoveredKey((prev) => prev === k3 ? null : prev);
  }, []);
  return /* @__PURE__ */ jsx_dev_runtime267.jsxDEV(jsx_dev_runtime267.Fragment, {
    children: [
      /* @__PURE__ */ jsx_dev_runtime267.jsxDEV(ThemedBox_default, {
        ref: spacerRef,
        height: topSpacer,
        flexShrink: 0
      }, void 0, !1, void 0, this),
      messages.slice(start, end).map((msg, i5) => {
        let idx = start + i5, k3 = keys3[idx], clickable = !!onItemClick && (isItemClickable?.(msg) ?? !0), hovered = clickable && hoveredKey === k3, expanded = isItemExpanded?.(msg);
        return /* @__PURE__ */ jsx_dev_runtime267.jsxDEV(VirtualItem, {
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
        }, k3, !1, void 0, this);
      }),
      bottomSpacer > 0 && /* @__PURE__ */ jsx_dev_runtime267.jsxDEV(ThemedBox_default, {
        height: bottomSpacer,
        flexShrink: 0
      }, void 0, !1, void 0, this),
      trackStickyPrompt && /* @__PURE__ */ jsx_dev_runtime267.jsxDEV(StickyTracker, {
        messages,
        start,
        end,
        offsets,
        getItemTop,
        getItemElement,
        scrollRef
      }, void 0, !1, void 0, this)
    ]
  }, void 0, !0, void 0, this);
}
