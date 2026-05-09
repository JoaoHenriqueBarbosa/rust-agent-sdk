// function: cacheMarketplaceFromUrl
async function cacheMarketplaceFromUrl(url3, cachePath, customHeaders, onProgress) {
  let fs17 = getFsImplementation(), redactedUrl = redactUrlCredentials(url3);
  if (safeCallProgress(onProgress, `Downloading marketplace from ${redactedUrl}`), logForDebugging(`Downloading marketplace from URL: ${redactedUrl}`), customHeaders && Object.keys(customHeaders).length > 0)
    logForDebugging(`Using custom headers: ${jsonStringify(redactHeaders(customHeaders))}`);
  let headers = {
    ...customHeaders,
    "User-Agent": "Claude-Code-Plugin-Manager"
  }, response7, fetchStarted = performance.now();
  try {
    response7 = await axios_default.get(url3, {
      timeout: 1e4,
      headers
    });
  } catch (error44) {
    if (logPluginFetch("marketplace_url", url3, "failure", performance.now() - fetchStarted, classifyFetchError(error44)), axios_default.isAxiosError(error44)) {
      if (error44.code === "ECONNREFUSED" || error44.code === "ENOTFOUND")
        throw Error(`Could not connect to ${redactedUrl}. Please check your internet connection and verify the URL is correct.

Technical details: ${error44.message}`);
      if (error44.code === "ETIMEDOUT")
        throw Error(`Request timed out while downloading marketplace from ${redactedUrl}. The server may be slow or unreachable.

Technical details: ${error44.message}`);
      if (error44.response)
        throw Error(`HTTP ${error44.response.status} error while downloading marketplace from ${redactedUrl}. The marketplace file may not exist at this URL.

Technical details: ${error44.message}`);
    }
    throw Error(`Failed to download marketplace from ${redactedUrl}: ${errorMessage(error44)}`);
  }
  safeCallProgress(onProgress, "Validating marketplace data");
  let result = PluginMarketplaceSchema().safeParse(response7.data);
  if (!result.success)
    throw logPluginFetch("marketplace_url", url3, "failure", performance.now() - fetchStarted, "invalid_schema"), new ConfigParseError(`Invalid marketplace schema from URL: ${result.error.issues.map((e) => `${e.path.join(".")}: ${e.message}`).join(", ")}`, redactedUrl, response7.data);
  logPluginFetch("marketplace_url", url3, "success", performance.now() - fetchStarted), safeCallProgress(onProgress, "Saving marketplace to cache");
  let cacheDir = join97(cachePath, "..");
  await fs17.mkdir(cacheDir), writeFileSync_DEPRECATED(cachePath, jsonStringify(result.data, null, 2), {
    encoding: "utf-8",
    flush: !0
  });
}
