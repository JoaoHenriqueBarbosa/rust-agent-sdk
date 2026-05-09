// Original: src/utils/hooks/execHttpHook.ts
async function getSandboxProxyConfig() {
  let { SandboxManager: SandboxManager3 } = await Promise.resolve().then(() => (init_sandbox_adapter(), exports_sandbox_adapter));
  if (!SandboxManager3.isSandboxingEnabled())
    return;
  await SandboxManager3.waitForNetworkInitialization();
  let proxyPort = SandboxManager3.getProxyPort();
  if (!proxyPort)
    return;
  return { host: "127.0.0.1", port: proxyPort, protocol: "http" };
}
function getHttpHookPolicy() {
  let settings = getInitialSettings();
  return {
    allowedUrls: settings.allowedHttpHookUrls,
    allowedEnvVars: settings.httpHookAllowedEnvVars
  };
}
function urlMatchesPattern2(url3, pattern) {
  let regexStr = pattern.replace(/[.+?^${}()|[\]\\]/g, "\\$&").replace(/\*/g, ".*");
  return new RegExp(`^${regexStr}$`).test(url3);
}
function sanitizeHeaderValue(value) {
  return value.replace(/[\r\n\x00]/g, "");
}
function interpolateEnvVars(value, allowedEnvVars) {
  let interpolated = value.replace(/\$\{([A-Z_][A-Z0-9_]*)\}|\$([A-Z_][A-Z0-9_]*)/g, (_, braced, unbraced) => {
    let varName = braced ?? unbraced;
    if (!allowedEnvVars.has(varName))
      return logForDebugging(`Hooks: env var $${varName} not in allowedEnvVars, skipping interpolation`, { level: "warn" }), "";
    return process.env[varName] ?? "";
  });
  return sanitizeHeaderValue(interpolated);
}
async function execHttpHook(hook, _hookEvent, jsonInput, signal) {
  let policy = getHttpHookPolicy();
  if (policy.allowedUrls !== void 0) {
    if (!policy.allowedUrls.some((p4) => urlMatchesPattern2(hook.url, p4))) {
      let msg = `HTTP hook blocked: ${hook.url} does not match any pattern in allowedHttpHookUrls`;
      return logForDebugging(msg, { level: "warn" }), { ok: !1, body: "", error: msg };
    }
  }
  let timeoutMs = hook.timeout ? hook.timeout * 1000 : DEFAULT_HTTP_HOOK_TIMEOUT_MS, { signal: combinedSignal, cleanup } = createCombinedAbortSignal(signal, { timeoutMs });
  try {
    let headers = {
      "Content-Type": "application/json"
    };
    if (hook.headers) {
      let hookVars = hook.allowedEnvVars ?? [], effectiveVars = policy.allowedEnvVars !== void 0 ? hookVars.filter((v2) => policy.allowedEnvVars.includes(v2)) : hookVars, allowedEnvVars = new Set(effectiveVars);
      for (let [name3, value] of Object.entries(hook.headers))
        headers[name3] = interpolateEnvVars(value, allowedEnvVars);
    }
    let sandboxProxy = await getSandboxProxyConfig(), envProxyActive = !sandboxProxy && getProxyUrl() !== void 0 && !shouldBypassProxy(hook.url);
    if (sandboxProxy)
      logForDebugging(`Hooks: HTTP hook POST to ${hook.url} (via sandbox proxy :${sandboxProxy.port})`);
    else if (envProxyActive)
      logForDebugging(`Hooks: HTTP hook POST to ${hook.url} (via env-var proxy)`);
    else
      logForDebugging(`Hooks: HTTP hook POST to ${hook.url}`);
    let response7 = await axios_default.post(hook.url, jsonInput, {
      headers,
      signal: combinedSignal,
      responseType: "text",
      validateStatus: () => !0,
      maxRedirects: 0,
      proxy: sandboxProxy ?? !1,
      lookup: sandboxProxy || envProxyActive ? void 0 : ssrfGuardedLookup
    });
    cleanup();
    let body = response7.data ?? "";
    return logForDebugging(`Hooks: HTTP hook response status ${response7.status}, body length ${body.length}`), {
      ok: response7.status >= 200 && response7.status < 300,
      statusCode: response7.status,
      body
    };
  } catch (error44) {
    if (cleanup(), combinedSignal.aborted)
      return { ok: !1, body: "", aborted: !0 };
    let errorMsg = errorMessage(error44);
    return logForDebugging(`Hooks: HTTP hook error: ${errorMsg}`, { level: "error" }), { ok: !1, body: "", error: errorMsg };
  }
}
var DEFAULT_HTTP_HOOK_TIMEOUT_MS = 600000;
var init_execHttpHook = __esm(() => {
  init_axios2();
  init_combinedAbortSignal();
  init_debug();
  init_errors();
  init_proxy();
  init_settings2();
  init_ssrfGuard();
});
