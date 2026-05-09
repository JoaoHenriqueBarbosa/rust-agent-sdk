// Original: src/hooks/useTextInput.ts
function mapInput(input_map) {
  let map8 = new Map(input_map);
  return function(input) {
    return (map8.get(input) ?? NOOP_HANDLER)(input);
  };
}
function useTextInput({
  value: originalValue,
  onChange,
  onSubmit,
  onExit: onExit2,
  onExitMessage,
  onHistoryUp,
  onHistoryDown,
  onHistoryReset,
  onClearInput,
  mask = "",
  multiline = !1,
  cursorChar,
  invert,
  columns,
  onImagePaste: _onImagePaste,
  disableCursorMovementForUpDownKeys = !1,
  disableEscapeDoublePress = !1,
  maxVisibleLines,
  externalOffset,
  onOffsetChange,
  inputFilter,
  inlineGhostText,
  dim: dim2
}) {
  if (env3.terminal === "Apple_Terminal")
    prewarmModifiers();
  let offset = externalOffset, setOffset = onOffsetChange, cursor = Cursor.fromText(originalValue, columns, offset), { addNotification, removeNotification } = useNotifications(), handleCtrlC = useDoublePress((show) => {
    onExitMessage?.(show, "Ctrl-C");
  }, () => onExit2?.(), () => {
    if (originalValue)
      onChange(""), setOffset(0), onHistoryReset?.();
  }), handleEscape = useDoublePress((show) => {
    if (!originalValue || !show)
      return;
    addNotification({
      key: "escape-again-to-clear",
      text: "Esc again to clear",
      priority: "immediate",
      timeoutMs: 1000
    });
  }, () => {
    if (removeNotification("escape-again-to-clear"), onClearInput?.(), originalValue) {
      if (originalValue.trim() !== "")
        addToHistory(originalValue);
      onChange(""), setOffset(0), onHistoryReset?.();
    }
  }), handleEmptyCtrlD = useDoublePress((show) => {
    if (originalValue !== "")
      return;
    onExitMessage?.(show, "Ctrl-D");
  }, () => {
    if (originalValue !== "")
      return;
    onExit2?.();
  });
  function handleCtrlD() {
    if (cursor.text === "")
      return handleEmptyCtrlD(), cursor;
    return cursor.del();
  }
  function killToLineEnd() {
    let { cursor: newCursor, killed } = cursor.deleteToLineEnd();
    return pushToKillRing(killed, "append"), newCursor;
  }
  function killToLineStart() {
    let { cursor: newCursor, killed } = cursor.deleteToLineStart();
    return pushToKillRing(killed, "prepend"), newCursor;
  }
  function killWordBefore() {
    let { cursor: newCursor, killed } = cursor.deleteWordBefore();
    return pushToKillRing(killed, "prepend"), newCursor;
  }
  function yank() {
    let text2 = getLastKill();
    if (text2.length > 0) {
      let startOffset = cursor.offset, newCursor = cursor.insert(text2);
      return recordYank(startOffset, text2.length), newCursor;
    }
    return cursor;
  }
  function handleYankPop() {
    let popResult = yankPop();
    if (!popResult)
      return cursor;
    let { text: text2, start, length } = popResult, before2 = cursor.text.slice(0, start), after2 = cursor.text.slice(start + length), newText = before2 + text2 + after2, newOffset = start + text2.length;
    return updateYankLength(text2.length), Cursor.fromText(newText, columns, newOffset);
  }
  let handleCtrl = mapInput([
    ["a", () => cursor.startOfLine()],
    ["b", () => cursor.left()],
    ["c", handleCtrlC],
    ["d", handleCtrlD],
    ["e", () => cursor.endOfLine()],
    ["f", () => cursor.right()],
    ["h", () => cursor.deleteTokenBefore() ?? cursor.backspace()],
    ["k", killToLineEnd],
    ["n", () => downOrHistoryDown()],
    ["p", () => upOrHistoryUp()],
    ["u", killToLineStart],
    ["w", killWordBefore],
    ["y", yank]
  ]), handleMeta = mapInput([
    ["b", () => cursor.prevWord()],
    ["f", () => cursor.nextWord()],
    ["d", () => cursor.deleteWordAfter()],
    ["y", handleYankPop]
  ]);
  function handleEnter(key3) {
    if (multiline && cursor.offset > 0 && cursor.text[cursor.offset - 1] === "\\")
      return markBackslashReturnUsed(), cursor.backspace().insert(`
`);
    if (key3.meta || key3.shift)
      return cursor.insert(`
`);
    if (env3.terminal === "Apple_Terminal" && isModifierPressed("shift"))
      return cursor.insert(`
`);
    onSubmit?.(originalValue);
  }
  function upOrHistoryUp() {
    if (disableCursorMovementForUpDownKeys)
      return onHistoryUp?.(), cursor;
    let cursorUp2 = cursor.up();
    if (!cursorUp2.equals(cursor))
      return cursorUp2;
    if (multiline) {
      let cursorUpLogical = cursor.upLogicalLine();
      if (!cursorUpLogical.equals(cursor))
        return cursorUpLogical;
    }
    return onHistoryUp?.(), cursor;
  }
  function downOrHistoryDown() {
    if (disableCursorMovementForUpDownKeys)
      return onHistoryDown?.(), cursor;
    let cursorDown3 = cursor.down();
    if (!cursorDown3.equals(cursor))
      return cursorDown3;
    if (multiline) {
      let cursorDownLogical = cursor.downLogicalLine();
      if (!cursorDownLogical.equals(cursor))
        return cursorDownLogical;
    }
    return onHistoryDown?.(), cursor;
  }
  function mapKey(key3) {
    switch (!0) {
      case key3.escape:
        return () => {
          if (disableEscapeDoublePress)
            return cursor;
          return handleEscape(), cursor;
        };
      case (key3.leftArrow && (key3.ctrl || key3.meta || key3.fn)):
        return () => cursor.prevWord();
      case (key3.rightArrow && (key3.ctrl || key3.meta || key3.fn)):
        return () => cursor.nextWord();
      case key3.backspace:
        return key3.meta || key3.ctrl ? killWordBefore : () => cursor.deleteTokenBefore() ?? cursor.backspace();
      case key3.delete:
        return key3.meta ? killToLineEnd : () => cursor.del();
      case key3.ctrl:
        return handleCtrl;
      case key3.home:
        return () => cursor.startOfLine();
      case key3.end:
        return () => cursor.endOfLine();
      case key3.pageDown:
        if (isFullscreenEnvEnabled())
          return NOOP_HANDLER;
        return () => cursor.endOfLine();
      case key3.pageUp:
        if (isFullscreenEnvEnabled())
          return NOOP_HANDLER;
        return () => cursor.startOfLine();
      case key3.wheelUp:
      case key3.wheelDown:
        return NOOP_HANDLER;
      case key3.return:
        return () => handleEnter(key3);
      case key3.meta:
        return handleMeta;
      case key3.tab:
        return () => cursor;
      case (key3.upArrow && !key3.shift):
        return upOrHistoryUp;
      case (key3.downArrow && !key3.shift):
        return downOrHistoryDown;
      case key3.leftArrow:
        return () => cursor.left();
      case key3.rightArrow:
        return () => cursor.right();
      default:
        return function(input) {
          switch (!0) {
            case (input === "\x1B[H" || input === "\x1B[1~"):
              return cursor.startOfLine();
            case (input === "\x1B[F" || input === "\x1B[4~"):
              return cursor.endOfLine();
            default: {
              let text2 = stripAnsi(input).replace(/(?<=[^\\\r\n])\r$/, "").replace(/\r/g, `
`);
              if (cursor.isAtStart() && isInputModeCharacter(input))
                return cursor.insert(text2).left();
              return cursor.insert(text2);
            }
          }
        };
    }
  }
  function isKillKey(key3, input) {
    if (key3.ctrl && (input === "k" || input === "u" || input === "w"))
      return !0;
    if (key3.meta && (key3.backspace || key3.delete))
      return !0;
    return !1;
  }
  function isYankKey(key3, input) {
    return (key3.ctrl || key3.meta) && input === "y";
  }
  function onInput(input, key3) {
    let filteredInput = inputFilter ? inputFilter(input, key3) : input;
    if (filteredInput === "" && input !== "")
      return;
    if (!key3.backspace && !key3.delete && input.includes("\x7F")) {
      let delCount = (input.match(/\x7f/g) || []).length, currentCursor = cursor;
      for (let i5 = 0;i5 < delCount; i5++)
        currentCursor = currentCursor.deleteTokenBefore() ?? currentCursor.backspace();
      if (!cursor.equals(currentCursor)) {
        if (cursor.text !== currentCursor.text)
          onChange(currentCursor.text);
        setOffset(currentCursor.offset);
      }
      resetKillAccumulation(), resetYankState();
      return;
    }
    if (!isKillKey(key3, filteredInput))
      resetKillAccumulation();
    if (!isYankKey(key3, filteredInput))
      resetYankState();
    let nextCursor = mapKey(key3)(filteredInput);
    if (nextCursor) {
      if (!cursor.equals(nextCursor)) {
        if (cursor.text !== nextCursor.text)
          onChange(nextCursor.text);
        setOffset(nextCursor.offset);
      }
      if (filteredInput.length > 1 && filteredInput.endsWith("\r") && !filteredInput.slice(0, -1).includes("\r") && filteredInput[filteredInput.length - 2] !== "\\")
        onSubmit?.(nextCursor.text);
    }
  }
  let ghostTextForRender = inlineGhostText && dim2 && inlineGhostText.insertPosition === offset ? { text: inlineGhostText.text, dim: dim2 } : void 0, cursorPos = cursor.getPosition();
  return {
    onInput,
    renderedValue: cursor.render(cursorChar, mask, invert, ghostTextForRender, maxVisibleLines),
    offset,
    setOffset,
    cursorLine: cursorPos.line - cursor.getViewportStartLine(maxVisibleLines),
    cursorColumn: cursorPos.column,
    viewportCharOffset: cursor.getViewportCharOffset(maxVisibleLines),
    viewportCharEnd: cursor.getViewportCharEnd(maxVisibleLines)
  };
}
var NOOP_HANDLER = () => {};
var init_useTextInput = __esm(() => {
  init_notifications();
  init_strip_ansi();
  init_terminalSetup();
  init_history();
  init_Cursor();
  init_env();
  init_fullscreen();
  init_useDoublePress();
});
