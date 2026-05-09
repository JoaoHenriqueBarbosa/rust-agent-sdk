// Original: src/utils/plugins/mcpbHandler.ts
import { createHash as createHash6 } from "crypto";
import { chmod, writeFile as writeFile7 } from "fs/promises";
import { dirname as dirname23, join as join42 } from "path";
function isMcpbSource(source) {
  return source.endsWith(".mcpb") || source.endsWith(".dxt");
}
function isUrl2(source) {
  return source.startsWith("http://") || source.startsWith("https://");
}
function generateContentHash(data) {
  return createHash6("sha256").update(data).digest("hex").substring(0, 16);
}
function getMcpbCacheDir(pluginPath) {
  return join42(pluginPath, ".mcpb-cache");
}
function getMetadataPath(cacheDir, source) {
  let sourceHash = createHash6("md5").update(source).digest("hex").substring(0, 8);
  return join42(cacheDir, `${sourceHash}.metadata.json`);
}
function serverSecretsKey(pluginId, serverName) {
  return `${pluginId}/${serverName}`;
}
function loadMcpServerUserConfig(pluginId, serverName) {
  try {
    let nonSensitive = getSettings_DEPRECATED().pluginConfigs?.[pluginId]?.mcpServers?.[serverName], sensitive = getSecureStorage().read()?.pluginSecrets?.[serverSecretsKey(pluginId, serverName)];
    if (!nonSensitive && !sensitive)
      return null;
    return logForDebugging(`Loaded user config for ${pluginId}/${serverName} (settings + secureStorage)`), { ...nonSensitive, ...sensitive };
  } catch (error44) {
    let errorObj = toError(error44);
    return logError2(errorObj), logForDebugging(`Failed to load user config for ${pluginId}/${serverName}: ${error44}`, { level: "error" }), null;
  }
}
function saveMcpServerUserConfig(pluginId, serverName, config10, schema5) {
  try {
    let nonSensitive = {}, sensitive = {};
    for (let [key2, value] of Object.entries(config10))
      if (schema5[key2]?.sensitive === !0)
        sensitive[key2] = String(value);
      else
        nonSensitive[key2] = value;
    let sensitiveKeysInThisSave = new Set(Object.keys(sensitive)), nonSensitiveKeysInThisSave = new Set(Object.keys(nonSensitive)), storage = getSecureStorage(), k3 = serverSecretsKey(pluginId, serverName), existingInSecureStorage = storage.read()?.pluginSecrets?.[k3] ?? void 0, secureScrubbed = existingInSecureStorage ? Object.fromEntries(Object.entries(existingInSecureStorage).filter(([key2]) => !nonSensitiveKeysInThisSave.has(key2))) : void 0, needSecureScrub = secureScrubbed && existingInSecureStorage && Object.keys(secureScrubbed).length !== Object.keys(existingInSecureStorage).length;
    if (Object.keys(sensitive).length > 0 || needSecureScrub) {
      let existing = storage.read() ?? {};
      if (!existing.pluginSecrets)
        existing.pluginSecrets = {};
      existing.pluginSecrets[k3] = {
        ...secureScrubbed,
        ...sensitive
      };
      let result = storage.update(existing);
      if (!result.success)
        throw Error(`Failed to save sensitive config to secure storage for ${k3}`);
      if (result.warning)
        logForDebugging(`Server secrets save warning: ${result.warning}`, {
          level: "warn"
        });
      if (needSecureScrub)
        logForDebugging(`saveMcpServerUserConfig: scrubbed ${Object.keys(existingInSecureStorage).length - Object.keys(secureScrubbed).length} stale non-sensitive key(s) from secureStorage for ${k3}`);
    }
    let settings = getSettings_DEPRECATED(), existingInSettings = settings.pluginConfigs?.[pluginId]?.mcpServers?.[serverName] ?? {}, keysToScrubFromSettings = Object.keys(existingInSettings).filter((k4) => sensitiveKeysInThisSave.has(k4));
    if (Object.keys(nonSensitive).length > 0 || keysToScrubFromSettings.length > 0) {
      if (!settings.pluginConfigs)
        settings.pluginConfigs = {};
      if (!settings.pluginConfigs[pluginId])
        settings.pluginConfigs[pluginId] = {};
      if (!settings.pluginConfigs[pluginId].mcpServers)
        settings.pluginConfigs[pluginId].mcpServers = {};
      let scrubbed = Object.fromEntries(keysToScrubFromSettings.map((k4) => [k4, void 0]));
      settings.pluginConfigs[pluginId].mcpServers[serverName] = {
        ...nonSensitive,
        ...scrubbed
      };
      let result = updateSettingsForSource("userSettings", settings);
      if (result.error)
        throw result.error;
      if (keysToScrubFromSettings.length > 0)
        logForDebugging(`saveMcpServerUserConfig: scrubbed ${keysToScrubFromSettings.length} plaintext sensitive key(s) from settings.json for ${pluginId}/${serverName}`);
    }
    logForDebugging(`Saved user config for ${pluginId}/${serverName} (${Object.keys(nonSensitive).length} non-sensitive, ${Object.keys(sensitive).length} sensitive)`);
  } catch (error44) {
    let errorObj = toError(error44);
    throw logError2(errorObj), Error(`Failed to save user configuration for ${pluginId}/${serverName}: ${errorObj.message}`);
  }
}
function validateUserConfig(values3, schema5) {
  let errors8 = [];
  for (let [key2, fieldSchema] of Object.entries(schema5)) {
    let value = values3[key2];
    if (fieldSchema.required && (value === void 0 || value === "")) {
      errors8.push(`${fieldSchema.title || key2} is required but not provided`);
      continue;
    }
    if (value === void 0 || value === "")
      continue;
    if (fieldSchema.type === "string") {
      if (Array.isArray(value)) {
        if (!fieldSchema.multiple)
          errors8.push(`${fieldSchema.title || key2} must be a string, not an array`);
        else if (!value.every((v2) => typeof v2 === "string"))
          errors8.push(`${fieldSchema.title || key2} must be an array of strings`);
      } else if (typeof value !== "string")
        errors8.push(`${fieldSchema.title || key2} must be a string`);
    } else if (fieldSchema.type === "number" && typeof value !== "number")
      errors8.push(`${fieldSchema.title || key2} must be a number`);
    else if (fieldSchema.type === "boolean" && typeof value !== "boolean")
      errors8.push(`${fieldSchema.title || key2} must be a boolean`);
    else if ((fieldSchema.type === "file" || fieldSchema.type === "directory") && typeof value !== "string")
      errors8.push(`${fieldSchema.title || key2} must be a path string`);
    if (fieldSchema.type === "number" && typeof value === "number") {
      if (fieldSchema.min !== void 0 && value < fieldSchema.min)
        errors8.push(`${fieldSchema.title || key2} must be at least ${fieldSchema.min}`);
      if (fieldSchema.max !== void 0 && value > fieldSchema.max)
        errors8.push(`${fieldSchema.title || key2} must be at most ${fieldSchema.max}`);
    }
  }
  return { valid: errors8.length === 0, errors: errors8 };
}
async function generateMcpConfig(manifest, extractedPath, userConfig = {}) {
  let { getMcpConfigForManifest: getMcpConfigForManifest2 } = await Promise.resolve().then(() => (init_dist7(), exports_dist2)), mcpConfig = await getMcpConfigForManifest2({
    manifest,
    extensionPath: extractedPath,
    systemDirs: getSystemDirectories(),
    userConfig,
    pathSeparator: "/"
  });
  if (!mcpConfig) {
    let error44 = Error(`Failed to generate MCP server configuration from manifest "${manifest.name}"`);
    throw logError2(error44), error44;
  }
  return mcpConfig;
}
async function loadCacheMetadata(cacheDir, source) {
  let fs15 = getFsImplementation(), metadataPath = getMetadataPath(cacheDir, source);
  try {
    let content = await fs15.readFile(metadataPath, { encoding: "utf-8" });
    return jsonParse(content);
  } catch (error44) {
    if (getErrnoCode(error44) === "ENOENT")
      return null;
    let errorObj = toError(error44);
    return logError2(errorObj), logForDebugging(`Failed to load MCPB cache metadata: ${error44}`, {
      level: "error"
    }), null;
  }
}
async function saveCacheMetadata(cacheDir, source, metadata) {
  let metadataPath = getMetadataPath(cacheDir, source);
  await getFsImplementation().mkdir(cacheDir), await writeFile7(metadataPath, jsonStringify(metadata, null, 2), "utf-8");
}
async function downloadMcpb(url3, destPath, onProgress) {
  if (logForDebugging(`Downloading MCPB from ${url3}`), onProgress)
    onProgress(`Downloading ${url3}...`);
  let started = performance.now(), fetchTelemetryFired = !1;
  try {
    let response7 = await axios_default.get(url3, {
      timeout: 120000,
      responseType: "arraybuffer",
      maxRedirects: 5,
      onDownloadProgress: (progressEvent) => {
        if (progressEvent.total && onProgress) {
          let percent = Math.round(progressEvent.loaded / progressEvent.total * 100);
          onProgress(`Downloading... ${percent}%`);
        }
      }
    }), data = new Uint8Array(response7.data);
    if (logPluginFetch("mcpb", url3, "success", performance.now() - started), fetchTelemetryFired = !0, await writeFile7(destPath, Buffer.from(data)), logForDebugging(`Downloaded ${data.length} bytes to ${destPath}`), onProgress)
      onProgress("Download complete");
    return data;
  } catch (error44) {
    if (!fetchTelemetryFired)
      logPluginFetch("mcpb", url3, "failure", performance.now() - started, classifyFetchError(error44));
    let errorMsg = errorMessage(error44), fullError = Error(`Failed to download MCPB file from ${url3}: ${errorMsg}`);
    throw logError2(fullError), fullError;
  }
}
async function extractMcpbContents(unzipped, extractPath, modes, onProgress) {
  if (onProgress)
    onProgress("Extracting files...");
  await getFsImplementation().mkdir(extractPath);
  let filesWritten = 0, entries = Object.entries(unzipped).filter(([k3]) => !k3.endsWith("/")), totalFiles = entries.length;
  for (let [filePath, fileData] of entries) {
    let fullPath = join42(extractPath, filePath), dir = dirname23(fullPath);
    if (dir !== extractPath)
      await getFsImplementation().mkdir(dir);
    if (filePath.endsWith(".json") || filePath.endsWith(".js") || filePath.endsWith(".ts") || filePath.endsWith(".txt") || filePath.endsWith(".md") || filePath.endsWith(".yml") || filePath.endsWith(".yaml")) {
      let content = (/* @__PURE__ */ new TextDecoder()).decode(fileData);
      await writeFile7(fullPath, content, "utf-8");
    } else
      await writeFile7(fullPath, Buffer.from(fileData));
    let mode = modes[filePath];
    if (mode && mode & 73)
      await chmod(fullPath, mode & 511).catch(() => {});
    if (filesWritten++, onProgress && filesWritten % 10 === 0)
      onProgress(`Extracted ${filesWritten}/${totalFiles} files`);
  }
  if (logForDebugging(`Extracted ${filesWritten} files to ${extractPath}`), onProgress)
    onProgress(`Extraction complete (${filesWritten} files)`);
}
async function checkMcpbChanged(source, pluginPath) {
  let fs15 = getFsImplementation(), cacheDir = getMcpbCacheDir(pluginPath), metadata = await loadCacheMetadata(cacheDir, source);
  if (!metadata)
    return !0;
  try {
    await fs15.stat(metadata.extractedPath);
  } catch (error44) {
    if (getErrnoCode(error44) === "ENOENT")
      logForDebugging(`MCPB extraction path missing: ${metadata.extractedPath}`);
    else
      logForDebugging(`MCPB extraction path inaccessible: ${metadata.extractedPath}: ${error44}`, { level: "error" });
    return !0;
  }
  if (!isUrl2(source)) {
    let localPath = join42(pluginPath, source), stats;
    try {
      stats = await fs15.stat(localPath);
    } catch (error44) {
      if (getErrnoCode(error44) === "ENOENT")
        logForDebugging(`MCPB source file missing: ${localPath}`);
      else
        logForDebugging(`MCPB source file inaccessible: ${localPath}: ${error44}`, { level: "error" });
      return !0;
    }
    let cachedTime = new Date(metadata.cachedAt).getTime(), fileTime = Math.floor(stats.mtimeMs);
    if (fileTime > cachedTime)
      return logForDebugging(`MCPB file modified: ${new Date(fileTime)} > ${new Date(cachedTime)}`), !0;
  }
  return !1;
}
async function loadMcpbFile(source, pluginPath, pluginId, onProgress, providedUserConfig, forceConfigDialog) {
  let fs15 = getFsImplementation(), cacheDir = getMcpbCacheDir(pluginPath);
  await fs15.mkdir(cacheDir), logForDebugging(`Loading MCPB from source: ${source}`);
  let metadata = await loadCacheMetadata(cacheDir, source);
  if (metadata && !await checkMcpbChanged(source, pluginPath)) {
    logForDebugging(`Using cached MCPB from ${metadata.extractedPath} (hash: ${metadata.contentHash})`);
    let manifestPath = join42(metadata.extractedPath, "manifest.json"), manifestContent;
    try {
      manifestContent = await fs15.readFile(manifestPath, { encoding: "utf-8" });
    } catch (error44) {
      if (isENOENT(error44)) {
        let err2 = Error(`Cached manifest not found: ${manifestPath}`);
        throw logError2(err2), err2;
      }
      throw error44;
    }
    let manifestData2 = (/* @__PURE__ */ new TextEncoder()).encode(manifestContent), manifest2 = await parseAndValidateManifestFromBytes(manifestData2);
    if (manifest2.user_config && Object.keys(manifest2.user_config).length > 0) {
      let serverName = manifest2.name, savedConfig = loadMcpServerUserConfig(pluginId, serverName), userConfig = providedUserConfig || savedConfig || {}, validation = validateUserConfig(userConfig, manifest2.user_config);
      if (forceConfigDialog || !validation.valid)
        return {
          status: "needs-config",
          manifest: manifest2,
          extractedPath: metadata.extractedPath,
          contentHash: metadata.contentHash,
          configSchema: manifest2.user_config,
          existingConfig: savedConfig || {},
          validationErrors: validation.valid ? [] : validation.errors
        };
      if (providedUserConfig)
        saveMcpServerUserConfig(pluginId, serverName, providedUserConfig, manifest2.user_config ?? {});
      let mcpConfig3 = await generateMcpConfig(manifest2, metadata.extractedPath, userConfig);
      return {
        manifest: manifest2,
        mcpConfig: mcpConfig3,
        extractedPath: metadata.extractedPath,
        contentHash: metadata.contentHash
      };
    }
    let mcpConfig2 = await generateMcpConfig(manifest2, metadata.extractedPath);
    return {
      manifest: manifest2,
      mcpConfig: mcpConfig2,
      extractedPath: metadata.extractedPath,
      contentHash: metadata.contentHash
    };
  }
  let mcpbData, mcpbFilePath;
  if (isUrl2(source)) {
    let sourceHash = createHash6("md5").update(source).digest("hex").substring(0, 8);
    mcpbFilePath = join42(cacheDir, `${sourceHash}.mcpb`), mcpbData = await downloadMcpb(source, mcpbFilePath, onProgress);
  } else {
    let localPath = join42(pluginPath, source);
    if (onProgress)
      onProgress(`Loading ${source}...`);
    try {
      mcpbData = await fs15.readFileBytes(localPath), mcpbFilePath = localPath;
    } catch (error44) {
      if (isENOENT(error44)) {
        let err2 = Error(`MCPB file not found: ${localPath}`);
        throw logError2(err2), err2;
      }
      throw error44;
    }
  }
  let contentHash = generateContentHash(mcpbData);
  if (logForDebugging(`MCPB content hash: ${contentHash}`), onProgress)
    onProgress("Extracting MCPB archive...");
  let unzipped = await unzipFile(Buffer.from(mcpbData)), modes = parseZipModes(mcpbData), manifestData = unzipped["manifest.json"];
  if (!manifestData) {
    let error44 = Error("No manifest.json found in MCPB file");
    throw logError2(error44), error44;
  }
  let manifest = await parseAndValidateManifestFromBytes(manifestData);
  if (logForDebugging(`MCPB manifest: ${manifest.name} v${manifest.version} by ${manifest.author.name}`), !manifest.server) {
    let error44 = Error(`MCPB manifest for "${manifest.name}" does not define a server configuration`);
    throw logError2(error44), error44;
  }
  let extractPath = join42(cacheDir, contentHash);
  if (await extractMcpbContents(unzipped, extractPath, modes, onProgress), manifest.user_config && Object.keys(manifest.user_config).length > 0) {
    let serverName = manifest.name, savedConfig = loadMcpServerUserConfig(pluginId, serverName), userConfig = providedUserConfig || savedConfig || {}, validation = validateUserConfig(userConfig, manifest.user_config);
    if (!validation.valid) {
      let newMetadata3 = {
        source,
        contentHash,
        extractedPath: extractPath,
        cachedAt: (/* @__PURE__ */ new Date()).toISOString(),
        lastChecked: (/* @__PURE__ */ new Date()).toISOString()
      };
      return await saveCacheMetadata(cacheDir, source, newMetadata3), {
        status: "needs-config",
        manifest,
        extractedPath: extractPath,
        contentHash,
        configSchema: manifest.user_config,
        existingConfig: savedConfig || {},
        validationErrors: validation.errors
      };
    }
    if (providedUserConfig)
      saveMcpServerUserConfig(pluginId, serverName, providedUserConfig, manifest.user_config ?? {});
    if (onProgress)
      onProgress("Generating MCP server configuration...");
    let mcpConfig2 = await generateMcpConfig(manifest, extractPath, userConfig), newMetadata2 = {
      source,
      contentHash,
      extractedPath: extractPath,
      cachedAt: (/* @__PURE__ */ new Date()).toISOString(),
      lastChecked: (/* @__PURE__ */ new Date()).toISOString()
    };
    return await saveCacheMetadata(cacheDir, source, newMetadata2), {
      manifest,
      mcpConfig: mcpConfig2,
      extractedPath: extractPath,
      contentHash
    };
  }
  if (onProgress)
    onProgress("Generating MCP server configuration...");
  let mcpConfig = await generateMcpConfig(manifest, extractPath), newMetadata = {
    source,
    contentHash,
    extractedPath: extractPath,
    cachedAt: (/* @__PURE__ */ new Date()).toISOString(),
    lastChecked: (/* @__PURE__ */ new Date()).toISOString()
  };
  return await saveCacheMetadata(cacheDir, source, newMetadata), logForDebugging(`Successfully loaded MCPB: ${manifest.name} (extracted to ${extractPath})`), {
    manifest,
    mcpConfig,
    extractedPath: extractPath,
    contentHash
  };
}
var init_mcpbHandler = __esm(() => {
  init_axios2();
  init_debug();
  init_helpers2();
  init_zip();
  init_errors();
  init_fsOperations();
  init_log3();
  init_secureStorage();
  init_settings2();
  init_slowOperations();
  init_systemDirectories();
  init_fetchTelemetry();
});
