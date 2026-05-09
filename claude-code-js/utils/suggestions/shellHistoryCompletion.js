// Original: src/utils/suggestions/shellHistoryCompletion.ts
async function getShellHistoryCommands() {
  let now2 = Date.now();
  if (shellHistoryCache && now2 - shellHistoryCacheTimestamp < CACHE_TTL_MS4)
    return shellHistoryCache;
  let commands7 = [], seen = /* @__PURE__ */ new Set;
  try {
    for await (let entry of getHistory()) {
      if (entry.display && entry.display.startsWith("!")) {
        let command19 = entry.display.slice(1).trim();
        if (command19 && !seen.has(command19))
          seen.add(command19), commands7.push(command19);
      }
      if (commands7.length >= 50)
        break;
    }
  } catch (error44) {
    logForDebugging(`Failed to read shell history: ${error44}`);
  }
  return shellHistoryCache = commands7, shellHistoryCacheTimestamp = now2, commands7;
}
function prependToShellHistoryCache(command19) {
  if (!shellHistoryCache)
    return;
  let idx = shellHistoryCache.indexOf(command19);
  if (idx !== -1)
    shellHistoryCache.splice(idx, 1);
  shellHistoryCache.unshift(command19);
}
async function getShellHistoryCompletion(input) {
  if (!input || input.length < 2)
    return null;
  if (!input.trim())
    return null;
  let commands7 = await getShellHistoryCommands();
  for (let command19 of commands7)
    if (command19.startsWith(input) && command19 !== input)
      return {
        fullCommand: command19,
        suffix: command19.slice(input.length)
      };
  return null;
}
var shellHistoryCache = null, shellHistoryCacheTimestamp = 0, CACHE_TTL_MS4 = 60000;
var init_shellHistoryCompletion = __esm(() => {
  init_history();
  init_debug();
});
