// Original: src/voice/voiceModeEnabled.ts
function isVoiceGrowthBookEnabled() {
  return !0;
}
function hasVoiceAuth() {
  if (!isAnthropicAuthEnabled())
    return !1;
  let tokens = getClaudeAIOAuthTokens();
  return Boolean(tokens?.accessToken);
}
function isVoiceModeEnabled() {
  return hasVoiceAuth() && isVoiceGrowthBookEnabled();
}
var init_voiceModeEnabled = __esm(() => {
  init_auth14();
});
