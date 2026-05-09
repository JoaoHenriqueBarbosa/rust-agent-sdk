// Original: src/services/api/filesApi.ts
import { randomUUID as randomUUID11 } from "crypto";
import * as fs16 from "fs/promises";
import * as path16 from "path";
function getDefaultApiBaseUrl() {
  return process.env.ANTHROPIC_BASE_URL || process.env.CLAUDE_CODE_API_BASE_URL || "https://api.anthropic.com";
}
function logDebugError(message) {
  logForDebugging(`[files-api] ${message}`, { level: "error" });
}
function logDebug(message) {
  logForDebugging(`[files-api] ${message}`);
}
async function retryWithBackoff(operation, attemptFn) {
  let lastError = "";
  for (let attempt = 1;attempt <= MAX_RETRIES2; attempt++) {
    let result = await attemptFn(attempt);
    if (result.done)
      return result.value;
    if (lastError = result.error || `${operation} failed`, logDebug(`${operation} attempt ${attempt}/${MAX_RETRIES2} failed: ${lastError}`), attempt < MAX_RETRIES2) {
      let delayMs = BASE_DELAY_MS3 * Math.pow(2, attempt - 1);
      logDebug(`Retrying ${operation} in ${delayMs}ms...`), await sleep3(delayMs);
    }
  }
  throw Error(`${lastError} after ${MAX_RETRIES2} attempts`);
}
async function downloadFile(fileId, config10) {
  let url3 = `${config10.baseUrl || getDefaultApiBaseUrl()}/v1/files/${fileId}/content`, headers = {
    Authorization: `Bearer ${config10.oauthToken}`,
    "anthropic-version": ANTHROPIC_VERSION,
    "anthropic-beta": FILES_API_BETA_HEADER
  };
  return logDebug(`Downloading file ${fileId} from ${url3}`), retryWithBackoff(`Download file ${fileId}`, async () => {
    try {
      let response7 = await axios_default.get(url3, {
        headers,
        responseType: "arraybuffer",
        timeout: 60000,
        validateStatus: (status) => status < 500
      });
      if (response7.status === 200)
        return logDebug(`Downloaded file ${fileId} (${response7.data.length} bytes)`), { done: !0, value: Buffer.from(response7.data) };
      if (response7.status === 404)
        throw Error(`File not found: ${fileId}`);
      if (response7.status === 401)
        throw Error("Authentication failed: invalid or missing API key");
      if (response7.status === 403)
        throw Error(`Access denied to file: ${fileId}`);
      return { done: !1, error: `status ${response7.status}` };
    } catch (error44) {
      if (!axios_default.isAxiosError(error44))
        throw error44;
      return { done: !1, error: error44.message };
    }
  });
}
function buildDownloadPath(basePath, sessionId, relativePath) {
  let normalized = path16.normalize(relativePath);
  if (normalized.startsWith(".."))
    return logDebugError(`Invalid file path: ${relativePath}. Path must not traverse above workspace`), null;
  let uploadsBase = path16.join(basePath, sessionId, "uploads"), matchedPrefix = [
    path16.join(basePath, sessionId, "uploads") + path16.sep,
    path16.sep + "uploads" + path16.sep
  ].find((p4) => normalized.startsWith(p4)), cleanPath = matchedPrefix ? normalized.slice(matchedPrefix.length) : normalized;
  return path16.join(uploadsBase, cleanPath);
}
async function downloadAndSaveFile(attachment, config10) {
  let { fileId, relativePath } = attachment, fullPath = buildDownloadPath(getCwd(), config10.sessionId, relativePath);
  if (!fullPath)
    return {
      fileId,
      path: "",
      success: !1,
      error: `Invalid file path: ${relativePath}`
    };
  try {
    let content = await downloadFile(fileId, config10), parentDir = path16.dirname(fullPath);
    return await fs16.mkdir(parentDir, { recursive: !0 }), await fs16.writeFile(fullPath, content), logDebug(`Saved file ${fileId} to ${fullPath} (${content.length} bytes)`), {
      fileId,
      path: fullPath,
      success: !0,
      bytesWritten: content.length
    };
  } catch (error44) {
    if (logDebugError(`Failed to download file ${fileId}: ${errorMessage(error44)}`), error44 instanceof Error)
      logError2(error44);
    return {
      fileId,
      path: fullPath,
      success: !1,
      error: errorMessage(error44)
    };
  }
}
async function parallelWithLimit(items, fn, concurrency) {
  let results = Array(items.length), currentIndex = 0;
  async function worker() {
    while (currentIndex < items.length) {
      let index = currentIndex++, item = items[index];
      if (item !== void 0)
        results[index] = await fn(item, index);
    }
  }
  let workers = [], workerCount = Math.min(concurrency, items.length);
  for (let i5 = 0;i5 < workerCount; i5++)
    workers.push(worker());
  return await Promise.all(workers), results;
}
async function downloadSessionFiles(files2, config10, concurrency = DEFAULT_CONCURRENCY) {
  if (files2.length === 0)
    return [];
  logDebug(`Downloading ${files2.length} file(s) for session ${config10.sessionId}`);
  let startTime = Date.now(), results = await parallelWithLimit(files2, (file2) => downloadAndSaveFile(file2, config10), concurrency), elapsedMs = Date.now() - startTime, successCount = count2(results, (r4) => r4.success);
  return logDebug(`Downloaded ${successCount}/${files2.length} file(s) in ${elapsedMs}ms`), results;
}
async function uploadFile(filePath, relativePath, config10, opts) {
  let url3 = `${config10.baseUrl || getDefaultApiBaseUrl()}/v1/files`, headers = {
    Authorization: `Bearer ${config10.oauthToken}`,
    "anthropic-version": ANTHROPIC_VERSION,
    "anthropic-beta": FILES_API_BETA_HEADER
  };
  logDebug(`Uploading file ${filePath} as ${relativePath}`);
  let content;
  try {
    content = await fs16.readFile(filePath);
  } catch (error44) {
    return logEvent("tengu_file_upload_failed", {
      error_type: "file_read"
    }), {
      path: relativePath,
      error: errorMessage(error44),
      success: !1
    };
  }
  let fileSize = content.length;
  if (fileSize > MAX_FILE_SIZE_BYTES)
    return logEvent("tengu_file_upload_failed", {
      error_type: "file_too_large"
    }), {
      path: relativePath,
      error: `File exceeds maximum size of ${MAX_FILE_SIZE_BYTES} bytes (actual: ${fileSize})`,
      success: !1
    };
  let boundary = `----FormBoundary${randomUUID11()}`, filename = path16.basename(relativePath), bodyParts = [];
  bodyParts.push(Buffer.from(`--${boundary}\r
Content-Disposition: form-data; name="file"; filename="${filename}"\r
Content-Type: application/octet-stream\r
\r
`)), bodyParts.push(content), bodyParts.push(Buffer.from(`\r
`)), bodyParts.push(Buffer.from(`--${boundary}\r
Content-Disposition: form-data; name="purpose"\r
\r
user_data\r
`)), bodyParts.push(Buffer.from(`--${boundary}--\r
`));
  let body = Buffer.concat(bodyParts);
  try {
    return await retryWithBackoff(`Upload file ${relativePath}`, async () => {
      try {
        let response7 = await axios_default.post(url3, body, {
          headers: {
            ...headers,
            "Content-Type": `multipart/form-data; boundary=${boundary}`,
            "Content-Length": body.length.toString()
          },
          timeout: 120000,
          signal: opts?.signal,
          validateStatus: (status) => status < 500
        });
        if (response7.status === 200 || response7.status === 201) {
          let fileId = response7.data?.id;
          if (!fileId)
            return {
              done: !1,
              error: "Upload succeeded but no file ID returned"
            };
          return logDebug(`Uploaded file ${filePath} -> ${fileId} (${fileSize} bytes)`), {
            done: !0,
            value: {
              path: relativePath,
              fileId,
              size: fileSize,
              success: !0
            }
          };
        }
        if (response7.status === 401)
          throw logEvent("tengu_file_upload_failed", {
            error_type: "auth"
          }), new UploadNonRetriableError("Authentication failed: invalid or missing API key");
        if (response7.status === 403)
          throw logEvent("tengu_file_upload_failed", {
            error_type: "forbidden"
          }), new UploadNonRetriableError("Access denied for upload");
        if (response7.status === 413)
          throw logEvent("tengu_file_upload_failed", {
            error_type: "size"
          }), new UploadNonRetriableError("File too large for upload");
        return { done: !1, error: `status ${response7.status}` };
      } catch (error44) {
        if (error44 instanceof UploadNonRetriableError)
          throw error44;
        if (axios_default.isCancel(error44))
          throw new UploadNonRetriableError("Upload canceled");
        if (axios_default.isAxiosError(error44))
          return { done: !1, error: error44.message };
        throw error44;
      }
    });
  } catch (error44) {
    if (error44 instanceof UploadNonRetriableError)
      return {
        path: relativePath,
        error: error44.message,
        success: !1
      };
    return logEvent("tengu_file_upload_failed", {
      error_type: "network"
    }), {
      path: relativePath,
      error: errorMessage(error44),
      success: !1
    };
  }
}
function parseFileSpecs(fileSpecs) {
  let files2 = [], expandedSpecs = fileSpecs.flatMap((s2) => s2.split(" ").filter(Boolean));
  for (let spec of expandedSpecs) {
    let colonIndex = spec.indexOf(":");
    if (colonIndex === -1)
      continue;
    let fileId = spec.substring(0, colonIndex), relativePath = spec.substring(colonIndex + 1);
    if (!fileId || !relativePath) {
      logDebugError(`Invalid file spec: ${spec}. Both file_id and path are required`);
      continue;
    }
    files2.push({ fileId, relativePath });
  }
  return files2;
}
var FILES_API_BETA_HEADER = "files-api-2025-04-14,oauth-2025-04-20", ANTHROPIC_VERSION = "2023-06-01", MAX_RETRIES2 = 3, BASE_DELAY_MS3 = 500, MAX_FILE_SIZE_BYTES = 524288000, DEFAULT_CONCURRENCY = 5, UploadNonRetriableError;
var init_filesApi = __esm(() => {
  init_axios2();
  init_cwd2();
  init_debug();
  init_errors();
  init_log3();
  UploadNonRetriableError = class UploadNonRetriableError extends Error {
    constructor(message) {
      super(message);
      this.name = "UploadNonRetriableError";
    }
  };
});
