// Original: src/utils/nativeInstaller/download.ts
import { createHash as createHash14 } from "crypto";
import { chmod as chmod4, writeFile as writeFile14 } from "fs/promises";
import { join as join67 } from "path";
async function getLatestVersionFromBinaryRepo(channel = "latest", baseUrl, authConfig) {
  let startTime = Date.now();
  try {
    let response7 = await axios_default.get(`${baseUrl}/${channel}`, {
      timeout: 30000,
      responseType: "text",
      ...authConfig
    }), latencyMs = Date.now() - startTime;
    return logEvent("tengu_version_check_success", {
      latency_ms: latencyMs
    }), response7.data.trim();
  } catch (error44) {
    let latencyMs = Date.now() - startTime, errorMessage2 = error44 instanceof Error ? error44.message : String(error44), httpStatus;
    if (axios_default.isAxiosError(error44) && error44.response)
      httpStatus = error44.response.status;
    logEvent("tengu_version_check_failure", {
      latency_ms: latencyMs,
      http_status: httpStatus,
      is_timeout: errorMessage2.includes("timeout")
    });
    let fetchError = Error(`Failed to fetch version from ${baseUrl}/${channel}: ${errorMessage2}`);
    throw logError2(fetchError), fetchError;
  }
}
async function getLatestVersion2(channelOrVersion) {
  if (/^v?\d+\.\d+\.\d+(-\S+)?$/.test(channelOrVersion)) {
    let normalized = channelOrVersion.startsWith("v") ? channelOrVersion.slice(1) : channelOrVersion;
    if (/^99\.99\./.test(normalized))
      throw Error(`Version ${normalized} is not available for installation. Use 'stable' or 'latest'.`);
    return normalized;
  }
  let channel = channelOrVersion;
  if (channel !== "stable" && channel !== "latest")
    throw Error(`Invalid channel: ${channelOrVersion}. Use 'stable' or 'latest'`);
  return getLatestVersionFromBinaryRepo(channel, GCS_BUCKET_URL2);
}
function getStallTimeoutMs() {
  return Number(process.env.CLAUDE_CODE_STALL_TIMEOUT_MS_FOR_TESTING) || DEFAULT_STALL_TIMEOUT_MS;
}
async function downloadAndVerifyBinary(binaryUrl, expectedChecksum, binaryPath, requestConfig = {}) {
  let lastError;
  for (let attempt = 1;attempt <= MAX_DOWNLOAD_RETRIES; attempt++) {
    let controller = new AbortController, stallTimer, clearStallTimer = () => {
      if (stallTimer)
        clearTimeout(stallTimer), stallTimer = void 0;
    }, resetStallTimer = () => {
      clearStallTimer(), stallTimer = setTimeout((c3) => c3.abort(), getStallTimeoutMs(), controller);
    };
    try {
      resetStallTimer();
      let response7 = await axios_default.get(binaryUrl, {
        timeout: 300000,
        responseType: "arraybuffer",
        signal: controller.signal,
        onDownloadProgress: () => {
          resetStallTimer();
        },
        ...requestConfig
      });
      clearStallTimer();
      let hash = createHash14("sha256");
      hash.update(response7.data);
      let actualChecksum = hash.digest("hex");
      if (actualChecksum !== expectedChecksum)
        throw Error(`Checksum mismatch: expected ${expectedChecksum}, got ${actualChecksum}`);
      await writeFile14(binaryPath, Buffer.from(response7.data)), await chmod4(binaryPath, 493);
      return;
    } catch (error44) {
      clearStallTimer();
      let isStallTimeout = axios_default.isCancel(error44);
      if (isStallTimeout)
        lastError = new StallTimeoutError;
      else
        lastError = toError(error44);
      if (isStallTimeout && attempt < MAX_DOWNLOAD_RETRIES) {
        logForDebugging(`Download stalled on attempt ${attempt}/${MAX_DOWNLOAD_RETRIES}, retrying...`), await sleep3(1000);
        continue;
      }
      throw lastError;
    }
  }
  throw lastError ?? Error("Download failed after all retries");
}
async function downloadVersionFromBinaryRepo(version5, stagingPath, baseUrl, authConfig) {
  let fs16 = getFsImplementation();
  await fs16.rm(stagingPath, { recursive: !0, force: !0 });
  let platform5 = getPlatform3(), startTime = Date.now();
  logEvent("tengu_binary_download_attempt", {});
  let manifest;
  try {
    manifest = (await axios_default.get(`${baseUrl}/${version5}/manifest.json`, {
      timeout: 1e4,
      responseType: "json",
      ...authConfig
    })).data;
  } catch (error44) {
    let latencyMs = Date.now() - startTime, errorMessage2 = error44 instanceof Error ? error44.message : String(error44), httpStatus;
    if (axios_default.isAxiosError(error44) && error44.response)
      httpStatus = error44.response.status;
    throw logEvent("tengu_binary_manifest_fetch_failure", {
      latency_ms: latencyMs,
      http_status: httpStatus,
      is_timeout: errorMessage2.includes("timeout")
    }), logError2(Error(`Failed to fetch manifest from ${baseUrl}/${version5}/manifest.json: ${errorMessage2}`)), error44;
  }
  let platformInfo = manifest.platforms[platform5];
  if (!platformInfo)
    throw logEvent("tengu_binary_platform_not_found", {}), Error(`Platform ${platform5} not found in manifest for version ${version5}`);
  let expectedChecksum = platformInfo.checksum, binaryName = getBinaryName(platform5), binaryUrl = `${baseUrl}/${version5}/${platform5}/${binaryName}`;
  await fs16.mkdir(stagingPath);
  let binaryPath = join67(stagingPath, binaryName);
  try {
    await downloadAndVerifyBinary(binaryUrl, expectedChecksum, binaryPath, authConfig || {});
    let latencyMs = Date.now() - startTime;
    logEvent("tengu_binary_download_success", {
      latency_ms: latencyMs
    });
  } catch (error44) {
    let latencyMs = Date.now() - startTime, errorMessage2 = error44 instanceof Error ? error44.message : String(error44), httpStatus;
    if (axios_default.isAxiosError(error44) && error44.response)
      httpStatus = error44.response.status;
    throw logEvent("tengu_binary_download_failure", {
      latency_ms: latencyMs,
      http_status: httpStatus,
      is_timeout: errorMessage2.includes("timeout"),
      is_checksum_mismatch: errorMessage2.includes("Checksum mismatch")
    }), logError2(Error(`Failed to download binary from ${binaryUrl}: ${errorMessage2}`)), error44;
  }
}
async function downloadVersion(version5, stagingPath) {
  return await downloadVersionFromBinaryRepo(version5, stagingPath, GCS_BUCKET_URL2), "binary";
}
var GCS_BUCKET_URL2 = "https://storage.googleapis.com/claude-code-dist-86c565f3-f756-42ad-8dfa-d59b1c096819/claude-code-releases", DEFAULT_STALL_TIMEOUT_MS = 60000, MAX_DOWNLOAD_RETRIES = 3, StallTimeoutError;
var init_download = __esm(() => {
  init_axios2();
  init_debug();
  init_errors();
  init_execFileNoThrow();
  init_fsOperations();
  init_log3();
  init_slowOperations();
  init_installer();
  StallTimeoutError = class StallTimeoutError extends Error {
    constructor() {
      super("Download stalled: no data received for 60 seconds");
      this.name = "StallTimeoutError";
    }
  };
});
