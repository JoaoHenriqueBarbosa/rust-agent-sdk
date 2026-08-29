// Original: src/utils/earlyInput.ts
var exports_earlyInput = {};
__export(exports_earlyInput, {
  stopCapturingEarlyInput: () => stopCapturingEarlyInput,
  startCapturingEarlyInput: () => startCapturingEarlyInput,
  seedEarlyInput: () => seedEarlyInput,
  isCapturingEarlyInput: () => isCapturingEarlyInput,
  hasEarlyInput: () => hasEarlyInput,
  consumeEarlyInput: () => consumeEarlyInput
});
function startCapturingEarlyInput() {
  if (!process.stdin.isTTY || isCapturing || process.argv.includes("-p") || process.argv.includes("--print"))
    return;
  isCapturing = !0, earlyInputBuffer = "";
  try {
    process.stdin.setEncoding("utf8"), process.stdin.setRawMode(!0), process.stdin.ref(), readableHandler = () => {
      let chunk = process.stdin.read();
      while (chunk !== null) {
        if (typeof chunk === "string")
          processChunk(chunk);
        chunk = process.stdin.read();
      }
    }, process.stdin.on("readable", readableHandler);
  } catch {
    isCapturing = !1;
  }
}
function processChunk(str) {
  let i4 = 0;
  while (i4 < str.length) {
    let char = str[i4], code = char.charCodeAt(0);
    if (code === 3) {
      stopCapturingEarlyInput(), process.exit(130);
      return;
    }
    if (code === 4) {
      stopCapturingEarlyInput();
      return;
    }
    if (code === 127 || code === 8) {
      if (earlyInputBuffer.length > 0) {
        let last = lastGrapheme(earlyInputBuffer);
        earlyInputBuffer = earlyInputBuffer.slice(0, -(last.length || 1));
      }
      i4++;
      continue;
    }
    if (code === 27) {
      i4++;
      while (i4 < str.length && !(str.charCodeAt(i4) >= 64 && str.charCodeAt(i4) <= 126))
        i4++;
      if (i4 < str.length)
        i4++;
      continue;
    }
    if (code < 32 && code !== 9 && code !== 10 && code !== 13) {
      i4++;
      continue;
    }
    if (code === 13) {
      earlyInputBuffer += `
`, i4++;
      continue;
    }
    earlyInputBuffer += char, i4++;
  }
}
function stopCapturingEarlyInput() {
  if (!isCapturing)
    return;
  if (isCapturing = !1, readableHandler)
    process.stdin.removeListener("readable", readableHandler), readableHandler = null;
}
function consumeEarlyInput() {
  stopCapturingEarlyInput();
  let input = earlyInputBuffer.trim();
  return earlyInputBuffer = "", input;
}
function hasEarlyInput() {
  return earlyInputBuffer.trim().length > 0;
}
function seedEarlyInput(text) {
  earlyInputBuffer = text;
}
function isCapturingEarlyInput() {
  return isCapturing;
}
var earlyInputBuffer = "", isCapturing = !1, readableHandler = null;
var init_earlyInput = __esm(() => {
  init_intl();
});
