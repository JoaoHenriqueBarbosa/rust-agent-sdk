// Original: src/utils/sessionStoragePortable.ts
import { open as fsOpen, readdir as readdir2, realpath, stat } from "fs/promises";
function validateUuid(maybeUuid) {
  if (typeof maybeUuid !== "string")
    return null;
  return uuidRegex.test(maybeUuid) ? maybeUuid : null;
}
function unescapeJsonString(raw) {
  if (!raw.includes("\\"))
    return raw;
  try {
    return JSON.parse(`"${raw}"`);
  } catch {
    return raw;
  }
}
function extractJsonStringField(text, key) {
  let patterns = [`"${key}":"`, `"${key}": "`];
  for (let pattern of patterns) {
    let idx = text.indexOf(pattern);
    if (idx < 0)
      continue;
    let valueStart = idx + pattern.length, i2 = valueStart;
    while (i2 < text.length) {
      if (text[i2] === "\\") {
        i2 += 2;
        continue;
      }
      if (text[i2] === '"')
        return unescapeJsonString(text.slice(valueStart, i2));
      i2++;
    }
  }
  return;
}
function extractLastJsonStringField(text, key) {
  let patterns = [`"${key}":"`, `"${key}": "`], lastValue;
  for (let pattern of patterns) {
    let searchFrom = 0;
    while (!0) {
      let idx = text.indexOf(pattern, searchFrom);
      if (idx < 0)
        break;
      let valueStart = idx + pattern.length, i2 = valueStart;
      while (i2 < text.length) {
        if (text[i2] === "\\") {
          i2 += 2;
          continue;
        }
        if (text[i2] === '"') {
          lastValue = unescapeJsonString(text.slice(valueStart, i2));
          break;
        }
        i2++;
      }
      searchFrom = i2 + 1;
    }
  }
  return lastValue;
}
async function readHeadAndTail(filePath, fileSize, buf) {
  try {
    let fh = await fsOpen(filePath, "r");
    try {
      let headResult = await fh.read(buf, 0, LITE_READ_BUF_SIZE, 0);
      if (headResult.bytesRead === 0)
        return { head: "", tail: "" };
      let head = buf.toString("utf8", 0, headResult.bytesRead), tailOffset = Math.max(0, fileSize - LITE_READ_BUF_SIZE), tail = head;
      if (tailOffset > 0) {
        let tailResult = await fh.read(buf, 0, LITE_READ_BUF_SIZE, tailOffset);
        tail = buf.toString("utf8", 0, tailResult.bytesRead);
      }
      return { head, tail };
    } finally {
      await fh.close();
    }
  } catch {
    return { head: "", tail: "" };
  }
}
function simpleHash(str) {
  return Math.abs(djb2Hash(str)).toString(36);
}
function sanitizePath2(name) {
  let sanitized = name.replace(/[^a-zA-Z0-9]/g, "-");
  if (sanitized.length <= MAX_SANITIZED_LENGTH2)
    return sanitized;
  let hash = typeof Bun < "u" ? Bun.hash(name).toString(36) : simpleHash(name);
  return `${sanitized.slice(0, MAX_SANITIZED_LENGTH2)}-${hash}`;
}
function compactBoundaryMarker() {
  return _compactBoundaryMarker ??= Buffer.from('"compact_boundary"');
}
function parseBoundaryLine(line) {
  try {
    let parsed = JSON.parse(line);
    if (parsed.type !== "system" || parsed.subtype !== "compact_boundary")
      return null;
    return {
      hasPreservedSegment: Boolean(parsed.compactMetadata?.preservedSegment)
    };
  } catch {
    return null;
  }
}
function sinkWrite(s, src, start, end) {
  let n2 = end - start;
  if (n2 <= 0)
    return;
  if (s.len + n2 > s.buf.length) {
    let grown = Buffer.allocUnsafe(Math.min(Math.max(s.buf.length * 2, s.len + n2), s.cap));
    s.buf.copy(grown, 0, 0, s.len), s.buf = grown;
  }
  src.copy(s.buf, s.len, start, end), s.len += n2;
}
function hasPrefix(src, prefix, at, end) {
  return end - at >= prefix.length && src.compare(prefix, 0, prefix.length, at, at + prefix.length) === 0;
}
function processStraddle(s, chunk, bytesRead) {
  if (s.straddleSnapCarryLen = 0, s.straddleSnapTailEnd = 0, s.carryLen === 0)
    return 0;
  let cb = s.carryBuf, firstNl = chunk.indexOf(LF2);
  if (firstNl === -1 || firstNl >= bytesRead)
    return 0;
  let tailEnd = firstNl + 1;
  if (hasPrefix(cb, ATTR_SNAP_PREFIX, 0, s.carryLen))
    s.straddleSnapCarryLen = s.carryLen, s.straddleSnapTailEnd = tailEnd, s.lastSnapSrc = null;
  else if (s.carryLen < ATTR_SNAP_PREFIX.length)
    return 0;
  else {
    if (hasPrefix(cb, SYSTEM_PREFIX, 0, s.carryLen)) {
      let hit = parseBoundaryLine(cb.toString("utf-8", 0, s.carryLen) + chunk.toString("utf-8", 0, firstNl));
      if (hit?.hasPreservedSegment)
        s.hasPreservedSegment = !0;
      else if (hit)
        s.out.len = 0, s.boundaryStartOffset = s.bufFileOff, s.hasPreservedSegment = !1, s.lastSnapSrc = null;
    }
    sinkWrite(s.out, cb, 0, s.carryLen), sinkWrite(s.out, chunk, 0, tailEnd);
  }
  return s.bufFileOff += s.carryLen + tailEnd, s.carryLen = 0, tailEnd;
}
function scanChunkLines(s, buf, boundaryMarker) {
  let boundaryAt = buf.indexOf(boundaryMarker), runStart = 0, lineStart = 0, lastSnapStart = -1, lastSnapEnd = -1, nl = buf.indexOf(LF2);
  while (nl !== -1) {
    let lineEnd = nl + 1;
    if (boundaryAt !== -1 && boundaryAt < lineStart)
      boundaryAt = buf.indexOf(boundaryMarker, lineStart);
    if (hasPrefix(buf, ATTR_SNAP_PREFIX, lineStart, lineEnd))
      sinkWrite(s.out, buf, runStart, lineStart), lastSnapStart = lineStart, lastSnapEnd = lineEnd, runStart = lineEnd;
    else if (boundaryAt >= lineStart && boundaryAt < Math.min(lineStart + BOUNDARY_SEARCH_BOUND, lineEnd)) {
      let hit = parseBoundaryLine(buf.toString("utf-8", lineStart, nl));
      if (hit?.hasPreservedSegment)
        s.hasPreservedSegment = !0;
      else if (hit)
        s.out.len = 0, s.boundaryStartOffset = s.bufFileOff + lineStart, s.hasPreservedSegment = !1, s.lastSnapSrc = null, lastSnapStart = -1, s.straddleSnapCarryLen = 0, runStart = lineStart;
      boundaryAt = buf.indexOf(boundaryMarker, boundaryAt + boundaryMarker.length);
    }
    lineStart = lineEnd, nl = buf.indexOf(LF2, lineStart);
  }
  return sinkWrite(s.out, buf, runStart, lineStart), { lastSnapStart, lastSnapEnd, trailStart: lineStart };
}
function captureSnap(s, buf, chunk, lastSnapStart, lastSnapEnd) {
  if (lastSnapStart !== -1) {
    if (s.lastSnapLen = lastSnapEnd - lastSnapStart, s.lastSnapBuf === void 0 || s.lastSnapLen > s.lastSnapBuf.length)
      s.lastSnapBuf = Buffer.allocUnsafe(s.lastSnapLen);
    buf.copy(s.lastSnapBuf, 0, lastSnapStart, lastSnapEnd), s.lastSnapSrc = s.lastSnapBuf;
  } else if (s.straddleSnapCarryLen > 0) {
    if (s.lastSnapLen = s.straddleSnapCarryLen + s.straddleSnapTailEnd, s.lastSnapBuf === void 0 || s.lastSnapLen > s.lastSnapBuf.length)
      s.lastSnapBuf = Buffer.allocUnsafe(s.lastSnapLen);
    s.carryBuf.copy(s.lastSnapBuf, 0, 0, s.straddleSnapCarryLen), chunk.copy(s.lastSnapBuf, s.straddleSnapCarryLen, 0, s.straddleSnapTailEnd), s.lastSnapSrc = s.lastSnapBuf;
  }
}
function captureCarry(s, buf, trailStart) {
  if (s.carryLen = buf.length - trailStart, s.carryLen > 0) {
    if (s.carryBuf === void 0 || s.carryLen > s.carryBuf.length)
      s.carryBuf = Buffer.allocUnsafe(s.carryLen);
    buf.copy(s.carryBuf, 0, trailStart, buf.length);
  }
}
function finalizeOutput(s) {
  if (s.carryLen > 0) {
    let cb = s.carryBuf;
    if (hasPrefix(cb, ATTR_SNAP_PREFIX, 0, s.carryLen))
      s.lastSnapSrc = cb, s.lastSnapLen = s.carryLen;
    else
      sinkWrite(s.out, cb, 0, s.carryLen);
  }
  if (s.lastSnapSrc) {
    if (s.out.len > 0 && s.out.buf[s.out.len - 1] !== LF2)
      sinkWrite(s.out, LF_BYTE, 0, 1);
    sinkWrite(s.out, s.lastSnapSrc, 0, s.lastSnapLen);
  }
}
async function readTranscriptForLoad(filePath, fileSize) {
  let boundaryMarker = compactBoundaryMarker(), CHUNK_SIZE = TRANSCRIPT_READ_CHUNK_SIZE, s = {
    out: {
      buf: Buffer.allocUnsafe(Math.min(fileSize, 8388608)),
      len: 0,
      cap: fileSize + 1
    },
    boundaryStartOffset: 0,
    hasPreservedSegment: !1,
    lastSnapSrc: null,
    lastSnapLen: 0,
    lastSnapBuf: void 0,
    bufFileOff: 0,
    carryLen: 0,
    carryBuf: void 0,
    straddleSnapCarryLen: 0,
    straddleSnapTailEnd: 0
  }, chunk = Buffer.allocUnsafe(CHUNK_SIZE), fd = await fsOpen(filePath, "r");
  try {
    let filePos = 0;
    while (filePos < fileSize) {
      let { bytesRead } = await fd.read(chunk, 0, Math.min(CHUNK_SIZE, fileSize - filePos), filePos);
      if (bytesRead === 0)
        break;
      filePos += bytesRead;
      let chunkOff = processStraddle(s, chunk, bytesRead), buf;
      if (s.carryLen > 0) {
        let bufLen = s.carryLen + (bytesRead - chunkOff);
        buf = Buffer.allocUnsafe(bufLen), s.carryBuf.copy(buf, 0, 0, s.carryLen), chunk.copy(buf, s.carryLen, chunkOff, bytesRead);
      } else
        buf = chunk.subarray(chunkOff, bytesRead);
      let r = scanChunkLines(s, buf, boundaryMarker);
      captureSnap(s, buf, chunk, r.lastSnapStart, r.lastSnapEnd), captureCarry(s, buf, r.trailStart), s.bufFileOff += r.trailStart;
    }
    finalizeOutput(s);
  } finally {
    await fd.close();
  }
  return {
    boundaryStartOffset: s.boundaryStartOffset,
    postBoundaryBuf: s.out.buf.subarray(0, s.out.len),
    hasPreservedSegment: s.hasPreservedSegment
  };
}
var LITE_READ_BUF_SIZE = 65536, uuidRegex, MAX_SANITIZED_LENGTH2 = 200, TRANSCRIPT_READ_CHUNK_SIZE = 1048576, SKIP_PRECOMPACT_THRESHOLD = 5242880, _compactBoundaryMarker, ATTR_SNAP_PREFIX, SYSTEM_PREFIX, LF2 = 10, LF_BYTE, BOUNDARY_SEARCH_BOUND = 256;
var init_sessionStoragePortable = __esm(() => {
  init_envUtils();
  init_getWorktreePathsPortable();
  uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  ATTR_SNAP_PREFIX = Buffer.from('{"type":"attribution-snapshot"'), SYSTEM_PREFIX = Buffer.from('{"type":"system"'), LF_BYTE = Buffer.from([LF2]);
});
