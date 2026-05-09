// Original: src/ink/selection.ts
function createSelectionState() {
  return {
    anchor: null,
    focus: null,
    isDragging: !1,
    anchorSpan: null,
    scrolledOffAbove: [],
    scrolledOffBelow: [],
    scrolledOffAboveSW: [],
    scrolledOffBelowSW: [],
    lastPressHadAlt: !1
  };
}
function startSelection(s2, col, row) {
  s2.anchor = { col, row }, s2.focus = null, s2.isDragging = !0, s2.anchorSpan = null, s2.scrolledOffAbove = [], s2.scrolledOffBelow = [], s2.scrolledOffAboveSW = [], s2.scrolledOffBelowSW = [], s2.virtualAnchorRow = void 0, s2.virtualFocusRow = void 0, s2.lastPressHadAlt = !1;
}
function updateSelection(s2, col, row) {
  if (!s2.isDragging)
    return;
  if (!s2.focus && s2.anchor && s2.anchor.col === col && s2.anchor.row === row)
    return;
  s2.focus = { col, row };
}
function finishSelection(s2) {
  s2.isDragging = !1;
}
function clearSelection(s2) {
  s2.anchor = null, s2.focus = null, s2.isDragging = !1, s2.anchorSpan = null, s2.scrolledOffAbove = [], s2.scrolledOffBelow = [], s2.scrolledOffAboveSW = [], s2.scrolledOffBelowSW = [], s2.virtualAnchorRow = void 0, s2.virtualFocusRow = void 0, s2.lastPressHadAlt = !1;
}
function charClass(c3) {
  if (c3 === " " || c3 === "")
    return 0;
  if (WORD_CHAR.test(c3))
    return 1;
  return 2;
}
function wordBoundsAt(screen, col, row) {
  if (row < 0 || row >= screen.height)
    return null;
  let { width, noSelect } = screen, rowOff = row * width, c3 = col;
  if (c3 > 0) {
    let cell = cellAt(screen, c3, row);
    if (cell && cell.width === 2 /* SpacerTail */)
      c3 -= 1;
  }
  if (c3 < 0 || c3 >= width || noSelect[rowOff + c3] === 1)
    return null;
  let startCell = cellAt(screen, c3, row);
  if (!startCell)
    return null;
  let cls = charClass(startCell.char), lo = c3;
  while (lo > 0) {
    let prev = lo - 1;
    if (noSelect[rowOff + prev] === 1)
      break;
    let pc = cellAt(screen, prev, row);
    if (!pc)
      break;
    if (pc.width === 2 /* SpacerTail */) {
      if (prev === 0 || noSelect[rowOff + prev - 1] === 1)
        break;
      let head = cellAt(screen, prev - 1, row);
      if (!head || charClass(head.char) !== cls)
        break;
      lo = prev - 1;
      continue;
    }
    if (charClass(pc.char) !== cls)
      break;
    lo = prev;
  }
  let hi = c3;
  while (hi < width - 1) {
    let next = hi + 1;
    if (noSelect[rowOff + next] === 1)
      break;
    let nc = cellAt(screen, next, row);
    if (!nc)
      break;
    if (nc.width === 2 /* SpacerTail */) {
      hi = next;
      continue;
    }
    if (charClass(nc.char) !== cls)
      break;
    hi = next;
  }
  return { lo, hi };
}
function comparePoints(a2, b) {
  if (a2.row !== b.row)
    return a2.row < b.row ? -1 : 1;
  if (a2.col !== b.col)
    return a2.col < b.col ? -1 : 1;
  return 0;
}
function selectWordAt(s2, screen, col, row) {
  let b = wordBoundsAt(screen, col, row);
  if (!b)
    return;
  let lo = { col: b.lo, row }, hi = { col: b.hi, row };
  s2.anchor = lo, s2.focus = hi, s2.isDragging = !0, s2.anchorSpan = { lo, hi, kind: "word" };
}
function isUrlChar(c3) {
  if (c3.length !== 1)
    return !1;
  let code = c3.charCodeAt(0);
  return code >= 33 && code <= 126 && !URL_BOUNDARY.has(c3);
}
function findPlainTextUrlAt(screen, col, row) {
  if (row < 0 || row >= screen.height)
    return;
  let { width, noSelect } = screen, rowOff = row * width, c3 = col;
  if (c3 > 0) {
    let cell = cellAt(screen, c3, row);
    if (cell && cell.width === 2 /* SpacerTail */)
      c3 -= 1;
  }
  if (c3 < 0 || c3 >= width || noSelect[rowOff + c3] === 1)
    return;
  let startCell = cellAt(screen, c3, row);
  if (!startCell || !isUrlChar(startCell.char))
    return;
  let lo = c3;
  while (lo > 0) {
    let prev = lo - 1;
    if (noSelect[rowOff + prev] === 1)
      break;
    let pc = cellAt(screen, prev, row);
    if (!pc || pc.width !== 0 /* Narrow */ || !isUrlChar(pc.char))
      break;
    lo = prev;
  }
  let hi = c3;
  while (hi < width - 1) {
    let next = hi + 1;
    if (noSelect[rowOff + next] === 1)
      break;
    let nc = cellAt(screen, next, row);
    if (!nc || nc.width !== 0 /* Narrow */ || !isUrlChar(nc.char))
      break;
    hi = next;
  }
  let token = "";
  for (let i4 = lo;i4 <= hi; i4++)
    token += cellAt(screen, i4, row).char;
  let clickIdx = c3 - lo, schemeRe = /(?:https?|file):\/\//g, urlStart = -1, urlEnd = token.length;
  for (let m4;m4 = schemeRe.exec(token); ) {
    if (m4.index > clickIdx) {
      urlEnd = m4.index;
      break;
    }
    urlStart = m4.index;
  }
  if (urlStart < 0)
    return;
  let url3 = token.slice(urlStart, urlEnd), OPENER = { ")": "(", "]": "[", "}": "{" };
  while (url3.length > 0) {
    let last = url3.at(-1);
    if (".,;:!?".includes(last)) {
      url3 = url3.slice(0, -1);
      continue;
    }
    let opener = OPENER[last];
    if (!opener)
      break;
    let opens = 0, closes = 0;
    for (let i4 = 0;i4 < url3.length; i4++) {
      let ch = url3.charAt(i4);
      if (ch === opener)
        opens++;
      else if (ch === last)
        closes++;
    }
    if (closes > opens)
      url3 = url3.slice(0, -1);
    else
      break;
  }
  if (clickIdx >= urlStart + url3.length)
    return;
  return url3;
}
function selectLineAt(s2, screen, row) {
  if (row < 0 || row >= screen.height)
    return;
  let lo = { col: 0, row }, hi = { col: screen.width - 1, row };
  s2.anchor = lo, s2.focus = hi, s2.isDragging = !0, s2.anchorSpan = { lo, hi, kind: "line" };
}
function extendSelection(s2, screen, col, row) {
  if (!s2.isDragging || !s2.anchorSpan)
    return;
  let span = s2.anchorSpan, mLo, mHi;
  if (span.kind === "word") {
    let b = wordBoundsAt(screen, col, row);
    mLo = { col: b ? b.lo : col, row }, mHi = { col: b ? b.hi : col, row };
  } else {
    let r4 = clamp(row, 0, screen.height - 1);
    mLo = { col: 0, row: r4 }, mHi = { col: screen.width - 1, row: r4 };
  }
  if (comparePoints(mHi, span.lo) < 0)
    s2.anchor = span.hi, s2.focus = mLo;
  else if (comparePoints(mLo, span.hi) > 0)
    s2.anchor = span.lo, s2.focus = mHi;
  else
    s2.anchor = span.lo, s2.focus = span.hi;
}
function moveFocus(s2, col, row) {
  if (!s2.focus)
    return;
  s2.anchorSpan = null, s2.focus = { col, row }, s2.virtualFocusRow = void 0;
}
function shiftSelection(s2, dRow, minRow, maxRow, width) {
  if (!s2.anchor || !s2.focus)
    return;
  let vAnchor = (s2.virtualAnchorRow ?? s2.anchor.row) + dRow, vFocus = (s2.virtualFocusRow ?? s2.focus.row) + dRow;
  if (vAnchor < minRow && vFocus < minRow || vAnchor > maxRow && vFocus > maxRow) {
    clearSelection(s2);
    return;
  }
  let oldMin = Math.min(s2.virtualAnchorRow ?? s2.anchor.row, s2.virtualFocusRow ?? s2.focus.row), oldMax = Math.max(s2.virtualAnchorRow ?? s2.anchor.row, s2.virtualFocusRow ?? s2.focus.row), oldAboveDebt = Math.max(0, minRow - oldMin), oldBelowDebt = Math.max(0, oldMax - maxRow), newAboveDebt = Math.max(0, minRow - Math.min(vAnchor, vFocus)), newBelowDebt = Math.max(0, Math.max(vAnchor, vFocus) - maxRow);
  if (newAboveDebt < oldAboveDebt) {
    let drop = oldAboveDebt - newAboveDebt;
    s2.scrolledOffAbove.length -= drop, s2.scrolledOffAboveSW.length = s2.scrolledOffAbove.length;
  }
  if (newBelowDebt < oldBelowDebt) {
    let drop = oldBelowDebt - newBelowDebt;
    s2.scrolledOffBelow.splice(0, drop), s2.scrolledOffBelowSW.splice(0, drop);
  }
  if (s2.scrolledOffAbove.length > newAboveDebt)
    s2.scrolledOffAbove = newAboveDebt > 0 ? s2.scrolledOffAbove.slice(-newAboveDebt) : [], s2.scrolledOffAboveSW = newAboveDebt > 0 ? s2.scrolledOffAboveSW.slice(-newAboveDebt) : [];
  if (s2.scrolledOffBelow.length > newBelowDebt)
    s2.scrolledOffBelow = s2.scrolledOffBelow.slice(0, newBelowDebt), s2.scrolledOffBelowSW = s2.scrolledOffBelowSW.slice(0, newBelowDebt);
  let shift = (p4, vRow) => {
    if (vRow < minRow)
      return { col: 0, row: minRow };
    if (vRow > maxRow)
      return { col: width - 1, row: maxRow };
    return { col: p4.col, row: vRow };
  };
  if (s2.anchor = shift(s2.anchor, vAnchor), s2.focus = shift(s2.focus, vFocus), s2.virtualAnchorRow = vAnchor < minRow || vAnchor > maxRow ? vAnchor : void 0, s2.virtualFocusRow = vFocus < minRow || vFocus > maxRow ? vFocus : void 0, s2.anchorSpan) {
    let sp = (p4) => {
      let r4 = p4.row + dRow;
      if (r4 < minRow)
        return { col: 0, row: minRow };
      if (r4 > maxRow)
        return { col: width - 1, row: maxRow };
      return { col: p4.col, row: r4 };
    };
    s2.anchorSpan = {
      lo: sp(s2.anchorSpan.lo),
      hi: sp(s2.anchorSpan.hi),
      kind: s2.anchorSpan.kind
    };
  }
}
function shiftAnchor(s2, dRow, minRow, maxRow) {
  if (!s2.anchor)
    return;
  let raw = (s2.virtualAnchorRow ?? s2.anchor.row) + dRow;
  if (s2.anchor = { col: s2.anchor.col, row: clamp(raw, minRow, maxRow) }, s2.virtualAnchorRow = raw < minRow || raw > maxRow ? raw : void 0, s2.anchorSpan) {
    let shift = (p4) => ({
      col: p4.col,
      row: clamp(p4.row + dRow, minRow, maxRow)
    });
    s2.anchorSpan = {
      lo: shift(s2.anchorSpan.lo),
      hi: shift(s2.anchorSpan.hi),
      kind: s2.anchorSpan.kind
    };
  }
}
function shiftSelectionForFollow(s2, dRow, minRow, maxRow) {
  if (!s2.anchor)
    return !1;
  let rawAnchor = (s2.virtualAnchorRow ?? s2.anchor.row) + dRow, rawFocus = s2.focus ? (s2.virtualFocusRow ?? s2.focus.row) + dRow : void 0;
  if (rawAnchor < minRow && rawFocus !== void 0 && rawFocus < minRow)
    return clearSelection(s2), !0;
  if (s2.anchor = { col: s2.anchor.col, row: clamp(rawAnchor, minRow, maxRow) }, s2.focus && rawFocus !== void 0)
    s2.focus = { col: s2.focus.col, row: clamp(rawFocus, minRow, maxRow) };
  if (s2.virtualAnchorRow = rawAnchor < minRow || rawAnchor > maxRow ? rawAnchor : void 0, s2.virtualFocusRow = rawFocus !== void 0 && (rawFocus < minRow || rawFocus > maxRow) ? rawFocus : void 0, s2.anchorSpan) {
    let shift = (p4) => ({
      col: p4.col,
      row: clamp(p4.row + dRow, minRow, maxRow)
    });
    s2.anchorSpan = {
      lo: shift(s2.anchorSpan.lo),
      hi: shift(s2.anchorSpan.hi),
      kind: s2.anchorSpan.kind
    };
  }
  return !1;
}
function hasSelection(s2) {
  return s2.anchor !== null && s2.focus !== null;
}
function selectionBounds(s2) {
  if (!s2.anchor || !s2.focus)
    return null;
  return comparePoints(s2.anchor, s2.focus) <= 0 ? { start: s2.anchor, end: s2.focus } : { start: s2.focus, end: s2.anchor };
}
function extractRowText(screen, row, colStart, colEnd) {
  let noSelect = screen.noSelect, rowOff = row * screen.width, contentEnd = row + 1 < screen.height ? screen.softWrap[row + 1] : 0, lastCol = contentEnd > 0 ? Math.min(colEnd, contentEnd - 1) : colEnd, line = "";
  for (let col = colStart;col <= lastCol; col++) {
    if (noSelect[rowOff + col] === 1)
      continue;
    let cell = cellAt(screen, col, row);
    if (!cell)
      continue;
    if (cell.width === 2 /* SpacerTail */ || cell.width === 3 /* SpacerHead */)
      continue;
    line += cell.char;
  }
  return contentEnd > 0 ? line : line.replace(/\s+$/, "");
}
function joinRows(lines, text, sw) {
  if (sw && lines.length > 0)
    lines[lines.length - 1] += text;
  else
    lines.push(text);
}
function getSelectedText(s2, screen) {
  let b = selectionBounds(s2);
  if (!b)
    return "";
  let { start, end } = b, sw = screen.softWrap, lines = [];
  for (let i4 = 0;i4 < s2.scrolledOffAbove.length; i4++)
    joinRows(lines, s2.scrolledOffAbove[i4], s2.scrolledOffAboveSW[i4]);
  for (let row = start.row;row <= end.row; row++) {
    let rowStart = row === start.row ? start.col : 0, rowEnd = row === end.row ? end.col : screen.width - 1;
    joinRows(lines, extractRowText(screen, row, rowStart, rowEnd), sw[row] > 0);
  }
  for (let i4 = 0;i4 < s2.scrolledOffBelow.length; i4++)
    joinRows(lines, s2.scrolledOffBelow[i4], s2.scrolledOffBelowSW[i4]);
  return lines.join(`
`);
}
function captureScrolledRows(s2, screen, firstRow, lastRow, side) {
  let b = selectionBounds(s2);
  if (!b || firstRow > lastRow)
    return;
  let { start, end } = b, lo = Math.max(firstRow, start.row), hi = Math.min(lastRow, end.row);
  if (lo > hi)
    return;
  let { width, softWrap: sw } = screen, captured = [], capturedSW = [];
  for (let row = lo;row <= hi; row++) {
    let colStart = row === start.row ? start.col : 0, colEnd = row === end.row ? end.col : width - 1;
    captured.push(extractRowText(screen, row, colStart, colEnd)), capturedSW.push(sw[row] > 0);
  }
  if (side === "above") {
    if (s2.scrolledOffAbove.push(...captured), s2.scrolledOffAboveSW.push(...capturedSW), s2.anchor && s2.anchor.row === start.row && lo === start.row) {
      if (s2.anchor = { col: 0, row: s2.anchor.row }, s2.anchorSpan)
        s2.anchorSpan = {
          kind: s2.anchorSpan.kind,
          lo: { col: 0, row: s2.anchorSpan.lo.row },
          hi: { col: width - 1, row: s2.anchorSpan.hi.row }
        };
    }
  } else if (s2.scrolledOffBelow.unshift(...captured), s2.scrolledOffBelowSW.unshift(...capturedSW), s2.anchor && s2.anchor.row === end.row && hi === end.row) {
    if (s2.anchor = { col: width - 1, row: s2.anchor.row }, s2.anchorSpan)
      s2.anchorSpan = {
        kind: s2.anchorSpan.kind,
        lo: { col: 0, row: s2.anchorSpan.lo.row },
        hi: { col: width - 1, row: s2.anchorSpan.hi.row }
      };
  }
}
function applySelectionOverlay(screen, selection, stylePool) {
  let b = selectionBounds(selection);
  if (!b)
    return;
  let { start, end } = b, width = screen.width, noSelect = screen.noSelect;
  for (let row = start.row;row <= end.row && row < screen.height; row++) {
    let colStart = row === start.row ? start.col : 0, colEnd = row === end.row ? Math.min(end.col, width - 1) : width - 1, rowOff = row * width;
    for (let col = colStart;col <= colEnd; col++) {
      let idx = rowOff + col;
      if (noSelect[idx] === 1)
        continue;
      let cell = cellAtIndex(screen, idx);
      setCellStyleId(screen, col, row, stylePool.withSelectionBg(cell.styleId));
    }
  }
}
var WORD_CHAR, URL_BOUNDARY;
var init_selection = __esm(() => {
  init_geometry();
  init_screen();
  WORD_CHAR = /[\p{L}\p{N}_/.\-+~\\]/u;
  URL_BOUNDARY = /* @__PURE__ */ new Set([..."<>\"'` "]);
});
