// Original: src/utils/streamJsonStdoutGuard.ts
function isJsonLine(line) {
  if (line.length === 0)
    return !0;
  try {
    return JSON.parse(line), !0;
  } catch {
    return !1;
  }
}
function installStreamJsonStdoutGuard() {
  if (installed)
    return;
  installed = !0, originalWrite = process.stdout.write.bind(process.stdout), process.stdout.write = function(chunk2, encodingOrCb, cb) {
    let text2 = typeof chunk2 === "string" ? chunk2 : Buffer.from(chunk2).toString("utf-8");
    buffer += text2;
    let newlineIdx, wrote = !0;
    while ((newlineIdx = buffer.indexOf(`
`)) !== -1) {
      let line = buffer.slice(0, newlineIdx);
      if (buffer = buffer.slice(newlineIdx + 1), isJsonLine(line))
        wrote = originalWrite(line + `
`);
      else
        process.stderr.write(`${STDOUT_GUARD_MARKER} ${line}
`), logForDebugging(`streamJsonStdoutGuard diverted non-JSON stdout line: ${line.slice(0, 200)}`);
    }
    let callback = typeof encodingOrCb === "function" ? encodingOrCb : cb;
    if (callback)
      queueMicrotask(() => callback());
    return wrote;
  }, registerCleanup(async () => {
    if (buffer.length > 0) {
      if (originalWrite && isJsonLine(buffer))
        originalWrite(buffer + `
`);
      else
        process.stderr.write(`${STDOUT_GUARD_MARKER} ${buffer}
`);
      buffer = "";
    }
    if (originalWrite)
      process.stdout.write = originalWrite, originalWrite = null;
    installed = !1;
  });
}
var STDOUT_GUARD_MARKER = "[stdout-guard]", installed = !1, buffer = "", originalWrite = null;
var init_streamJsonStdoutGuard = __esm(() => {
  init_cleanupRegistry();
  init_debug();
});
