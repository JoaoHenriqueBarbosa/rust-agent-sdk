// Original: src/utils/plugins/pluginFlagging.ts
import { randomBytes as randomBytes17 } from "crypto";
import { readFile as readFile41, rename as rename8, unlink as unlink15, writeFile as writeFile35 } from "fs/promises";
import { join as join118 } from "path";
function getFlaggedPluginsPath() {
  return join118(getPluginsDirectory(), FLAGGED_PLUGINS_FILENAME);
}
function parsePluginsData(content) {
  let parsed = jsonParse(content);
  if (typeof parsed !== "object" || parsed === null || !("plugins" in parsed) || typeof parsed.plugins !== "object" || parsed.plugins === null)
    return {};
  let plugins = parsed.plugins, result = {};
  for (let [id, entry] of Object.entries(plugins))
    if (entry && typeof entry === "object" && "flaggedAt" in entry && typeof entry.flaggedAt === "string") {
      let parsed2 = {
        flaggedAt: entry.flaggedAt
      };
      if ("seenAt" in entry && typeof entry.seenAt === "string")
        parsed2.seenAt = entry.seenAt;
      result[id] = parsed2;
    }
  return result;
}
async function readFromDisk() {
  try {
    let content = await readFile41(getFlaggedPluginsPath(), {
      encoding: "utf-8"
    });
    return parsePluginsData(content);
  } catch {
    return {};
  }
}
async function writeToDisk(plugins) {
  let filePath = getFlaggedPluginsPath(), tempPath = `${filePath}.${randomBytes17(8).toString("hex")}.tmp`;
  try {
    await getFsImplementation().mkdir(getPluginsDirectory());
    let content = jsonStringify({ plugins }, null, 2);
    await writeFile35(tempPath, content, {
      encoding: "utf-8",
      mode: 384
    }), await rename8(tempPath, filePath), cache6 = plugins;
  } catch (error44) {
    logError2(error44);
    try {
      await unlink15(tempPath);
    } catch {}
  }
}
async function loadFlaggedPlugins() {
  let all4 = await readFromDisk(), now2 = Date.now(), changed = !1;
  for (let [id, entry] of Object.entries(all4))
    if (entry.seenAt && now2 - new Date(entry.seenAt).getTime() >= SEEN_EXPIRY_MS)
      delete all4[id], changed = !0;
  if (cache6 = all4, changed)
    await writeToDisk(all4);
}
function getFlaggedPlugins() {
  return cache6 ?? {};
}
async function addFlaggedPlugin(pluginId) {
  if (cache6 === null)
    cache6 = await readFromDisk();
  let updated = {
    ...cache6,
    [pluginId]: {
      flaggedAt: (/* @__PURE__ */ new Date()).toISOString()
    }
  };
  await writeToDisk(updated), logForDebugging(`Flagged plugin: ${pluginId}`);
}
async function markFlaggedPluginsSeen(pluginIds) {
  if (cache6 === null)
    cache6 = await readFromDisk();
  let now2 = (/* @__PURE__ */ new Date()).toISOString(), changed = !1, updated = { ...cache6 };
  for (let id of pluginIds) {
    let entry = updated[id];
    if (entry && !entry.seenAt)
      updated[id] = { ...entry, seenAt: now2 }, changed = !0;
  }
  if (changed)
    await writeToDisk(updated);
}
async function removeFlaggedPlugin(pluginId) {
  if (cache6 === null)
    cache6 = await readFromDisk();
  if (!(pluginId in cache6))
    return;
  let { [pluginId]: _, ...rest } = cache6;
  cache6 = rest, await writeToDisk(rest);
}
var FLAGGED_PLUGINS_FILENAME = "flagged-plugins.json", SEEN_EXPIRY_MS = 172800000, cache6 = null;
var init_pluginFlagging = __esm(() => {
  init_debug();
  init_fsOperations();
  init_log3();
  init_slowOperations();
  init_pluginDirectories();
});
