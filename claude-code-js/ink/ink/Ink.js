// class: Ink
class Ink {
  options;
  log;
  terminal;
  scheduleRender;
  isUnmounted = !1;
  isPaused = !1;
  container;
  rootNode;
  focusManager;
  renderer;
  stylePool;
  charPool;
  hyperlinkPool;
  exitPromise;
  restoreConsole;
  restoreStderr;
  unsubscribeTTYHandlers;
  terminalColumns;
  terminalRows;
  currentNode = null;
  frontFrame;
  backFrame;
  lastPoolResetTime = performance.now();
  drainTimer = null;
  lastYogaCounters = {
    ms: 0,
    visited: 0,
    measured: 0,
    cacheHits: 0,
    live: 0
  };
  altScreenParkPatch;
  selection = createSelectionState();
  searchHighlightQuery = "";
  searchPositions = null;
  selectionListeners = /* @__PURE__ */ new Set;
  hoveredNodes = /* @__PURE__ */ new Set;
  altScreenActive = !1;
  altScreenMouseTracking = !1;
  prevFrameContaminated = !1;
  needsEraseBeforePaint = !1;
  cursorDeclaration = null;
  displayCursor = null;
  constructor(options) {
    this.options = options;
    if (autoBind(this), this.options.patchConsole)
      this.restoreConsole = this.patchConsole(), this.restoreStderr = this.patchStderr();
    this.terminal = {
      stdout: options.stdout,
      stderr: options.stderr
    }, this.terminalColumns = options.stdout.columns || 80, this.terminalRows = options.stdout.rows || 24, this.altScreenParkPatch = makeAltScreenParkPatch(this.terminalRows), this.stylePool = new StylePool, this.charPool = new CharPool, this.hyperlinkPool = new HyperlinkPool, this.frontFrame = emptyFrame(this.terminalRows, this.terminalColumns, this.stylePool, this.charPool, this.hyperlinkPool), this.backFrame = emptyFrame(this.terminalRows, this.terminalColumns, this.stylePool, this.charPool, this.hyperlinkPool), this.log = new LogUpdate({
      isTTY: options.stdout.isTTY || !1,
      stylePool: this.stylePool
    });
    let deferredRender = () => queueMicrotask(this.onRender);
    if (this.scheduleRender = throttle_default2(deferredRender, FRAME_INTERVAL_MS, {
      leading: !0,
      trailing: !0
    }), this.isUnmounted = !1, this.unsubscribeExit = onExit(this.unmount, {
      alwaysLast: !1
    }), options.stdout.isTTY)
      options.stdout.on("resize", this.handleResize), process.on("SIGCONT", this.handleResume), this.unsubscribeTTYHandlers = () => {
        options.stdout.off("resize", this.handleResize), process.off("SIGCONT", this.handleResume);
      };
    this.rootNode = createNode("ink-root"), this.focusManager = new FocusManager((target, event) => dispatcher.dispatchDiscrete(target, event)), this.rootNode.focusManager = this.focusManager, this.renderer = createRenderer(this.rootNode, this.stylePool), this.rootNode.onRender = this.scheduleRender, this.rootNode.onImmediateRender = this.onRender, this.rootNode.onComputeLayout = () => {
      if (this.isUnmounted)
        return;
      if (this.rootNode.yogaNode) {
        let t0 = performance.now();
        this.rootNode.yogaNode.setWidth(this.terminalColumns), this.rootNode.yogaNode.calculateLayout(this.terminalColumns);
        let ms = performance.now() - t0;
        recordYogaMs(ms);
        let c3 = getYogaCounters();
        this.lastYogaCounters = {
          ms,
          ...c3
        };
      }
    }, this.container = reconciler_default.createContainer(this.rootNode, import_constants39.ConcurrentRoot, null, !1, null, "id", noop_default, noop_default, noop_default, noop_default);
  }
  handleResume = () => {
    if (!this.options.stdout.isTTY)
      return;
    if (this.altScreenActive) {
      this.reenterAltScreen();
      return;
    }
    this.frontFrame = emptyFrame(this.frontFrame.viewport.height, this.frontFrame.viewport.width, this.stylePool, this.charPool, this.hyperlinkPool), this.backFrame = emptyFrame(this.backFrame.viewport.height, this.backFrame.viewport.width, this.stylePool, this.charPool, this.hyperlinkPool), this.log.reset(), this.displayCursor = null;
  };
  handleResize = () => {
    let cols = this.options.stdout.columns || 80, rows = this.options.stdout.rows || 24;
    if (cols === this.terminalColumns && rows === this.terminalRows)
      return;
    if (this.terminalColumns = cols, this.terminalRows = rows, this.altScreenParkPatch = makeAltScreenParkPatch(this.terminalRows), this.altScreenActive && !this.isPaused && this.options.stdout.isTTY) {
      if (this.altScreenMouseTracking)
        this.options.stdout.write(ENABLE_MOUSE_TRACKING);
      this.resetFramesForAltScreen(), this.needsEraseBeforePaint = !0;
    }
    if (this.currentNode !== null)
      this.render(this.currentNode);
  };
  resolveExitPromise = () => {};
  rejectExitPromise = () => {};
  unsubscribeExit = () => {};
  enterAlternateScreen() {
    this.pause(), this.suspendStdin(), this.options.stdout.write(DISABLE_KITTY_KEYBOARD + DISABLE_MODIFY_OTHER_KEYS + (this.altScreenMouseTracking ? DISABLE_MOUSE_TRACKING : "") + (this.altScreenActive ? "" : "\x1B[?1049h") + "\x1B[?1004l\x1B[0m\x1B[?25h\x1B[2J\x1B[H");
  }
  exitAlternateScreen() {
    if (this.options.stdout.write((this.altScreenActive ? ENTER_ALT_SCREEN : "") + "\x1B[2J\x1B[H" + (this.altScreenMouseTracking ? ENABLE_MOUSE_TRACKING : "") + (this.altScreenActive ? "" : "\x1B[?1049l") + "\x1B[?25l"), this.resumeStdin(), this.altScreenActive)
      this.resetFramesForAltScreen();
    else
      this.repaint();
    this.resume(), this.options.stdout.write("\x1B[?1004h" + (supportsExtendedKeys() ? DISABLE_KITTY_KEYBOARD + ENABLE_KITTY_KEYBOARD + ENABLE_MODIFY_OTHER_KEYS : ""));
  }
  onRender() {
    if (this.isUnmounted || this.isPaused)
      return;
    if (this.drainTimer !== null)
      clearTimeout(this.drainTimer), this.drainTimer = null;
    flushInteractionTime();
    let renderStart = performance.now(), terminalWidth = this.options.stdout.columns || 80, terminalRows = this.options.stdout.rows || 24, frame = this.renderer({
      frontFrame: this.frontFrame,
      backFrame: this.backFrame,
      isTTY: this.options.stdout.isTTY,
      terminalWidth,
      terminalRows,
      altScreen: this.altScreenActive,
      prevFrameContaminated: this.prevFrameContaminated
    }), rendererMs = performance.now() - renderStart, follow = consumeFollowScroll();
    if (follow && this.selection.anchor && this.selection.anchor.row >= follow.viewportTop && this.selection.anchor.row <= follow.viewportBottom) {
      let {
        delta,
        viewportTop,
        viewportBottom
      } = follow;
      if (this.selection.isDragging) {
        if (hasSelection(this.selection))
          captureScrolledRows(this.selection, this.frontFrame.screen, viewportTop, viewportTop + delta - 1, "above");
        shiftAnchor(this.selection, -delta, viewportTop, viewportBottom);
      } else if (!this.selection.focus || this.selection.focus.row >= viewportTop && this.selection.focus.row <= viewportBottom) {
        if (hasSelection(this.selection))
          captureScrolledRows(this.selection, this.frontFrame.screen, viewportTop, viewportTop + delta - 1, "above");
        if (shiftSelectionForFollow(this.selection, -delta, viewportTop, viewportBottom))
          for (let cb of this.selectionListeners)
            cb();
      }
    }
    let selActive = !1, hlActive = !1;
    if (this.altScreenActive) {
      if (selActive = hasSelection(this.selection), selActive)
        applySelectionOverlay(frame.screen, this.selection, this.stylePool);
      if (hlActive = applySearchHighlight(frame.screen, this.searchHighlightQuery, this.stylePool), this.searchPositions) {
        let sp = this.searchPositions, posApplied = applyPositionedHighlight(frame.screen, this.stylePool, sp.positions, sp.rowOffset, sp.currentIdx);
        hlActive = hlActive || posApplied;
      }
    }
    if (didLayoutShift() || selActive || hlActive || this.prevFrameContaminated)
      frame.screen.damage = {
        x: 0,
        y: 0,
        width: frame.screen.width,
        height: frame.screen.height
      };
    let prevFrame = this.frontFrame;
    if (this.altScreenActive)
      prevFrame = {
        ...this.frontFrame,
        cursor: ALT_SCREEN_ANCHOR_CURSOR
      };
    let tDiff = performance.now(), diff2 = this.log.render(prevFrame, frame, this.altScreenActive, SYNC_OUTPUT_SUPPORTED), diffMs = performance.now() - tDiff;
    if (this.backFrame = this.frontFrame, this.frontFrame = frame, renderStart - this.lastPoolResetTime > 300000)
      this.resetPools(), this.lastPoolResetTime = renderStart;
    let flickers = [];
    for (let patch of diff2)
      if (patch.type === "clearTerminal") {
        if (flickers.push({
          desiredHeight: frame.screen.height,
          availableHeight: frame.viewport.height,
          reason: patch.reason
        }), isDebugRepaintsEnabled() && patch.debug) {
          let chain4 = findOwnerChainAtRow(this.rootNode, patch.debug.triggerY);
          logForDebugging(`[REPAINT] full reset \xB7 ${patch.reason} \xB7 row ${patch.debug.triggerY}
  prev: "${patch.debug.prevLine}"
  next: "${patch.debug.nextLine}"
  culprit: ${chain4.length ? chain4.join(" < ") : "(no owner chain captured)"}`, {
            level: "warn"
          });
        }
      }
    let tOptimize = performance.now(), optimized = optimize(diff2), optimizeMs = performance.now() - tOptimize, hasDiff = optimized.length > 0;
    if (this.altScreenActive && hasDiff) {
      if (this.needsEraseBeforePaint)
        this.needsEraseBeforePaint = !1, optimized.unshift(ERASE_THEN_HOME_PATCH);
      else
        optimized.unshift(CURSOR_HOME_PATCH);
      optimized.push(this.altScreenParkPatch);
    }
    let decl = this.cursorDeclaration, rect = decl !== null ? nodeCache.get(decl.node) : void 0, target = decl !== null && rect !== void 0 ? {
      x: rect.x + decl.relativeX,
      y: rect.y + decl.relativeY
    } : null, parked = this.displayCursor, targetMoved = target !== null && (parked === null || parked.x !== target.x || parked.y !== target.y);
    if (hasDiff || targetMoved || target === null && parked !== null) {
      if (parked !== null && !this.altScreenActive && hasDiff) {
        let pdx = prevFrame.cursor.x - parked.x, pdy = prevFrame.cursor.y - parked.y;
        if (pdx !== 0 || pdy !== 0)
          optimized.unshift({
            type: "stdout",
            content: cursorMove(pdx, pdy)
          });
      }
      if (target !== null) {
        if (this.altScreenActive) {
          let row = Math.min(Math.max(target.y + 1, 1), terminalRows), col = Math.min(Math.max(target.x + 1, 1), terminalWidth);
          optimized.push({
            type: "stdout",
            content: cursorPosition(row, col)
          });
        } else {
          let from = !hasDiff && parked !== null ? parked : {
            x: frame.cursor.x,
            y: frame.cursor.y
          }, dx = target.x - from.x, dy = target.y - from.y;
          if (dx !== 0 || dy !== 0)
            optimized.push({
              type: "stdout",
              content: cursorMove(dx, dy)
            });
        }
        this.displayCursor = target;
      } else {
        if (parked !== null && !this.altScreenActive && !hasDiff) {
          let rdx = frame.cursor.x - parked.x, rdy = frame.cursor.y - parked.y;
          if (rdx !== 0 || rdy !== 0)
            optimized.push({
              type: "stdout",
              content: cursorMove(rdx, rdy)
            });
        }
        this.displayCursor = null;
      }
    }
    let tWrite = performance.now();
    writeDiffToTerminal(this.terminal, optimized, this.altScreenActive && !SYNC_OUTPUT_SUPPORTED);
    let writeMs = performance.now() - tWrite;
    if (this.prevFrameContaminated = selActive || hlActive, frame.scrollDrainPending)
      this.drainTimer = setTimeout(() => this.onRender(), FRAME_INTERVAL_MS >> 2);
    let yogaMs = getLastYogaMs(), commitMs = getLastCommitMs(), yc = this.lastYogaCounters;
    resetProfileCounters(), this.lastYogaCounters = {
      ms: 0,
      visited: 0,
      measured: 0,
      cacheHits: 0,
      live: 0
    }, this.options.onFrame?.({
      durationMs: performance.now() - renderStart,
      phases: {
        renderer: rendererMs,
        diff: diffMs,
        optimize: optimizeMs,
        write: writeMs,
        patches: diff2.length,
        yoga: yogaMs,
        commit: commitMs,
        yogaVisited: yc.visited,
        yogaMeasured: yc.measured,
        yogaCacheHits: yc.cacheHits,
        yogaLive: yc.live
      },
      flickers
    });
  }
  pause() {
    reconciler_default.flushSyncFromReconciler(), this.onRender(), this.isPaused = !0;
  }
  resume() {
    this.isPaused = !1, this.onRender();
  }
  repaint() {
    this.frontFrame = emptyFrame(this.frontFrame.viewport.height, this.frontFrame.viewport.width, this.stylePool, this.charPool, this.hyperlinkPool), this.backFrame = emptyFrame(this.backFrame.viewport.height, this.backFrame.viewport.width, this.stylePool, this.charPool, this.hyperlinkPool), this.log.reset(), this.displayCursor = null;
  }
  forceRedraw() {
    if (!this.options.stdout.isTTY || this.isUnmounted || this.isPaused)
      return;
    if (this.options.stdout.write(ERASE_SCREEN + CURSOR_HOME), this.altScreenActive)
      this.resetFramesForAltScreen();
    else
      this.repaint(), this.prevFrameContaminated = !0;
    this.onRender();
  }
  invalidatePrevFrame() {
    this.prevFrameContaminated = !0;
  }
  setAltScreenActive(active, mouseTracking = !1) {
    if (this.altScreenActive === active)
      return;
    if (this.altScreenActive = active, this.altScreenMouseTracking = active && mouseTracking, active)
      this.resetFramesForAltScreen();
    else
      this.repaint();
  }
  get isAltScreenActive() {
    return this.altScreenActive;
  }
  reassertTerminalModes = (includeAltScreen = !1) => {
    if (!this.options.stdout.isTTY)
      return;
    if (this.isPaused)
      return;
    if (supportsExtendedKeys())
      this.options.stdout.write(DISABLE_KITTY_KEYBOARD + ENABLE_KITTY_KEYBOARD + ENABLE_MODIFY_OTHER_KEYS);
    if (!this.altScreenActive)
      return;
    if (this.altScreenMouseTracking)
      this.options.stdout.write(ENABLE_MOUSE_TRACKING);
    if (includeAltScreen)
      this.reenterAltScreen();
  };
  detachForShutdown() {
    this.isUnmounted = !0, this.scheduleRender.cancel?.();
    let stdin = this.options.stdin;
    if (this.drainStdin(), stdin.isTTY && stdin.isRaw && stdin.setRawMode)
      stdin.setRawMode(!1);
  }
  drainStdin() {
    drainStdin(this.options.stdin);
  }
  reenterAltScreen() {
    this.options.stdout.write(ENTER_ALT_SCREEN + ERASE_SCREEN + CURSOR_HOME + (this.altScreenMouseTracking ? ENABLE_MOUSE_TRACKING : "")), this.resetFramesForAltScreen();
  }
  resetFramesForAltScreen() {
    let rows = this.terminalRows, cols = this.terminalColumns, blank = () => ({
      screen: createScreen(cols, rows, this.stylePool, this.charPool, this.hyperlinkPool),
      viewport: {
        width: cols,
        height: rows + 1
      },
      cursor: {
        x: 0,
        y: 0,
        visible: !0
      }
    });
    this.frontFrame = blank(), this.backFrame = blank(), this.log.reset(), this.displayCursor = null, this.prevFrameContaminated = !0;
  }
  copySelectionNoClear() {
    if (!hasSelection(this.selection))
      return "";
    let text = getSelectedText(this.selection, this.frontFrame.screen);
    if (text)
      setClipboard(text).then((raw) => {
        if (raw)
          this.options.stdout.write(raw);
      });
    return text;
  }
  copySelection() {
    if (!hasSelection(this.selection))
      return "";
    let text = this.copySelectionNoClear();
    return clearSelection(this.selection), this.notifySelectionChange(), text;
  }
  clearTextSelection() {
    if (!hasSelection(this.selection))
      return;
    clearSelection(this.selection), this.notifySelectionChange();
  }
  setSearchHighlight(query) {
    if (this.searchHighlightQuery === query)
      return;
    this.searchHighlightQuery = query, this.scheduleRender();
  }
  scanElementSubtree(el) {
    if (!this.searchHighlightQuery || !el.yogaNode)
      return [];
    let width = Math.ceil(el.yogaNode.getComputedWidth()), height = Math.ceil(el.yogaNode.getComputedHeight());
    if (width <= 0 || height <= 0)
      return [];
    let elLeft = el.yogaNode.getComputedLeft(), elTop = el.yogaNode.getComputedTop(), screen = createScreen(width, height, this.stylePool, this.charPool, this.hyperlinkPool), output = new Output({
      width,
      height,
      stylePool: this.stylePool,
      screen
    });
    render_node_to_output_default(el, output, {
      offsetX: -elLeft,
      offsetY: -elTop,
      prevScreen: void 0
    });
    let rendered = output.get();
    markDirty(el);
    let positions = scanPositions(rendered, this.searchHighlightQuery);
    return logForDebugging(`scanElementSubtree: q='${this.searchHighlightQuery}' el=${width}x${height}@(${elLeft},${elTop}) n=${positions.length} [${positions.slice(0, 10).map((p4) => `${p4.row}:${p4.col}`).join(",")}${positions.length > 10 ? ",\u2026" : ""}]`), positions;
  }
  setSearchPositions(state3) {
    this.searchPositions = state3, this.scheduleRender();
  }
  setSelectionBgColor(color) {
    let wrapped = colorize("\x00", color, "background"), nul = wrapped.indexOf("\x00");
    if (nul <= 0 || nul === wrapped.length - 1) {
      this.stylePool.setSelectionBg(null);
      return;
    }
    this.stylePool.setSelectionBg({
      type: "ansi",
      code: wrapped.slice(0, nul),
      endCode: wrapped.slice(nul + 1)
    });
  }
  captureScrolledRows(firstRow, lastRow, side) {
    captureScrolledRows(this.selection, this.frontFrame.screen, firstRow, lastRow, side);
  }
  shiftSelectionForScroll(dRow, minRow, maxRow) {
    let hadSel = hasSelection(this.selection);
    if (shiftSelection(this.selection, dRow, minRow, maxRow, this.frontFrame.screen.width), hadSel && !hasSelection(this.selection))
      this.notifySelectionChange();
  }
  moveSelectionFocus(move) {
    if (!this.altScreenActive)
      return;
    let {
      focus
    } = this.selection;
    if (!focus)
      return;
    let {
      width,
      height
    } = this.frontFrame.screen, maxCol = width - 1, maxRow = height - 1, {
      col,
      row
    } = focus;
    switch (move) {
      case "left":
        if (col > 0)
          col--;
        else if (row > 0)
          col = maxCol, row--;
        break;
      case "right":
        if (col < maxCol)
          col++;
        else if (row < maxRow)
          col = 0, row++;
        break;
      case "up":
        if (row > 0)
          row--;
        break;
      case "down":
        if (row < maxRow)
          row++;
        break;
      case "lineStart":
        col = 0;
        break;
      case "lineEnd":
        col = maxCol;
        break;
    }
    if (col === focus.col && row === focus.row)
      return;
    moveFocus(this.selection, col, row), this.notifySelectionChange();
  }
  hasTextSelection() {
    return hasSelection(this.selection);
  }
  subscribeToSelectionChange(cb) {
    return this.selectionListeners.add(cb), () => this.selectionListeners.delete(cb);
  }
  notifySelectionChange() {
    this.onRender();
    for (let cb of this.selectionListeners)
      cb();
  }
  dispatchClick(col, row) {
    if (!this.altScreenActive)
      return !1;
    let blank = isEmptyCellAt(this.frontFrame.screen, col, row);
    return dispatchClick(this.rootNode, col, row, blank);
  }
  dispatchHover(col, row) {
    if (!this.altScreenActive)
      return;
    dispatchHover(this.rootNode, col, row, this.hoveredNodes);
  }
  dispatchKeyboardEvent(parsedKey) {
    let target = this.focusManager.activeElement ?? this.rootNode, event = new KeyboardEvent(parsedKey);
    if (dispatcher.dispatchDiscrete(target, event), !event.defaultPrevented && parsedKey.name === "tab" && !parsedKey.ctrl && !parsedKey.meta)
      if (parsedKey.shift)
        this.focusManager.focusPrevious(this.rootNode);
      else
        this.focusManager.focusNext(this.rootNode);
  }
  getHyperlinkAt(col, row) {
    if (!this.altScreenActive)
      return;
    let screen = this.frontFrame.screen, cell = cellAt(screen, col, row), url3 = cell?.hyperlink;
    if (!url3 && cell?.width === 2 /* SpacerTail */ && col > 0)
      url3 = cellAt(screen, col - 1, row)?.hyperlink;
    return url3 ?? findPlainTextUrlAt(screen, col, row);
  }
  onHyperlinkClick;
  openHyperlink(url3) {
    this.onHyperlinkClick?.(url3);
  }
  handleMultiClick(col, row, count3) {
    if (!this.altScreenActive)
      return;
    let screen = this.frontFrame.screen;
    if (startSelection(this.selection, col, row), count3 === 2)
      selectWordAt(this.selection, screen, col, row);
    else
      selectLineAt(this.selection, screen, row);
    if (!this.selection.focus)
      this.selection.focus = this.selection.anchor;
    this.notifySelectionChange();
  }
  handleSelectionDrag(col, row) {
    if (!this.altScreenActive)
      return;
    let sel = this.selection;
    if (sel.anchorSpan)
      extendSelection(sel, this.frontFrame.screen, col, row);
    else
      updateSelection(sel, col, row);
    this.notifySelectionChange();
  }
  stdinListeners = [];
  wasRawMode = !1;
  suspendStdin() {
    let stdin = this.options.stdin;
    if (!stdin.isTTY)
      return;
    let readableListeners = stdin.listeners("readable");
    logForDebugging(`[stdin] suspendStdin: removing ${readableListeners.length} readable listener(s), wasRawMode=${stdin.isRaw ?? !1}`), readableListeners.forEach((listener) => {
      this.stdinListeners.push({
        event: "readable",
        listener
      }), stdin.removeListener("readable", listener);
    });
    let stdinWithRaw = stdin;
    if (stdinWithRaw.isRaw && stdinWithRaw.setRawMode)
      stdinWithRaw.setRawMode(!1), this.wasRawMode = !0;
  }
  resumeStdin() {
    let stdin = this.options.stdin;
    if (!stdin.isTTY)
      return;
    if (this.stdinListeners.length === 0 && !this.wasRawMode)
      logForDebugging("[stdin] resumeStdin: called with no stored listeners and wasRawMode=false (possible desync)", {
        level: "warn"
      });
    if (logForDebugging(`[stdin] resumeStdin: re-attaching ${this.stdinListeners.length} listener(s), wasRawMode=${this.wasRawMode}`), this.stdinListeners.forEach(({
      event,
      listener
    }) => {
      stdin.addListener(event, listener);
    }), this.stdinListeners = [], this.wasRawMode) {
      let stdinWithRaw = stdin;
      if (stdinWithRaw.setRawMode)
        stdinWithRaw.setRawMode(!0);
      this.wasRawMode = !1;
    }
  }
  writeRaw(data) {
    this.options.stdout.write(data);
  }
  setCursorDeclaration = (decl, clearIfNode) => {
    if (decl === null && clearIfNode !== void 0 && this.cursorDeclaration?.node !== clearIfNode)
      return;
    this.cursorDeclaration = decl;
  };
  render(node) {
    this.currentNode = node;
    let tree = /* @__PURE__ */ jsx_dev_runtime8.jsxDEV(App, {
      stdin: this.options.stdin,
      stdout: this.options.stdout,
      stderr: this.options.stderr,
      exitOnCtrlC: this.options.exitOnCtrlC,
      onExit: this.unmount,
      terminalColumns: this.terminalColumns,
      terminalRows: this.terminalRows,
      selection: this.selection,
      onSelectionChange: this.notifySelectionChange,
      onClickAt: this.dispatchClick,
      onHoverAt: this.dispatchHover,
      getHyperlinkAt: this.getHyperlinkAt,
      onOpenHyperlink: this.openHyperlink,
      onMultiClick: this.handleMultiClick,
      onSelectionDrag: this.handleSelectionDrag,
      onStdinResume: this.reassertTerminalModes,
      onCursorDeclaration: this.setCursorDeclaration,
      dispatchKeyboardEvent: this.dispatchKeyboardEvent,
      children: /* @__PURE__ */ jsx_dev_runtime8.jsxDEV(TerminalWriteProvider, {
        value: this.writeRaw,
        children: node
      }, void 0, !1, void 0, this)
    }, void 0, !1, void 0, this);
    reconciler_default.updateContainerSync(tree, this.container, null, noop_default), reconciler_default.flushSyncWork();
  }
  unmount(error44) {
    if (this.isUnmounted)
      return;
    if (this.onRender(), this.unsubscribeExit(), typeof this.restoreConsole === "function")
      this.restoreConsole();
    this.restoreStderr?.(), this.unsubscribeTTYHandlers?.();
    let diff2 = this.log.renderPreviousOutput_DEPRECATED(this.frontFrame);
    if (writeDiffToTerminal(this.terminal, optimize(diff2)), this.options.stdout.isTTY) {
      if (this.altScreenActive)
        writeSync(1, EXIT_ALT_SCREEN);
      if (writeSync(1, DISABLE_MOUSE_TRACKING), this.drainStdin(), writeSync(1, DISABLE_MODIFY_OTHER_KEYS), writeSync(1, DISABLE_KITTY_KEYBOARD), writeSync(1, DFE), writeSync(1, DBP), writeSync(1, SHOW_CURSOR), writeSync(1, CLEAR_ITERM2_PROGRESS), supportsTabStatus())
        writeSync(1, wrapForMultiplexer(CLEAR_TAB_STATUS));
    }
    if (this.isUnmounted = !0, this.scheduleRender.cancel?.(), this.drainTimer !== null)
      clearTimeout(this.drainTimer), this.drainTimer = null;
    if (reconciler_default.updateContainerSync(null, this.container, null, noop_default), reconciler_default.flushSyncWork(), instances_default.delete(this.options.stdout), this.rootNode.yogaNode?.free(), this.rootNode.yogaNode = void 0, error44 instanceof Error)
      this.rejectExitPromise(error44);
    else
      this.resolveExitPromise();
  }
  async waitUntilExit() {
    return this.exitPromise ||= new Promise((resolve10, reject) => {
      this.resolveExitPromise = resolve10, this.rejectExitPromise = reject;
    }), this.exitPromise;
  }
  resetLineCount() {
    if (this.options.stdout.isTTY)
      this.backFrame = this.frontFrame, this.frontFrame = emptyFrame(this.frontFrame.viewport.height, this.frontFrame.viewport.width, this.stylePool, this.charPool, this.hyperlinkPool), this.log.reset(), this.displayCursor = null;
  }
  resetPools() {
    this.charPool = new CharPool, this.hyperlinkPool = new HyperlinkPool, migrateScreenPools(this.frontFrame.screen, this.charPool, this.hyperlinkPool), this.backFrame.screen.charPool = this.charPool, this.backFrame.screen.hyperlinkPool = this.hyperlinkPool;
  }
  patchConsole() {
    let con = console, originals = {}, toDebug = (...args) => logForDebugging(`console.log: ${format3(...args)}`), toError2 = (...args) => logError2(Error(`console.error: ${format3(...args)}`));
    for (let m4 of CONSOLE_STDOUT_METHODS)
      originals[m4] = con[m4], con[m4] = toDebug;
    for (let m4 of CONSOLE_STDERR_METHODS)
      originals[m4] = con[m4], con[m4] = toError2;
    return originals.assert = con.assert, con.assert = (condition, ...args) => {
      if (!condition)
        toError2(...args);
    }, () => Object.assign(con, originals);
  }
  patchStderr() {
    let stderr = process.stderr, originalWrite = stderr.write, reentered = !1, intercept = (chunk, encodingOrCb, cb) => {
      let callback = typeof encodingOrCb === "function" ? encodingOrCb : cb;
      if (reentered) {
        let encoding = typeof encodingOrCb === "string" ? encodingOrCb : void 0;
        return originalWrite.call(stderr, chunk, encoding, callback);
      }
      reentered = !0;
      try {
        let text = typeof chunk === "string" ? chunk : Buffer.from(chunk).toString("utf8");
        if (logForDebugging(`[stderr] ${text}`, {
          level: "warn"
        }), this.altScreenActive && !this.isUnmounted && !this.isPaused)
          this.prevFrameContaminated = !0, this.scheduleRender();
      } finally {
        reentered = !1, callback?.();
      }
      return !0;
    };
    return stderr.write = intercept, () => {
      if (stderr.write === intercept)
        stderr.write = originalWrite;
    };
  }
}
