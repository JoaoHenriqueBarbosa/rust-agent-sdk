// Original: src/commands/voice/index.ts
var exports_voice4 = {};
__export(exports_voice4, {
  default: () => voice_default
});
var voice, voice_default;
var init_voice4 = __esm(() => {
  init_voiceModeEnabled();
  voice = {
    type: "local",
    name: "voice",
    description: "Toggle voice mode",
    availability: void 0,
    isEnabled: () => isVoiceGrowthBookEnabled(),
    isHidden: !1,
    supportsNonInteractive: !1,
    load: () => Promise.resolve().then(() => (init_voice3(), exports_voice3))
  }, voice_default = voice;
});
