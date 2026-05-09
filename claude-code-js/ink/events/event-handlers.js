// Original: src/ink/events/event-handlers.ts
var HANDLER_FOR_EVENT, EVENT_HANDLER_PROPS;
var init_event_handlers = __esm(() => {
  HANDLER_FOR_EVENT = {
    keydown: { bubble: "onKeyDown", capture: "onKeyDownCapture" },
    focus: { bubble: "onFocus", capture: "onFocusCapture" },
    blur: { bubble: "onBlur", capture: "onBlurCapture" },
    paste: { bubble: "onPaste", capture: "onPasteCapture" },
    resize: { bubble: "onResize" },
    click: { bubble: "onClick" }
  }, EVENT_HANDLER_PROPS = /* @__PURE__ */ new Set([
    "onKeyDown",
    "onKeyDownCapture",
    "onFocus",
    "onFocusCapture",
    "onBlur",
    "onBlurCapture",
    "onPaste",
    "onPasteCapture",
    "onResize",
    "onClick",
    "onMouseEnter",
    "onMouseLeave"
  ]);
});
