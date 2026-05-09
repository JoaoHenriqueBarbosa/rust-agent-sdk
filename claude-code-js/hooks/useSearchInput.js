// Original: src/hooks/useSearchInput.ts
function isKillKey(e) {
  if (e.ctrl && (e.key === "k" || e.key === "u" || e.key === "w"))
    return !0;
  if (e.meta && e.key === "backspace")
    return !0;
  return !1;
}
function isYankKey(e) {
  return (e.ctrl || e.meta) && e.key === "y";
}
function useSearchInput({
  isActive,
  onExit: onExit2,
  onCancel,
  onExitUp,
  columns,
  passthroughCtrlKeys = [],
  initialQuery = "",
  backspaceExitsOnEmpty = !0
}) {
  let { columns: terminalColumns } = useTerminalSize(), effectiveColumns = columns ?? terminalColumns, [query3, setQueryState] = import_react103.useState(initialQuery), [cursorOffset, setCursorOffset] = import_react103.useState(initialQuery.length), setQuery = import_react103.useCallback((q4) => {
    setQueryState(q4), setCursorOffset(q4.length);
  }, []), handleKeyDown = (e) => {
    if (!isActive)
      return;
    let cursor = Cursor.fromText(query3, effectiveColumns, cursorOffset);
    if (e.ctrl && passthroughCtrlKeys.includes(e.key.toLowerCase()))
      return;
    if (!isKillKey(e))
      resetKillAccumulation();
    if (!isYankKey(e))
      resetYankState();
    if (e.key === "return" || e.key === "down") {
      e.preventDefault(), onExit2();
      return;
    }
    if (e.key === "up") {
      if (e.preventDefault(), onExitUp)
        onExitUp();
      return;
    }
    if (e.key === "escape") {
      if (e.preventDefault(), onCancel)
        onCancel();
      else if (query3.length > 0)
        setQueryState(""), setCursorOffset(0);
      else
        onExit2();
      return;
    }
    if (e.key === "backspace") {
      if (e.preventDefault(), e.meta) {
        let { cursor: newCursor2, killed } = cursor.deleteWordBefore();
        pushToKillRing(killed, "prepend"), setQueryState(newCursor2.text), setCursorOffset(newCursor2.offset);
        return;
      }
      if (query3.length === 0) {
        if (backspaceExitsOnEmpty)
          (onCancel ?? onExit2)();
        return;
      }
      let newCursor = cursor.backspace();
      setQueryState(newCursor.text), setCursorOffset(newCursor.offset);
      return;
    }
    if (e.key === "delete") {
      e.preventDefault();
      let newCursor = cursor.del();
      setQueryState(newCursor.text), setCursorOffset(newCursor.offset);
      return;
    }
    if (e.key === "left" && (e.ctrl || e.meta || e.fn)) {
      e.preventDefault();
      let newCursor = cursor.prevWord();
      setCursorOffset(newCursor.offset);
      return;
    }
    if (e.key === "right" && (e.ctrl || e.meta || e.fn)) {
      e.preventDefault();
      let newCursor = cursor.nextWord();
      setCursorOffset(newCursor.offset);
      return;
    }
    if (e.key === "left") {
      e.preventDefault();
      let newCursor = cursor.left();
      setCursorOffset(newCursor.offset);
      return;
    }
    if (e.key === "right") {
      e.preventDefault();
      let newCursor = cursor.right();
      setCursorOffset(newCursor.offset);
      return;
    }
    if (e.key === "home") {
      e.preventDefault(), setCursorOffset(0);
      return;
    }
    if (e.key === "end") {
      e.preventDefault(), setCursorOffset(query3.length);
      return;
    }
    if (e.ctrl) {
      switch (e.preventDefault(), e.key.toLowerCase()) {
        case "a":
          setCursorOffset(0);
          return;
        case "e":
          setCursorOffset(query3.length);
          return;
        case "b":
          setCursorOffset(cursor.left().offset);
          return;
        case "f":
          setCursorOffset(cursor.right().offset);
          return;
        case "d": {
          if (query3.length === 0) {
            (onCancel ?? onExit2)();
            return;
          }
          let newCursor = cursor.del();
          setQueryState(newCursor.text), setCursorOffset(newCursor.offset);
          return;
        }
        case "h": {
          if (query3.length === 0) {
            if (backspaceExitsOnEmpty)
              (onCancel ?? onExit2)();
            return;
          }
          let newCursor = cursor.backspace();
          setQueryState(newCursor.text), setCursorOffset(newCursor.offset);
          return;
        }
        case "k": {
          let { cursor: newCursor, killed } = cursor.deleteToLineEnd();
          pushToKillRing(killed, "append"), setQueryState(newCursor.text), setCursorOffset(newCursor.offset);
          return;
        }
        case "u": {
          let { cursor: newCursor, killed } = cursor.deleteToLineStart();
          pushToKillRing(killed, "prepend"), setQueryState(newCursor.text), setCursorOffset(newCursor.offset);
          return;
        }
        case "w": {
          let { cursor: newCursor, killed } = cursor.deleteWordBefore();
          pushToKillRing(killed, "prepend"), setQueryState(newCursor.text), setCursorOffset(newCursor.offset);
          return;
        }
        case "y": {
          let text2 = getLastKill();
          if (text2.length > 0) {
            let startOffset = cursor.offset, newCursor = cursor.insert(text2);
            recordYank(startOffset, text2.length), setQueryState(newCursor.text), setCursorOffset(newCursor.offset);
          }
          return;
        }
        case "g":
        case "c":
          if (onCancel) {
            onCancel();
            return;
          }
      }
      return;
    }
    if (e.meta) {
      switch (e.preventDefault(), e.key.toLowerCase()) {
        case "b":
          setCursorOffset(cursor.prevWord().offset);
          return;
        case "f":
          setCursorOffset(cursor.nextWord().offset);
          return;
        case "d": {
          let newCursor = cursor.deleteWordAfter();
          setQueryState(newCursor.text), setCursorOffset(newCursor.offset);
          return;
        }
        case "y": {
          let popResult = yankPop();
          if (popResult) {
            let { text: text2, start, length } = popResult, before2 = query3.slice(0, start), after2 = query3.slice(start + length), newText = before2 + text2 + after2, newOffset = start + text2.length;
            updateYankLength(text2.length), setQueryState(newText), setCursorOffset(newOffset);
          }
          return;
        }
      }
      return;
    }
    if (e.key === "tab")
      return;
    if (e.key.length >= 1 && !UNHANDLED_SPECIAL_KEYS.has(e.key)) {
      e.preventDefault();
      let newCursor = cursor.insert(e.key);
      setQueryState(newCursor.text), setCursorOffset(newCursor.offset);
    }
  };
  return use_input_default((_input, _key, event) => {
    handleKeyDown(new KeyboardEvent(event.keypress));
  }, { isActive }), { query: query3, setQuery, cursorOffset, handleKeyDown };
}
var import_react103, UNHANDLED_SPECIAL_KEYS;
var init_useSearchInput = __esm(() => {
  init_keyboard_event();
  init_ink2();
  init_Cursor();
  init_useTerminalSize();
  import_react103 = __toESM(require_react_development(), 1);
  UNHANDLED_SPECIAL_KEYS = /* @__PURE__ */ new Set([
    "pageup",
    "pagedown",
    "insert",
    "wheelup",
    "wheeldown",
    "mouse",
    "f1",
    "f2",
    "f3",
    "f4",
    "f5",
    "f6",
    "f7",
    "f8",
    "f9",
    "f10",
    "f11",
    "f12"
  ]);
});
