// Original: src/ink/output.ts
function intersectClip(parent, child) {
  if (!parent)
    return child;
  return {
    x1: maxDefined(parent.x1, child.x1),
    x2: minDefined(parent.x2, child.x2),
    y1: maxDefined(parent.y1, child.y1),
    y2: minDefined(parent.y2, child.y2)
  };
}
function maxDefined(a2, b) {
  if (a2 === void 0)
    return b;
  if (b === void 0)
    return a2;
  return Math.max(a2, b);
}
function minDefined(a2, b) {
  if (a2 === void 0)
    return b;
  if (b === void 0)
    return a2;
  return Math.min(a2, b);
}

class Output {
  width;
  height;
  stylePool;
  screen;
  operations = [];
  charCache = /* @__PURE__ */ new Map;
  constructor(options) {
    let { width, height, stylePool, screen } = options;
    this.width = width, this.height = height, this.stylePool = stylePool, this.screen = screen, resetScreen(screen, width, height);
  }
  reset(width, height, screen) {
    if (this.width = width, this.height = height, this.screen = screen, this.operations.length = 0, resetScreen(screen, width, height), this.charCache.size > 16384)
      this.charCache.clear();
  }
  blit(src, x3, y2, width, height) {
    this.operations.push({ type: "blit", src, x: x3, y: y2, width, height });
  }
  shift(top, bottom, n5) {
    this.operations.push({ type: "shift", top, bottom, n: n5 });
  }
  clear(region, fromAbsolute) {
    this.operations.push({ type: "clear", region, fromAbsolute });
  }
  noSelect(region) {
    this.operations.push({ type: "noSelect", region });
  }
  write(x3, y2, text, softWrap) {
    if (!text)
      return;
    this.operations.push({
      type: "write",
      x: x3,
      y: y2,
      text,
      softWrap
    });
  }
  clip(clip) {
    this.operations.push({
      type: "clip",
      clip
    });
  }
  unclip() {
    this.operations.push({
      type: "unclip"
    });
  }
  get() {
    let screen = this.screen, screenWidth = this.width, screenHeight = this.height, blitCells = 0, writeCells = 0, absoluteClears = [];
    for (let operation of this.operations) {
      if (operation.type !== "clear")
        continue;
      let { x: x3, y: y2, width, height } = operation.region, startX = Math.max(0, x3), startY = Math.max(0, y2), maxX = Math.min(x3 + width, screenWidth), maxY = Math.min(y2 + height, screenHeight);
      if (startX >= maxX || startY >= maxY)
        continue;
      let rect = {
        x: startX,
        y: startY,
        width: maxX - startX,
        height: maxY - startY
      };
      if (screen.damage = screen.damage ? unionRect(screen.damage, rect) : rect, operation.fromAbsolute)
        absoluteClears.push(rect);
    }
    let clips = [];
    for (let operation of this.operations)
      switch (operation.type) {
        case "clear":
          continue;
        case "clip":
          clips.push(intersectClip(clips.at(-1), operation.clip));
          continue;
        case "unclip":
          clips.pop();
          continue;
        case "blit": {
          let {
            src,
            x: regionX,
            y: regionY,
            width: regionWidth,
            height: regionHeight
          } = operation, clip = clips.at(-1), startX = Math.max(regionX, clip?.x1 ?? 0), startY = Math.max(regionY, clip?.y1 ?? 0), maxY = Math.min(regionY + regionHeight, screenHeight, src.height, clip?.y2 ?? 1 / 0), maxX = Math.min(regionX + regionWidth, screenWidth, src.width, clip?.x2 ?? 1 / 0);
          if (startX >= maxX || startY >= maxY)
            continue;
          if (absoluteClears.length === 0) {
            blitRegion(screen, src, startX, startY, maxX, maxY), blitCells += (maxY - startY) * (maxX - startX);
            continue;
          }
          let rowStart = startY;
          for (let row = startY;row <= maxY; row++)
            if (row < maxY && absoluteClears.some((r4) => row >= r4.y && row < r4.y + r4.height && startX >= r4.x && maxX <= r4.x + r4.width) || row === maxY) {
              if (row > rowStart)
                blitRegion(screen, src, startX, rowStart, maxX, row), blitCells += (row - rowStart) * (maxX - startX);
              rowStart = row + 1;
            }
          continue;
        }
        case "shift": {
          shiftRows(screen, operation.top, operation.bottom, operation.n);
          continue;
        }
        case "write": {
          let { text, softWrap } = operation, { x: x3, y: y2 } = operation, lines = text.split(`
`), swFrom = 0, prevContentEnd = 0, clip = clips.at(-1);
          if (clip) {
            let clipHorizontally = typeof clip?.x1 === "number" && typeof clip?.x2 === "number", clipVertically = typeof clip?.y1 === "number" && typeof clip?.y2 === "number";
            if (clipHorizontally) {
              let width = widestLine(text);
              if (x3 + width <= clip.x1 || x3 >= clip.x2)
                continue;
            }
            if (clipVertically) {
              let height = lines.length;
              if (y2 + height <= clip.y1 || y2 >= clip.y2)
                continue;
            }
            if (clipHorizontally) {
              if (lines = lines.map((line) => {
                let from = x3 < clip.x1 ? clip.x1 - x3 : 0, width = stringWidth(line), to = x3 + width > clip.x2 ? clip.x2 - x3 : width, sliced = sliceAnsi(line, from, to);
                if (stringWidth(sliced) > to - from)
                  sliced = sliceAnsi(line, from, to - 1);
                return sliced;
              }), x3 < clip.x1)
                x3 = clip.x1;
            }
            if (clipVertically) {
              let from = y2 < clip.y1 ? clip.y1 - y2 : 0, height = lines.length, to = y2 + height > clip.y2 ? clip.y2 - y2 : height;
              if (softWrap && from > 0 && softWrap[from] === !0)
                prevContentEnd = x3 + stringWidth(lines[from - 1]);
              if (lines = lines.slice(from, to), swFrom = from, y2 < clip.y1)
                y2 = clip.y1;
            }
          }
          let swBits = screen.softWrap, offsetY = 0;
          for (let line of lines) {
            let lineY = y2 + offsetY;
            if (lineY >= screenHeight)
              break;
            let contentEnd = writeLineToScreen(screen, line, x3, lineY, screenWidth, this.stylePool, this.charCache);
            if (writeCells += contentEnd - x3, softWrap) {
              let isSW = softWrap[swFrom + offsetY] === !0;
              swBits[lineY] = isSW ? prevContentEnd : 0, prevContentEnd = contentEnd;
            }
            offsetY++;
          }
          continue;
        }
      }
    for (let operation of this.operations)
      if (operation.type === "noSelect") {
        let { x: x3, y: y2, width, height } = operation.region;
        markNoSelectRegion(screen, x3, y2, width, height);
      }
    let totalCells = blitCells + writeCells;
    if (totalCells > 1000 && writeCells > blitCells)
      logForDebugging(`High write ratio: blit=${blitCells}, write=${writeCells} (${(writeCells / totalCells * 100).toFixed(1)}% writes), screen=${screenHeight}x${screenWidth}`);
    return screen;
  }
}
function stylesEqual2(a2, b) {
  if (a2 === b)
    return !0;
  let len = a2.length;
  if (len !== b.length)
    return !1;
  if (len === 0)
    return !0;
  for (let i4 = 0;i4 < len; i4++)
    if (a2[i4].code !== b[i4].code)
      return !1;
  return !0;
}
function styledCharsWithGraphemeClustering(chars, stylePool) {
  let charCount = chars.length;
  if (charCount === 0)
    return [];
  let result = [], bufferChars = [], bufferStyles = chars[0].styles;
  for (let i4 = 0;i4 < charCount; i4++) {
    let char = chars[i4], styles5 = char.styles;
    if (bufferChars.length > 0 && !stylesEqual2(styles5, bufferStyles))
      flushBuffer(bufferChars.join(""), bufferStyles, stylePool, result), bufferChars.length = 0;
    bufferChars.push(char.value), bufferStyles = styles5;
  }
  if (bufferChars.length > 0)
    flushBuffer(bufferChars.join(""), bufferStyles, stylePool, result);
  return result;
}
function flushBuffer(buffer, styles5, stylePool, out) {
  let hyperlink = extractHyperlinkFromStyles(styles5) ?? void 0, filteredStyles = hyperlink !== void 0 || styles5.some((s2) => s2.code.length >= OSC8_PREFIX.length && s2.code.startsWith(OSC8_PREFIX)) ? filterOutHyperlinkStyles(styles5) : styles5, styleId = stylePool.intern(filteredStyles);
  for (let { segment: grapheme } of getGraphemeSegmenter().segment(buffer))
    out.push({
      value: grapheme,
      width: stringWidth(grapheme),
      styleId,
      hyperlink
    });
}
function writeLineToScreen(screen, line, x3, y2, screenWidth, stylePool, charCache) {
  let characters = charCache.get(line);
  if (!characters)
    characters = reorderBidi(styledCharsWithGraphemeClustering(styledCharsFromTokens(tokenize3(line)), stylePool)), charCache.set(line, characters);
  let offsetX = x3;
  for (let charIdx = 0;charIdx < characters.length; charIdx++) {
    let character = characters[charIdx], codePoint = character.value.codePointAt(0);
    if (codePoint !== void 0 && codePoint <= 31) {
      if (codePoint === 9) {
        let spacesToNextStop = 8 - offsetX % 8;
        for (let i4 = 0;i4 < spacesToNextStop && offsetX < screenWidth; i4++)
          setCellAt(screen, offsetX, y2, {
            char: " ",
            styleId: stylePool.none,
            width: 0 /* Narrow */,
            hyperlink: void 0
          }), offsetX++;
      } else if (codePoint === 27) {
        let nextChar = characters[charIdx + 1]?.value, nextCode = nextChar?.codePointAt(0);
        if (nextChar === "(" || nextChar === ")" || nextChar === "*" || nextChar === "+")
          charIdx += 2;
        else if (nextChar === "[") {
          charIdx++;
          while (charIdx < characters.length - 1) {
            charIdx++;
            let c3 = characters[charIdx]?.value.codePointAt(0);
            if (c3 !== void 0 && c3 >= 64 && c3 <= 126)
              break;
          }
        } else if (nextChar === "]" || nextChar === "P" || nextChar === "_" || nextChar === "^" || nextChar === "X") {
          charIdx++;
          while (charIdx < characters.length - 1) {
            charIdx++;
            let c3 = characters[charIdx]?.value;
            if (c3 === "\x07")
              break;
            if (c3 === "\x1B") {
              if (characters[charIdx + 1]?.value === "\\") {
                charIdx++;
                break;
              }
            }
          }
        } else if (nextCode !== void 0 && nextCode >= 48 && nextCode <= 126)
          charIdx++;
      }
      continue;
    }
    let charWidth = character.width;
    if (charWidth === 0)
      continue;
    let isWideCharacter = charWidth >= 2;
    if (isWideCharacter && offsetX + 2 > screenWidth) {
      setCellAt(screen, offsetX, y2, {
        char: " ",
        styleId: stylePool.none,
        width: 3 /* SpacerHead */,
        hyperlink: void 0
      }), offsetX++;
      continue;
    }
    setCellAt(screen, offsetX, y2, {
      char: character.value,
      styleId: character.styleId,
      width: isWideCharacter ? 1 /* Wide */ : 0 /* Narrow */,
      hyperlink: character.hyperlink
    }), offsetX += isWideCharacter ? 2 : 1;
  }
  return offsetX;
}
var init_output2 = __esm(() => {
  init_build();
  init_debug();
  init_intl();
  init_sliceAnsi();
  init_bidi2();
  init_geometry();
  init_screen();
  init_stringWidth();
  init_widest_line();
});

// node_modules/indent-string/index.js
function indentString(string4, count3 = 1, options = {}) {
  let {
    indent = " ",
    includeEmptyLines = !1
  } = options;
  if (typeof string4 !== "string")
    throw TypeError(`Expected \`input\` to be a \`string\`, got \`${typeof string4}\``);
  if (typeof count3 !== "number")
    throw TypeError(`Expected \`count\` to be a \`number\`, got \`${typeof count3}\``);
  if (count3 < 0)
    throw RangeError(`Expected \`count\` to be at least 0, got \`${count3}\``);
  if (typeof indent !== "string")
    throw TypeError(`Expected \`options.indent\` to be a \`string\`, got \`${typeof indent}\``);
  if (count3 === 0)
    return string4;
  let regex2 = includeEmptyLines ? /^/gm : /^(?!\s*$)/gm;
  return string4.replace(regex2, indent.repeat(count3));
}
