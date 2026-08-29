// Original: src/commands/btw/btw.tsx
var exports_btw = {};
__export(exports_btw, {
  call: () => call7
});
function BtwSideQuestion(t0) {
  let $3 = import_compiler_runtime129.c(25), {
    question,
    context: context6,
    onDone
  } = t0, [response7, setResponse] = import_react93.useState(null), [error44, setError] = import_react93.useState(null), [frame, setFrame] = import_react93.useState(0), scrollRef = import_react93.useRef(null), {
    rows
  } = useModalOrTerminalSize(useTerminalSize()), t1;
  if ($3[0] === Symbol.for("react.memo_cache_sentinel"))
    t1 = () => setFrame(_temp60), $3[0] = t1;
  else
    t1 = $3[0];
  useInterval(t1, response7 || error44 ? null : 80);
  let t2;
  if ($3[1] !== onDone)
    t2 = function(e) {
      if (e.key === "escape" || e.key === "return" || e.key === " " || e.ctrl && (e.key === "c" || e.key === "d")) {
        e.preventDefault(), onDone(void 0, {
          display: "skip"
        });
        return;
      }
      if (e.key === "up" || e.ctrl && e.key === "p")
        e.preventDefault(), scrollRef.current?.scrollBy(-SCROLL_LINES);
      if (e.key === "down" || e.ctrl && e.key === "n")
        e.preventDefault(), scrollRef.current?.scrollBy(SCROLL_LINES);
    }, $3[1] = onDone, $3[2] = t2;
  else
    t2 = $3[2];
  let handleKeyDown = t2, t3, t4;
  if ($3[3] !== context6 || $3[4] !== question)
    t3 = () => {
      let abortController = createAbortController();
      return async function() {
        try {
          let cacheSafeParams = await buildCacheSafeParams(context6), result = await runSideQuestion({
            question,
            cacheSafeParams
          });
          if (!abortController.signal.aborted)
            if (result.response)
              setResponse(result.response);
            else
              setError("No response received");
        } catch (t52) {
          let err2 = t52;
          if (!abortController.signal.aborted)
            setError(errorMessage(err2) || "Failed to get response");
        }
      }(), () => {
        abortController.abort();
      };
    }, t4 = [question, context6], $3[3] = context6, $3[4] = question, $3[5] = t3, $3[6] = t4;
  else
    t3 = $3[5], t4 = $3[6];
  import_react93.useEffect(t3, t4);
  let maxContentHeight = Math.max(5, rows - CHROME_ROWS - OUTER_CHROME_ROWS), t5;
  if ($3[7] === Symbol.for("react.memo_cache_sentinel"))
    t5 = /* @__PURE__ */ jsx_dev_runtime163.jsxDEV(ThemedText, {
      color: "warning",
      bold: !0,
      children: [
        "/btw",
        " "
      ]
    }, void 0, !0, void 0, this), $3[7] = t5;
  else
    t5 = $3[7];
  let t6;
  if ($3[8] !== question)
    t6 = /* @__PURE__ */ jsx_dev_runtime163.jsxDEV(ThemedBox_default, {
      children: [
        t5,
        /* @__PURE__ */ jsx_dev_runtime163.jsxDEV(ThemedText, {
          dimColor: !0,
          children: question
        }, void 0, !1, void 0, this)
      ]
    }, void 0, !0, void 0, this), $3[8] = question, $3[9] = t6;
  else
    t6 = $3[9];
  let t7;
  if ($3[10] !== error44 || $3[11] !== frame || $3[12] !== response7)
    t7 = /* @__PURE__ */ jsx_dev_runtime163.jsxDEV(ScrollBox_default, {
      ref: scrollRef,
      flexDirection: "column",
      flexGrow: 1,
      children: error44 ? /* @__PURE__ */ jsx_dev_runtime163.jsxDEV(ThemedText, {
        color: "error",
        children: error44
      }, void 0, !1, void 0, this) : response7 ? /* @__PURE__ */ jsx_dev_runtime163.jsxDEV(Markdown, {
        children: response7
      }, void 0, !1, void 0, this) : /* @__PURE__ */ jsx_dev_runtime163.jsxDEV(ThemedBox_default, {
        children: [
          /* @__PURE__ */ jsx_dev_runtime163.jsxDEV(SpinnerGlyph, {
            frame,
            messageColor: "warning"
          }, void 0, !1, void 0, this),
          /* @__PURE__ */ jsx_dev_runtime163.jsxDEV(ThemedText, {
            color: "warning",
            children: "Answering..."
          }, void 0, !1, void 0, this)
        ]
      }, void 0, !0, void 0, this)
    }, void 0, !1, void 0, this), $3[10] = error44, $3[11] = frame, $3[12] = response7, $3[13] = t7;
  else
    t7 = $3[13];
  let t8;
  if ($3[14] !== maxContentHeight || $3[15] !== t7)
    t8 = /* @__PURE__ */ jsx_dev_runtime163.jsxDEV(ThemedBox_default, {
      marginTop: 1,
      marginLeft: 2,
      maxHeight: maxContentHeight,
      children: t7
    }, void 0, !1, void 0, this), $3[14] = maxContentHeight, $3[15] = t7, $3[16] = t8;
  else
    t8 = $3[16];
  let t9;
  if ($3[17] !== error44 || $3[18] !== response7)
    t9 = (response7 || error44) && /* @__PURE__ */ jsx_dev_runtime163.jsxDEV(ThemedBox_default, {
      marginTop: 1,
      children: /* @__PURE__ */ jsx_dev_runtime163.jsxDEV(ThemedText, {
        dimColor: !0,
        children: [
          UP_ARROW,
          "/",
          DOWN_ARROW,
          " to scroll \xB7 Space, Enter, or Escape to dismiss"
        ]
      }, void 0, !0, void 0, this)
    }, void 0, !1, void 0, this), $3[17] = error44, $3[18] = response7, $3[19] = t9;
  else
    t9 = $3[19];
  let t10;
  if ($3[20] !== handleKeyDown || $3[21] !== t6 || $3[22] !== t8 || $3[23] !== t9)
    t10 = /* @__PURE__ */ jsx_dev_runtime163.jsxDEV(ThemedBox_default, {
      flexDirection: "column",
      paddingLeft: 2,
      marginTop: 1,
      tabIndex: 0,
      autoFocus: !0,
      onKeyDown: handleKeyDown,
      children: [
        t6,
        t8,
        t9
      ]
    }, void 0, !0, void 0, this), $3[20] = handleKeyDown, $3[21] = t6, $3[22] = t8, $3[23] = t9, $3[24] = t10;
  else
    t10 = $3[24];
  return t10;
}
function _temp60(f) {
  return f + 1;
}
function stripInProgressAssistantMessage(messages) {
  let last2 = messages.at(-1);
  if (last2?.type === "assistant" && last2.message.stop_reason === null)
    return messages.slice(0, -1);
  return messages;
}
async function buildCacheSafeParams(context6) {
  let forkContextMessages = getMessagesAfterCompactBoundary(stripInProgressAssistantMessage(context6.messages)), saved = getLastCacheSafeParams();
  if (saved)
    return {
      systemPrompt: saved.systemPrompt,
      userContext: saved.userContext,
      systemContext: saved.systemContext,
      toolUseContext: context6,
      forkContextMessages
    };
  let [rawSystemPrompt, userContext, systemContext] = await Promise.all([getSystemPrompt(context6.options.tools, context6.options.mainLoopModel, [], context6.options.mcpClients), getUserContext(), getSystemContext()]);
  return {
    systemPrompt: asSystemPrompt(rawSystemPrompt),
    userContext,
    systemContext,
    toolUseContext: context6,
    forkContextMessages
  };
}
async function call7(onDone, context6, args) {
  let question = args?.trim();
  if (!question)
    return onDone("Usage: /btw <your question>", {
      display: "system"
    }), null;
  return saveGlobalConfig((current) => ({
    ...current,
    btwUseCount: current.btwUseCount + 1
  })), /* @__PURE__ */ jsx_dev_runtime163.jsxDEV(BtwSideQuestion, {
    question,
    context: context6,
    onDone
  }, void 0, !1, void 0, this);
}
var import_compiler_runtime129, import_react93, jsx_dev_runtime163, CHROME_ROWS = 5, OUTER_CHROME_ROWS = 6, SCROLL_LINES = 3;
var init_btw = __esm(() => {
  init_dist4();
  init_Markdown();
  init_SpinnerGlyph();
  init_figures2();
  init_prompts4();
  init_modalContext();
  init_context2();
  init_useTerminalSize();
  init_ScrollBox();
  init_ink2();
  init_abortController();
  init_config4();
  init_errors();
  init_forkedAgent();
  init_messages3();
  init_sideQuestion();
  import_compiler_runtime129 = __toESM(require_react_compiler_runtime_development(), 1), import_react93 = __toESM(require_react_development(), 1), jsx_dev_runtime163 = __toESM(require_react_jsx_dev_runtime_development(), 1);
});
