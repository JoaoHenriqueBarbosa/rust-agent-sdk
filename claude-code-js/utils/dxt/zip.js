// Original: src/utils/dxt/zip.ts
import { isAbsolute as isAbsolute9, normalize as normalize8 } from "path";
function isPathSafe(filePath) {
  if (containsPathTraversal(filePath))
    return !1;
  let normalized = normalize8(filePath);
  if (isAbsolute9(normalized))
    return !1;
  return !0;
}
function validateZipFile(file2, state3) {
  state3.fileCount++;
  let error44;
  if (state3.fileCount > LIMITS.MAX_FILE_COUNT)
    error44 = `Archive contains too many files: ${state3.fileCount} (max: ${LIMITS.MAX_FILE_COUNT})`;
  if (!isPathSafe(file2.name))
    error44 = `Unsafe file path detected: "${file2.name}". Path traversal or absolute paths are not allowed.`;
  let fileSize = file2.originalSize || 0;
  if (fileSize > LIMITS.MAX_FILE_SIZE)
    error44 = `File "${file2.name}" is too large: ${Math.round(fileSize / 1024 / 1024)}MB (max: ${Math.round(LIMITS.MAX_FILE_SIZE / 1024 / 1024)}MB)`;
  if (state3.totalUncompressedSize += fileSize, state3.totalUncompressedSize > LIMITS.MAX_TOTAL_SIZE)
    error44 = `Archive total size is too large: ${Math.round(state3.totalUncompressedSize / 1024 / 1024)}MB (max: ${Math.round(LIMITS.MAX_TOTAL_SIZE / 1024 / 1024)}MB)`;
  let currentRatio = state3.totalUncompressedSize / state3.compressedSize;
  if (currentRatio > LIMITS.MAX_COMPRESSION_RATIO)
    error44 = `Suspicious compression ratio detected: ${currentRatio.toFixed(1)}:1 (max: ${LIMITS.MAX_COMPRESSION_RATIO}:1). This may be a zip bomb.`;
  return error44 ? { isValid: !1, error: error44 } : { isValid: !0 };
}
async function unzipFile(zipData) {
  let { unzipSync: unzipSync2 } = await Promise.resolve().then(() => (init_esm17(), exports_esm2)), state3 = {
    fileCount: 0,
    totalUncompressedSize: 0,
    compressedSize: zipData.length,
    errors: []
  }, result = unzipSync2(new Uint8Array(zipData), {
    filter: (file2) => {
      let validationResult = validateZipFile(file2, state3);
      if (!validationResult.isValid)
        throw Error(validationResult.error);
      return !0;
    }
  });
  return logForDebugging(`Zip extraction completed: ${state3.fileCount} files, ${Math.round(state3.totalUncompressedSize / 1024)}KB uncompressed`), result;
}
function parseZipModes(data) {
  let buf = Buffer.from(data.buffer, data.byteOffset, data.byteLength), modes = {}, minEocd = Math.max(0, buf.length - 22 - 65535), eocd = -1;
  for (let i5 = buf.length - 22;i5 >= minEocd; i5--)
    if (buf.readUInt32LE(i5) === 101010256) {
      eocd = i5;
      break;
    }
  if (eocd < 0)
    return modes;
  let entryCount = buf.readUInt16LE(eocd + 10), off = buf.readUInt32LE(eocd + 16);
  for (let i5 = 0;i5 < entryCount; i5++) {
    if (off + 46 > buf.length || buf.readUInt32LE(off) !== 33639248)
      break;
    let versionMadeBy = buf.readUInt16LE(off + 4), nameLen = buf.readUInt16LE(off + 28), extraLen = buf.readUInt16LE(off + 30), commentLen = buf.readUInt16LE(off + 32), externalAttr = buf.readUInt32LE(off + 38), name3 = buf.toString("utf8", off + 46, off + 46 + nameLen);
    if (versionMadeBy >> 8 === 3) {
      let mode = externalAttr >>> 16 & 65535;
      if (mode)
        modes[name3] = mode;
    }
    off += 46 + nameLen + extraLen + commentLen;
  }
  return modes;
}
var LIMITS;
var init_zip = __esm(() => {
  init_debug();
  init_errors();
  init_fsOperations();
  init_path2();
  LIMITS = {
    MAX_FILE_SIZE: 536870912,
    MAX_TOTAL_SIZE: 1073741824,
    MAX_FILE_COUNT: 1e5,
    MAX_COMPRESSION_RATIO: 50,
    MIN_COMPRESSION_RATIO: 0.5
  };
});
