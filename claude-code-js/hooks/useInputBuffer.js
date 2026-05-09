// Original: src/hooks/useInputBuffer.ts
function useInputBuffer({
  maxBufferSize,
  debounceMs
}) {
  let [buffer, setBuffer] = import_react236.useState([]), [currentIndex, setCurrentIndex] = import_react236.useState(-1), lastPushTime = import_react236.useRef(0), pendingPush = import_react236.useRef(null), pushToBuffer = import_react236.useCallback((text2, cursorOffset, pastedContents = {}) => {
    let now2 = Date.now();
    if (pendingPush.current)
      clearTimeout(pendingPush.current), pendingPush.current = null;
    if (now2 - lastPushTime.current < debounceMs) {
      pendingPush.current = setTimeout(pushToBuffer, debounceMs, text2, cursorOffset, pastedContents);
      return;
    }
    lastPushTime.current = now2, setBuffer((prevBuffer) => {
      let newBuffer = currentIndex >= 0 ? prevBuffer.slice(0, currentIndex + 1) : prevBuffer, lastEntry = newBuffer[newBuffer.length - 1];
      if (lastEntry && lastEntry.text === text2)
        return newBuffer;
      let updatedBuffer = [
        ...newBuffer,
        { text: text2, cursorOffset, pastedContents, timestamp: now2 }
      ];
      if (updatedBuffer.length > maxBufferSize)
        return updatedBuffer.slice(-maxBufferSize);
      return updatedBuffer;
    }), setCurrentIndex((prev) => {
      let newIndex = prev >= 0 ? prev + 1 : buffer.length;
      return Math.min(newIndex, maxBufferSize - 1);
    });
  }, [debounceMs, maxBufferSize, currentIndex, buffer.length]), undo = import_react236.useCallback(() => {
    if (currentIndex < 0 || buffer.length === 0)
      return;
    let targetIndex = Math.max(0, currentIndex - 1), entry = buffer[targetIndex];
    if (entry)
      return setCurrentIndex(targetIndex), entry;
    return;
  }, [buffer, currentIndex]), clearBuffer = import_react236.useCallback(() => {
    if (setBuffer([]), setCurrentIndex(-1), lastPushTime.current = 0, pendingPush.current)
      clearTimeout(pendingPush.current), pendingPush.current = null;
  }, [lastPushTime, pendingPush]), canUndo = currentIndex > 0 && buffer.length > 1;
  return {
    pushToBuffer,
    undo,
    canUndo,
    clearBuffer
  };
}
var import_react236;
var init_useInputBuffer = __esm(() => {
  import_react236 = __toESM(require_react_development(), 1);
});
