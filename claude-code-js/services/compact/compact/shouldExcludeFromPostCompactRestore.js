// function: shouldExcludeFromPostCompactRestore
function shouldExcludeFromPostCompactRestore(filename, agentId) {
  let normalizedFilename = expandPath(filename);
  try {
    let planFilePath = expandPath(getPlanFilePath(agentId));
    if (normalizedFilename === planFilePath)
      return !0;
  } catch {}
  try {
    if (new Set(MEMORY_TYPE_VALUES.map((type) => expandPath(getMemoryPath(type)))).has(normalizedFilename))
      return !0;
  } catch {}
  return !1;
}
