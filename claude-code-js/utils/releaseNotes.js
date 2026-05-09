// Original: src/utils/releaseNotes.ts
import { mkdir as mkdir29, readFile as readFile44, writeFile as writeFile36 } from "fs/promises";
import { dirname as dirname55, join as join121 } from "path";
function getChangelogCachePath() {
  return join121(getClaudeConfigHomeDir(), "cache", "changelog.md");
}
async function migrateChangelogFromConfig() {
  let config11 = getGlobalConfig();
  if (!config11.cachedChangelog)
    return;
  let cachePath = getChangelogCachePath();
  try {
    await mkdir29(dirname55(cachePath), { recursive: !0 }), await writeFile36(cachePath, config11.cachedChangelog, {
      encoding: "utf-8",
      flag: "wx"
    });
  } catch {}
  saveGlobalConfig(({ cachedChangelog: _, ...rest }) => rest);
}
async function fetchAndStoreChangelog() {
  if (getIsNonInteractiveSession())
    return;
  if (isEssentialTrafficOnly())
    return;
  let response7 = await axios_default.get(RAW_CHANGELOG_URL);
  if (response7.status === 200) {
    let changelogContent = response7.data;
    if (changelogContent === changelogMemoryCache)
      return;
    let cachePath = getChangelogCachePath();
    await mkdir29(dirname55(cachePath), { recursive: !0 }), await writeFile36(cachePath, changelogContent, { encoding: "utf-8" }), changelogMemoryCache = changelogContent;
    let changelogLastFetched = Date.now();
    saveGlobalConfig((current) => ({
      ...current,
      changelogLastFetched
    }));
  }
}
async function getStoredChangelog() {
  if (changelogMemoryCache !== null)
    return changelogMemoryCache;
  let cachePath = getChangelogCachePath();
  try {
    let content = await readFile44(cachePath, "utf-8");
    return changelogMemoryCache = content, content;
  } catch {
    return changelogMemoryCache = "", "";
  }
}
function getStoredChangelogFromMemory() {
  return changelogMemoryCache ?? "";
}
function parseChangelog(content) {
  try {
    if (!content)
      return {};
    let releaseNotes = {}, sections = content.split(/^## /gm).slice(1);
    for (let section of sections) {
      let lines2 = section.trim().split(`
`);
      if (lines2.length === 0)
        continue;
      let versionLine = lines2[0];
      if (!versionLine)
        continue;
      let version5 = versionLine.split(" - ")[0]?.trim() || "";
      if (!version5)
        continue;
      let notes = lines2.slice(1).filter((line) => line.trim().startsWith("- ")).map((line) => line.trim().substring(2).trim()).filter(Boolean);
      if (notes.length > 0)
        releaseNotes[version5] = notes;
    }
    return releaseNotes;
  } catch (error44) {
    return logError2(toError(error44)), {};
  }
}
function getRecentReleaseNotes(currentVersion, previousVersion, changelogContent = getStoredChangelogFromMemory()) {
  try {
    let releaseNotes = parseChangelog(changelogContent), baseCurrentVersion = import_semver9.coerce(currentVersion), basePreviousVersion = previousVersion ? import_semver9.coerce(previousVersion) : null;
    if (!basePreviousVersion || baseCurrentVersion && gt(baseCurrentVersion.version, basePreviousVersion.version))
      return Object.entries(releaseNotes).filter(([version5]) => !basePreviousVersion || gt(version5, basePreviousVersion.version)).sort(([versionA], [versionB]) => gt(versionA, versionB) ? -1 : 1).flatMap(([_, notes]) => notes).filter(Boolean).slice(0, MAX_RELEASE_NOTES_SHOWN);
  } catch (error44) {
    return logError2(toError(error44)), [];
  }
  return [];
}
function getAllReleaseNotes(changelogContent = getStoredChangelogFromMemory()) {
  try {
    let releaseNotes = parseChangelog(changelogContent);
    return Object.keys(releaseNotes).sort((a2, b) => gt(a2, b) ? 1 : -1).map((version5) => {
      let versionNotes = releaseNotes[version5];
      if (!versionNotes || versionNotes.length === 0)
        return null;
      let notes = versionNotes.filter(Boolean);
      if (notes.length === 0)
        return null;
      return [version5, notes];
    }).filter((item) => item !== null);
  } catch (error44) {
    return logError2(toError(error44)), [];
  }
}
async function checkForReleaseNotes(lastSeenVersion, currentVersion = "2.1.90") {
  let cachedChangelog = await getStoredChangelog();
  if (lastSeenVersion !== currentVersion || !cachedChangelog)
    fetchAndStoreChangelog().catch((error44) => logError2(toError(error44)));
  let releaseNotes = getRecentReleaseNotes(currentVersion, lastSeenVersion, cachedChangelog);
  return {
    hasReleaseNotes: releaseNotes.length > 0,
    releaseNotes
  };
}
function checkForReleaseNotesSync(lastSeenVersion, currentVersion = "2.1.90") {
  let releaseNotes = getRecentReleaseNotes(currentVersion, lastSeenVersion);
  return {
    hasReleaseNotes: releaseNotes.length > 0,
    releaseNotes
  };
}
var import_semver9, MAX_RELEASE_NOTES_SHOWN = 5, CHANGELOG_URL = "https://github.com/anthropics/claude-code/blob/main/CHANGELOG.md", RAW_CHANGELOG_URL = "https://raw.githubusercontent.com/anthropics/claude-code/refs/heads/main/CHANGELOG.md", changelogMemoryCache = null;
var init_releaseNotes = __esm(() => {
  init_axios2();
  init_state();
  init_config4();
  init_envUtils();
  init_errors();
  init_log3();
  import_semver9 = __toESM(require_semver2(), 1);
});
