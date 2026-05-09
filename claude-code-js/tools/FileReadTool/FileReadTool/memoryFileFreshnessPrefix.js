// function: memoryFileFreshnessPrefix
function memoryFileFreshnessPrefix(data) {
  let mtimeMs = memoryFileMtimes.get(data);
  if (mtimeMs === void 0)
    return "";
  return memoryFreshnessNote(mtimeMs);
}
