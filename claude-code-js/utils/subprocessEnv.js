// Original: src/utils/subprocessEnv.ts
var exports_subprocessEnv = {};
__export(exports_subprocessEnv, {
  subprocessEnv: () => subprocessEnv,
  registerUpstreamProxyEnvFn: () => registerUpstreamProxyEnvFn
});
function registerUpstreamProxyEnvFn(fn) {
  _getUpstreamProxyEnv = fn;
}
function subprocessEnv() {
  let proxyEnv = _getUpstreamProxyEnv?.() ?? {};
  if (!isEnvTruthy(process.env.CLAUDE_CODE_SUBPROCESS_ENV_SCRUB))
    return Object.keys(proxyEnv).length > 0 ? { ...process.env, ...proxyEnv } : process.env;
  let env5 = { ...process.env, ...proxyEnv };
  for (let k3 of GHA_SUBPROCESS_SCRUB)
    delete env5[k3], delete env5[`INPUT_${k3}`];
  return env5;
}
var GHA_SUBPROCESS_SCRUB, _getUpstreamProxyEnv;
var init_subprocessEnv = __esm(() => {
  init_envUtils();
  GHA_SUBPROCESS_SCRUB = [
    "ANTHROPIC_API_KEY",
    "CLAUDE_CODE_OAUTH_TOKEN",
    "ANTHROPIC_AUTH_TOKEN",
    "ANTHROPIC_FOUNDRY_API_KEY",
    "ANTHROPIC_CUSTOM_HEADERS",
    "OTEL_EXPORTER_OTLP_HEADERS",
    "OTEL_EXPORTER_OTLP_LOGS_HEADERS",
    "OTEL_EXPORTER_OTLP_METRICS_HEADERS",
    "OTEL_EXPORTER_OTLP_TRACES_HEADERS",
    "AWS_SECRET_ACCESS_KEY",
    "AWS_SESSION_TOKEN",
    "AWS_BEARER_TOKEN_BEDROCK",
    "GOOGLE_APPLICATION_CREDENTIALS",
    "AZURE_CLIENT_SECRET",
    "AZURE_CLIENT_CERTIFICATE_PATH",
    "ACTIONS_ID_TOKEN_REQUEST_TOKEN",
    "ACTIONS_ID_TOKEN_REQUEST_URL",
    "ACTIONS_RUNTIME_TOKEN",
    "ACTIONS_RUNTIME_URL",
    "ALL_INPUTS",
    "OVERRIDE_GITHUB_TOKEN",
    "DEFAULT_WORKFLOW_TOKEN",
    "SSH_SIGNING_KEY"
  ];
});
