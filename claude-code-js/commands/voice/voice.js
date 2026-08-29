// Original: src/commands/voice/voice.ts
var exports_voice3 = {};
__export(exports_voice3, {
  call: () => call68
});
var LANG_HINT_MAX_SHOWS = 2, call68 = async () => {
  if (!isVoiceModeEnabled()) {
    if (!isAnthropicAuthEnabled())
      return {
        type: "text",
        value: "Voice mode requires a Claude.ai account. Please run /login to sign in."
      };
    return {
      type: "text",
      value: "Voice mode is not available."
    };
  }
  let currentSettings = getInitialSettings();
  if (currentSettings.voiceEnabled === !0) {
    if (updateSettingsForSource("userSettings", {
      voiceEnabled: !1
    }).error)
      return {
        type: "text",
        value: "Failed to update settings. Check your settings file for syntax errors."
      };
    return settingsChangeDetector.notifyChange("userSettings"), logEvent("tengu_voice_toggled", { enabled: !1 }), {
      type: "text",
      value: "Voice mode disabled."
    };
  }
  let { isVoiceStreamAvailable: isVoiceStreamAvailable2 } = await Promise.resolve().then(() => (init_voiceStreamSTT(), exports_voiceStreamSTT)), { checkRecordingAvailability: checkRecordingAvailability2 } = await Promise.resolve().then(() => (init_voice2(), exports_voice2)), recording = await checkRecordingAvailability2();
  if (!recording.available)
    return {
      type: "text",
      value: recording.reason ?? "Voice mode is not available in this environment."
    };
  if (!isVoiceStreamAvailable2())
    return {
      type: "text",
      value: "Voice mode requires a Claude.ai account. Please run /login to sign in."
    };
  let { checkVoiceDependencies: checkVoiceDependencies2, requestMicrophonePermission: requestMicrophonePermission2 } = await Promise.resolve().then(() => (init_voice2(), exports_voice2)), deps = await checkVoiceDependencies2();
  if (!deps.available)
    return {
      type: "text",
      value: `No audio recording tool found.${deps.installCommand ? `
Install audio recording tools? Run: ${deps.installCommand}` : `
Install SoX manually for audio recording.`}`
    };
  if (!await requestMicrophonePermission2()) {
    let guidance;
    if (process.platform === "win32")
      guidance = "Settings \u2192 Privacy \u2192 Microphone";
    else if (process.platform === "linux")
      guidance = "your system's audio settings";
    else
      guidance = "System Settings \u2192 Privacy & Security \u2192 Microphone";
    return {
      type: "text",
      value: `Microphone access is denied. To enable it, go to ${guidance}, then run /voice again.`
    };
  }
  if (updateSettingsForSource("userSettings", { voiceEnabled: !0 }).error)
    return {
      type: "text",
      value: "Failed to update settings. Check your settings file for syntax errors."
    };
  settingsChangeDetector.notifyChange("userSettings"), logEvent("tengu_voice_toggled", { enabled: !0 });
  let key3 = getShortcutDisplay("voice:pushToTalk", "Chat", "Space"), stt = normalizeLanguageForSTT(currentSettings.language), cfg = getGlobalConfig(), langChanged = cfg.voiceLangHintLastLanguage !== stt.code, priorCount = langChanged ? 0 : cfg.voiceLangHintShownCount ?? 0, showHint = !stt.fellBackFrom && priorCount < LANG_HINT_MAX_SHOWS, langNote = "";
  if (stt.fellBackFrom)
    langNote = ` Note: "${stt.fellBackFrom}" is not a supported dictation language; using English. Change it via /config.`;
  else if (showHint)
    langNote = ` Dictation language: ${stt.code} (/config to change).`;
  if (langChanged || showHint)
    saveGlobalConfig((prev) => ({
      ...prev,
      voiceLangHintShownCount: priorCount + (showHint ? 1 : 0),
      voiceLangHintLastLanguage: stt.code
    }));
  return {
    type: "text",
    value: `Voice mode enabled. Hold ${key3} to record.${langNote}`
  };
};
var init_voice3 = __esm(() => {
  init_useVoice();
  init_shortcutFormat();
  init_auth14();
  init_config4();
  init_changeDetector();
  init_settings2();
  init_voiceModeEnabled();
});
