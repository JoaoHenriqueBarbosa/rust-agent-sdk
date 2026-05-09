// function: getOauthAccountInfo
function getOauthAccountInfo() {
  return isAnthropicAuthEnabled() ? getGlobalConfig().oauthAccount : void 0;
}
