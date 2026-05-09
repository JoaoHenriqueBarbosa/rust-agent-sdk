// Original: src/utils/readEditContext.ts
import { open as open10 } from "fs/promises";
async function readEditContext(path19, needle, contextLines = 3) {
  let handle = await openForScan(path19);
  if (handle === null)
    return null;
  try {
    return await scanForContext(handle, needle, contextLines);
  } finally {
    await handle.close();
  }
}
async function openForScan(path19) {
  try {
    return await open10(path19, "r");
  } catch (e) {
    if (isENOENT(e))
      return null;
    throw e;
  }
}
async function scanForContext(handle, needle, contextLines) {
  if (needle === "")
    return { content: "", lineOffset: 1, truncated: !1 };
  let needleLF = Buffer.from(needle, "utf8"), nlCount = 0;
  for (let i5 = 0;i5 < needleLF.length; i5++)
    if (needleLF[i5] === NL)
      nlCount++;
  let needleCRLF, overlap = needleLF.length + nlCount - 1, buf = Buffer.allocUnsafe(CHUNK_SIZE + overlap), pos = 0, linesBeforePos = 0, prevTail = 0;
  while (pos < MAX_SCAN_BYTES) {
    let { bytesRead } = await handle.read(buf, prevTail, CHUNK_SIZE, pos);
    if (bytesRead === 0)
      break;
    let viewLen = prevTail + bytesRead, matchAt = indexOfWithin(buf, needleLF, viewLen), matchLen = needleLF.length;
    if (matchAt === -1 && nlCount > 0)
      needleCRLF ??= Buffer.from(needle.replaceAll(`
`, `\r
`), "utf8"), matchAt = indexOfWithin(buf, needleCRLF, viewLen), matchLen = needleCRLF.length;
    if (matchAt !== -1) {
      let absMatch = pos - prevTail + matchAt;
      return await sliceContext(handle, buf, absMatch, matchLen, contextLines, linesBeforePos + countNewlines(buf, 0, matchAt));
    }
    pos += bytesRead;
    let nextTail = Math.min(overlap, viewLen);
    linesBeforePos += countNewlines(buf, 0, viewLen - nextTail), prevTail = nextTail, buf.copyWithin(0, viewLen - prevTail, viewLen);
  }
  return { content: "", lineOffset: 1, truncated: pos >= MAX_SCAN_BYTES };
}
async function readCapped(handle) {
  let buf = Buffer.allocUnsafe(CHUNK_SIZE), total = 0;
  for (;; ) {
    if (total === buf.length) {
      let grown = Buffer.allocUnsafe(Math.min(buf.length * 2, MAX_SCAN_BYTES + CHUNK_SIZE));
      buf.copy(grown, 0, 0, total), buf = grown;
    }
    let { bytesRead } = await handle.read(buf, total, buf.length - total, total);
    if (bytesRead === 0)
      break;
    if (total += bytesRead, total > MAX_SCAN_BYTES)
      return null;
  }
  return normalizeCRLF(buf, total);
}
function indexOfWithin(buf, needle, end) {
  let at = buf.indexOf(needle);
  return at === -1 || at + needle.length > end ? -1 : at;
}
function countNewlines(buf, start, end) {
  let n5 = 0;
  for (let i5 = start;i5 < end; i5++)
    if (buf[i5] === NL)
      n5++;
  return n5;
}
function normalizeCRLF(buf, len) {
  let s2 = buf.toString("utf8", 0, len);
  return s2.includes("\r") ? s2.replaceAll(`\r
`, `
`) : s2;
}
async function sliceContext(handle, scratch, matchStart, matchLen, contextLines, linesBeforeMatch) {
  let backChunk = Math.min(matchStart, CHUNK_SIZE), { bytesRead: backRead } = await handle.read(scratch, 0, backChunk, matchStart - backChunk), ctxStart = matchStart, nlSeen = 0;
  for (let i5 = backRead - 1;i5 >= 0 && nlSeen <= contextLines; i5--) {
    if (scratch[i5] === NL) {
      if (nlSeen++, nlSeen > contextLines)
        break;
    }
    ctxStart--;
  }
  let walkedBack = matchStart - ctxStart, lineOffset = linesBeforeMatch - countNewlines(scratch, backRead - walkedBack, backRead) + 1, matchEnd = matchStart + matchLen, { bytesRead: fwdRead } = await handle.read(scratch, 0, CHUNK_SIZE, matchEnd), ctxEnd = matchEnd;
  nlSeen = 0;
  for (let i5 = 0;i5 < fwdRead; i5++)
    if (ctxEnd++, scratch[i5] === NL) {
      if (nlSeen++, nlSeen >= contextLines + 1)
        break;
    }
  let len = ctxEnd - ctxStart, out = len <= scratch.length ? scratch : Buffer.allocUnsafe(len), { bytesRead: outRead } = await handle.read(out, 0, len, ctxStart);
  return { content: normalizeCRLF(out, outRead), lineOffset, truncated: !1 };
}
var CHUNK_SIZE = 8192, MAX_SCAN_BYTES = 10485760, NL = 10;
var init_readEditContext = __esm(() => {
  init_errors();
});
