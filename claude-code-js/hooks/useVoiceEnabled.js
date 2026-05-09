// Original: src/hooks/useVoiceEnabled.ts
function useVoiceEnabled() {
  let userIntent = useAppState((s2) => s2.settings.voiceEnabled === !0), authVersion = useAppState((s2) => s2.authVersion), authed = import_react224.useMemo(hasVoiceAuth, [authVersion]);
  return userIntent && authed && isVoiceGrowthBookEnabled();
}
var import_react224;
var init_useVoiceEnabled = __esm(() => {
  init_AppState();
  init_voiceModeEnabled();
  import_react224 = __toESM(require_react_development(), 1);
});
