// Original: src/ink/components/App.tsx
function processKeysInBatch(app, items, _unused1, _unused2) {
  if (items.some((i4) => i4.kind === "key" || i4.kind === "mouse" && !((i4.button & 32) !== 0 && (i4.button & 3) === 3)))
    updateLastInteractionTime();
  for (let item of items) {
    if (item.kind === "response") {
      app.querier.onResponse(item.response);
      continue;
    }
    if (item.kind === "mouse") {
      handleMouseEvent(app, item);
      continue;
    }
    let sequence = item.sequence;
    if (sequence === FOCUS_IN) {
      app.handleTerminalFocus(!0);
      let event2 = new TerminalFocusEvent("terminalfocus");
      app.internal_eventEmitter.emit("terminalfocus", event2);
      continue;
    }
    if (sequence === FOCUS_OUT) {
      if (app.handleTerminalFocus(!1), app.props.selection.isDragging)
        finishSelection(app.props.selection), app.props.onSelectionChange();
      let event2 = new TerminalFocusEvent("terminalblur");
      app.internal_eventEmitter.emit("terminalblur", event2);
      continue;
    }
    if (!getTerminalFocused())
      setTerminalFocused(!0);
    if (item.name === "z" && item.ctrl && SUPPORTS_SUSPEND) {
      app.handleSuspend();
      continue;
    }
    app.handleInput(sequence);
    let event = new InputEvent(item);
    app.internal_eventEmitter.emit("input", event), app.props.dispatchKeyboardEvent(item);
  }
}
function handleMouseEvent(app, m4) {
  if (isMouseClicksDisabled())
    return;
  let sel = app.props.selection, col = m4.col - 1, row = m4.row - 1, baseButton = m4.button & 3;
  if (m4.action === "press") {
    if ((m4.button & 32) !== 0 && baseButton === 3) {
      if (sel.isDragging)
        finishSelection(sel), app.props.onSelectionChange();
      if (col === app.lastHoverCol && row === app.lastHoverRow)
        return;
      app.lastHoverCol = col, app.lastHoverRow = row, app.props.onHoverAt(col, row);
      return;
    }
    if (baseButton !== 0) {
      app.clickCount = 0;
      return;
    }
    if ((m4.button & 32) !== 0) {
      app.props.onSelectionDrag(col, row);
      return;
    }
    if (sel.isDragging)
      finishSelection(sel), app.props.onSelectionChange();
    let now2 = Date.now(), nearLast = now2 - app.lastClickTime < MULTI_CLICK_TIMEOUT_MS && Math.abs(col - app.lastClickCol) <= MULTI_CLICK_DISTANCE && Math.abs(row - app.lastClickRow) <= MULTI_CLICK_DISTANCE;
    if (app.clickCount = nearLast ? app.clickCount + 1 : 1, app.lastClickTime = now2, app.lastClickCol = col, app.lastClickRow = row, app.clickCount >= 2) {
      if (app.pendingHyperlinkTimer)
        clearTimeout(app.pendingHyperlinkTimer), app.pendingHyperlinkTimer = null;
      let count3 = app.clickCount === 2 ? 2 : 3;
      app.props.onMultiClick(col, row, count3);
      return;
    }
    startSelection(sel, col, row), sel.lastPressHadAlt = (m4.button & 8) !== 0, app.props.onSelectionChange();
    return;
  }
  if (baseButton !== 0) {
    if (!sel.isDragging)
      return;
    finishSelection(sel), app.props.onSelectionChange();
    return;
  }
  if (finishSelection(sel), !hasSelection(sel) && sel.anchor) {
    if (!app.props.onClickAt(col, row)) {
      let url3 = app.props.getHyperlinkAt(col, row);
      if (url3 && process.env.TERM_PROGRAM !== "vscode" && !isXtermJs()) {
        if (app.pendingHyperlinkTimer)
          clearTimeout(app.pendingHyperlinkTimer);
        app.pendingHyperlinkTimer = setTimeout((app2, url4) => {
          app2.pendingHyperlinkTimer = null, app2.props.onOpenHyperlink(url4);
        }, MULTI_CLICK_TIMEOUT_MS, app, url3);
      }
    }
  }
  app.props.onSelectionChange();
}
var import_react10, jsx_dev_runtime7, SUPPORTS_SUSPEND, STDIN_RESUME_GAP_MS = 5000, MULTI_CLICK_TIMEOUT_MS = 500, MULTI_CLICK_DISTANCE = 1, App;
var init_App = __esm(() => {
  init_state();
  init_debug();
  init_earlyInput();
  init_envUtils();
  init_fullscreen();
  init_log3();
  init_emitter();
  init_input_event();
  init_terminal_focus_event();
  init_parse_keypress();
  init_reconciler();
  init_selection();
  init_terminal();
  init_terminal_focus_state();
  init_terminal_querier();
  init_csi();
  init_dec();
  init_AppContext();
  init_ClockContext();
  init_CursorDeclarationContext();
  init_ErrorOverview();
  init_StdinContext();
  init_TerminalFocusContext();
  init_TerminalSizeContext();
  import_react10 = __toESM(require_react_development(), 1), jsx_dev_runtime7 = __toESM(require_react_jsx_dev_runtime_development(), 1), SUPPORTS_SUSPEND = process.platform !== "win32";
  App = class App extends import_react10.PureComponent {
    static displayName = "InternalApp";
    static getDerivedStateFromError(error44) {
      return {
        error: error44
      };
    }
    state = {
      error: void 0
    };
    rawModeEnabledCount = 0;
    internal_eventEmitter = new EventEmitter3;
    keyParseState = INITIAL_STATE;
    incompleteEscapeTimer = null;
    NORMAL_TIMEOUT = 50;
    PASTE_TIMEOUT = 500;
    querier = new TerminalQuerier(this.props.stdout);
    lastClickTime = 0;
    lastClickCol = -1;
    lastClickRow = -1;
    clickCount = 0;
    pendingHyperlinkTimer = null;
    lastHoverCol = -1;
    lastHoverRow = -1;
    lastStdinTime = Date.now();
    isRawModeSupported() {
      return this.props.stdin.isTTY;
    }
    render() {
      return /* @__PURE__ */ jsx_dev_runtime7.jsxDEV(TerminalSizeContext.Provider, {
        value: {
          columns: this.props.terminalColumns,
          rows: this.props.terminalRows
        },
        children: /* @__PURE__ */ jsx_dev_runtime7.jsxDEV(AppContext_default.Provider, {
          value: {
            exit: this.handleExit
          },
          children: /* @__PURE__ */ jsx_dev_runtime7.jsxDEV(StdinContext_default.Provider, {
            value: {
              stdin: this.props.stdin,
              setRawMode: this.handleSetRawMode,
              isRawModeSupported: this.isRawModeSupported(),
              internal_exitOnCtrlC: this.props.exitOnCtrlC,
              internal_eventEmitter: this.internal_eventEmitter,
              internal_querier: this.querier
            },
            children: /* @__PURE__ */ jsx_dev_runtime7.jsxDEV(TerminalFocusProvider, {
              children: /* @__PURE__ */ jsx_dev_runtime7.jsxDEV(ClockProvider, {
                children: /* @__PURE__ */ jsx_dev_runtime7.jsxDEV(CursorDeclarationContext_default.Provider, {
                  value: this.props.onCursorDeclaration ?? (() => {}),
                  children: this.state.error ? /* @__PURE__ */ jsx_dev_runtime7.jsxDEV(ErrorOverview, {
                    error: this.state.error
                  }, void 0, !1, void 0, this) : this.props.children
                }, void 0, !1, void 0, this)
              }, void 0, !1, void 0, this)
            }, void 0, !1, void 0, this)
          }, void 0, !1, void 0, this)
        }, void 0, !1, void 0, this)
      }, void 0, !1, void 0, this);
    }
    componentDidMount() {
      if (this.props.stdout.isTTY && !isEnvTruthy(process.env.CLAUDE_CODE_ACCESSIBILITY))
        this.props.stdout.write(HIDE_CURSOR);
    }
    componentWillUnmount() {
      if (this.props.stdout.isTTY)
        this.props.stdout.write(SHOW_CURSOR);
      if (this.incompleteEscapeTimer)
        clearTimeout(this.incompleteEscapeTimer), this.incompleteEscapeTimer = null;
      if (this.pendingHyperlinkTimer)
        clearTimeout(this.pendingHyperlinkTimer), this.pendingHyperlinkTimer = null;
      if (this.isRawModeSupported())
        this.handleSetRawMode(!1);
    }
    componentDidCatch(error44) {
      this.handleExit(error44);
    }
    handleSetRawMode = (isEnabled) => {
      let {
        stdin
      } = this.props;
      if (!this.isRawModeSupported())
        if (stdin === process.stdin)
          throw Error(`Raw mode is not supported on the current process.stdin, which Ink uses as input stream by default.
Read about how to prevent this error on https://github.com/vadimdemedes/ink/#israwmodesupported`);
        else
          throw Error(`Raw mode is not supported on the stdin provided to Ink.
Read about how to prevent this error on https://github.com/vadimdemedes/ink/#israwmodesupported`);
      if (stdin.setEncoding("utf8"), isEnabled) {
        if (this.rawModeEnabledCount === 0) {
          if (stopCapturingEarlyInput(), stdin.ref(), stdin.setRawMode(!0), stdin.addListener("readable", this.handleReadable), this.props.stdout.write(EBP), this.props.stdout.write(EFE), supportsExtendedKeys())
            this.props.stdout.write(ENABLE_KITTY_KEYBOARD), this.props.stdout.write(ENABLE_MODIFY_OTHER_KEYS);
          setImmediate(() => {
            Promise.all([this.querier.send(xtversion()), this.querier.flush()]).then(([r4]) => {
              if (r4)
                setXtversionName(r4.name), logForDebugging(`XTVERSION: terminal identified as "${r4.name}"`);
              else
                logForDebugging("XTVERSION: no reply (terminal ignored query)");
            });
          });
        }
        this.rawModeEnabledCount++;
        return;
      }
      if (--this.rawModeEnabledCount === 0)
        this.props.stdout.write(DISABLE_MODIFY_OTHER_KEYS), this.props.stdout.write(DISABLE_KITTY_KEYBOARD), this.props.stdout.write(DFE), this.props.stdout.write(DBP), stdin.setRawMode(!1), stdin.removeListener("readable", this.handleReadable), stdin.unref();
    };
    flushIncomplete = () => {
      if (this.incompleteEscapeTimer = null, !this.keyParseState.incomplete)
        return;
      if (this.props.stdin.readableLength > 0) {
        this.incompleteEscapeTimer = setTimeout(this.flushIncomplete, this.NORMAL_TIMEOUT);
        return;
      }
      this.processInput(null);
    };
    processInput = (input) => {
      let [keys2, newState] = parseMultipleKeypresses(this.keyParseState, input);
      if (this.keyParseState = newState, keys2.length > 0)
        reconciler_default.discreteUpdates(processKeysInBatch, this, keys2, void 0, void 0);
      if (this.keyParseState.incomplete) {
        if (this.incompleteEscapeTimer)
          clearTimeout(this.incompleteEscapeTimer);
        this.incompleteEscapeTimer = setTimeout(this.flushIncomplete, this.keyParseState.mode === "IN_PASTE" ? this.PASTE_TIMEOUT : this.NORMAL_TIMEOUT);
      }
    };
    handleReadable = () => {
      let now2 = Date.now();
      if (now2 - this.lastStdinTime > STDIN_RESUME_GAP_MS)
        this.props.onStdinResume?.();
      this.lastStdinTime = now2;
      try {
        let chunk;
        while ((chunk = this.props.stdin.read()) !== null)
          this.processInput(chunk);
      } catch (error44) {
        logError2(error44);
        let {
          stdin
        } = this.props;
        if (this.rawModeEnabledCount > 0 && !stdin.listeners("readable").includes(this.handleReadable))
          logForDebugging("handleReadable: re-attaching stdin readable listener after error recovery", {
            level: "warn"
          }), stdin.addListener("readable", this.handleReadable);
      }
    };
    handleInput = (input) => {
      if (input === "\x03" && this.props.exitOnCtrlC)
        this.handleExit();
    };
    handleExit = (error44) => {
      if (this.isRawModeSupported())
        this.handleSetRawMode(!1);
      this.props.onExit(error44);
    };
    handleTerminalFocus = (isFocused) => {
      setTerminalFocused(isFocused);
    };
    handleSuspend = () => {
      if (!this.isRawModeSupported())
        return;
      let rawModeCountBeforeSuspend = this.rawModeEnabledCount;
      while (this.rawModeEnabledCount > 0)
        this.handleSetRawMode(!1);
      if (this.props.stdout.isTTY)
        this.props.stdout.write(SHOW_CURSOR + DFE + DISABLE_MOUSE_TRACKING);
      this.internal_eventEmitter.emit("suspend");
      let resumeHandler = () => {
        for (let i4 = 0;i4 < rawModeCountBeforeSuspend; i4++)
          if (this.isRawModeSupported())
            this.handleSetRawMode(!0);
        if (this.props.stdout.isTTY) {
          if (!isEnvTruthy(process.env.CLAUDE_CODE_ACCESSIBILITY))
            this.props.stdout.write(HIDE_CURSOR);
          this.props.stdout.write(EFE);
        }
        this.internal_eventEmitter.emit("resume"), process.removeListener("SIGCONT", resumeHandler);
      };
      process.on("SIGCONT", resumeHandler), process.kill(process.pid, "SIGSTOP");
    };
  };
});
