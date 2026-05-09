// Original: src/constants/oauth.ts
function getOauthConfigType() {
  return "prod";
}
function fileSuffixForOauthConfig() {
  if (process.env.CLAUDE_CODE_CUSTOM_OAUTH_URL)
    return "-custom-oauth";
  switch (getOauthConfigType()) {
    case "local":
      return "-local-oauth";
    case "staging":
      return "-staging-oauth";
    case "prod":
      return "";
  }
}
function getOauthConfig() {
  let config2 = PROD_OAUTH_CONFIG, oauthBaseUrl = process.env.CLAUDE_CODE_CUSTOM_OAUTH_URL;
  if (oauthBaseUrl) {
    let base2 = oauthBaseUrl.replace(/\/$/, "");
    if (!ALLOWED_OAUTH_BASE_URLS.includes(base2))
      throw Error("CLAUDE_CODE_CUSTOM_OAUTH_URL is not an approved endpoint.");
    config2 = {
      ...config2,
      BASE_API_URL: base2,
      CONSOLE_AUTHORIZE_URL: `${base2}/oauth/authorize`,
      CLAUDE_AI_AUTHORIZE_URL: `${base2}/oauth/authorize`,
      CLAUDE_AI_ORIGIN: base2,
      TOKEN_URL: `${base2}/v1/oauth/token`,
      API_KEY_URL: `${base2}/api/oauth/claude_cli/create_api_key`,
      ROLES_URL: `${base2}/api/oauth/claude_cli/roles`,
      CONSOLE_SUCCESS_URL: `${base2}/oauth/code/success?app=claude-code`,
      CLAUDEAI_SUCCESS_URL: `${base2}/oauth/code/success?app=claude-code`,
      MANUAL_REDIRECT_URL: `${base2}/oauth/code/callback`,
      OAUTH_FILE_SUFFIX: "-custom-oauth"
    };
  }
  let clientIdOverride = process.env.CLAUDE_CODE_OAUTH_CLIENT_ID;
  if (clientIdOverride)
    config2 = {
      ...config2,
      CLIENT_ID: clientIdOverride
    };
  return config2;
}
var CLAUDE_AI_INFERENCE_SCOPE = "user:inference", CLAUDE_AI_PROFILE_SCOPE = "user:profile", CONSOLE_SCOPE = "org:create_api_key", OAUTH_BETA_HEADER = "oauth-2025-04-20", CONSOLE_OAUTH_SCOPES, CLAUDE_AI_OAUTH_SCOPES, ALL_OAUTH_SCOPES, PROD_OAUTH_CONFIG, MCP_CLIENT_METADATA_URL = "https://claude.ai/oauth/claude-code-client-metadata", ALLOWED_OAUTH_BASE_URLS;
var init_oauth = __esm(() => {
  CONSOLE_OAUTH_SCOPES = [
    CONSOLE_SCOPE,
    CLAUDE_AI_PROFILE_SCOPE
  ], CLAUDE_AI_OAUTH_SCOPES = [
    CLAUDE_AI_PROFILE_SCOPE,
    CLAUDE_AI_INFERENCE_SCOPE,
    "user:sessions:claude_code",
    "user:mcp_servers",
    "user:file_upload"
  ], ALL_OAUTH_SCOPES = Array.from(/* @__PURE__ */ new Set([...CONSOLE_OAUTH_SCOPES, ...CLAUDE_AI_OAUTH_SCOPES])), PROD_OAUTH_CONFIG = {
    BASE_API_URL: "https://api.anthropic.com",
    CONSOLE_AUTHORIZE_URL: "https://platform.claude.com/oauth/authorize",
    CLAUDE_AI_AUTHORIZE_URL: "https://claude.com/cai/oauth/authorize",
    CLAUDE_AI_ORIGIN: "https://claude.ai",
    TOKEN_URL: "https://platform.claude.com/v1/oauth/token",
    API_KEY_URL: "https://api.anthropic.com/api/oauth/claude_cli/create_api_key",
    ROLES_URL: "https://api.anthropic.com/api/oauth/claude_cli/roles",
    CONSOLE_SUCCESS_URL: "https://platform.claude.com/buy_credits?returnUrl=/oauth/code/success%3Fapp%3Dclaude-code",
    CLAUDEAI_SUCCESS_URL: "https://platform.claude.com/oauth/code/success?app=claude-code",
    MANUAL_REDIRECT_URL: "https://platform.claude.com/oauth/code/callback",
    CLIENT_ID: "9d1c250a-e61b-44d9-88ed-5944d1962f5e",
    OAUTH_FILE_SUFFIX: "",
    MCP_PROXY_URL: "https://mcp-proxy.anthropic.com",
    MCP_PROXY_PATH: "/v1/mcp/{server_id}"
  }, ALLOWED_OAUTH_BASE_URLS = [
    "https://beacon.claude-ai.staging.ant.dev",
    "https://claude.fedstart.com",
    "https://claude-staging.fedstart.com"
  ];
});
