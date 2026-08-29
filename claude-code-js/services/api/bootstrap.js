// Original: src/services/api/bootstrap.ts
async function fetchBootstrapAPI() {
  if (isEssentialTrafficOnly())
    return logForDebugging("[Bootstrap] Skipped: Nonessential traffic disabled"), null;
  if (getAPIProvider() !== "firstParty")
    return logForDebugging("[Bootstrap] Skipped: 3P provider"), null;
  let apiKey = getAnthropicApiKey();
  if (!(getClaudeAIOAuthTokens()?.accessToken && hasProfileScope()) && !apiKey)
    return logForDebugging("[Bootstrap] Skipped: no usable OAuth or API key"), null;
  let endpoint7 = `${getOauthConfig().BASE_API_URL}/api/claude_cli/bootstrap`;
  try {
    return await withOAuth401Retry(async () => {
      let token = getClaudeAIOAuthTokens()?.accessToken, authHeaders;
      if (token && hasProfileScope())
        authHeaders = {
          Authorization: `Bearer ${token}`,
          "anthropic-beta": OAUTH_BETA_HEADER
        };
      else if (apiKey)
        authHeaders = { "x-api-key": apiKey };
      else
        return logForDebugging("[Bootstrap] No auth available on retry, aborting"), null;
      logForDebugging("[Bootstrap] Fetching");
      let response7 = await axios_default.get(endpoint7, {
        headers: {
          "Content-Type": "application/json",
          "User-Agent": getClaudeCodeUserAgent(),
          ...authHeaders
        },
        timeout: 5000
      }), parsed = bootstrapResponseSchema().safeParse(response7.data);
      if (!parsed.success)
        return logForDebugging(`[Bootstrap] Response failed validation: ${parsed.error.message}`), null;
      return logForDebugging("[Bootstrap] Fetch ok"), parsed.data;
    });
  } catch (error44) {
    throw logForDebugging(`[Bootstrap] Fetch failed: ${axios_default.isAxiosError(error44) ? error44.response?.status ?? error44.code : "unknown"}`), error44;
  }
}
async function fetchBootstrapData() {
  try {
    let response7 = await fetchBootstrapAPI();
    if (!response7)
      return;
    let clientData = response7.client_data ?? null, additionalModelOptions = response7.additional_model_options ?? [], config11 = getGlobalConfig();
    if (isEqual_default(config11.clientDataCache, clientData) && isEqual_default(config11.additionalModelOptionsCache, additionalModelOptions)) {
      logForDebugging("[Bootstrap] Cache unchanged, skipping write");
      return;
    }
    logForDebugging("[Bootstrap] Cache updated, persisting to disk"), saveGlobalConfig((current) => ({
      ...current,
      clientDataCache: clientData,
      additionalModelOptionsCache: additionalModelOptions
    }));
  } catch (error44) {
    logError2(error44);
  }
}
var bootstrapResponseSchema;
var init_bootstrap = __esm(() => {
  init_axios2();
  init_isEqual();
  init_auth14();
  init_zod();
  init_oauth();
  init_config4();
  init_debug();
  init_http6();
  init_log3();
  init_providers();
  bootstrapResponseSchema = lazySchema(() => exports_external2.object({
    client_data: exports_external2.record(exports_external2.unknown()).nullish(),
    additional_model_options: exports_external2.array(exports_external2.object({
      model: exports_external2.string(),
      name: exports_external2.string(),
      description: exports_external2.string()
    }).transform(({ model, name: name3, description }) => ({
      value: model,
      label: name3,
      description
    }))).nullish()
  }));
});
