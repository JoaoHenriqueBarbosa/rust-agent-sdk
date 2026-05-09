// Original: src/utils/binaryCheck.ts
async function isBinaryInstalled(command19) {
  if (!command19 || !command19.trim())
    return logForDebugging("[binaryCheck] Empty command provided, returning false"), !1;
  let trimmedCommand = command19.trim(), cached3 = binaryCache.get(trimmedCommand);
  if (cached3 !== void 0)
    return logForDebugging(`[binaryCheck] Cache hit for '${trimmedCommand}': ${cached3}`), cached3;
  let exists = !1;
  if (await which(trimmedCommand).catch(() => null))
    exists = !0;
  return binaryCache.set(trimmedCommand, exists), logForDebugging(`[binaryCheck] Binary '${trimmedCommand}' ${exists ? "found" : "not found"}`), exists;
}
var binaryCache;
var init_binaryCheck = __esm(() => {
  init_debug();
  init_which();
  binaryCache = /* @__PURE__ */ new Map;
});
