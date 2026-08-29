// Original: src/utils/bufferedWriter.ts
function createBufferedWriter({
  writeFn,
  flushIntervalMs = 1000,
  maxBufferSize = 100,
  maxBufferBytes = 1 / 0,
  immediateMode = !1
}) {
  let buffer = [], bufferBytes = 0, flushTimer = null, pendingOverflow = null;
  function clearTimer() {
    if (flushTimer)
      clearTimeout(flushTimer), flushTimer = null;
  }
  function flush() {
    if (pendingOverflow)
      writeFn(pendingOverflow.join("")), pendingOverflow = null;
    if (buffer.length === 0)
      return;
    writeFn(buffer.join("")), buffer = [], bufferBytes = 0, clearTimer();
  }
  function scheduleFlush() {
    if (!flushTimer)
      flushTimer = setTimeout(flush, flushIntervalMs);
  }
  function flushDeferred() {
    if (pendingOverflow) {
      pendingOverflow.push(...buffer), buffer = [], bufferBytes = 0, clearTimer();
      return;
    }
    let detached = buffer;
    buffer = [], bufferBytes = 0, clearTimer(), pendingOverflow = detached, setImmediate(() => {
      let toWrite = pendingOverflow;
      if (pendingOverflow = null, toWrite)
        writeFn(toWrite.join(""));
    });
  }
  return {
    write(content) {
      if (immediateMode) {
        writeFn(content);
        return;
      }
      if (buffer.push(content), bufferBytes += content.length, scheduleFlush(), buffer.length >= maxBufferSize || bufferBytes >= maxBufferBytes)
        flushDeferred();
    },
    flush,
    dispose() {
      flush();
    }
  };
}
