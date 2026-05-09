// function: StickyTracker
function StickyTracker({
  messages,
  start,
  end,
  offsets,
  getItemTop,
  getItemElement,
  scrollRef
}) {
  let {
    setStickyPrompt
  } = import_react155.useContext(ScrollChromeContext), subscribe2 = import_react155.useCallback((listener2) => scrollRef.current?.subscribe(listener2) ?? NOOP_UNSUB2, [scrollRef]);
  import_react155.useSyncExternalStore(subscribe2, () => {
    let s2 = scrollRef.current;
    if (!s2)
      return NaN;
    let t2 = s2.getScrollTop() + s2.getPendingDelta();
    return s2.isSticky() ? -1 - t2 : t2;
  });
  let isSticky = scrollRef.current?.isSticky() ?? !0, target = Math.max(0, (scrollRef.current?.getScrollTop() ?? 0) + (scrollRef.current?.getPendingDelta() ?? 0)), firstVisible = start, firstVisibleTop = -1;
  for (let i5 = end - 1;i5 >= start; i5--) {
    let top = getItemTop(i5);
    if (top >= 0) {
      if (top < target)
        break;
      firstVisibleTop = top;
    }
    firstVisible = i5;
  }
  let idx = -1, text2 = null;
  if (firstVisible > 0 && !isSticky)
    for (let i5 = firstVisible - 1;i5 >= 0; i5--) {
      let t2 = stickyPromptText(messages[i5]);
      if (t2 === null)
        continue;
      let top = getItemTop(i5);
      if (top >= 0 && top + 1 >= target)
        continue;
      idx = i5, text2 = t2;
      break;
    }
  let baseOffset = firstVisibleTop >= 0 ? firstVisibleTop - offsets[firstVisible] : 0, estimate = idx >= 0 ? Math.max(0, baseOffset + offsets[idx]) : -1, pending = import_react155.useRef({
    idx: -1,
    tries: 0
  }), suppress = import_react155.useRef("none"), lastIdx = import_react155.useRef(-1);
  return import_react155.useEffect(() => {
    if (pending.current.idx >= 0)
      return;
    if (suppress.current === "armed") {
      suppress.current = "force";
      return;
    }
    let force = suppress.current === "force";
    if (suppress.current = "none", !force && lastIdx.current === idx)
      return;
    if (lastIdx.current = idx, text2 === null) {
      setStickyPrompt(null);
      return;
    }
    let trimmed = text2.trimStart(), paraEnd = trimmed.search(/\n\s*\n/), collapsed = (paraEnd >= 0 ? trimmed.slice(0, paraEnd) : trimmed).slice(0, STICKY_TEXT_CAP).replace(/\s+/g, " ").trim();
    if (collapsed === "") {
      setStickyPrompt(null);
      return;
    }
    let capturedIdx = idx, capturedEstimate = estimate;
    setStickyPrompt({
      text: collapsed,
      scrollTo: () => {
        setStickyPrompt("clicked"), suppress.current = "armed";
        let el = getItemElement(capturedIdx);
        if (el)
          scrollRef.current?.scrollToElement(el, 1);
        else
          scrollRef.current?.scrollTo(capturedEstimate), pending.current = {
            idx: capturedIdx,
            tries: 0
          };
      }
    });
  }), import_react155.useEffect(() => {
    if (pending.current.idx < 0)
      return;
    let el = getItemElement(pending.current.idx);
    if (el)
      scrollRef.current?.scrollToElement(el, 1), pending.current = {
        idx: -1,
        tries: 0
      };
    else if (++pending.current.tries > 5)
      pending.current = {
        idx: -1,
        tries: 0
      };
  }), null;
}
