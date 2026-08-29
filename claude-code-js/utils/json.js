// Original: src/utils/json.ts
import { open as open2, readFile as readFile5, stat as stat4 } from "fs/promises";
function parseJSONUncached(json2, shouldLogError) {
  try {
    return { ok: !0, value: JSON.parse(stripBOM(json2)) };
  } catch (e) {
    if (shouldLogError)
      logError2(e);
    return { ok: !1 };
  }
}
function safeParseJSONC(json2) {
  if (!json2)
    return null;
  try {
    return parse6(stripBOM(json2));
  } catch (e) {
    return logError2(e), null;
  }
}
function parseJSONLBun(data) {
  let parse7 = bunJSONLParse, len = data.length, result = parse7(data);
  if (!result.error || result.done || result.read >= len)
    return result.values;
  let { values, read: offset } = result;
  while (offset < len) {
    let newlineIndex = typeof data === "string" ? data.indexOf(`
`, offset) : data.indexOf(10, offset);
    if (newlineIndex === -1)
      break;
    offset = newlineIndex + 1;
    let next = parse7(data, offset);
    if (next.values.length > 0)
      values = values.concat(next.values);
    if (!next.error || next.done || next.read >= len)
      break;
    offset = next.read;
  }
  return values;
}
function parseJSONLBuffer(buf) {
  let bufLen = buf.length, start = 0;
  if (buf[0] === 239 && buf[1] === 187 && buf[2] === 191)
    start = 3;
  let results = [];
  while (start < bufLen) {
    let end = buf.indexOf(10, start);
    if (end === -1)
      end = bufLen;
    let line = buf.toString("utf8", start, end).trim();
    if (start = end + 1, !line)
      continue;
    try {
      results.push(JSON.parse(line));
    } catch {}
  }
  return results;
}
function parseJSONLString(data) {
  let stripped = stripBOM(data), len = stripped.length, start = 0, results = [];
  while (start < len) {
    let end = stripped.indexOf(`
`, start);
    if (end === -1)
      end = len;
    let line = stripped.substring(start, end).trim();
    if (start = end + 1, !line)
      continue;
    try {
      results.push(JSON.parse(line));
    } catch {}
  }
  return results;
}
function parseJSONL(data) {
  if (bunJSONLParse)
    return parseJSONLBun(data);
  if (typeof data === "string")
    return parseJSONLString(data);
  return parseJSONLBuffer(data);
}
async function readJSONLFile(filePath) {
  let __stack = [];
  try {
    let { size } = await stat4(filePath);
    if (size <= MAX_JSONL_READ_BYTES)
      return parseJSONL(await readFile5(filePath));
    const fd = __using(__stack, await open2(filePath, "r"), 1);
    let buf = Buffer.allocUnsafe(MAX_JSONL_READ_BYTES);
    let totalRead = 0;
    let fileOffset = size - MAX_JSONL_READ_BYTES;
    while (totalRead < MAX_JSONL_READ_BYTES) {
      let { bytesRead } = await fd.read(buf, totalRead, MAX_JSONL_READ_BYTES - totalRead, fileOffset + totalRead);
      if (bytesRead === 0)
        break;
      totalRead += bytesRead;
    }
    let newlineIndex = buf.indexOf(10);
    if (newlineIndex !== -1 && newlineIndex < totalRead - 1)
      return parseJSONL(buf.subarray(newlineIndex + 1, totalRead));
    return parseJSONL(buf.subarray(0, totalRead));
  } catch (_catch3) {
    var _err = _catch3, _hasErr = 1;
  } finally {
    var _promise2 = __callDispose(__stack, _err, _hasErr);
    _promise2 && await _promise2;
  }
}
function addItemToJSONCArray(content, newItem) {
  try {
    if (!content || content.trim() === "")
      return jsonStringify([newItem], null, 4);
    let cleanContent = stripBOM(content), parsedContent = parse6(cleanContent);
    if (Array.isArray(parsedContent)) {
      let arrayLength = parsedContent.length, edits = modify(cleanContent, arrayLength === 0 ? [0] : [arrayLength], newItem, {
        formattingOptions: { insertSpaces: !0, tabSize: 4 },
        isArrayInsertion: !0
      });
      if (!edits || edits.length === 0) {
        let copy = [...parsedContent, newItem];
        return jsonStringify(copy, null, 4);
      }
      return applyEdits(cleanContent, edits);
    } else
      return jsonStringify([newItem], null, 4);
  } catch (e) {
    return logError2(e), jsonStringify([newItem], null, 4);
  }
}
var PARSE_CACHE_MAX_KEY_BYTES = 8192, parseJSONCached, safeParseJSON, bunJSONLParse, MAX_JSONL_READ_BYTES = 104857600;
var init_json = __esm(() => {
  init_main2();
  init_log3();
  init_memoize2();
  init_slowOperations();
  parseJSONCached = memoizeWithLRU(parseJSONUncached, (json2) => json2, 50), safeParseJSON = Object.assign(function(json2, shouldLogError = !0) {
    if (!json2)
      return null;
    let result = json2.length > PARSE_CACHE_MAX_KEY_BYTES ? parseJSONUncached(json2, shouldLogError) : parseJSONCached(json2, shouldLogError);
    return result.ok ? result.value : null;
  }, { cache: parseJSONCached.cache });
  bunJSONLParse = (() => {
    if (typeof Bun > "u")
      return !1;
    let jsonl = Bun.JSONL;
    if (!jsonl?.parseChunk)
      return !1;
    return jsonl.parseChunk;
  })();
});
