// Original: src/vim/operators.ts
function executeOperatorMotion(op, motion, count4, ctx) {
  let target = resolveMotion(motion, ctx.cursor, count4);
  if (target.equals(ctx.cursor))
    return;
  let range = getOperatorRange(ctx.cursor, target, motion, op, count4);
  applyOperator(op, range.from, range.to, ctx, range.linewise), ctx.recordChange({ type: "operator", op, motion, count: count4 });
}
function executeOperatorFind(op, findType, char, count4, ctx) {
  let targetOffset = ctx.cursor.findCharacter(char, findType, count4);
  if (targetOffset === null)
    return;
  let target = new Cursor(ctx.cursor.measuredText, targetOffset), range = getOperatorRangeForFind(ctx.cursor, target, findType);
  applyOperator(op, range.from, range.to, ctx), ctx.setLastFind(findType, char), ctx.recordChange({ type: "operatorFind", op, find: findType, char, count: count4 });
}
function executeOperatorTextObj(op, scope, objType, count4, ctx) {
  let range = findTextObject(ctx.text, ctx.cursor.offset, objType, scope === "inner");
  if (!range)
    return;
  applyOperator(op, range.start, range.end, ctx), ctx.recordChange({ type: "operatorTextObj", op, objType, scope, count: count4 });
}
function executeLineOp(op, count4, ctx) {
  let text2 = ctx.text, lines2 = text2.split(`
`), currentLine = countCharInString(text2.slice(0, ctx.cursor.offset), `
`), linesToAffect = Math.min(count4, lines2.length - currentLine), lineStart = ctx.cursor.startOfLogicalLine().offset, lineEnd = lineStart;
  for (let i5 = 0;i5 < linesToAffect; i5++) {
    let nextNewline = text2.indexOf(`
`, lineEnd);
    lineEnd = nextNewline === -1 ? text2.length : nextNewline + 1;
  }
  let content = text2.slice(lineStart, lineEnd);
  if (!content.endsWith(`
`))
    content = content + `
`;
  if (ctx.setRegister(content, !0), op === "yank")
    ctx.setOffset(lineStart);
  else if (op === "delete") {
    let deleteStart = lineStart, deleteEnd = lineEnd;
    if (deleteEnd === text2.length && deleteStart > 0 && text2[deleteStart - 1] === `
`)
      deleteStart -= 1;
    let newText = text2.slice(0, deleteStart) + text2.slice(deleteEnd);
    ctx.setText(newText || "");
    let maxOff = Math.max(0, newText.length - (lastGrapheme(newText).length || 1));
    ctx.setOffset(Math.min(deleteStart, maxOff));
  } else if (op === "change")
    if (lines2.length === 1)
      ctx.setText(""), ctx.enterInsert(0);
    else {
      let beforeLines = lines2.slice(0, currentLine), afterLines = lines2.slice(currentLine + linesToAffect), newText = [...beforeLines, "", ...afterLines].join(`
`);
      ctx.setText(newText), ctx.enterInsert(lineStart);
    }
  ctx.recordChange({ type: "operator", op, motion: op[0], count: count4 });
}
function executeX(count4, ctx) {
  let from = ctx.cursor.offset;
  if (from >= ctx.text.length)
    return;
  let endCursor = ctx.cursor;
  for (let i5 = 0;i5 < count4 && !endCursor.isAtEnd(); i5++)
    endCursor = endCursor.right();
  let to = endCursor.offset, deleted = ctx.text.slice(from, to), newText = ctx.text.slice(0, from) + ctx.text.slice(to);
  ctx.setRegister(deleted, !1), ctx.setText(newText);
  let maxOff = Math.max(0, newText.length - (lastGrapheme(newText).length || 1));
  ctx.setOffset(Math.min(from, maxOff)), ctx.recordChange({ type: "x", count: count4 });
}
function executeReplace(char, count4, ctx) {
  let offset = ctx.cursor.offset, newText = ctx.text;
  for (let i5 = 0;i5 < count4 && offset < newText.length; i5++) {
    let graphemeLen = firstGrapheme(newText.slice(offset)).length || 1;
    newText = newText.slice(0, offset) + char + newText.slice(offset + graphemeLen), offset += char.length;
  }
  ctx.setText(newText), ctx.setOffset(Math.max(0, offset - char.length)), ctx.recordChange({ type: "replace", char, count: count4 });
}
function executeToggleCase(count4, ctx) {
  let startOffset = ctx.cursor.offset;
  if (startOffset >= ctx.text.length)
    return;
  let newText = ctx.text, offset = startOffset, toggled = 0;
  while (offset < newText.length && toggled < count4) {
    let grapheme = firstGrapheme(newText.slice(offset)), graphemeLen = grapheme.length, toggledGrapheme = grapheme === grapheme.toUpperCase() ? grapheme.toLowerCase() : grapheme.toUpperCase();
    newText = newText.slice(0, offset) + toggledGrapheme + newText.slice(offset + graphemeLen), offset += toggledGrapheme.length, toggled++;
  }
  ctx.setText(newText), ctx.setOffset(offset), ctx.recordChange({ type: "toggleCase", count: count4 });
}
function executeJoin(count4, ctx) {
  let lines2 = ctx.text.split(`
`), { line: currentLine } = ctx.cursor.getPosition();
  if (currentLine >= lines2.length - 1)
    return;
  let linesToJoin = Math.min(count4, lines2.length - currentLine - 1), joinedLine = lines2[currentLine], cursorPos = joinedLine.length;
  for (let i5 = 1;i5 <= linesToJoin; i5++) {
    let nextLine = (lines2[currentLine + i5] ?? "").trimStart();
    if (nextLine.length > 0) {
      if (!joinedLine.endsWith(" ") && joinedLine.length > 0)
        joinedLine += " ";
      joinedLine += nextLine;
    }
  }
  let newLines = [
    ...lines2.slice(0, currentLine),
    joinedLine,
    ...lines2.slice(currentLine + linesToJoin + 1)
  ], newText = newLines.join(`
`);
  ctx.setText(newText), ctx.setOffset(getLineStartOffset(newLines, currentLine) + cursorPos), ctx.recordChange({ type: "join", count: count4 });
}
function executePaste(after2, count4, ctx) {
  let register2 = ctx.getRegister();
  if (!register2)
    return;
  let isLinewise = register2.endsWith(`
`), content = isLinewise ? register2.slice(0, -1) : register2;
  if (isLinewise) {
    let lines2 = ctx.text.split(`
`), { line: currentLine } = ctx.cursor.getPosition(), insertLine = after2 ? currentLine + 1 : currentLine, contentLines = content.split(`
`), repeatedLines = [];
    for (let i5 = 0;i5 < count4; i5++)
      repeatedLines.push(...contentLines);
    let newLines = [
      ...lines2.slice(0, insertLine),
      ...repeatedLines,
      ...lines2.slice(insertLine)
    ], newText = newLines.join(`
`);
    ctx.setText(newText), ctx.setOffset(getLineStartOffset(newLines, insertLine));
  } else {
    let textToInsert = content.repeat(count4), insertPoint = after2 && ctx.cursor.offset < ctx.text.length ? ctx.cursor.measuredText.nextOffset(ctx.cursor.offset) : ctx.cursor.offset, newText = ctx.text.slice(0, insertPoint) + textToInsert + ctx.text.slice(insertPoint), lastGr = lastGrapheme(textToInsert), newOffset = insertPoint + textToInsert.length - (lastGr.length || 1);
    ctx.setText(newText), ctx.setOffset(Math.max(insertPoint, newOffset));
  }
}
function executeIndent(dir, count4, ctx) {
  let lines2 = ctx.text.split(`
`), { line: currentLine } = ctx.cursor.getPosition(), linesToAffect = Math.min(count4, lines2.length - currentLine), indent = "  ";
  for (let i5 = 0;i5 < linesToAffect; i5++) {
    let lineIdx = currentLine + i5, line = lines2[lineIdx] ?? "";
    if (dir === ">")
      lines2[lineIdx] = "  " + line;
    else if (line.startsWith("  "))
      lines2[lineIdx] = line.slice(2);
    else if (line.startsWith("\t"))
      lines2[lineIdx] = line.slice(1);
    else {
      let removed = 0, idx = 0;
      while (idx < line.length && removed < 2 && /\s/.test(line[idx]))
        removed++, idx++;
      lines2[lineIdx] = line.slice(idx);
    }
  }
  let newText = lines2.join(`
`), firstNonBlank = ((lines2[currentLine] ?? "").match(/^\s*/)?.[0] ?? "").length;
  ctx.setText(newText), ctx.setOffset(getLineStartOffset(lines2, currentLine) + firstNonBlank), ctx.recordChange({ type: "indent", dir, count: count4 });
}
function executeOpenLine(direction, ctx) {
  let lines2 = ctx.text.split(`
`), { line: currentLine } = ctx.cursor.getPosition(), insertLine = direction === "below" ? currentLine + 1 : currentLine, newLines = [
    ...lines2.slice(0, insertLine),
    "",
    ...lines2.slice(insertLine)
  ], newText = newLines.join(`
`);
  ctx.setText(newText), ctx.enterInsert(getLineStartOffset(newLines, insertLine)), ctx.recordChange({ type: "openLine", direction });
}
function getLineStartOffset(lines2, lineIndex) {
  return lines2.slice(0, lineIndex).join(`
`).length + (lineIndex > 0 ? 1 : 0);
}
function getOperatorRange(cursor, target, motion, op, count4) {
  let from = Math.min(cursor.offset, target.offset), to = Math.max(cursor.offset, target.offset), linewise = !1;
  if (op === "change" && (motion === "w" || motion === "W")) {
    let wordCursor = cursor;
    for (let i5 = 0;i5 < count4 - 1; i5++)
      wordCursor = motion === "w" ? wordCursor.nextVimWord() : wordCursor.nextWORD();
    let wordEnd = motion === "w" ? wordCursor.endOfVimWord() : wordCursor.endOfWORD();
    to = cursor.measuredText.nextOffset(wordEnd.offset);
  } else if (isLinewiseMotion(motion)) {
    linewise = !0;
    let text2 = cursor.text, nextNewline = text2.indexOf(`
`, to);
    if (nextNewline === -1) {
      if (to = text2.length, from > 0 && text2[from - 1] === `
`)
        from -= 1;
    } else
      to = nextNewline + 1;
  } else if (isInclusiveMotion(motion) && cursor.offset <= target.offset)
    to = cursor.measuredText.nextOffset(to);
  return from = cursor.snapOutOfImageRef(from, "start"), to = cursor.snapOutOfImageRef(to, "end"), { from, to, linewise };
}
function getOperatorRangeForFind(cursor, target, _findType) {
  let from = Math.min(cursor.offset, target.offset), maxOffset = Math.max(cursor.offset, target.offset), to = cursor.measuredText.nextOffset(maxOffset);
  return { from, to };
}
function applyOperator(op, from, to, ctx, linewise = !1) {
  let content = ctx.text.slice(from, to);
  if (linewise && !content.endsWith(`
`))
    content = content + `
`;
  if (ctx.setRegister(content, linewise), op === "yank")
    ctx.setOffset(from);
  else if (op === "delete") {
    let newText = ctx.text.slice(0, from) + ctx.text.slice(to);
    ctx.setText(newText);
    let maxOff = Math.max(0, newText.length - (lastGrapheme(newText).length || 1));
    ctx.setOffset(Math.min(from, maxOff));
  } else if (op === "change") {
    let newText = ctx.text.slice(0, from) + ctx.text.slice(to);
    ctx.setText(newText), ctx.enterInsert(from);
  }
}
function executeOperatorG(op, count4, ctx) {
  let target = count4 === 1 ? ctx.cursor.startOfLastLine() : ctx.cursor.goToLine(count4);
  if (target.equals(ctx.cursor))
    return;
  let range = getOperatorRange(ctx.cursor, target, "G", op, count4);
  applyOperator(op, range.from, range.to, ctx, range.linewise), ctx.recordChange({ type: "operator", op, motion: "G", count: count4 });
}
function executeOperatorGg(op, count4, ctx) {
  let target = count4 === 1 ? ctx.cursor.startOfFirstLine() : ctx.cursor.goToLine(count4);
  if (target.equals(ctx.cursor))
    return;
  let range = getOperatorRange(ctx.cursor, target, "gg", op, count4);
  applyOperator(op, range.from, range.to, ctx, range.linewise), ctx.recordChange({ type: "operator", op, motion: "gg", count: count4 });
}
var init_operators = __esm(() => {
  init_Cursor();
  init_intl();
  init_textObjects();
});
