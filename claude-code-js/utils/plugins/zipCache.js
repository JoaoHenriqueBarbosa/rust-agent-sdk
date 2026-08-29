// Original: src/utils/plugins/zipCache.ts
import { randomBytes as randomBytes12 } from "crypto";
import {
  chmod as chmod7,
  lstat as lstat5,
  readdir as readdir16,
  readFile as readFile33,
  rename as rename3,
  rm as rm7,
  stat as stat30,
  writeFile as writeFile24
} from "fs/promises";
import { tmpdir as tmpdir8 } from "os";
import { basename as basename28, dirname as dirname41, join as join94 } from "path";
function isPluginZipCacheEnabled() {
  return isEnvTruthy(process.env.CLAUDE_CODE_PLUGIN_USE_ZIP_CACHE);
}
function getPluginZipCachePath() {
  if (!isPluginZipCacheEnabled())
    return;
  let dir = process.env.CLAUDE_CODE_PLUGIN_CACHE_DIR;
  return dir ? expandTilde(dir) : void 0;
}
function getZipCacheKnownMarketplacesPath() {
  let cachePath = getPluginZipCachePath();
  if (!cachePath)
    throw Error("Plugin zip cache is not enabled");
  return join94(cachePath, "known_marketplaces.json");
}
function getZipCacheMarketplacesDir() {
  let cachePath = getPluginZipCachePath();
  if (!cachePath)
    throw Error("Plugin zip cache is not enabled");
  return join94(cachePath, "marketplaces");
}
function getZipCachePluginsDir() {
  let cachePath = getPluginZipCachePath();
  if (!cachePath)
    throw Error("Plugin zip cache is not enabled");
  return join94(cachePath, "plugins");
}
async function getSessionPluginCachePath() {
  if (sessionPluginCachePath)
    return sessionPluginCachePath;
  if (!sessionPluginCachePromise)
    sessionPluginCachePromise = (async () => {
      let suffix = randomBytes12(8).toString("hex"), dir = join94(tmpdir8(), `claude-plugin-session-${suffix}`);
      return await getFsImplementation().mkdir(dir), sessionPluginCachePath = dir, logForDebugging(`Created session plugin cache at ${dir}`), dir;
    })();
  return sessionPluginCachePromise;
}
async function cleanupSessionPluginCache() {
  if (!sessionPluginCachePath)
    return;
  try {
    await rm7(sessionPluginCachePath, { recursive: !0, force: !0 }), logForDebugging(`Cleaned up session plugin cache at ${sessionPluginCachePath}`);
  } catch (error44) {
    logForDebugging(`Failed to clean up session plugin cache: ${error44}`);
  } finally {
    sessionPluginCachePath = null, sessionPluginCachePromise = null;
  }
}
async function atomicWriteToZipCache(targetPath, data) {
  let dir = dirname41(targetPath);
  await getFsImplementation().mkdir(dir);
  let tmpName = `.${basename28(targetPath)}.tmp.${randomBytes12(4).toString("hex")}`, tmpPath = join94(dir, tmpName);
  try {
    if (typeof data === "string")
      await writeFile24(tmpPath, data, { encoding: "utf-8" });
    else
      await writeFile24(tmpPath, data);
    await rename3(tmpPath, targetPath);
  } catch (error44) {
    try {
      await rm7(tmpPath, { force: !0 });
    } catch {}
    throw error44;
  }
}
async function createZipFromDirectory(sourceDir) {
  let files2 = {};
  await collectFilesForZip(sourceDir, "", files2, /* @__PURE__ */ new Set);
  let { zipSync: zipSync2 } = await Promise.resolve().then(() => (init_esm17(), exports_esm2)), zipData = zipSync2(files2, { level: 6 });
  return logForDebugging(`Created ZIP from ${sourceDir}: ${Object.keys(files2).length} files, ${zipData.length} bytes`), zipData;
}
async function collectFilesForZip(baseDir, relativePath, files2, visited) {
  let currentDir = relativePath ? join94(baseDir, relativePath) : baseDir, entries2;
  try {
    entries2 = await readdir16(currentDir);
  } catch {
    return;
  }
  try {
    let dirStat = await stat30(currentDir, { bigint: !0 });
    if (dirStat.dev !== 0n || dirStat.ino !== 0n) {
      let key3 = `${dirStat.dev}:${dirStat.ino}`;
      if (visited.has(key3)) {
        logForDebugging(`Skipping symlink cycle at ${currentDir}`);
        return;
      }
      visited.add(key3);
    }
  } catch {
    return;
  }
  for (let entry of entries2) {
    if (entry === ".git")
      continue;
    let fullPath = join94(currentDir, entry), relPath = relativePath ? `${relativePath}/${entry}` : entry, fileStat;
    try {
      fileStat = await lstat5(fullPath);
    } catch {
      continue;
    }
    if (fileStat.isSymbolicLink())
      try {
        let targetStat = await stat30(fullPath);
        if (targetStat.isDirectory())
          continue;
        fileStat = targetStat;
      } catch {
        continue;
      }
    if (fileStat.isDirectory())
      await collectFilesForZip(baseDir, relPath, files2, visited);
    else if (fileStat.isFile())
      try {
        let content = await readFile33(fullPath);
        files2[relPath] = [
          new Uint8Array(content),
          { os: 3, attrs: (fileStat.mode & 65535) << 16 }
        ];
      } catch (error44) {
        logForDebugging(`Failed to read file for zip: ${relPath}: ${error44}`);
      }
  }
}
async function extractZipToDirectory(zipPath, targetDir) {
  let zipBuf = await getFsImplementation().readFileBytes(zipPath), files2 = await unzipFile(zipBuf), modes = parseZipModes(zipBuf);
  await getFsImplementation().mkdir(targetDir);
  for (let [relPath, data] of Object.entries(files2)) {
    if (relPath.endsWith("/")) {
      await getFsImplementation().mkdir(join94(targetDir, relPath));
      continue;
    }
    let fullPath = join94(targetDir, relPath);
    await getFsImplementation().mkdir(dirname41(fullPath)), await writeFile24(fullPath, data);
    let mode = modes[relPath];
    if (mode && mode & 73)
      await chmod7(fullPath, mode & 511).catch(() => {});
  }
  logForDebugging(`Extracted ZIP to ${targetDir}: ${Object.keys(files2).length} entries`);
}
async function convertDirectoryToZipInPlace(dirPath, zipPath) {
  let zipData = await createZipFromDirectory(dirPath);
  await atomicWriteToZipCache(zipPath, zipData), await rm7(dirPath, { recursive: !0, force: !0 });
}
function getMarketplaceJsonRelativePath(marketplaceName) {
  let sanitized = marketplaceName.replace(/[^a-zA-Z0-9\-_]/g, "-");
  return join94("marketplaces", `${sanitized}.json`);
}
function isMarketplaceSourceSupportedByZipCache(source) {
  return ["github", "git", "url", "settings"].includes(source.source);
}
var sessionPluginCachePath = null, sessionPluginCachePromise = null;
var init_zipCache = __esm(() => {
  init_debug();
  init_zip();
  init_envUtils();
  init_fsOperations();
  init_pathValidation();
});
