// Original: src/components/Spinner/SpinnerAnimationRow.tsx
function SpinnerAnimationRow({
  mode,
  reducedMotion,
  hasActiveTools,
  responseLengthRef,
  message,
  messageColor,
  shimmerColor,
  overrideColor,
  loadingStartTimeRef,
  totalPausedMsRef,
  pauseStartTimeRef,
  spinnerSuffix,
  verbose,
  columns,
  hasRunningTeammates,
  teammateTokens,
  foregroundedTeammate,
  leaderIsIdle = !1,
  thinkingStatus,
  effortSuffix
}) {
  let [viewportRef, time3] = useAnimationFrame(reducedMotion ? null : 50), now2 = Date.now(), elapsedTimeMs = pauseStartTimeRef.current !== null ? pauseStartTimeRef.current - loadingStartTimeRef.current - totalPausedMsRef.current : now2 - loadingStartTimeRef.current - totalPausedMsRef.current, derivedStart = now2 - elapsedTimeMs, turnStartRef = import_react54.useRef(derivedStart);
  if (!hasRunningTeammates || derivedStart < turnStartRef.current)
    turnStartRef.current = derivedStart;
  let currentResponseLength = responseLengthRef.current, {
    isStalled,
    stalledIntensity
  } = useStalledAnimation(time3, currentResponseLength, hasActiveTools || leaderIsIdle, reducedMotion), frame = reducedMotion ? 0 : Math.floor(time3 / 120), glimmerSpeed = mode === "requesting" ? 50 : 200, glimmerMessageWidth = import_react54.useMemo(() => stringWidth(message), [message]), cycleLength = glimmerMessageWidth + 20, cyclePosition = Math.floor(time3 / glimmerSpeed), glimmerIndex = reducedMotion ? -100 : isStalled ? -100 : mode === "requesting" ? cyclePosition % cycleLength - 10 : glimmerMessageWidth + 10 - cyclePosition % cycleLength, flashOpacity = reducedMotion ? 0 : mode === "tool-use" ? (Math.sin(time3 / 1000 * Math.PI) + 1) / 2 : 0, tokenCounterRef = import_react54.useRef(currentResponseLength);
  if (reducedMotion)
    tokenCounterRef.current = currentResponseLength;
  else {
    let gap = currentResponseLength - tokenCounterRef.current;
    if (gap > 0) {
      let increment3;
      if (gap < 70)
        increment3 = 3;
      else if (gap < 200)
        increment3 = Math.max(8, Math.ceil(gap * 0.15));
      else
        increment3 = 50;
      tokenCounterRef.current = Math.min(tokenCounterRef.current + increment3, currentResponseLength);
    }
  }
  let displayedResponseLength = tokenCounterRef.current, leaderTokens = Math.round(displayedResponseLength / 4), effectiveElapsedMs = hasRunningTeammates ? Math.max(elapsedTimeMs, now2 - turnStartRef.current) : elapsedTimeMs, timerText = formatDuration(effectiveElapsedMs), timerWidth = stringWidth(timerText), totalTokens = foregroundedTeammate && !foregroundedTeammate.isIdle ? foregroundedTeammate.progress?.tokenCount ?? 0 : leaderTokens + teammateTokens, tokenCount = formatNumber(totalTokens), tokensText = hasRunningTeammates ? `${tokenCount} tokens` : `${figures_default.arrowDown} ${tokenCount} tokens`, tokensWidth = stringWidth(tokensText), thinkingText = thinkingStatus === "thinking" ? `thinking${effortSuffix}` : typeof thinkingStatus === "number" ? `thought for ${Math.max(1, Math.round(thinkingStatus / 1000))}s` : null, thinkingWidthValue = thinkingText ? stringWidth(thinkingText) : 0, messageWidth = glimmerMessageWidth + 2, sep13 = SEP_WIDTH, wantsThinking = thinkingStatus !== null, wantsTimerAndTokens = verbose || hasRunningTeammates || effectiveElapsedMs > SHOW_TOKENS_AFTER_MS, availableSpace = columns - messageWidth - 5, showThinking = wantsThinking && availableSpace > thinkingWidthValue;
  if (!showThinking && wantsThinking && thinkingStatus === "thinking" && effortSuffix) {
    if (availableSpace > THINKING_BARE_WIDTH)
      thinkingText = "thinking", thinkingWidthValue = THINKING_BARE_WIDTH, showThinking = !0;
  }
  let usedAfterThinking = showThinking ? thinkingWidthValue + sep13 : 0, showTimer = wantsTimerAndTokens && availableSpace > usedAfterThinking + timerWidth, usedAfterTimer = usedAfterThinking + (showTimer ? timerWidth + sep13 : 0), showTokens = wantsTimerAndTokens && totalTokens > 0 && availableSpace > usedAfterTimer + tokensWidth, thinkingOnly = showThinking && thinkingStatus === "thinking" && !spinnerSuffix && !showTimer && !showTokens && !0, thinkingElapsedSec = (time3 - THINKING_DELAY_MS) / 1000, thinkingOpacity = time3 < THINKING_DELAY_MS ? 0 : (Math.sin(thinkingElapsedSec * Math.PI * 2 / THINKING_GLOW_PERIOD_S) + 1) / 2, thinkingShimmerColor = toRGBColor(interpolateColor(THINKING_INACTIVE, THINKING_INACTIVE_SHIMMER, thinkingOpacity)), parts = [...spinnerSuffix ? [/* @__PURE__ */ jsx_dev_runtime67.jsxDEV(ThemedText, {
    dimColor: !0,
    children: spinnerSuffix
  }, "suffix", !1, void 0, this)] : [], ...showTimer ? [/* @__PURE__ */ jsx_dev_runtime67.jsxDEV(ThemedText, {
    dimColor: !0,
    children: timerText
  }, "elapsedTime", !1, void 0, this)] : [], ...showTokens ? [/* @__PURE__ */ jsx_dev_runtime67.jsxDEV(ThemedBox_default, {
    flexDirection: "row",
    children: [
      !hasRunningTeammates && /* @__PURE__ */ jsx_dev_runtime67.jsxDEV(SpinnerModeGlyph, {
        mode
      }, void 0, !1, void 0, this),
      /* @__PURE__ */ jsx_dev_runtime67.jsxDEV(ThemedText, {
        dimColor: !0,
        children: [
          tokenCount,
          " tokens"
        ]
      }, void 0, !0, void 0, this)
    ]
  }, "tokens", !0, void 0, this)] : [], ...showThinking && thinkingText ? [thinkingStatus === "thinking" && !reducedMotion ? /* @__PURE__ */ jsx_dev_runtime67.jsxDEV(ThemedText, {
    color: thinkingShimmerColor,
    children: thinkingOnly ? `(${thinkingText})` : thinkingText
  }, "thinking", !1, void 0, this) : /* @__PURE__ */ jsx_dev_runtime67.jsxDEV(ThemedText, {
    dimColor: !0,
    children: thinkingText
  }, "thinking", !1, void 0, this)] : []], status = foregroundedTeammate && !foregroundedTeammate.isIdle ? /* @__PURE__ */ jsx_dev_runtime67.jsxDEV(jsx_dev_runtime67.Fragment, {
    children: [
      /* @__PURE__ */ jsx_dev_runtime67.jsxDEV(ThemedText, {
        dimColor: !0,
        children: "(esc to interrupt "
      }, void 0, !1, void 0, this),
      /* @__PURE__ */ jsx_dev_runtime67.jsxDEV(ThemedText, {
        color: toInkColor(foregroundedTeammate.identity.color),
        children: foregroundedTeammate.identity.agentName
      }, void 0, !1, void 0, this),
      /* @__PURE__ */ jsx_dev_runtime67.jsxDEV(ThemedText, {
        dimColor: !0,
        children: ")"
      }, void 0, !1, void 0, this)
    ]
  }, void 0, !0, void 0, this) : !foregroundedTeammate && parts.length > 0 ? thinkingOnly ? /* @__PURE__ */ jsx_dev_runtime67.jsxDEV(Byline, {
    children: parts
  }, void 0, !1, void 0, this) : /* @__PURE__ */ jsx_dev_runtime67.jsxDEV(jsx_dev_runtime67.Fragment, {
    children: [
      /* @__PURE__ */ jsx_dev_runtime67.jsxDEV(ThemedText, {
        dimColor: !0,
        children: "("
      }, void 0, !1, void 0, this),
      /* @__PURE__ */ jsx_dev_runtime67.jsxDEV(Byline, {
        children: parts
      }, void 0, !1, void 0, this),
      /* @__PURE__ */ jsx_dev_runtime67.jsxDEV(ThemedText, {
        dimColor: !0,
        children: ")"
      }, void 0, !1, void 0, this)
    ]
  }, void 0, !0, void 0, this) : null;
  return /* @__PURE__ */ jsx_dev_runtime67.jsxDEV(ThemedBox_default, {
    ref: viewportRef,
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: 1,
    width: "100%",
    children: [
      /* @__PURE__ */ jsx_dev_runtime67.jsxDEV(SpinnerGlyph, {
        frame,
        messageColor,
        stalledIntensity: overrideColor ? 0 : stalledIntensity,
        reducedMotion,
        time: time3
      }, void 0, !1, void 0, this),
      /* @__PURE__ */ jsx_dev_runtime67.jsxDEV(GlimmerMessage, {
        message,
        mode,
        messageColor,
        glimmerIndex,
        flashOpacity,
        shimmerColor,
        stalledIntensity: overrideColor ? 0 : stalledIntensity
      }, void 0, !1, void 0, this),
      status
    ]
  }, void 0, !0, void 0, this);
}
function SpinnerModeGlyph(t0) {
  let $3 = import_compiler_runtime59.c(2), {
    mode
  } = t0;
  switch (mode) {
    case "tool-input":
    case "tool-use":
    case "responding":
    case "thinking": {
      let t1;
      if ($3[0] === Symbol.for("react.memo_cache_sentinel"))
        t1 = /* @__PURE__ */ jsx_dev_runtime67.jsxDEV(ThemedBox_default, {
          width: 2,
          children: /* @__PURE__ */ jsx_dev_runtime67.jsxDEV(ThemedText, {
            dimColor: !0,
            children: figures_default.arrowDown
          }, void 0, !1, void 0, this)
        }, void 0, !1, void 0, this), $3[0] = t1;
      else
        t1 = $3[0];
      return t1;
    }
    case "requesting": {
      let t1;
      if ($3[1] === Symbol.for("react.memo_cache_sentinel"))
        t1 = /* @__PURE__ */ jsx_dev_runtime67.jsxDEV(ThemedBox_default, {
          width: 2,
          children: /* @__PURE__ */ jsx_dev_runtime67.jsxDEV(ThemedText, {
            dimColor: !0,
            children: figures_default.arrowUp
          }, void 0, !1, void 0, this)
        }, void 0, !1, void 0, this), $3[1] = t1;
      else
        t1 = $3[1];
      return t1;
    }
  }
}
var import_compiler_runtime59, import_react54, jsx_dev_runtime67, SEP_WIDTH, THINKING_BARE_WIDTH, SHOW_TOKENS_AFTER_MS = 30000, THINKING_INACTIVE, THINKING_INACTIVE_SHIMMER, THINKING_DELAY_MS = 3000, THINKING_GLOW_PERIOD_S = 2;
var init_SpinnerAnimationRow = __esm(() => {
  init_figures();
  init_stringWidth();
  init_ink2();
  init_format();
  init_ink3();
  init_Byline();
  init_GlimmerMessage();
  init_SpinnerGlyph();
  init_useStalledAnimation();
  init_utils10();
  import_compiler_runtime59 = __toESM(require_react_compiler_runtime_development(), 1), import_react54 = __toESM(require_react_development(), 1), jsx_dev_runtime67 = __toESM(require_react_jsx_dev_runtime_development(), 1), SEP_WIDTH = stringWidth(" \xB7 "), THINKING_BARE_WIDTH = stringWidth("thinking"), THINKING_INACTIVE = {
    r: 153,
    g: 153,
    b: 153
  }, THINKING_INACTIVE_SHIMMER = {
    r: 185,
    g: 185,
    b: 185
  };
});
