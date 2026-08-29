// Original: src/hooks/useVoice.ts
var exports_useVoice = {};
__export(exports_useVoice, {
  useVoice: () => useVoice,
  normalizeLanguageForSTT: () => normalizeLanguageForSTT,
  computeLevel: () => computeLevel,
  FIRST_PRESS_FALLBACK_MS: () => FIRST_PRESS_FALLBACK_MS
});
function normalizeLanguageForSTT(language) {
  if (!language)
    return { code: DEFAULT_STT_LANGUAGE };
  let lower = language.toLowerCase().trim();
  if (!lower)
    return { code: DEFAULT_STT_LANGUAGE };
  if (SUPPORTED_LANGUAGE_CODES.has(lower))
    return { code: lower };
  let fromName = LANGUAGE_NAME_TO_CODE[lower];
  if (fromName)
    return { code: fromName };
  let base2 = lower.split("-")[0];
  if (base2 && SUPPORTED_LANGUAGE_CODES.has(base2))
    return { code: base2 };
  return { code: DEFAULT_STT_LANGUAGE, fellBackFrom: language };
}
function computeLevel(chunk2) {
  let samples = chunk2.length >> 1;
  if (samples === 0)
    return 0;
  let sumSq = 0;
  for (let i5 = 0;i5 < chunk2.length - 1; i5 += 2) {
    let sample2 = (chunk2[i5] | chunk2[i5 + 1] << 8) << 16 >> 16;
    sumSq += sample2 * sample2;
  }
  let rms = Math.sqrt(sumSq / samples), normalized = Math.min(rms / 2000, 1);
  return Math.sqrt(normalized);
}
function useVoice({
  onTranscript,
  onError,
  enabled: enabled2,
  focusMode
}) {
  let [state3, setState] = import_react193.useState("idle"), stateRef = import_react193.useRef("idle"), connectionRef = import_react193.useRef(null), accumulatedRef = import_react193.useRef(""), onTranscriptRef = import_react193.useRef(onTranscript), onErrorRef = import_react193.useRef(onError), cleanupTimerRef = import_react193.useRef(null), releaseTimerRef = import_react193.useRef(null), seenRepeatRef = import_react193.useRef(!1), repeatFallbackTimerRef = import_react193.useRef(null), focusTriggeredRef = import_react193.useRef(!1), focusSilenceTimerRef = import_react193.useRef(null), silenceTimedOutRef = import_react193.useRef(!1), recordingStartRef = import_react193.useRef(0), sessionGenRef = import_react193.useRef(0), retryUsedRef = import_react193.useRef(!1), fullAudioRef = import_react193.useRef([]), silentDropRetriedRef = import_react193.useRef(!1), attemptGenRef = import_react193.useRef(0), focusFlushedCharsRef = import_react193.useRef(0), hasAudioSignalRef = import_react193.useRef(!1), everConnectedRef = import_react193.useRef(!1), audioLevelsRef = import_react193.useRef([]), isFocused = useTerminalFocus(), setVoiceState = useSetVoiceState();
  onTranscriptRef.current = onTranscript, onErrorRef.current = onError;
  function updateState(newState) {
    stateRef.current = newState, setState(newState), setVoiceState((prev) => {
      if (prev.voiceState === newState)
        return prev;
      return { ...prev, voiceState: newState };
    });
  }
  let cleanup = import_react193.useCallback(() => {
    if (sessionGenRef.current++, cleanupTimerRef.current)
      clearTimeout(cleanupTimerRef.current), cleanupTimerRef.current = null;
    if (releaseTimerRef.current)
      clearTimeout(releaseTimerRef.current), releaseTimerRef.current = null;
    if (repeatFallbackTimerRef.current)
      clearTimeout(repeatFallbackTimerRef.current), repeatFallbackTimerRef.current = null;
    if (focusSilenceTimerRef.current)
      clearTimeout(focusSilenceTimerRef.current), focusSilenceTimerRef.current = null;
    if (silenceTimedOutRef.current = !1, voiceModule?.stopRecording(), connectionRef.current)
      connectionRef.current.close(), connectionRef.current = null;
    accumulatedRef.current = "", audioLevelsRef.current = [], fullAudioRef.current = [], setVoiceState((prev) => {
      if (prev.voiceInterimTranscript === "" && !prev.voiceAudioLevels.length)
        return prev;
      return { ...prev, voiceInterimTranscript: "", voiceAudioLevels: [] };
    });
  }, [setVoiceState]);
  function finishRecording() {
    logForDebugging("[voice] finishRecording: stopping recording, transitioning to processing"), attemptGenRef.current++;
    let focusTriggered = focusTriggeredRef.current;
    focusTriggeredRef.current = !1, updateState("processing"), voiceModule?.stopRecording();
    let recordingDurationMs = Date.now() - recordingStartRef.current, hadAudioSignal = hasAudioSignalRef.current, retried = retryUsedRef.current, focusFlushedChars = focusFlushedCharsRef.current, wsConnected = everConnectedRef.current, myGen = sessionGenRef.current, isStale = () => sessionGenRef.current !== myGen;
    logForDebugging("[voice] Recording stopped"), (connectionRef.current ? connectionRef.current.finalize() : Promise.resolve(void 0)).then(async (finalizeSource) => {
      if (isStale())
        return;
      if (finalizeSource === "no_data_timeout" && hadAudioSignal && wsConnected && !focusTriggered && focusFlushedChars === 0 && accumulatedRef.current.trim() === "" && !silentDropRetriedRef.current && fullAudioRef.current.length > 0) {
        if (silentDropRetriedRef.current = !0, logForDebugging(`[voice] Silent-drop detected (no_data_timeout, ${String(fullAudioRef.current.length)} chunks); replaying on fresh connection`), logEvent("tengu_voice_silent_drop_replay", {
          recordingDurationMs,
          chunkCount: fullAudioRef.current.length
        }), connectionRef.current)
          connectionRef.current.close(), connectionRef.current = null;
        let replayBuffer = fullAudioRef.current;
        if (await sleep3(250), isStale())
          return;
        let stt = normalizeLanguageForSTT(getInitialSettings().language), keyterms = await getVoiceKeyterms();
        if (isStale())
          return;
        if (await new Promise((resolve44) => {
          connectVoiceStream({
            onTranscript: (t2, isFinal) => {
              if (isStale())
                return;
              if (isFinal && t2.trim()) {
                if (accumulatedRef.current)
                  accumulatedRef.current += " ";
                accumulatedRef.current += t2.trim();
              }
            },
            onError: () => resolve44(),
            onClose: () => {},
            onReady: (conn) => {
              if (isStale()) {
                conn.close(), resolve44();
                return;
              }
              connectionRef.current = conn;
              let SLICE = 32000, slice = [], bytes = 0;
              for (let c3 of replayBuffer) {
                if (bytes > 0 && bytes + c3.length > SLICE)
                  conn.send(Buffer.concat(slice)), slice = [], bytes = 0;
                slice.push(c3), bytes += c3.length;
              }
              if (slice.length)
                conn.send(Buffer.concat(slice));
              conn.finalize().then(() => {
                conn.close(), resolve44();
              });
            }
          }, { language: stt.code, keyterms }).then((c3) => {
            if (!c3)
              resolve44();
          }, () => resolve44());
        }), isStale())
          return;
      }
      fullAudioRef.current = [];
      let text2 = accumulatedRef.current.trim();
      if (logForDebugging(`[voice] Final transcript assembled (${String(text2.length)} chars): "${text2.slice(0, 200)}"`), logEvent("tengu_voice_recording_completed", {
        transcriptChars: text2.length + focusFlushedChars,
        recordingDurationMs,
        hadAudioSignal,
        retried,
        silentDropRetried: silentDropRetriedRef.current,
        wsConnected,
        focusTriggered
      }), connectionRef.current)
        connectionRef.current.close(), connectionRef.current = null;
      if (text2)
        logForDebugging(`[voice] Injecting transcript (${String(text2.length)} chars)`), onTranscriptRef.current(text2);
      else if (focusFlushedChars === 0 && recordingDurationMs > 2000)
        if (!wsConnected)
          onErrorRef.current?.("Voice connection failed. Check your network and try again.");
        else if (!hadAudioSignal)
          onErrorRef.current?.("No audio detected from microphone. Check that the correct input device is selected and that Claude Code has microphone access.");
        else
          onErrorRef.current?.("No speech detected.");
      accumulatedRef.current = "", setVoiceState((prev) => {
        if (prev.voiceInterimTranscript === "")
          return prev;
        return { ...prev, voiceInterimTranscript: "" };
      }), updateState("idle");
    }).catch((err2) => {
      if (logError2(toError(err2)), !isStale())
        updateState("idle");
    });
  }
  import_react193.useEffect(() => {
    if (enabled2 && !voiceModule)
      Promise.resolve().then(() => (init_voice2(), exports_voice2)).then((mod) => {
        voiceModule = mod;
      });
  }, [enabled2]);
  function armFocusSilenceTimer() {
    if (focusSilenceTimerRef.current)
      clearTimeout(focusSilenceTimerRef.current);
    focusSilenceTimerRef.current = setTimeout((focusSilenceTimerRef2, stateRef2, focusTriggeredRef2, silenceTimedOutRef2, finishRecording2) => {
      if (focusSilenceTimerRef2.current = null, stateRef2.current === "recording" && focusTriggeredRef2.current)
        logForDebugging("[voice] Focus silence timeout \u2014 tearing down session"), silenceTimedOutRef2.current = !0, finishRecording2();
    }, FOCUS_SILENCE_TIMEOUT_MS, focusSilenceTimerRef, stateRef, focusTriggeredRef, silenceTimedOutRef, finishRecording);
  }
  import_react193.useEffect(() => {
    if (!enabled2 || !focusMode) {
      if (focusTriggeredRef.current && stateRef.current === "recording")
        logForDebugging("[voice] Focus mode disabled during recording, finishing"), finishRecording();
      return;
    }
    let cancelled = !1;
    if (isFocused && stateRef.current === "idle" && !silenceTimedOutRef.current) {
      let beginFocusRecording = () => {
        if (cancelled || stateRef.current !== "idle" || silenceTimedOutRef.current)
          return;
        logForDebugging("[voice] Focus gained, starting recording session"), focusTriggeredRef.current = !0, startRecordingSession(), armFocusSilenceTimer();
      };
      if (voiceModule)
        beginFocusRecording();
      else
        Promise.resolve().then(() => (init_voice2(), exports_voice2)).then((mod) => {
          voiceModule = mod, beginFocusRecording();
        });
    } else if (!isFocused) {
      if (silenceTimedOutRef.current = !1, stateRef.current === "recording")
        logForDebugging("[voice] Focus lost, finishing recording"), finishRecording();
    }
    return () => {
      cancelled = !0;
    };
  }, [enabled2, focusMode, isFocused]);
  async function startRecordingSession() {
    if (!voiceModule) {
      onErrorRef.current?.("Voice module not loaded yet. Try again in a moment.");
      return;
    }
    updateState("recording"), recordingStartRef.current = Date.now(), accumulatedRef.current = "", seenRepeatRef.current = !1, hasAudioSignalRef.current = !1, retryUsedRef.current = !1, silentDropRetriedRef.current = !1, fullAudioRef.current = [], focusFlushedCharsRef.current = 0, everConnectedRef.current = !1;
    let myGen = ++sessionGenRef.current, availability = await voiceModule.checkRecordingAvailability();
    if (!availability.available) {
      logForDebugging(`[voice] Recording not available: ${availability.reason ?? "unknown"}`), onErrorRef.current?.(availability.reason ?? "Audio recording is not available."), cleanup(), updateState("idle");
      return;
    }
    logForDebugging("[voice] Starting recording session, connecting voice stream"), setVoiceState((prev) => {
      if (!prev.voiceError)
        return prev;
      return { ...prev, voiceError: null };
    });
    let audioBuffer = [];
    if (logForDebugging("[voice] startRecording: buffering audio while WebSocket connects"), audioLevelsRef.current = [], !await voiceModule.startRecording((chunk2) => {
      let owned = Buffer.from(chunk2);
      if (!focusTriggeredRef.current)
        fullAudioRef.current.push(owned);
      if (connectionRef.current)
        connectionRef.current.send(owned);
      else
        audioBuffer.push(owned);
      let level = computeLevel(chunk2);
      if (!hasAudioSignalRef.current && level > 0.01)
        hasAudioSignalRef.current = !0;
      let levels = audioLevelsRef.current;
      if (levels.length >= AUDIO_LEVEL_BARS)
        levels.shift();
      levels.push(level);
      let snapshot2 = [...levels];
      audioLevelsRef.current = snapshot2, setVoiceState((prev) => ({ ...prev, voiceAudioLevels: snapshot2 }));
    }, () => {
      if (stateRef.current === "recording")
        finishRecording();
    }, { silenceDetection: !1 })) {
      logError2(Error("[voice] Recording failed \u2014 no audio tool found")), onErrorRef.current?.("Failed to start audio capture. Check that your microphone is accessible."), cleanup(), updateState("idle"), setVoiceState((prev) => ({
        ...prev,
        voiceError: "Recording failed \u2014 no audio tool found"
      }));
      return;
    }
    let rawLanguage = getInitialSettings().language, stt = normalizeLanguageForSTT(rawLanguage);
    logEvent("tengu_voice_recording_started", {
      focusTriggered: focusTriggeredRef.current,
      sttLanguage: stt.code,
      sttLanguageIsDefault: !rawLanguage?.trim(),
      sttLanguageFellBack: stt.fellBackFrom !== void 0,
      systemLocaleLanguage: getSystemLocaleLanguage()
    });
    let sawTranscript = !1, isStale = () => sessionGenRef.current !== myGen, attemptConnect = (keyterms) => {
      let myAttemptGen = attemptGenRef.current;
      connectVoiceStream({
        onTranscript: (text2, isFinal) => {
          if (isStale())
            return;
          if (sawTranscript = !0, logForDebugging(`[voice] onTranscript: isFinal=${String(isFinal)} text="${text2}"`), isFinal && text2.trim())
            if (focusTriggeredRef.current)
              logForDebugging(`[voice] Focus mode: flushing final transcript immediately: "${text2.trim()}"`), onTranscriptRef.current(text2.trim()), focusFlushedCharsRef.current += text2.trim().length, setVoiceState((prev) => {
                if (prev.voiceInterimTranscript === "")
                  return prev;
                return { ...prev, voiceInterimTranscript: "" };
              }), accumulatedRef.current = "", armFocusSilenceTimer();
            else {
              if (accumulatedRef.current)
                accumulatedRef.current += " ";
              accumulatedRef.current += text2.trim(), logForDebugging(`[voice] Accumulated final transcript: "${accumulatedRef.current}"`), setVoiceState((prev) => {
                let preview = accumulatedRef.current;
                if (prev.voiceInterimTranscript === preview)
                  return prev;
                return { ...prev, voiceInterimTranscript: preview };
              });
            }
          else if (!isFinal) {
            if (focusTriggeredRef.current)
              armFocusSilenceTimer();
            let interim = text2.trim(), preview = accumulatedRef.current ? accumulatedRef.current + (interim ? " " + interim : "") : interim;
            setVoiceState((prev) => {
              if (prev.voiceInterimTranscript === preview)
                return prev;
              return { ...prev, voiceInterimTranscript: preview };
            });
          }
        },
        onError: (error44, opts) => {
          if (isStale()) {
            logForDebugging(`[voice] ignoring onError from stale session: ${error44}`);
            return;
          }
          if (attemptGenRef.current !== myAttemptGen) {
            logForDebugging(`[voice] ignoring stale onError from superseded attempt: ${error44}`);
            return;
          }
          if (!opts?.fatal && !sawTranscript && stateRef.current === "recording") {
            if (!retryUsedRef.current) {
              retryUsedRef.current = !0, logForDebugging(`[voice] early voice_stream error (pre-transcript), retrying once: ${error44}`), logEvent("tengu_voice_stream_early_retry", {}), connectionRef.current = null, attemptGenRef.current++, setTimeout((stateRef2, attemptConnect2, keyterms2) => {
                if (stateRef2.current === "recording")
                  attemptConnect2(keyterms2);
              }, 250, stateRef, attemptConnect, keyterms);
              return;
            }
          }
          attemptGenRef.current++, logError2(Error(`[voice] voice_stream error: ${error44}`)), onErrorRef.current?.(`Voice stream error: ${error44}`), audioBuffer.length = 0, focusTriggeredRef.current = !1, cleanup(), updateState("idle");
        },
        onClose: () => {},
        onReady: (conn) => {
          if (isStale() || stateRef.current !== "recording") {
            conn.close();
            return;
          }
          connectionRef.current = conn, everConnectedRef.current = !0;
          let SLICE_TARGET_BYTES = 32000;
          if (audioBuffer.length > 0) {
            let totalBytes = 0;
            for (let c3 of audioBuffer)
              totalBytes += c3.length;
            let slices = [[]], sliceBytes2 = 0;
            for (let chunk2 of audioBuffer) {
              if (sliceBytes2 > 0 && sliceBytes2 + chunk2.length > SLICE_TARGET_BYTES)
                slices.push([]), sliceBytes2 = 0;
              slices[slices.length - 1].push(chunk2), sliceBytes2 += chunk2.length;
            }
            logForDebugging(`[voice] onReady: flushing ${String(audioBuffer.length)} buffered chunks (${String(totalBytes)} bytes) as ${String(slices.length)} coalesced frame(s)`);
            for (let slice of slices)
              conn.send(Buffer.concat(slice));
          }
          if (audioBuffer.length = 0, releaseTimerRef.current)
            clearTimeout(releaseTimerRef.current);
          if (seenRepeatRef.current)
            releaseTimerRef.current = setTimeout((releaseTimerRef2, stateRef2, finishRecording2) => {
              if (releaseTimerRef2.current = null, stateRef2.current === "recording")
                finishRecording2();
            }, RELEASE_TIMEOUT_MS, releaseTimerRef, stateRef, finishRecording);
        }
      }, {
        language: stt.code,
        keyterms
      }).then((conn) => {
        if (isStale()) {
          conn?.close();
          return;
        }
        if (!conn) {
          logForDebugging("[voice] Failed to connect to voice_stream (no OAuth token?)"), onErrorRef.current?.("Voice mode requires a Claude.ai account. Please run /login to sign in."), audioBuffer.length = 0, cleanup(), updateState("idle");
          return;
        }
        if (stateRef.current !== "recording") {
          audioBuffer.length = 0, conn.close();
          return;
        }
      });
    };
    getVoiceKeyterms().then(attemptConnect);
  }
  let handleKeyEvent = import_react193.useCallback((fallbackMs = REPEAT_FALLBACK_MS) => {
    if (!enabled2 || !isVoiceStreamAvailable())
      return;
    if (focusTriggeredRef.current)
      return;
    if (focusMode && silenceTimedOutRef.current) {
      logForDebugging("[voice] Re-arming focus recording after silence timeout"), silenceTimedOutRef.current = !1, focusTriggeredRef.current = !0, startRecordingSession(), armFocusSilenceTimer();
      return;
    }
    let currentState = stateRef.current;
    if (currentState === "processing")
      return;
    if (currentState === "idle")
      logForDebugging("[voice] handleKeyEvent: idle, starting recording session immediately"), startRecordingSession(), repeatFallbackTimerRef.current = setTimeout((repeatFallbackTimerRef2, stateRef2, seenRepeatRef2, releaseTimerRef2, finishRecording2) => {
        if (repeatFallbackTimerRef2.current = null, stateRef2.current === "recording" && !seenRepeatRef2.current)
          logForDebugging("[voice] No auto-repeat seen, arming release timer via fallback"), seenRepeatRef2.current = !0, releaseTimerRef2.current = setTimeout((releaseTimerRef3, stateRef3, finishRecording3) => {
            if (releaseTimerRef3.current = null, stateRef3.current === "recording")
              finishRecording3();
          }, RELEASE_TIMEOUT_MS, releaseTimerRef2, stateRef2, finishRecording2);
      }, fallbackMs, repeatFallbackTimerRef, stateRef, seenRepeatRef, releaseTimerRef, finishRecording);
    else if (currentState === "recording") {
      if (seenRepeatRef.current = !0, repeatFallbackTimerRef.current)
        clearTimeout(repeatFallbackTimerRef.current), repeatFallbackTimerRef.current = null;
    }
    if (releaseTimerRef.current)
      clearTimeout(releaseTimerRef.current);
    if (stateRef.current === "recording" && seenRepeatRef.current)
      releaseTimerRef.current = setTimeout((releaseTimerRef2, stateRef2, finishRecording2) => {
        if (releaseTimerRef2.current = null, stateRef2.current === "recording")
          finishRecording2();
      }, RELEASE_TIMEOUT_MS, releaseTimerRef, stateRef, finishRecording);
  }, [enabled2, focusMode, cleanup]);
  return import_react193.useEffect(() => {
    if (!enabled2 && stateRef.current !== "idle")
      cleanup(), updateState("idle");
    return () => {
      cleanup();
    };
  }, [enabled2, cleanup]), {
    state: state3,
    handleKeyEvent
  };
}
var import_react193, DEFAULT_STT_LANGUAGE = "en", LANGUAGE_NAME_TO_CODE, SUPPORTED_LANGUAGE_CODES, voiceModule = null, RELEASE_TIMEOUT_MS = 200, REPEAT_FALLBACK_MS = 600, FIRST_PRESS_FALLBACK_MS = 2000, FOCUS_SILENCE_TIMEOUT_MS = 5000, AUDIO_LEVEL_BARS = 16;
var init_useVoice = __esm(() => {
  init_voice();
  init_use_terminal_focus();
  init_voiceKeyterms();
  init_voiceStreamSTT();
  init_debug();
  init_errors();
  init_intl();
  init_log3();
  init_settings2();
  import_react193 = __toESM(require_react_development(), 1), LANGUAGE_NAME_TO_CODE = {
    english: "en",
    spanish: "es",
    espa\u{f1}ol: "es",
    espanol: "es",
    french: "fr",
    fran\u{e7}ais: "fr",
    francais: "fr",
    japanese: "ja",
    \u{65e5}\u{672c}\u{8a9e}: "ja",
    german: "de",
    deutsch: "de",
    portuguese: "pt",
    portugu\u{ea}s: "pt",
    portugues: "pt",
    italian: "it",
    italiano: "it",
    korean: "ko",
    \u{d55c}\u{ad6d}\u{c5b4}: "ko",
    hindi: "hi",
    \u{939}\u{93f}\u{928}\u{94d}\u{926}\u{940}: "hi",
    \u{939}\u{93f}\u{902}\u{926}\u{940}: "hi",
    indonesian: "id",
    "bahasa indonesia": "id",
    bahasa: "id",
    russian: "ru",
    \u{440}\u{443}\u{441}\u{441}\u{43a}\u{438}\u{439}: "ru",
    polish: "pl",
    polski: "pl",
    turkish: "tr",
    t\u{fc}rk\u{e7}e: "tr",
    turkce: "tr",
    dutch: "nl",
    nederlands: "nl",
    ukrainian: "uk",
    \u{443}\u{43a}\u{440}\u{430}\u{457}\u{43d}\u{441}\u{44c}\u{43a}\u{430}: "uk",
    greek: "el",
    \u{3b5}\u{3bb}\u{3bb}\u{3b7}\u{3bd}\u{3b9}\u{3ba}\u{3ac}: "el",
    czech: "cs",
    \u{10d}e\u{161}tina: "cs",
    cestina: "cs",
    danish: "da",
    dansk: "da",
    swedish: "sv",
    svenska: "sv",
    norwegian: "no",
    norsk: "no"
  }, SUPPORTED_LANGUAGE_CODES = /* @__PURE__ */ new Set([
    "en",
    "es",
    "fr",
    "ja",
    "de",
    "pt",
    "it",
    "ko",
    "hi",
    "id",
    "ru",
    "pl",
    "tr",
    "nl",
    "uk",
    "el",
    "cs",
    "da",
    "sv",
    "no"
  ]);
});
