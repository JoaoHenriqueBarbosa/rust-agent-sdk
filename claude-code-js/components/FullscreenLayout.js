// Original: src/components/FullscreenLayout.tsx
import { fileURLToPath as fileURLToPath7 } from "url";
function useUnseenDivider(messageCount) {
  let [dividerIndex, setDividerIndex] = import_react154.useState(null), countRef = import_react154.useRef(messageCount);
  countRef.current = messageCount;
  let dividerYRef = import_react154.useRef(null), onRepin = import_react154.useCallback(() => {
    setDividerIndex(null);
  }, []), onScrollAway = import_react154.useCallback((handle) => {
    let max2 = Math.max(0, handle.getScrollHeight() - handle.getViewportHeight());
    if (handle.getScrollTop() + handle.getPendingDelta() >= max2)
      return;
    if (dividerYRef.current === null)
      dividerYRef.current = handle.getScrollHeight(), setDividerIndex(countRef.current);
  }, []), jumpToNew = import_react154.useCallback((handle_0) => {
    if (!handle_0)
      return;
    handle_0.scrollToBottom();
  }, []);
  import_react154.useEffect(() => {
    if (dividerIndex === null)
      dividerYRef.current = null;
    else if (messageCount < dividerIndex)
      dividerYRef.current = null, setDividerIndex(null);
  }, [messageCount, dividerIndex]);
  let shiftDivider = import_react154.useCallback((indexDelta, heightDelta) => {
    if (setDividerIndex((idx) => idx === null ? null : idx + indexDelta), dividerYRef.current !== null)
      dividerYRef.current += heightDelta;
  }, []);
  return {
    dividerIndex,
    dividerYRef,
    onScrollAway,
    onRepin,
    jumpToNew,
    shiftDivider
  };
}
function countUnseenAssistantTurns(messages, dividerIndex) {
  let count4 = 0, prevWasAssistant = !1;
  for (let i5 = dividerIndex;i5 < messages.length; i5++) {
    let m4 = messages[i5];
    if (m4.type === "progress")
      continue;
    if (m4.type === "assistant" && !assistantHasVisibleText(m4))
      continue;
    let isAssistant = m4.type === "assistant";
    if (isAssistant && !prevWasAssistant)
      count4++;
    prevWasAssistant = isAssistant;
  }
  return count4;
}
function assistantHasVisibleText(m4) {
  if (m4.type !== "assistant")
    return !1;
  for (let b of m4.message.content)
    if (b.type === "text" && b.text.trim() !== "")
      return !0;
  return !1;
}
function computeUnseenDivider(messages, dividerIndex) {
  if (dividerIndex === null)
    return;
  let anchorIdx = dividerIndex;
  while (anchorIdx < messages.length && (messages[anchorIdx]?.type === "progress" || isNullRenderingAttachment(messages[anchorIdx])))
    anchorIdx++;
  let uuid8 = messages[anchorIdx]?.uuid;
  if (!uuid8)
    return;
  let count4 = countUnseenAssistantTurns(messages, dividerIndex);
  return {
    firstUnseenUuid: uuid8,
    count: Math.max(1, count4)
  };
}
function FullscreenLayout(t0) {
  let $3 = import_compiler_runtime211.c(47), {
    scrollable,
    bottom,
    overlay,
    bottomFloat,
    modal,
    modalScrollRef,
    scrollRef,
    dividerYRef,
    hidePill: t1,
    hideSticky: t2,
    newMessageCount: t3,
    onPillClick
  } = t0, hidePill = t1 === void 0 ? !1 : t1, hideSticky = t2 === void 0 ? !1 : t2, newMessageCount = t3 === void 0 ? 0 : t3, {
    rows: terminalRows,
    columns
  } = useTerminalSize(), [stickyPrompt, setStickyPrompt] = import_react154.useState(null), t4;
  if ($3[0] === Symbol.for("react.memo_cache_sentinel"))
    t4 = {
      setStickyPrompt
    }, $3[0] = t4;
  else
    t4 = $3[0];
  let chromeCtx = t4, t5;
  if ($3[1] !== scrollRef)
    t5 = (listener2) => scrollRef?.current?.subscribe(listener2) ?? _temp128, $3[1] = scrollRef, $3[2] = t5;
  else
    t5 = $3[2];
  let subscribe2 = t5, t6;
  if ($3[3] !== dividerYRef || $3[4] !== scrollRef)
    t6 = () => {
      let s2 = scrollRef?.current, dividerY = dividerYRef?.current;
      if (!s2 || dividerY == null)
        return !1;
      return s2.getScrollTop() + s2.getPendingDelta() + s2.getViewportHeight() < dividerY;
    }, $3[3] = dividerYRef, $3[4] = scrollRef, $3[5] = t6;
  else
    t6 = $3[5];
  let pillVisible = import_react154.useSyncExternalStore(subscribe2, t6), t7;
  if ($3[6] === Symbol.for("react.memo_cache_sentinel"))
    t7 = [], $3[6] = t7;
  else
    t7 = $3[6];
  if (import_react154.useLayoutEffect(_temp331, t7), isFullscreenEnvEnabled()) {
    let sticky = hideSticky ? null : stickyPrompt, headerPrompt = sticky != null && sticky !== "clicked" && overlay == null ? sticky : null, padCollapsed = sticky != null && overlay == null, t82;
    if ($3[7] !== headerPrompt)
      t82 = headerPrompt && /* @__PURE__ */ jsx_dev_runtime266.jsxDEV(StickyPromptHeader, {
        text: headerPrompt.text,
        onClick: headerPrompt.scrollTo
      }, void 0, !1, void 0, this), $3[7] = headerPrompt, $3[8] = t82;
    else
      t82 = $3[8];
    let t9 = padCollapsed ? 0 : 1, t10;
    if ($3[9] !== scrollable)
      t10 = /* @__PURE__ */ jsx_dev_runtime266.jsxDEV(ScrollChromeContext, {
        value: chromeCtx,
        children: scrollable
      }, void 0, !1, void 0, this), $3[9] = scrollable, $3[10] = t10;
    else
      t10 = $3[10];
    let t11;
    if ($3[11] !== overlay || $3[12] !== scrollRef || $3[13] !== t10 || $3[14] !== t9)
      t11 = /* @__PURE__ */ jsx_dev_runtime266.jsxDEV(ScrollBox_default, {
        ref: scrollRef,
        flexGrow: 1,
        flexDirection: "column",
        paddingTop: t9,
        stickyScroll: !0,
        children: [
          t10,
          overlay
        ]
      }, void 0, !0, void 0, this), $3[11] = overlay, $3[12] = scrollRef, $3[13] = t10, $3[14] = t9, $3[15] = t11;
    else
      t11 = $3[15];
    let t12;
    if ($3[16] !== hidePill || $3[17] !== newMessageCount || $3[18] !== onPillClick || $3[19] !== overlay || $3[20] !== pillVisible)
      t12 = !hidePill && pillVisible && overlay == null && /* @__PURE__ */ jsx_dev_runtime266.jsxDEV(NewMessagesPill, {
        count: newMessageCount,
        onClick: onPillClick
      }, void 0, !1, void 0, this), $3[16] = hidePill, $3[17] = newMessageCount, $3[18] = onPillClick, $3[19] = overlay, $3[20] = pillVisible, $3[21] = t12;
    else
      t12 = $3[21];
    let t13;
    if ($3[22] !== bottomFloat)
      t13 = bottomFloat != null && /* @__PURE__ */ jsx_dev_runtime266.jsxDEV(ThemedBox_default, {
        position: "absolute",
        bottom: 0,
        right: 0,
        opaque: !0,
        children: bottomFloat
      }, void 0, !1, void 0, this), $3[22] = bottomFloat, $3[23] = t13;
    else
      t13 = $3[23];
    let t14;
    if ($3[24] !== t11 || $3[25] !== t12 || $3[26] !== t13 || $3[27] !== t82)
      t14 = /* @__PURE__ */ jsx_dev_runtime266.jsxDEV(ThemedBox_default, {
        flexGrow: 1,
        flexDirection: "column",
        overflow: "hidden",
        children: [
          t82,
          t11,
          t12,
          t13
        ]
      }, void 0, !0, void 0, this), $3[24] = t11, $3[25] = t12, $3[26] = t13, $3[27] = t82, $3[28] = t14;
    else
      t14 = $3[28];
    let t15, t16;
    if ($3[29] === Symbol.for("react.memo_cache_sentinel"))
      t15 = /* @__PURE__ */ jsx_dev_runtime266.jsxDEV(SuggestionsOverlay, {}, void 0, !1, void 0, this), t16 = /* @__PURE__ */ jsx_dev_runtime266.jsxDEV(DialogOverlay, {}, void 0, !1, void 0, this), $3[29] = t15, $3[30] = t16;
    else
      t15 = $3[29], t16 = $3[30];
    let t17;
    if ($3[31] !== bottom)
      t17 = /* @__PURE__ */ jsx_dev_runtime266.jsxDEV(ThemedBox_default, {
        flexDirection: "column",
        flexShrink: 0,
        width: "100%",
        maxHeight: "50%",
        children: [
          t15,
          t16,
          /* @__PURE__ */ jsx_dev_runtime266.jsxDEV(ThemedBox_default, {
            flexDirection: "column",
            width: "100%",
            flexGrow: 1,
            overflowY: "hidden",
            children: bottom
          }, void 0, !1, void 0, this)
        ]
      }, void 0, !0, void 0, this), $3[31] = bottom, $3[32] = t17;
    else
      t17 = $3[32];
    let t18;
    if ($3[33] !== columns || $3[34] !== modal || $3[35] !== modalScrollRef || $3[36] !== terminalRows)
      t18 = modal != null && /* @__PURE__ */ jsx_dev_runtime266.jsxDEV(ModalContext, {
        value: {
          rows: terminalRows - MODAL_TRANSCRIPT_PEEK - 1,
          columns: columns - 4,
          scrollRef: modalScrollRef ?? null
        },
        children: /* @__PURE__ */ jsx_dev_runtime266.jsxDEV(ThemedBox_default, {
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          maxHeight: terminalRows - MODAL_TRANSCRIPT_PEEK,
          flexDirection: "column",
          overflow: "hidden",
          opaque: !0,
          children: [
            /* @__PURE__ */ jsx_dev_runtime266.jsxDEV(ThemedBox_default, {
              flexShrink: 0,
              children: /* @__PURE__ */ jsx_dev_runtime266.jsxDEV(ThemedText, {
                color: "permission",
                children: "\u2594".repeat(columns)
              }, void 0, !1, void 0, this)
            }, void 0, !1, void 0, this),
            /* @__PURE__ */ jsx_dev_runtime266.jsxDEV(ThemedBox_default, {
              flexDirection: "column",
              paddingX: 2,
              flexShrink: 0,
              overflow: "hidden",
              children: modal
            }, void 0, !1, void 0, this)
          ]
        }, void 0, !0, void 0, this)
      }, void 0, !1, void 0, this), $3[33] = columns, $3[34] = modal, $3[35] = modalScrollRef, $3[36] = terminalRows, $3[37] = t18;
    else
      t18 = $3[37];
    let t19;
    if ($3[38] !== t14 || $3[39] !== t17 || $3[40] !== t18)
      t19 = /* @__PURE__ */ jsx_dev_runtime266.jsxDEV(PromptOverlayProvider, {
        children: [
          t14,
          t17,
          t18
        ]
      }, void 0, !0, void 0, this), $3[38] = t14, $3[39] = t17, $3[40] = t18, $3[41] = t19;
    else
      t19 = $3[41];
    return t19;
  }
  let t8;
  if ($3[42] !== bottom || $3[43] !== modal || $3[44] !== overlay || $3[45] !== scrollable)
    t8 = /* @__PURE__ */ jsx_dev_runtime266.jsxDEV(jsx_dev_runtime266.Fragment, {
      children: [
        scrollable,
        bottom,
        overlay,
        modal
      ]
    }, void 0, !0, void 0, this), $3[42] = bottom, $3[43] = modal, $3[44] = overlay, $3[45] = scrollable, $3[46] = t8;
  else
    t8 = $3[46];
  return t8;
}
function _temp331() {
  if (!isFullscreenEnvEnabled())
    return;
  let ink = instances_default.get(process.stdout);
  if (!ink)
    return;
  return ink.onHyperlinkClick = _temp247, () => {
    ink.onHyperlinkClick = void 0;
  };
}
function _temp247(url3) {
  if (url3.startsWith("file:"))
    try {
      openPath(fileURLToPath7(url3));
    } catch {}
  else
    openBrowser(url3);
}
function _temp128() {}
function NewMessagesPill(t0) {
  let $3 = import_compiler_runtime211.c(10), {
    count: count4,
    onClick
  } = t0, [hover, setHover] = import_react154.useState(!1), t1, t2;
  if ($3[0] === Symbol.for("react.memo_cache_sentinel"))
    t1 = () => setHover(!0), t2 = () => setHover(!1), $3[0] = t1, $3[1] = t2;
  else
    t1 = $3[0], t2 = $3[1];
  let t3 = hover ? "userMessageBackgroundHover" : "userMessageBackground", t4;
  if ($3[2] !== count4)
    t4 = count4 > 0 ? `${count4} new ${plural(count4, "message")}` : "Jump to bottom", $3[2] = count4, $3[3] = t4;
  else
    t4 = $3[3];
  let t5;
  if ($3[4] !== t3 || $3[5] !== t4)
    t5 = /* @__PURE__ */ jsx_dev_runtime266.jsxDEV(ThemedText, {
      backgroundColor: t3,
      dimColor: !0,
      children: [
        " ",
        t4,
        " ",
        figures_default.arrowDown,
        " "
      ]
    }, void 0, !0, void 0, this), $3[4] = t3, $3[5] = t4, $3[6] = t5;
  else
    t5 = $3[6];
  let t6;
  if ($3[7] !== onClick || $3[8] !== t5)
    t6 = /* @__PURE__ */ jsx_dev_runtime266.jsxDEV(ThemedBox_default, {
      position: "absolute",
      bottom: 0,
      left: 0,
      right: 0,
      justifyContent: "center",
      children: /* @__PURE__ */ jsx_dev_runtime266.jsxDEV(ThemedBox_default, {
        onClick,
        onMouseEnter: t1,
        onMouseLeave: t2,
        children: t5
      }, void 0, !1, void 0, this)
    }, void 0, !1, void 0, this), $3[7] = onClick, $3[8] = t5, $3[9] = t6;
  else
    t6 = $3[9];
  return t6;
}
function StickyPromptHeader(t0) {
  let $3 = import_compiler_runtime211.c(8), {
    text: text2,
    onClick
  } = t0, [hover, setHover] = import_react154.useState(!1), t1 = hover ? "userMessageBackgroundHover" : "userMessageBackground", t2, t3;
  if ($3[0] === Symbol.for("react.memo_cache_sentinel"))
    t2 = () => setHover(!0), t3 = () => setHover(!1), $3[0] = t2, $3[1] = t3;
  else
    t2 = $3[0], t3 = $3[1];
  let t4;
  if ($3[2] !== text2)
    t4 = /* @__PURE__ */ jsx_dev_runtime266.jsxDEV(ThemedText, {
      color: "subtle",
      wrap: "truncate-end",
      children: [
        figures_default.pointer,
        " ",
        text2
      ]
    }, void 0, !0, void 0, this), $3[2] = text2, $3[3] = t4;
  else
    t4 = $3[3];
  let t5;
  if ($3[4] !== onClick || $3[5] !== t1 || $3[6] !== t4)
    t5 = /* @__PURE__ */ jsx_dev_runtime266.jsxDEV(ThemedBox_default, {
      flexShrink: 0,
      width: "100%",
      height: 1,
      paddingRight: 1,
      backgroundColor: t1,
      onClick,
      onMouseEnter: t2,
      onMouseLeave: t3,
      children: t4
    }, void 0, !1, void 0, this), $3[4] = onClick, $3[5] = t1, $3[6] = t4, $3[7] = t5;
  else
    t5 = $3[7];
  return t5;
}
function SuggestionsOverlay() {
  let $3 = import_compiler_runtime211.c(4), data = usePromptOverlay();
  if (!data || data.suggestions.length === 0)
    return null;
  let t0;
  if ($3[0] !== data.maxColumnWidth || $3[1] !== data.selectedSuggestion || $3[2] !== data.suggestions)
    t0 = /* @__PURE__ */ jsx_dev_runtime266.jsxDEV(ThemedBox_default, {
      position: "absolute",
      bottom: "100%",
      left: 0,
      right: 0,
      paddingX: 2,
      paddingTop: 1,
      flexDirection: "column",
      opaque: !0,
      children: /* @__PURE__ */ jsx_dev_runtime266.jsxDEV(PromptInputFooterSuggestions_default, {
        suggestions: data.suggestions,
        selectedSuggestion: data.selectedSuggestion,
        maxColumnWidth: data.maxColumnWidth,
        overlay: !0
      }, void 0, !1, void 0, this)
    }, void 0, !1, void 0, this), $3[0] = data.maxColumnWidth, $3[1] = data.selectedSuggestion, $3[2] = data.suggestions, $3[3] = t0;
  else
    t0 = $3[3];
  return t0;
}
function DialogOverlay() {
  let $3 = import_compiler_runtime211.c(2), node2 = usePromptOverlayDialog();
  if (!node2)
    return null;
  let t0;
  if ($3[0] !== node2)
    t0 = /* @__PURE__ */ jsx_dev_runtime266.jsxDEV(ThemedBox_default, {
      position: "absolute",
      bottom: "100%",
      left: 0,
      right: 0,
      opaque: !0,
      children: node2
    }, void 0, !1, void 0, this), $3[0] = node2, $3[1] = t0;
  else
    t0 = $3[1];
  return t0;
}
var import_compiler_runtime211, import_react154, jsx_dev_runtime266, MODAL_TRANSCRIPT_PEEK = 2, ScrollChromeContext;
var init_FullscreenLayout = __esm(() => {
  init_figures();
  init_modalContext();
  init_promptOverlayContext();
  init_useTerminalSize();
  init_ScrollBox();
  init_instances();
  init_ink2();
  init_browser();
  init_fullscreen();
  init_nullRenderingAttachments();
  init_PromptInputFooterSuggestions();
  import_compiler_runtime211 = __toESM(require_react_compiler_runtime_development(), 1), import_react154 = __toESM(require_react_development(), 1), jsx_dev_runtime266 = __toESM(require_react_jsx_dev_runtime_development(), 1), ScrollChromeContext = import_react154.createContext({
    setStickyPrompt: () => {}
  });
});
