// Original: src/components/ScrollKeybindingHandler.tsx
function shouldClearSelectionOnKey(key3) {
  if (key3.wheelUp || key3.wheelDown)
    return !1;
  if ((key3.leftArrow || key3.rightArrow || key3.upArrow || key3.downArrow || key3.home || key3.end || key3.pageUp || key3.pageDown) && (key3.shift || key3.meta || key3.super))
    return !1;
  return !0;
}
function selectionFocusMoveForKey(key3) {
  if (!key3.shift || key3.meta)
    return null;
  if (key3.leftArrow)
    return "left";
  if (key3.rightArrow)
    return "right";
  if (key3.upArrow)
    return "up";
  if (key3.downArrow)
    return "down";
  if (key3.home)
    return "lineStart";
  if (key3.end)
    return "lineEnd";
  return null;
}
function computeWheelStep(state4, dir, now2) {
  if (!state4.xtermJs) {
    if (state4.wheelMode && now2 - state4.time > WHEEL_MODE_IDLE_DISENGAGE_MS)
      state4.wheelMode = !1, state4.burstCount = 0, state4.mult = state4.base;
    if (state4.pendingFlip) {
      if (state4.pendingFlip = !1, dir !== state4.dir || now2 - state4.time > WHEEL_BOUNCE_GAP_MAX_MS)
        return state4.dir = dir, state4.time = now2, state4.mult = state4.base, Math.floor(state4.mult);
      state4.wheelMode = !0;
    }
    let gap2 = now2 - state4.time;
    if (dir !== state4.dir && state4.dir !== 0)
      return state4.pendingFlip = !0, state4.time = now2, 0;
    if (state4.dir = dir, state4.time = now2, state4.wheelMode)
      if (gap2 < WHEEL_BURST_MS)
        if (++state4.burstCount >= 5)
          state4.wheelMode = !1, state4.burstCount = 0, state4.mult = state4.base;
        else
          return 1;
      else
        state4.burstCount = 0;
    if (state4.wheelMode) {
      let m4 = Math.pow(0.5, gap2 / WHEEL_DECAY_HALFLIFE_MS), cap = Math.max(WHEEL_MODE_CAP, state4.base * 2), next2 = 1 + (state4.mult - 1) * m4 + WHEEL_MODE_STEP * m4;
      return state4.mult = Math.min(cap, next2, state4.mult + WHEEL_MODE_RAMP), Math.floor(state4.mult);
    }
    if (gap2 > WHEEL_ACCEL_WINDOW_MS)
      state4.mult = state4.base;
    else {
      let cap = Math.max(WHEEL_ACCEL_MAX, state4.base * 2);
      state4.mult = Math.min(cap, state4.mult + WHEEL_ACCEL_STEP);
    }
    return Math.floor(state4.mult);
  }
  let gap = now2 - state4.time, sameDir = dir === state4.dir;
  if (state4.time = now2, state4.dir = dir, sameDir && gap < WHEEL_BURST_MS)
    return 1;
  if (!sameDir || gap > WHEEL_DECAY_IDLE_MS)
    state4.mult = 2, state4.frac = 0;
  else {
    let m4 = Math.pow(0.5, gap / WHEEL_DECAY_HALFLIFE_MS), cap = gap >= WHEEL_DECAY_GAP_MS ? WHEEL_DECAY_CAP_SLOW : WHEEL_DECAY_CAP_FAST;
    state4.mult = Math.min(cap, 1 + (state4.mult - 1) * m4 + WHEEL_DECAY_STEP * m4);
  }
  let total = state4.mult + state4.frac, rows = Math.floor(total);
  return state4.frac = total - rows, rows;
}
function readScrollSpeedBase() {
  let raw = process.env.CLAUDE_CODE_SCROLL_SPEED;
  if (!raw)
    return 1;
  let n6 = parseFloat(raw);
  return Number.isNaN(n6) || n6 <= 0 ? 1 : Math.min(n6, 20);
}
function initWheelAccel(xtermJs = !1, base2 = 1) {
  return {
    time: 0,
    mult: base2,
    dir: 0,
    xtermJs,
    frac: 0,
    base: base2,
    pendingFlip: !1,
    wheelMode: !1,
    burstCount: 0
  };
}
function initAndLogWheelAccel() {
  let xtermJs = isXtermJs(), base2 = readScrollSpeedBase();
  return logForDebugging(`wheel accel: ${xtermJs ? "decay (xterm.js)" : "window (native)"} \xB7 base=${base2} \xB7 TERM_PROGRAM=${process.env.TERM_PROGRAM ?? "unset"}`), initWheelAccel(xtermJs, base2);
}
function ScrollKeybindingHandler({
  scrollRef,
  isActive,
  onScroll,
  isModal = !1
}) {
  let selection = useSelection(), {
    addNotification
  } = useNotifications(), wheelAccel = import_react301.useRef(null);
  function showCopiedToast(text2) {
    let path27 = getClipboardPath(), n6 = text2.length, msg;
    switch (path27) {
      case "native":
        msg = `copied ${n6} chars to clipboard`;
        break;
      case "tmux-buffer":
        msg = `copied ${n6} chars to tmux buffer \xB7 paste with prefix + ]`;
        break;
      case "osc52":
        msg = `sent ${n6} chars via OSC 52 \xB7 check terminal clipboard settings if paste fails`;
        break;
    }
    addNotification({
      key: "selection-copied",
      text: msg,
      color: "suggestion",
      priority: "immediate",
      timeoutMs: path27 === "native" ? 2000 : 4000
    });
  }
  function copyAndToast() {
    let text_0 = selection.copySelection();
    if (text_0)
      showCopiedToast(text_0);
  }
  function translateSelectionForJump(s2, delta) {
    let sel = selection.getState();
    if (!sel?.anchor || !sel.focus)
      return;
    let top = s2.getViewportTop(), bottom = top + s2.getViewportHeight() - 1;
    if (sel.anchor.row < top || sel.anchor.row > bottom)
      return;
    if (sel.focus.row < top || sel.focus.row > bottom)
      return;
    let max2 = Math.max(0, s2.getScrollHeight() - s2.getViewportHeight()), cur = s2.getScrollTop() + s2.getPendingDelta(), actual = Math.max(0, Math.min(max2, cur + delta)) - cur;
    if (actual === 0)
      return;
    if (actual > 0)
      selection.captureScrolledRows(top, top + actual - 1, "above"), selection.shiftSelection(-actual, top, bottom);
    else {
      let a2 = -actual;
      selection.captureScrolledRows(bottom - a2 + 1, bottom, "below"), selection.shiftSelection(a2, top, bottom);
    }
  }
  return useKeybindings({
    "scroll:pageUp": () => {
      let s_0 = scrollRef.current;
      if (!s_0)
        return;
      let d = -Math.max(1, Math.floor(s_0.getViewportHeight() / 2));
      translateSelectionForJump(s_0, d);
      let sticky = jumpBy(s_0, d);
      onScroll?.(sticky, s_0);
    },
    "scroll:pageDown": () => {
      let s_1 = scrollRef.current;
      if (!s_1)
        return;
      let d_0 = Math.max(1, Math.floor(s_1.getViewportHeight() / 2));
      translateSelectionForJump(s_1, d_0);
      let sticky_0 = jumpBy(s_1, d_0);
      onScroll?.(sticky_0, s_1);
    },
    "scroll:lineUp": () => {
      selection.clearSelection();
      let s_2 = scrollRef.current;
      if (!s_2 || s_2.getScrollHeight() <= s_2.getViewportHeight())
        return !1;
      wheelAccel.current ??= initAndLogWheelAccel(), scrollUp2(s_2, computeWheelStep(wheelAccel.current, -1, performance.now())), onScroll?.(!1, s_2);
    },
    "scroll:lineDown": () => {
      selection.clearSelection();
      let s_3 = scrollRef.current;
      if (!s_3 || s_3.getScrollHeight() <= s_3.getViewportHeight())
        return !1;
      wheelAccel.current ??= initAndLogWheelAccel();
      let step = computeWheelStep(wheelAccel.current, 1, performance.now()), reachedBottom = scrollDown2(s_3, step);
      onScroll?.(reachedBottom, s_3);
    },
    "scroll:top": () => {
      let s_4 = scrollRef.current;
      if (!s_4)
        return;
      translateSelectionForJump(s_4, -(s_4.getScrollTop() + s_4.getPendingDelta())), s_4.scrollTo(0), onScroll?.(!1, s_4);
    },
    "scroll:bottom": () => {
      let s_5 = scrollRef.current;
      if (!s_5)
        return;
      let max_0 = Math.max(0, s_5.getScrollHeight() - s_5.getViewportHeight());
      translateSelectionForJump(s_5, max_0 - (s_5.getScrollTop() + s_5.getPendingDelta())), s_5.scrollTo(max_0), s_5.scrollToBottom(), onScroll?.(!0, s_5);
    },
    "selection:copy": copyAndToast
  }, {
    context: "Scroll",
    isActive
  }), useKeybindings({
    "scroll:halfPageUp": () => {
      let s_6 = scrollRef.current;
      if (!s_6)
        return;
      let d_1 = -Math.max(1, Math.floor(s_6.getViewportHeight() / 2));
      translateSelectionForJump(s_6, d_1);
      let sticky_1 = jumpBy(s_6, d_1);
      onScroll?.(sticky_1, s_6);
    },
    "scroll:halfPageDown": () => {
      let s_7 = scrollRef.current;
      if (!s_7)
        return;
      let d_2 = Math.max(1, Math.floor(s_7.getViewportHeight() / 2));
      translateSelectionForJump(s_7, d_2);
      let sticky_2 = jumpBy(s_7, d_2);
      onScroll?.(sticky_2, s_7);
    },
    "scroll:fullPageUp": () => {
      let s_8 = scrollRef.current;
      if (!s_8)
        return;
      let d_3 = -Math.max(1, s_8.getViewportHeight());
      translateSelectionForJump(s_8, d_3);
      let sticky_3 = jumpBy(s_8, d_3);
      onScroll?.(sticky_3, s_8);
    },
    "scroll:fullPageDown": () => {
      let s_9 = scrollRef.current;
      if (!s_9)
        return;
      let d_4 = Math.max(1, s_9.getViewportHeight());
      translateSelectionForJump(s_9, d_4);
      let sticky_4 = jumpBy(s_9, d_4);
      onScroll?.(sticky_4, s_9);
    }
  }, {
    context: "Scroll",
    isActive
  }), use_input_default((input, key3, event) => {
    let s_10 = scrollRef.current;
    if (!s_10)
      return;
    let sticky_5 = applyModalPagerAction(s_10, modalPagerAction(input, key3), (d_5) => translateSelectionForJump(s_10, d_5));
    if (sticky_5 === null)
      return;
    onScroll?.(sticky_5, s_10), event.stopImmediatePropagation();
  }, {
    isActive: isActive && isModal
  }), use_input_default((input_0, key_0, event_0) => {
    if (!selection.hasSelection())
      return;
    if (key_0.escape) {
      selection.clearSelection(), event_0.stopImmediatePropagation();
      return;
    }
    if (key_0.ctrl && !key_0.shift && !key_0.meta && input_0 === "c") {
      copyAndToast(), event_0.stopImmediatePropagation();
      return;
    }
    let move = selectionFocusMoveForKey(key_0);
    if (move) {
      selection.moveFocus(move), event_0.stopImmediatePropagation();
      return;
    }
    if (shouldClearSelectionOnKey(key_0))
      selection.clearSelection();
  }, {
    isActive
  }), useDragToScroll(scrollRef, selection, isActive, onScroll), useCopyOnSelect(selection, isActive, showCopiedToast), useSelectionBgColor(selection), null;
}
function useDragToScroll(scrollRef, selection, isActive, onScroll) {
  let timerRef = import_react301.useRef(null), dirRef = import_react301.useRef(0), lastScrolledDirRef = import_react301.useRef(0), ticksRef = import_react301.useRef(0), onScrollRef = import_react301.useRef(onScroll);
  onScrollRef.current = onScroll, import_react301.useEffect(() => {
    if (!isActive)
      return;
    function stop() {
      if (dirRef.current = 0, timerRef.current)
        clearInterval(timerRef.current), timerRef.current = null;
    }
    function tick() {
      let sel = selection.getState(), s2 = scrollRef.current, dir = dirRef.current;
      if (!sel?.isDragging || !sel.focus || !s2 || dir === 0 || ++ticksRef.current > AUTOSCROLL_MAX_TICKS) {
        stop();
        return;
      }
      if (s2.getPendingDelta() !== 0)
        return;
      let top = s2.getViewportTop(), bottom = top + s2.getViewportHeight() - 1;
      if (dir < 0) {
        if (s2.getScrollTop() <= 0) {
          stop();
          return;
        }
        let actual = Math.min(AUTOSCROLL_LINES, s2.getScrollTop());
        selection.captureScrolledRows(bottom - actual + 1, bottom, "below"), selection.shiftAnchor(actual, 0, bottom), s2.scrollBy(-AUTOSCROLL_LINES);
      } else {
        let max2 = Math.max(0, s2.getScrollHeight() - s2.getViewportHeight());
        if (s2.getScrollTop() >= max2) {
          stop();
          return;
        }
        let actual_0 = Math.min(AUTOSCROLL_LINES, max2 - s2.getScrollTop());
        selection.captureScrolledRows(top, top + actual_0 - 1, "above"), selection.shiftAnchor(-actual_0, top, bottom), s2.scrollBy(AUTOSCROLL_LINES);
      }
      onScrollRef.current?.(!1, s2);
    }
    function start(dir_0) {
      if (lastScrolledDirRef.current = dir_0, dirRef.current === dir_0)
        return;
      if (stop(), dirRef.current = dir_0, ticksRef.current = 0, tick(), dirRef.current === dir_0)
        timerRef.current = setInterval(tick, AUTOSCROLL_INTERVAL_MS);
    }
    function check3() {
      let s_0 = scrollRef.current;
      if (!s_0) {
        stop();
        return;
      }
      let top_0 = s_0.getViewportTop(), bottom_0 = top_0 + s_0.getViewportHeight() - 1, sel_0 = selection.getState();
      if (!sel_0?.isDragging || sel_0.scrolledOffAbove.length === 0 && sel_0.scrolledOffBelow.length === 0)
        lastScrolledDirRef.current = 0;
      let dir_1 = dragScrollDirection(sel_0, top_0, bottom_0, lastScrolledDirRef.current);
      if (dir_1 === 0) {
        if (lastScrolledDirRef.current !== 0 && sel_0?.focus) {
          let want = sel_0.focus.row < top_0 ? -1 : sel_0.focus.row > bottom_0 ? 1 : 0;
          if (want !== 0 && want !== lastScrolledDirRef.current)
            sel_0.scrolledOffAbove = [], sel_0.scrolledOffBelow = [], sel_0.scrolledOffAboveSW = [], sel_0.scrolledOffBelowSW = [], lastScrolledDirRef.current = 0;
        }
        stop();
      } else
        start(dir_1);
    }
    let unsubscribe2 = selection.subscribe(check3);
    return () => {
      unsubscribe2(), stop(), lastScrolledDirRef.current = 0;
    };
  }, [isActive, scrollRef, selection]);
}
function dragScrollDirection(sel, top, bottom, alreadyScrollingDir = 0) {
  if (!sel?.isDragging || !sel.anchor || !sel.focus)
    return 0;
  let row = sel.focus.row, want = row < top ? -1 : row > bottom ? 1 : 0;
  if (alreadyScrollingDir !== 0)
    return want === alreadyScrollingDir ? want : 0;
  if (sel.anchor.row < top || sel.anchor.row > bottom)
    return 0;
  return want;
}
function jumpBy(s2, delta) {
  let max2 = Math.max(0, s2.getScrollHeight() - s2.getViewportHeight()), target = s2.getScrollTop() + s2.getPendingDelta() + delta;
  if (target >= max2)
    return s2.scrollTo(max2), s2.scrollToBottom(), !0;
  return s2.scrollTo(Math.max(0, target)), !1;
}
function scrollDown2(s2, amount) {
  let max2 = Math.max(0, s2.getScrollHeight() - s2.getViewportHeight());
  if (s2.getScrollTop() + s2.getPendingDelta() + amount >= max2)
    return s2.scrollToBottom(), !0;
  return s2.scrollBy(amount), !1;
}
function scrollUp2(s2, amount) {
  if (s2.getScrollTop() + s2.getPendingDelta() - amount <= 0) {
    s2.scrollTo(0);
    return;
  }
  s2.scrollBy(-amount);
}
function modalPagerAction(input, key3) {
  if (key3.meta)
    return null;
  if (!key3.ctrl && !key3.shift) {
    if (key3.upArrow)
      return "lineUp";
    if (key3.downArrow)
      return "lineDown";
    if (key3.home)
      return "top";
    if (key3.end)
      return "bottom";
  }
  if (key3.ctrl) {
    if (key3.shift)
      return null;
    switch (input) {
      case "u":
        return "halfPageUp";
      case "d":
        return "halfPageDown";
      case "b":
        return "fullPageUp";
      case "f":
        return "fullPageDown";
      case "n":
        return "lineDown";
      case "p":
        return "lineUp";
      default:
        return null;
    }
  }
  let c3 = input[0];
  if (!c3 || input !== c3.repeat(input.length))
    return null;
  if (c3 === "G" || c3 === "g" && key3.shift)
    return "bottom";
  if (key3.shift)
    return null;
  switch (c3) {
    case "g":
      return "top";
    case "j":
      return "lineDown";
    case "k":
      return "lineUp";
    case " ":
      return "fullPageDown";
    case "b":
      return "fullPageUp";
    default:
      return null;
  }
}
function applyModalPagerAction(s2, act, onBeforeJump) {
  switch (act) {
    case null:
      return null;
    case "lineUp":
    case "lineDown": {
      let d = act === "lineDown" ? 1 : -1;
      return onBeforeJump(d), jumpBy(s2, d);
    }
    case "halfPageUp":
    case "halfPageDown": {
      let half = Math.max(1, Math.floor(s2.getViewportHeight() / 2)), d = act === "halfPageDown" ? half : -half;
      return onBeforeJump(d), jumpBy(s2, d);
    }
    case "fullPageUp":
    case "fullPageDown": {
      let page = Math.max(1, s2.getViewportHeight()), d = act === "fullPageDown" ? page : -page;
      return onBeforeJump(d), jumpBy(s2, d);
    }
    case "top":
      return onBeforeJump(-(s2.getScrollTop() + s2.getPendingDelta())), s2.scrollTo(0), !1;
    case "bottom": {
      let max2 = Math.max(0, s2.getScrollHeight() - s2.getViewportHeight());
      return onBeforeJump(max2 - (s2.getScrollTop() + s2.getPendingDelta())), s2.scrollTo(max2), s2.scrollToBottom(), !0;
    }
  }
}
var import_react301, WHEEL_ACCEL_WINDOW_MS = 40, WHEEL_ACCEL_STEP = 0.3, WHEEL_ACCEL_MAX = 6, WHEEL_BOUNCE_GAP_MAX_MS = 200, WHEEL_MODE_STEP = 15, WHEEL_MODE_CAP = 15, WHEEL_MODE_RAMP = 3, WHEEL_MODE_IDLE_DISENGAGE_MS = 1500, WHEEL_DECAY_HALFLIFE_MS = 150, WHEEL_DECAY_STEP = 5, WHEEL_BURST_MS = 5, WHEEL_DECAY_GAP_MS = 80, WHEEL_DECAY_CAP_SLOW = 3, WHEEL_DECAY_CAP_FAST = 6, WHEEL_DECAY_IDLE_MS = 500, AUTOSCROLL_LINES = 2, AUTOSCROLL_INTERVAL_MS = 50, AUTOSCROLL_MAX_TICKS = 200;
var init_ScrollKeybindingHandler = __esm(() => {
  init_notifications();
  init_useCopyOnSelect();
  init_use_selection();
  init_terminal();
  init_osc();
  init_ink2();
  init_useKeybinding();
  init_debug();
  import_react301 = __toESM(require_react_development(), 1);
});
