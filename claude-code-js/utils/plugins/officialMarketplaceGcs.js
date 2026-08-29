// Original: src/utils/plugins/officialMarketplaceGcs.ts
import { chmod as chmod8, mkdir as mkdir22, readFile as readFile34, rename as rename4, rm as rm9, writeFile as writeFile26 } from "fs/promises";
import { dirname as dirname42, join as join96, resolve as resolve36, sep as sep20 } from "path";
async function fetchOfficialMarketplaceFromGcs(installLocation, marketplacesCacheDir) {
  let cacheDir = resolve36(marketplacesCacheDir), resolvedLoc = resolve36(installLocation);
  if (resolvedLoc !== cacheDir && !resolvedLoc.startsWith(cacheDir + sep20))
    return logForDebugging(`fetchOfficialMarketplaceFromGcs: refusing path outside cache dir: ${installLocation}`, { level: "error" }), null;
  await waitForScrollIdle();
  let start = performance.now(), outcome = "failed", sha, bytes, errKind;
  try {
    let latest = await axios_default.get(`${GCS_BASE}/latest`, {
      responseType: "text",
      timeout: 1e4
    });
    if (sha = String(latest.data).trim(), !sha)
      throw Error("latest pointer returned empty body");
    let sentinelPath = join96(installLocation, ".gcs-sha");
    if (await readFile34(sentinelPath, "utf8").then((s2) => s2.trim(), () => null) === sha)
      return outcome = "noop", sha;
    let zipResp = await axios_default.get(`${GCS_BASE}/${sha}.zip`, {
      responseType: "arraybuffer",
      timeout: 60000
    }), zipBuf = Buffer.from(zipResp.data);
    bytes = zipBuf.length;
    let files2 = await unzipFile(zipBuf), modes = parseZipModes(zipBuf), staging = `${installLocation}.staging`;
    await rm9(staging, { recursive: !0, force: !0 }), await mkdir22(staging, { recursive: !0 });
    for (let [arcPath, data] of Object.entries(files2)) {
      if (!arcPath.startsWith(ARC_PREFIX))
        continue;
      let rel = arcPath.slice(ARC_PREFIX.length);
      if (!rel || rel.endsWith("/"))
        continue;
      let dest = join96(staging, rel);
      await mkdir22(dirname42(dest), { recursive: !0 }), await writeFile26(dest, data);
      let mode = modes[arcPath];
      if (mode && mode & 73)
        await chmod8(dest, mode & 511).catch(() => {});
    }
    return await writeFile26(join96(staging, ".gcs-sha"), sha), await rm9(installLocation, { recursive: !0, force: !0 }), await rename4(staging, installLocation), outcome = "updated", sha;
  } catch (e) {
    return errKind = classifyGcsError(e), logForDebugging(`Official marketplace GCS fetch failed: ${errorMessage(e)}`, { level: "warn" }), null;
  } finally {
    logEvent("tengu_plugin_remote_fetch", {
      source: "marketplace_gcs",
      host: "downloads.claude.ai",
      is_official: !0,
      outcome,
      duration_ms: Math.round(performance.now() - start),
      ...bytes !== void 0 && { bytes },
      ...sha && { sha },
      ...errKind && { error_kind: errKind }
    });
  }
}
function classifyGcsError(e) {
  if (axios_default.isAxiosError(e)) {
    if (e.code === "ECONNABORTED")
      return "timeout";
    if (e.response)
      return `http_${e.response.status}`;
    return "network";
  }
  let code = getErrnoCode(e);
  if (code && /^E[A-Z]+$/.test(code) && !code.startsWith("ERR_"))
    return KNOWN_FS_CODES.has(code) ? `fs_${code}` : "fs_other";
  if (typeof e?.code === "number")
    return "zip_parse";
  let msg = errorMessage(e);
  if (/unzip|invalid zip|central directory/i.test(msg))
    return "zip_parse";
  if (/empty body/.test(msg))
    return "empty_latest";
  return "other";
}
var GCS_BASE = "https://downloads.claude.ai/claude-code-releases/plugins/claude-plugins-official", ARC_PREFIX = "marketplaces/claude-plugins-official/", KNOWN_FS_CODES;
var init_officialMarketplaceGcs = __esm(() => {
  init_axios2();
  init_state();
  init_debug();
  init_zip();
  init_errors();
  KNOWN_FS_CODES = /* @__PURE__ */ new Set([
    "ENOSPC",
    "EACCES",
    "EPERM",
    "EXDEV",
    "EBUSY",
    "ENOENT",
    "ENOTDIR",
    "EROFS",
    "EMFILE",
    "ENAMETOOLONG"
  ]);
});
