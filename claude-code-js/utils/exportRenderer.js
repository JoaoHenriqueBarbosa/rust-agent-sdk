// Original: src/utils/exportRenderer.tsx
function StaticKeybindingProvider({
  children
}) {
  let {
    bindings
  } = loadKeybindingsSyncWithWarnings(), pendingChordRef = import_react189.useRef(null), handlerRegistryRef = import_react189.useRef(/* @__PURE__ */ new Map), activeContexts = import_react189.useRef(/* @__PURE__ */ new Set).current;
  return /* @__PURE__ */ jsx_dev_runtime350.jsxDEV(KeybindingProvider, {
    bindings,
    pendingChordRef,
    pendingChord: null,
    setPendingChord: () => {},
    activeContexts,
    registerActiveContext: () => {},
    unregisterActiveContext: () => {},
    handlerRegistryRef,
    children
  }, void 0, !1, void 0, this);
}
function normalizedUpperBound(m4) {
  if (!("message" in m4))
    return 1;
  let c3 = m4.message.content;
  return Array.isArray(c3) ? c3.length : 1;
}
async function streamRenderedMessages(messages, tools, sink, {
  columns,
  verbose = !1,
  chunkSize = 40,
  onProgress
} = {}) {
  let renderChunk = (range) => renderToAnsiString(/* @__PURE__ */ jsx_dev_runtime350.jsxDEV(AppStateProvider, {
    children: /* @__PURE__ */ jsx_dev_runtime350.jsxDEV(StaticKeybindingProvider, {
      children: /* @__PURE__ */ jsx_dev_runtime350.jsxDEV(Messages4, {
        messages,
        tools,
        commands: [],
        verbose,
        toolJSX: null,
        toolUseConfirmQueue: [],
        inProgressToolUseIDs: /* @__PURE__ */ new Set,
        isMessageSelectorVisible: !1,
        conversationId: "export",
        screen: "prompt",
        streamingToolUses: [],
        showAllInTranscript: !0,
        isLoading: !1,
        renderRange: range
      }, void 0, !1, void 0, this)
    }, void 0, !1, void 0, this)
  }, void 0, !1, void 0, this), columns), ceiling = chunkSize;
  for (let m4 of messages)
    ceiling += normalizedUpperBound(m4);
  for (let offset = 0;offset < ceiling; offset += chunkSize) {
    let ansi = await renderChunk([offset, offset + chunkSize]);
    if (stripAnsi(ansi).trim() === "")
      break;
    await sink(ansi), onProgress?.(offset + chunkSize);
  }
}
async function renderMessagesToPlainText(messages, tools = [], columns) {
  let parts = [];
  return await streamRenderedMessages(messages, tools, (chunk) => void parts.push(stripAnsi(chunk)), {
    columns
  }), parts.join("");
}
var import_react189, jsx_dev_runtime350;
var init_exportRenderer = __esm(() => {
  init_strip_ansi();
  init_Messages();
  init_KeybindingContext();
  init_loadUserBindings();
  init_AppState();
  init_staticRender();
  import_react189 = __toESM(require_react_development(), 1), jsx_dev_runtime350 = __toESM(require_react_jsx_dev_runtime_development(), 1);
});
