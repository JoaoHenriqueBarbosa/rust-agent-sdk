// Original: src/utils/readFileInRange.ts
import { createReadStream as createReadStream2, fstat } from "fs";
import { stat as fsStat3, readFile as readFile28 } from "fs/promises";
async function readFileInRange(filePath, offset = 0, maxLines, maxBytes, signal, options2) {
  signal?.throwIfAborted();
  let truncateOnByteLimit = options2?.truncateOnByteLimit ?? !1, stats = await fsStat3(filePath);
  if (stats.isDirectory())
    throw Error(`EISDIR: illegal operation on a directory, read '${filePath}'`);
  if (stats.isFile() && stats.size < FAST_PATH_MAX_SIZE) {
    if (!truncateOnByteLimit && maxBytes !== void 0 && stats.size > maxBytes)
      throw new FileTooLargeError(stats.size, maxBytes);
    let text2 = await readFile28(filePath, { encoding: "utf8", signal });
    return readFileInRangeFast(text2, stats.mtimeMs, offset, maxLines, truncateOnByteLimit ? maxBytes : void 0);
  }
  return readFileInRangeStreaming(filePath, offset, maxLines, maxBytes, truncateOnByteLimit, signal);
}
function readFileInRangeFast(raw, mtimeMs, offset, maxLines, truncateAtBytes) {
  let endLine = maxLines !== void 0 ? offset + maxLines : 1 / 0, text2 = raw.charCodeAt(0) === 65279 ? raw.slice(1) : raw, selectedLines = [], lineIndex = 0, startPos = 0, newlinePos, selectedBytes = 0, truncatedByBytes = !1;
  function tryPush(line) {
    if (truncateAtBytes !== void 0) {
      let sep20 = selectedLines.length > 0 ? 1 : 0, nextBytes = selectedBytes + sep20 + Buffer.byteLength(line);
      if (nextBytes > truncateAtBytes)
        return truncatedByBytes = !0, !1;
      selectedBytes = nextBytes;
    }
    return selectedLines.push(line), !0;
  }
  while ((newlinePos = text2.indexOf(`
`, startPos)) !== -1) {
    if (lineIndex >= offset && lineIndex < endLine && !truncatedByBytes) {
      let line = text2.slice(startPos, newlinePos);
      if (line.endsWith("\r"))
        line = line.slice(0, -1);
      tryPush(line);
    }
    lineIndex++, startPos = newlinePos + 1;
  }
  if (lineIndex >= offset && lineIndex < endLine && !truncatedByBytes) {
    let line = text2.slice(startPos);
    if (line.endsWith("\r"))
      line = line.slice(0, -1);
    tryPush(line);
  }
  lineIndex++;
  let content = selectedLines.join(`
`);
  return {
    content,
    lineCount: selectedLines.length,
    totalLines: lineIndex,
    totalBytes: Buffer.byteLength(text2, "utf8"),
    readBytes: Buffer.byteLength(content, "utf8"),
    mtimeMs,
    ...truncatedByBytes ? { truncatedByBytes: !0 } : {}
  };
}
function streamOnOpen(fd2) {
  fstat(fd2, (err2, stats) => {
    this.resolveMtime(err2 ? 0 : stats.mtimeMs);
  });
}
function streamOnData(chunk) {
  if (this.isFirstChunk) {
    if (this.isFirstChunk = !1, chunk.charCodeAt(0) === 65279)
      chunk = chunk.slice(1);
  }
  if (this.totalBytesRead += Buffer.byteLength(chunk), !this.truncateOnByteLimit && this.maxBytes !== void 0 && this.totalBytesRead > this.maxBytes) {
    this.stream.destroy(new FileTooLargeError(this.totalBytesRead, this.maxBytes));
    return;
  }
  let data = this.partial.length > 0 ? this.partial + chunk : chunk;
  this.partial = "";
  let startPos = 0, newlinePos;
  while ((newlinePos = data.indexOf(`
`, startPos)) !== -1) {
    if (this.currentLineIndex >= this.offset && this.currentLineIndex < this.endLine) {
      let line = data.slice(startPos, newlinePos);
      if (line.endsWith("\r"))
        line = line.slice(0, -1);
      if (this.truncateOnByteLimit && this.maxBytes !== void 0) {
        let sep20 = this.selectedLines.length > 0 ? 1 : 0, nextBytes = this.selectedBytes + sep20 + Buffer.byteLength(line);
        if (nextBytes > this.maxBytes)
          this.truncatedByBytes = !0, this.endLine = this.currentLineIndex;
        else
          this.selectedBytes = nextBytes, this.selectedLines.push(line);
      } else
        this.selectedLines.push(line);
    }
    this.currentLineIndex++, startPos = newlinePos + 1;
  }
  if (startPos < data.length) {
    if (this.currentLineIndex >= this.offset && this.currentLineIndex < this.endLine) {
      let fragment = data.slice(startPos);
      if (this.truncateOnByteLimit && this.maxBytes !== void 0) {
        let sep20 = this.selectedLines.length > 0 ? 1 : 0;
        if (this.selectedBytes + sep20 + Buffer.byteLength(fragment) > this.maxBytes) {
          this.truncatedByBytes = !0, this.endLine = this.currentLineIndex;
          return;
        }
      }
      this.partial = fragment;
    }
  }
}
function streamOnEnd() {
  let line = this.partial;
  if (line.endsWith("\r"))
    line = line.slice(0, -1);
  if (this.currentLineIndex >= this.offset && this.currentLineIndex < this.endLine)
    if (this.truncateOnByteLimit && this.maxBytes !== void 0) {
      let sep20 = this.selectedLines.length > 0 ? 1 : 0;
      if (this.selectedBytes + sep20 + Buffer.byteLength(line) > this.maxBytes)
        this.truncatedByBytes = !0;
      else
        this.selectedLines.push(line);
    } else
      this.selectedLines.push(line);
  this.currentLineIndex++;
  let content = this.selectedLines.join(`
`), truncated = this.truncatedByBytes;
  this.mtimeReady.then((mtimeMs) => {
    this.resolve({
      content,
      lineCount: this.selectedLines.length,
      totalLines: this.currentLineIndex,
      totalBytes: this.totalBytesRead,
      readBytes: Buffer.byteLength(content, "utf8"),
      mtimeMs,
      ...truncated ? { truncatedByBytes: !0 } : {}
    });
  });
}
function readFileInRangeStreaming(filePath, offset, maxLines, maxBytes, truncateOnByteLimit, signal) {
  return new Promise((resolve35, reject2) => {
    let state3 = {
      stream: createReadStream2(filePath, {
        encoding: "utf8",
        highWaterMark: 524288,
        ...signal ? { signal } : void 0
      }),
      offset,
      endLine: maxLines !== void 0 ? offset + maxLines : 1 / 0,
      maxBytes,
      truncateOnByteLimit,
      resolve: resolve35,
      totalBytesRead: 0,
      selectedBytes: 0,
      truncatedByBytes: !1,
      currentLineIndex: 0,
      selectedLines: [],
      partial: "",
      isFirstChunk: !0,
      resolveMtime: () => {},
      mtimeReady: null
    };
    state3.mtimeReady = new Promise((r4) => {
      state3.resolveMtime = r4;
    }), state3.stream.once("open", streamOnOpen.bind(state3)), state3.stream.on("data", streamOnData.bind(state3)), state3.stream.once("end", streamOnEnd.bind(state3)), state3.stream.once("error", reject2);
  });
}
var FAST_PATH_MAX_SIZE = 10485760, FileTooLargeError;
var init_readFileInRange = __esm(() => {
  init_format();
  FileTooLargeError = class FileTooLargeError extends Error {
    sizeInBytes;
    maxSizeBytes;
    constructor(sizeInBytes, maxSizeBytes) {
      super(`File content (${formatFileSize(sizeInBytes)}) exceeds maximum allowed size (${formatFileSize(maxSizeBytes)}). Use offset and limit parameters to read specific portions of the file, or search for specific content instead of reading the whole file.`);
      this.sizeInBytes = sizeInBytes;
      this.maxSizeBytes = maxSizeBytes;
      this.name = "FileTooLargeError";
    }
  };
});
