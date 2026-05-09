// Original: src/hooks/useVoiceIntegration.tsx
var exports_useVoiceIntegration = {};
__export(exports_useVoiceIntegration, {
  useVoiceKeybindingHandler: () => useVoiceKeybindingHandler,
  useVoiceIntegration: () => useVoiceIntegration,
  VoiceKeybindingHandler: () => VoiceKeybindingHandler
});
function matchesKeyboardEvent(e, target) {
  if ((e.key === "space" ? " " : e.key === "return" ? "enter" : e.key.toLowerCase()) !== target.key)
    return !1;
  if (e.ctrl !== target.ctrl)
    return !1;
  if (e.shift !== target.shift)
    return !1;
  if (e.meta !== (target.alt || target.meta))
    return !1;
  if (e.superKey !== target.super)
    return !1;
  return !0;
}
function useVoiceIntegration({
  setInputValueRaw,
  inputValueRef,
  insertTextRef
}) {
  let {
    addNotification
  } = useNotifications(), voicePrefixRef = import_react302.useRef(null), voiceSuffixRef = import_react302.useRef(""), lastSetInputRef = import_react302.useRef(null), stripTrailing = import_react302.useCallback((maxStrip, {
    char = " ",
    anchor = !1,
    floor = 0
  } = {}) => {
    let prev = inputValueRef.current, offset = insertTextRef.current?.cursorOffset ?? prev.length, beforeCursor = prev.slice(0, offset), afterCursor = prev.slice(offset), scan = char === " " ? normalizeFullWidthSpace(beforeCursor) : beforeCursor, trailing = 0;
    while (trailing < scan.length && scan[scan.length - 1 - trailing] === char)
      trailing++;
    let stripCount = Math.max(0, Math.min(trailing - floor, maxStrip)), remaining = trailing - stripCount, stripped = beforeCursor.slice(0, beforeCursor.length - stripCount), gap = "";
    if (anchor) {
      if (voicePrefixRef.current = stripped, voiceSuffixRef.current = afterCursor, afterCursor.length > 0 && !/^\s/.test(afterCursor))
        gap = " ";
    }
    let newValue = stripped + gap + afterCursor;
    if (anchor)
      lastSetInputRef.current = newValue;
    if (newValue === prev && stripCount === 0)
      return remaining;
    if (insertTextRef.current)
      insertTextRef.current.setInputWithCursor(newValue, stripped.length);
    else
      setInputValueRaw(newValue);
    return remaining;
  }, [setInputValueRaw, inputValueRef, insertTextRef]), resetAnchor = import_react302.useCallback(() => {
    let prefix = voicePrefixRef.current;
    if (prefix === null)
      return;
    let suffix = voiceSuffixRef.current;
    voicePrefixRef.current = null, voiceSuffixRef.current = "";
    let restored = prefix + suffix;
    if (insertTextRef.current)
      insertTextRef.current.setInputWithCursor(restored, prefix.length);
    else
      setInputValueRaw(restored);
  }, [setInputValueRaw, insertTextRef]), voiceEnabled = useVoiceEnabled(), voiceState = useVoiceState((s2) => s2.voiceState), voiceInterimTranscript = useVoiceState((s_0) => s_0.voiceInterimTranscript);
  import_react302.useEffect(() => {
    if (voiceState === "recording" && voicePrefixRef.current === null) {
      let input = inputValueRef.current, offset_0 = insertTextRef.current?.cursorOffset ?? input.length;
      voicePrefixRef.current = input.slice(0, offset_0), voiceSuffixRef.current = input.slice(offset_0), lastSetInputRef.current = input;
    }
    if (voiceState === "idle")
      voicePrefixRef.current = null, voiceSuffixRef.current = "", lastSetInputRef.current = null;
  }, [voiceState, inputValueRef, insertTextRef]), import_react302.useEffect(() => {
    if (voicePrefixRef.current === null)
      return;
    let prefix_0 = voicePrefixRef.current, suffix_0 = voiceSuffixRef.current;
    if (inputValueRef.current !== lastSetInputRef.current)
      return;
    let needsSpace = prefix_0.length > 0 && !/\s$/.test(prefix_0) && voiceInterimTranscript.length > 0, needsTrailingSpace = suffix_0.length > 0 && !/^\s/.test(suffix_0), leadingSpace = needsSpace ? " " : "", trailingSpace = needsTrailingSpace ? " " : "", newValue_0 = prefix_0 + leadingSpace + voiceInterimTranscript + trailingSpace + suffix_0, cursorPos = prefix_0.length + leadingSpace.length + voiceInterimTranscript.length;
    if (insertTextRef.current)
      insertTextRef.current.setInputWithCursor(newValue_0, cursorPos);
    else
      setInputValueRaw(newValue_0);
    lastSetInputRef.current = newValue_0;
  }, [voiceInterimTranscript, setInputValueRaw, inputValueRef, insertTextRef]);
  let handleVoiceTranscript = import_react302.useCallback((text2) => {
    let prefix_1 = voicePrefixRef.current;
    if (prefix_1 === null)
      return;
    let suffix_1 = voiceSuffixRef.current;
    if (inputValueRef.current !== lastSetInputRef.current)
      return;
    let needsSpace_0 = prefix_1.length > 0 && !/\s$/.test(prefix_1) && text2.length > 0, needsTrailingSpace_0 = suffix_1.length > 0 && !/^\s/.test(suffix_1) && text2.length > 0, leadingSpace_0 = needsSpace_0 ? " " : "", trailingSpace_0 = needsTrailingSpace_0 ? " " : "", newInput = prefix_1 + leadingSpace_0 + text2 + trailingSpace_0 + suffix_1, cursorPos_0 = prefix_1.length + leadingSpace_0.length + text2.length;
    if (insertTextRef.current)
      insertTextRef.current.setInputWithCursor(newInput, cursorPos_0);
    else
      setInputValueRaw(newInput);
    lastSetInputRef.current = newInput, voicePrefixRef.current = prefix_1 + leadingSpace_0 + text2;
  }, [setInputValueRaw, inputValueRef, insertTextRef]), voice2 = voiceNs.useVoice({
    onTranscript: handleVoiceTranscript,
    onError: (message) => {
      addNotification({
        key: "voice-error",
        text: message,
        color: "error",
        priority: "immediate",
        timeoutMs: 1e4
      });
    },
    enabled: voiceEnabled,
    focusMode: !1
  }), interimRange = import_react302.useMemo(() => {
    if (voicePrefixRef.current === null)
      return null;
    if (voiceInterimTranscript.length === 0)
      return null;
    let prefix_2 = voicePrefixRef.current, needsSpace_1 = prefix_2.length > 0 && !/\s$/.test(prefix_2) && voiceInterimTranscript.length > 0, start = prefix_2.length + (needsSpace_1 ? 1 : 0), end = start + voiceInterimTranscript.length;
    return {
      start,
      end
    };
  }, [voiceInterimTranscript]);
  return {
    stripTrailing,
    resetAnchor,
    handleKeyEvent: voice2.handleKeyEvent,
    interimRange
  };
}
function useVoiceKeybindingHandler({
  voiceHandleKeyEvent,
  stripTrailing,
  resetAnchor,
  isActive
}) {
  let getVoiceState = useGetVoiceState(), setVoiceState = useSetVoiceState(), keybindingContext = useOptionalKeybindingContext(), isModalOverlayActive = useIsModalOverlayActive(), voiceEnabled = useVoiceEnabled(), voiceState = useVoiceState((s2) => s2.voiceState), voiceKeystroke = import_react302.useMemo(() => {
    if (!keybindingContext)
      return DEFAULT_VOICE_KEYSTROKE;
    let result = null;
    for (let binding of keybindingContext.bindings) {
      if (binding.context !== "Chat")
        continue;
      if (binding.chord.length !== 1)
        continue;
      let ks = binding.chord[0];
      if (!ks)
        continue;
      if (binding.action === "voice:pushToTalk")
        result = ks;
      else if (result !== null && keystrokesEqual(ks, result))
        result = null;
    }
    return result;
  }, [keybindingContext]), bareChar = voiceKeystroke !== null && voiceKeystroke.key.length === 1 && !voiceKeystroke.ctrl && !voiceKeystroke.alt && !voiceKeystroke.shift && !voiceKeystroke.meta && !voiceKeystroke.super ? voiceKeystroke.key : null, rapidCountRef = import_react302.useRef(0), charsInInputRef = import_react302.useRef(0), recordingFloorRef = import_react302.useRef(0), isHoldActiveRef = import_react302.useRef(!1), resetTimerRef = import_react302.useRef(null);
  import_react302.useEffect(() => {
    if (voiceState !== "recording")
      isHoldActiveRef.current = !1, rapidCountRef.current = 0, charsInInputRef.current = 0, recordingFloorRef.current = 0, setVoiceState((prev) => {
        if (!prev.voiceWarmingUp)
          return prev;
        return {
          ...prev,
          voiceWarmingUp: !1
        };
      });
  }, [voiceState, setVoiceState]);
  let handleKeyDown = (e) => {
    if (!voiceEnabled)
      return;
    if (!isActive || isModalOverlayActive)
      return;
    if (voiceKeystroke === null)
      return;
    let repeatCount;
    if (bareChar !== null) {
      if (e.ctrl || e.meta || e.shift)
        return;
      let normalized = bareChar === " " ? normalizeFullWidthSpace(e.key) : e.key;
      if (normalized[0] !== bareChar)
        return;
      if (normalized.length > 1 && normalized !== bareChar.repeat(normalized.length))
        return;
      repeatCount = normalized.length;
    } else {
      if (!matchesKeyboardEvent(e, voiceKeystroke))
        return;
      repeatCount = 1;
    }
    let currentVoiceState = getVoiceState().voiceState;
    if (isHoldActiveRef.current && currentVoiceState !== "idle") {
      if (e.stopImmediatePropagation(), bareChar !== null)
        stripTrailing(repeatCount, {
          char: bareChar,
          floor: recordingFloorRef.current
        });
      voiceHandleKeyEvent();
      return;
    }
    if (currentVoiceState !== "idle") {
      if (bareChar === null)
        e.stopImmediatePropagation();
      return;
    }
    let countBefore = rapidCountRef.current;
    if (rapidCountRef.current += repeatCount, bareChar === null || rapidCountRef.current >= HOLD_THRESHOLD) {
      if (e.stopImmediatePropagation(), resetTimerRef.current)
        clearTimeout(resetTimerRef.current), resetTimerRef.current = null;
      if (rapidCountRef.current = 0, isHoldActiveRef.current = !0, setVoiceState((prev_0) => {
        if (!prev_0.voiceWarmingUp)
          return prev_0;
        return {
          ...prev_0,
          voiceWarmingUp: !1
        };
      }), bareChar !== null)
        recordingFloorRef.current = stripTrailing(charsInInputRef.current + repeatCount, {
          char: bareChar,
          anchor: !0
        }), charsInInputRef.current = 0, voiceHandleKeyEvent();
      else
        stripTrailing(0, {
          anchor: !0
        }), voiceHandleKeyEvent(MODIFIER_FIRST_PRESS_FALLBACK_MS);
      if (getVoiceState().voiceState === "idle")
        isHoldActiveRef.current = !1, resetAnchor();
      return;
    }
    if (countBefore >= WARMUP_THRESHOLD)
      e.stopImmediatePropagation(), stripTrailing(repeatCount, {
        char: bareChar,
        floor: charsInInputRef.current
      });
    else
      charsInInputRef.current += repeatCount;
    if (rapidCountRef.current >= WARMUP_THRESHOLD)
      setVoiceState((prev_1) => {
        if (prev_1.voiceWarmingUp)
          return prev_1;
        return {
          ...prev_1,
          voiceWarmingUp: !0
        };
      });
    if (resetTimerRef.current)
      clearTimeout(resetTimerRef.current);
    resetTimerRef.current = setTimeout((resetTimerRef_0, rapidCountRef_0, charsInInputRef_0, setVoiceState_0) => {
      resetTimerRef_0.current = null, rapidCountRef_0.current = 0, charsInInputRef_0.current = 0, setVoiceState_0((prev_2) => {
        if (!prev_2.voiceWarmingUp)
          return prev_2;
        return {
          ...prev_2,
          voiceWarmingUp: !1
        };
      });
    }, RAPID_KEY_GAP_MS, resetTimerRef, rapidCountRef, charsInInputRef, setVoiceState);
  };
  return use_input_default((_input, _key, event) => {
    let kbEvent = new KeyboardEvent(event.keypress);
    if (handleKeyDown(kbEvent), kbEvent.didStopImmediatePropagation())
      event.stopImmediatePropagation();
  }, {
    isActive
  }), {
    handleKeyDown
  };
}
function VoiceKeybindingHandler(props) {
  return useVoiceKeybindingHandler(props), null;
}
var import_react302, voiceNs, RAPID_KEY_GAP_MS = 120, MODIFIER_FIRST_PRESS_FALLBACK_MS = 2000, HOLD_THRESHOLD = 5, WARMUP_THRESHOLD = 2, DEFAULT_VOICE_KEYSTROKE;
var init_useVoiceIntegration = __esm(() => {
  init_notifications();
  init_overlayContext();
  init_voice();
  init_keyboard_event();
  init_ink2();
  init_KeybindingContext();
  init_resolver();
  init_useVoiceEnabled();
  import_react302 = __toESM(require_react_development(), 1), voiceNs = (init_useVoice(), __toCommonJS(exports_useVoice));
  DEFAULT_VOICE_KEYSTROKE = {
    key: " ",
    ctrl: !1,
    alt: !1,
    shift: !1,
    meta: !1,
    super: !1
  };
});
