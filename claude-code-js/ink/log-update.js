// Original: src/ink/log-update.ts
class LogUpdate {
  options;
  state;
  constructor(options) {
    this.options = options;
    this.state = {
      previousOutput: ""
    };
  }
  renderPreviousOutput_DEPRECATED(prevFrame) {
    if (!this.options.isTTY)
      return [NEWLINE];
    return this.getRenderOpsForDone(prevFrame);
  }
  reset() {
    this.state.previousOutput = "";
  }
  renderFullFrame(frame) {
    let { screen } = frame, lines = [], currentStyles = [], currentHyperlink = void 0;
    for (let y2 = 0;y2 < screen.height; y2++) {
      let line = "";
      for (let x3 = 0;x3 < screen.width; x3++) {
        let cell = cellAt(screen, x3, y2);
        if (cell && cell.width !== 2 /* SpacerTail */) {
          if (cell.hyperlink !== currentHyperlink) {
            if (currentHyperlink !== void 0)
              line += LINK_END;
            if (cell.hyperlink !== void 0)
              line += link(cell.hyperlink);
            currentHyperlink = cell.hyperlink;
          }
          let cellStyles = this.options.stylePool.get(cell.styleId), styleDiff = diffAnsiCodes(currentStyles, cellStyles);
          if (styleDiff.length > 0)
            line += ansiCodesToString(styleDiff), currentStyles = cellStyles;
          line += cell.char;
        }
      }
      if (currentHyperlink !== void 0)
        line += LINK_END, currentHyperlink = void 0;
      let resetCodes = diffAnsiCodes(currentStyles, []);
      if (resetCodes.length > 0)
        line += ansiCodesToString(resetCodes), currentStyles = [];
      lines.push(line.trimEnd());
    }
    if (lines.length === 0)
      return [];
    return [{ type: "stdout", content: lines.join(`
`) }];
  }
  getRenderOpsForDone(prev) {
    if (this.state.previousOutput = "", !prev.cursor.visible)
      return [{ type: "cursorShow" }];
    return [];
  }
  render(prev, next, altScreen = !1, decstbmSafe = !0) {
    if (!this.options.isTTY)
      return this.renderFullFrame(next);
    let startTime = performance.now(), stylePool = this.options.stylePool;
    if (next.viewport.height < prev.viewport.height || prev.viewport.width !== 0 && next.viewport.width !== prev.viewport.width)
      return fullResetSequence_CAUSES_FLICKER(next, "resize", stylePool);
    let scrollPatch = [];
    if (altScreen && next.scrollHint && decstbmSafe) {
      let { top, bottom, delta } = next.scrollHint;
      if (top >= 0 && bottom < prev.screen.height && bottom < next.screen.height)
        shiftRows(prev.screen, top, bottom, delta), scrollPatch = [
          {
            type: "stdout",
            content: setScrollRegion(top + 1, bottom + 1) + (delta > 0 ? scrollUp(delta) : scrollDown(-delta)) + RESET_SCROLL_REGION + CURSOR_HOME
          }
        ];
    }
    let cursorAtBottom = prev.cursor.y >= prev.screen.height, isGrowing = next.screen.height > prev.screen.height, prevHadScrollback = cursorAtBottom && prev.screen.height >= prev.viewport.height, isShrinking = next.screen.height < prev.screen.height, nextFitsViewport = next.screen.height <= prev.viewport.height;
    if (prevHadScrollback && nextFitsViewport && isShrinking)
      return logForDebugging(`Full reset (shrink->below): prevHeight=${prev.screen.height}, nextHeight=${next.screen.height}, viewport=${prev.viewport.height}`), fullResetSequence_CAUSES_FLICKER(next, "offscreen", stylePool);
    if (prev.screen.height >= prev.viewport.height && prev.screen.height > 0 && cursorAtBottom && !isGrowing) {
      let scrollbackRows = prev.screen.height - prev.viewport.height + 1, scrollbackChangeY = -1;
      if (diffEach(prev.screen, next.screen, (_x, y2) => {
        if (y2 < scrollbackRows)
          return scrollbackChangeY = y2, !0;
      }), scrollbackChangeY >= 0) {
        let prevLine = readLine(prev.screen, scrollbackChangeY), nextLine = readLine(next.screen, scrollbackChangeY);
        return fullResetSequence_CAUSES_FLICKER(next, "offscreen", stylePool, {
          triggerY: scrollbackChangeY,
          prevLine,
          nextLine
        });
      }
    }
    let screen = new VirtualScreen(prev.cursor, next.viewport.width), heightDelta = Math.max(next.screen.height, 1) - Math.max(prev.screen.height, 1), shrinking = heightDelta < 0, growing = heightDelta > 0;
    if (shrinking) {
      let linesToClear = prev.screen.height - next.screen.height;
      if (linesToClear > prev.viewport.height)
        return fullResetSequence_CAUSES_FLICKER(next, "offscreen", this.options.stylePool);
      screen.txn((prev2) => [
        [
          { type: "clear", count: linesToClear },
          { type: "cursorMove", x: 0, y: -1 }
        ],
        { dx: -prev2.x, dy: -linesToClear }
      ]);
    }
    let cursorRestoreScroll = prevHadScrollback ? 1 : 0, viewportY = growing ? Math.max(0, prev.screen.height - prev.viewport.height + cursorRestoreScroll) : Math.max(prev.screen.height, next.screen.height) - next.viewport.height + cursorRestoreScroll, currentStyleId = stylePool.none, currentHyperlink = void 0, needsFullReset = !1, resetTriggerY = -1;
    if (diffEach(prev.screen, next.screen, (x3, y2, removed, added) => {
      if (growing && y2 >= prev.screen.height)
        return;
      if (added && (added.width === 2 /* SpacerTail */ || added.width === 3 /* SpacerHead */))
        return;
      if (removed && (removed.width === 2 /* SpacerTail */ || removed.width === 3 /* SpacerHead */) && !added)
        return;
      if (added && isEmptyCellAt(next.screen, x3, y2) && !removed)
        return;
      if (y2 < viewportY)
        return needsFullReset = !0, resetTriggerY = y2, !0;
      if (moveCursorTo(screen, x3, y2), added) {
        let targetHyperlink = added.hyperlink;
        currentHyperlink = transitionHyperlink(screen.diff, currentHyperlink, targetHyperlink);
        let styleStr = stylePool.transition(currentStyleId, added.styleId);
        if (writeCellWithStyleStr(screen, added, styleStr))
          currentStyleId = added.styleId;
      } else if (removed) {
        let styleIdToReset = currentStyleId, hyperlinkToReset = currentHyperlink;
        currentStyleId = stylePool.none, currentHyperlink = void 0, screen.txn(() => {
          let patches = [];
          return transitionStyle(patches, stylePool, styleIdToReset, stylePool.none), transitionHyperlink(patches, hyperlinkToReset, void 0), patches.push({ type: "stdout", content: " " }), [patches, { dx: 1, dy: 0 }];
        });
      }
    }), needsFullReset)
      return fullResetSequence_CAUSES_FLICKER(next, "offscreen", stylePool, {
        triggerY: resetTriggerY,
        prevLine: readLine(prev.screen, resetTriggerY),
        nextLine: readLine(next.screen, resetTriggerY)
      });
    if (currentStyleId = transitionStyle(screen.diff, stylePool, currentStyleId, stylePool.none), currentHyperlink = transitionHyperlink(screen.diff, currentHyperlink, void 0), growing)
      renderFrameSlice(screen, next, prev.screen.height, next.screen.height, stylePool);
    if (altScreen)
      ;
    else if (next.cursor.y >= next.screen.height)
      screen.txn((prev2) => {
        let rowsToCreate = next.cursor.y - prev2.y;
        if (rowsToCreate > 0) {
          let patches = Array(1 + rowsToCreate);
          patches[0] = CARRIAGE_RETURN;
          for (let i4 = 0;i4 < rowsToCreate; i4++)
            patches[1 + i4] = NEWLINE;
          return [patches, { dx: -prev2.x, dy: rowsToCreate }];
        }
        let dy = next.cursor.y - prev2.y;
        if (dy !== 0 || prev2.x !== next.cursor.x) {
          let patches = [CARRIAGE_RETURN];
          return patches.push({ type: "cursorMove", x: next.cursor.x, y: dy }), [patches, { dx: next.cursor.x - prev2.x, dy }];
        }
        return [[], { dx: 0, dy: 0 }];
      });
    else
      moveCursorTo(screen, next.cursor.x, next.cursor.y);
    let elapsed = performance.now() - startTime;
    if (elapsed > 50) {
      let damage = next.screen.damage, damageInfo = damage ? `${damage.width}x${damage.height} at (${damage.x},${damage.y})` : "none";
      logForDebugging(`Slow render: ${elapsed.toFixed(1)}ms, screen: ${next.screen.height}x${next.screen.width}, damage: ${damageInfo}, changes: ${screen.diff.length}`);
    }
    return scrollPatch.length > 0 ? [...scrollPatch, ...screen.diff] : screen.diff;
  }
}
function transitionHyperlink(diff2, current, target) {
  if (current !== target)
    return diff2.push({ type: "hyperlink", uri: target ?? "" }), target;
  return current;
}
function transitionStyle(diff2, stylePool, currentId, targetId) {
  let str = stylePool.transition(currentId, targetId);
  if (str.length > 0)
    diff2.push({ type: "styleStr", str });
  return targetId;
}
function readLine(screen, y2) {
  let line = "";
  for (let x3 = 0;x3 < screen.width; x3++)
    line += charInCellAt(screen, x3, y2) ?? " ";
  return line.trimEnd();
}
function fullResetSequence_CAUSES_FLICKER(frame, reason, stylePool, debug) {
  let screen = new VirtualScreen({ x: 0, y: 0 }, frame.viewport.width);
  return renderFrame(screen, frame, stylePool), [{ type: "clearTerminal", reason, debug }, ...screen.diff];
}
function renderFrame(screen, frame, stylePool) {
  renderFrameSlice(screen, frame, 0, frame.screen.height, stylePool);
}
function renderFrameSlice(screen, frame, startY, endY, stylePool) {
  let currentStyleId = stylePool.none, currentHyperlink = void 0, lastRenderedStyleId = -1, { width: screenWidth, cells, charPool, hyperlinkPool } = frame.screen, index = startY * screenWidth;
  for (let y2 = startY;y2 < endY; y2 += 1) {
    if (screen.cursor.y < y2) {
      let rowsToAdvance = y2 - screen.cursor.y;
      screen.txn((prev) => {
        let patches = Array(1 + rowsToAdvance);
        patches[0] = CARRIAGE_RETURN;
        for (let i4 = 0;i4 < rowsToAdvance; i4++)
          patches[1 + i4] = NEWLINE;
        return [patches, { dx: -prev.x, dy: rowsToAdvance }];
      });
    }
    lastRenderedStyleId = -1;
    for (let x3 = 0;x3 < screenWidth; x3 += 1, index += 1) {
      let cell = visibleCellAtIndex(cells, charPool, hyperlinkPool, index, lastRenderedStyleId);
      if (!cell)
        continue;
      moveCursorTo(screen, x3, y2);
      let targetHyperlink = cell.hyperlink;
      currentHyperlink = transitionHyperlink(screen.diff, currentHyperlink, targetHyperlink);
      let styleStr = stylePool.transition(currentStyleId, cell.styleId);
      if (writeCellWithStyleStr(screen, cell, styleStr))
        currentStyleId = cell.styleId, lastRenderedStyleId = cell.styleId;
    }
    currentStyleId = transitionStyle(screen.diff, stylePool, currentStyleId, stylePool.none), currentHyperlink = transitionHyperlink(screen.diff, currentHyperlink, void 0), screen.txn((prev) => [[CARRIAGE_RETURN, NEWLINE], { dx: -prev.x, dy: 1 }]);
  }
  return transitionStyle(screen.diff, stylePool, currentStyleId, stylePool.none), transitionHyperlink(screen.diff, currentHyperlink, void 0), screen;
}
function writeCellWithStyleStr(screen, cell, styleStr) {
  let cellWidth = cell.width === 1 /* Wide */ ? 2 : 1, px = screen.cursor.x, vw = screen.viewportWidth;
  if (cellWidth === 2 && px < vw) {
    let threshold = cell.char.length > 2 ? vw : vw + 1;
    if (px + 2 >= threshold)
      return !1;
  }
  let diff2 = screen.diff;
  if (styleStr.length > 0)
    diff2.push({ type: "styleStr", str: styleStr });
  let needsCompensation = cellWidth === 2 && needsWidthCompensation(cell.char);
  if (needsCompensation && px + 1 < vw)
    diff2.push({ type: "cursorTo", col: px + 2 }), diff2.push({ type: "stdout", content: " " }), diff2.push({ type: "cursorTo", col: px + 1 });
  if (diff2.push({ type: "stdout", content: cell.char }), needsCompensation)
    diff2.push({ type: "cursorTo", col: px + cellWidth + 1 });
  if (px >= vw)
    screen.cursor.x = cellWidth, screen.cursor.y++;
  else
    screen.cursor.x = px + cellWidth;
  return !0;
}
function moveCursorTo(screen, targetX, targetY) {
  screen.txn((prev) => {
    let dx = targetX - prev.x, dy = targetY - prev.y;
    if (prev.x >= screen.viewportWidth)
      return [
        [CARRIAGE_RETURN, { type: "cursorMove", x: targetX, y: dy }],
        { dx, dy }
      ];
    if (dy !== 0)
      return [
        [CARRIAGE_RETURN, { type: "cursorMove", x: targetX, y: dy }],
        { dx, dy }
      ];
    return [[{ type: "cursorMove", x: dx, y: dy }], { dx, dy }];
  });
}
function needsWidthCompensation(char) {
  let cp = char.codePointAt(0);
  if (cp === void 0)
    return !1;
  if (cp >= 129648 && cp <= 129791 || cp >= 129792 && cp <= 130047)
    return !0;
  if (char.length >= 2) {
    for (let i4 = 0;i4 < char.length; i4++)
      if (char.charCodeAt(i4) === 65039)
        return !0;
  }
  return !1;
}

class VirtualScreen {
  viewportWidth;
  cursor;
  diff = [];
  constructor(origin2, viewportWidth) {
    this.viewportWidth = viewportWidth;
    this.cursor = { ...origin2 };
  }
  txn(fn) {
    let [patches, next] = fn(this.cursor);
    for (let patch of patches)
      this.diff.push(patch);
    this.cursor.x += next.dx, this.cursor.y += next.dy;
  }
}
var CARRIAGE_RETURN, NEWLINE;
var init_log_update = __esm(() => {
  init_build();
  init_debug();
  init_screen();
  init_csi();
  init_osc();
  CARRIAGE_RETURN = { type: "carriageReturn" }, NEWLINE = { type: "stdout", content: `
` };
});
