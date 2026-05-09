// Original: src/ink/components/ScrollBox.tsx
function ScrollBox({
  children,
  ref,
  stickyScroll,
  ...style
}) {
  let domRef = import_react92.useRef(null), [, forceRender] = import_react92.useState(0), listenersRef = import_react92.useRef(/* @__PURE__ */ new Set), renderQueuedRef = import_react92.useRef(!1), notify2 = () => {
    for (let l3 of listenersRef.current)
      l3();
  };
  function scrollMutated(el) {
    if (markScrollActivity(), markDirty(el), markCommitStart(), notify2(), renderQueuedRef.current)
      return;
    renderQueuedRef.current = !0, queueMicrotask(() => {
      renderQueuedRef.current = !1, scheduleRenderFrom(el);
    });
  }
  return import_react92.useImperativeHandle(ref, () => ({
    scrollTo(y2) {
      let el = domRef.current;
      if (!el)
        return;
      el.stickyScroll = !1, el.pendingScrollDelta = void 0, el.scrollAnchor = void 0, el.scrollTop = Math.max(0, Math.floor(y2)), scrollMutated(el);
    },
    scrollToElement(el, offset = 0) {
      let box = domRef.current;
      if (!box)
        return;
      box.stickyScroll = !1, box.pendingScrollDelta = void 0, box.scrollAnchor = {
        el,
        offset
      }, scrollMutated(box);
    },
    scrollBy(dy) {
      let el = domRef.current;
      if (!el)
        return;
      el.stickyScroll = !1, el.scrollAnchor = void 0, el.pendingScrollDelta = (el.pendingScrollDelta ?? 0) + Math.floor(dy), scrollMutated(el);
    },
    scrollToBottom() {
      let el = domRef.current;
      if (!el)
        return;
      el.pendingScrollDelta = void 0, el.stickyScroll = !0, markDirty(el), notify2(), forceRender((n5) => n5 + 1);
    },
    getScrollTop() {
      return domRef.current?.scrollTop ?? 0;
    },
    getPendingDelta() {
      return domRef.current?.pendingScrollDelta ?? 0;
    },
    getScrollHeight() {
      return domRef.current?.scrollHeight ?? 0;
    },
    getFreshScrollHeight() {
      return domRef.current?.childNodes[0]?.yogaNode?.getComputedHeight() ?? domRef.current?.scrollHeight ?? 0;
    },
    getViewportHeight() {
      return domRef.current?.scrollViewportHeight ?? 0;
    },
    getViewportTop() {
      return domRef.current?.scrollViewportTop ?? 0;
    },
    isSticky() {
      let el = domRef.current;
      if (!el)
        return !1;
      return el.stickyScroll ?? Boolean(el.attributes.stickyScroll);
    },
    subscribe(listener2) {
      return listenersRef.current.add(listener2), () => listenersRef.current.delete(listener2);
    },
    setClampBounds(min, max2) {
      let el = domRef.current;
      if (!el)
        return;
      el.scrollClampMin = min, el.scrollClampMax = max2;
    }
  }), []), /* @__PURE__ */ jsx_dev_runtime162.jsxDEV("ink-box", {
    ref: (el) => {
      if (domRef.current = el, el)
        el.scrollTop ??= 0;
    },
    style: {
      flexWrap: "nowrap",
      flexDirection: style.flexDirection ?? "row",
      flexGrow: style.flexGrow ?? 0,
      flexShrink: style.flexShrink ?? 1,
      ...style,
      overflowX: "scroll",
      overflowY: "scroll"
    },
    ...stickyScroll ? {
      stickyScroll: !0
    } : {},
    children: /* @__PURE__ */ jsx_dev_runtime162.jsxDEV(Box_default, {
      flexDirection: "column",
      flexGrow: 1,
      flexShrink: 0,
      width: "100%",
      children
    }, void 0, !1, void 0, this)
  }, void 0, !1, void 0, this);
}
var import_react92, jsx_dev_runtime162, ScrollBox_default;
var init_ScrollBox = __esm(() => {
  init_state();
  init_dom();
  init_reconciler();
  init_Box();
  import_react92 = __toESM(require_react_development(), 1), jsx_dev_runtime162 = __toESM(require_react_jsx_dev_runtime_development(), 1);
  ScrollBox_default = ScrollBox;
});
