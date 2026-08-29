// Original: src/services/PromptSuggestion/promptSuggestion.ts
function getPromptVariant() {
  return "user_intent";
}
function shouldEnablePromptSuggestion() {
  let envOverride = process.env.CLAUDE_CODE_ENABLE_PROMPT_SUGGESTION;
  if (isEnvDefinedFalsy(envOverride))
    return logEvent("tengu_prompt_suggestion_init", {
      enabled: !1,
      source: "env"
    }), !1;
  if (isEnvTruthy(envOverride))
    return logEvent("tengu_prompt_suggestion_init", {
      enabled: !0,
      source: "env"
    }), !0;
  if (getIsNonInteractiveSession())
    return logEvent("tengu_prompt_suggestion_init", {
      enabled: !1,
      source: "non_interactive"
    }), !1;
  if (isAgentSwarmsEnabled() && isTeammate())
    return logEvent("tengu_prompt_suggestion_init", {
      enabled: !1,
      source: "swarm_teammate"
    }), !1;
  let enabled2 = getInitialSettings()?.promptSuggestionEnabled !== !1;
  return logEvent("tengu_prompt_suggestion_init", {
    enabled: enabled2,
    source: "setting"
  }), enabled2;
}
function abortPromptSuggestion() {
  if (currentAbortController)
    currentAbortController.abort(), currentAbortController = null;
}
function getSuggestionSuppressReason(appState) {
  if (!appState.promptSuggestionEnabled)
    return "disabled";
  if (appState.pendingWorkerRequest || appState.pendingSandboxRequest)
    return "pending_permission";
  if (appState.elicitation.queue.length > 0)
    return "elicitation_active";
  if (appState.toolPermissionContext.mode === "plan")
    return "plan_mode";
  if (currentLimits.status !== "allowed")
    return "rate_limit";
  return null;
}
async function tryGenerateSuggestion(abortController, messages, getAppState, cacheSafeParams, source) {
  if (abortController.signal.aborted)
    return logSuggestionSuppressed("aborted", void 0, void 0, source), null;
  if (count2(messages, (m4) => m4.type === "assistant") < 2)
    return logSuggestionSuppressed("early_conversation", void 0, void 0, source), null;
  let lastAssistantMessage = getLastAssistantMessage(messages);
  if (lastAssistantMessage?.isApiErrorMessage)
    return logSuggestionSuppressed("last_response_error", void 0, void 0, source), null;
  let cacheReason = getParentCacheSuppressReason(lastAssistantMessage);
  if (cacheReason)
    return logSuggestionSuppressed(cacheReason, void 0, void 0, source), null;
  let appState = getAppState(), suppressReason = getSuggestionSuppressReason(appState);
  if (suppressReason)
    return logSuggestionSuppressed(suppressReason, void 0, void 0, source), null;
  let promptId = getPromptVariant(), { suggestion, generationRequestId } = await generateSuggestion(abortController, promptId, cacheSafeParams);
  if (abortController.signal.aborted)
    return logSuggestionSuppressed("aborted", void 0, void 0, source), null;
  if (!suggestion)
    return logSuggestionSuppressed("empty", void 0, promptId, source), null;
  if (shouldFilterSuggestion(suggestion, promptId, source))
    return null;
  return { suggestion, promptId, generationRequestId };
}
async function executePromptSuggestion(context3) {
  if (context3.querySource !== "repl_main_thread")
    return;
  currentAbortController = new AbortController;
  let abortController = currentAbortController, cacheSafeParams = createCacheSafeParams(context3);
  try {
    let result = await tryGenerateSuggestion(abortController, context3.messages, context3.toolUseContext.getAppState, cacheSafeParams, "cli");
    if (!result)
      return;
    if (context3.toolUseContext.setAppState((prev) => ({
      ...prev,
      promptSuggestion: {
        text: result.suggestion,
        promptId: result.promptId,
        shownAt: 0,
        acceptedAt: 0,
        generationRequestId: result.generationRequestId
      }
    })), isSpeculationEnabled() && result.suggestion)
      startSpeculation(result.suggestion, context3, context3.toolUseContext.setAppState, !1, cacheSafeParams);
  } catch (error44) {
    if (error44 instanceof Error && (error44.name === "AbortError" || error44.name === "APIUserAbortError")) {
      logSuggestionSuppressed("aborted", void 0, void 0, "cli");
      return;
    }
    logError2(toError(error44));
  } finally {
    if (currentAbortController === abortController)
      currentAbortController = null;
  }
}
function getParentCacheSuppressReason(lastAssistantMessage) {
  if (!lastAssistantMessage)
    return null;
  let usage = lastAssistantMessage.message.usage, inputTokens = usage.input_tokens ?? 0, cacheWriteTokens = usage.cache_creation_input_tokens ?? 0, outputTokens = usage.output_tokens ?? 0;
  return inputTokens + cacheWriteTokens + outputTokens > MAX_PARENT_UNCACHED_TOKENS ? "cache_cold" : null;
}
async function generateSuggestion(abortController, promptId, cacheSafeParams) {
  let prompt = SUGGESTION_PROMPTS[promptId], canUseTool = async () => ({
    behavior: "deny",
    message: "No tools needed for suggestion",
    decisionReason: { type: "other", reason: "suggestion only" }
  }), result = await runForkedAgent({
    promptMessages: [createUserMessage({ content: prompt })],
    cacheSafeParams,
    canUseTool,
    querySource: "prompt_suggestion",
    forkLabel: "prompt_suggestion",
    overrides: {
      abortController
    },
    skipTranscript: !0,
    skipCacheWrite: !0
  }), firstAssistantMsg = result.messages.find((m4) => m4.type === "assistant"), generationRequestId = firstAssistantMsg?.type === "assistant" ? firstAssistantMsg.requestId ?? null : null;
  for (let msg of result.messages) {
    if (msg.type !== "assistant")
      continue;
    let textBlock = msg.message.content.find((b) => b.type === "text");
    if (textBlock?.type === "text") {
      let suggestion = textBlock.text.trim();
      if (suggestion)
        return { suggestion, generationRequestId };
    }
  }
  return { suggestion: null, generationRequestId };
}
function shouldFilterSuggestion(suggestion, promptId, source) {
  if (!suggestion)
    return logSuggestionSuppressed("empty", void 0, promptId, source), !0;
  let lower = suggestion.toLowerCase(), wordCount = suggestion.trim().split(/\s+/).length, filters = [
    ["done", () => lower === "done"],
    [
      "meta_text",
      () => lower === "nothing found" || lower === "nothing found." || lower.startsWith("nothing to suggest") || lower.startsWith("no suggestion") || /\bsilence is\b|\bstay(s|ing)? silent\b/.test(lower) || /^\W*silence\W*$/.test(lower)
    ],
    [
      "meta_wrapped",
      () => /^\(.*\)$|^\[.*\]$/.test(suggestion)
    ],
    [
      "error_message",
      () => lower.startsWith("api error:") || lower.startsWith("prompt is too long") || lower.startsWith("request timed out") || lower.startsWith("invalid api key") || lower.startsWith("image was too large")
    ],
    ["prefixed_label", () => /^\w+:\s/.test(suggestion)],
    [
      "too_few_words",
      () => {
        if (wordCount >= 2)
          return !1;
        if (suggestion.startsWith("/"))
          return !1;
        return !(/* @__PURE__ */ new Set([
          "yes",
          "yeah",
          "yep",
          "yea",
          "yup",
          "sure",
          "ok",
          "okay",
          "push",
          "commit",
          "deploy",
          "stop",
          "continue",
          "check",
          "exit",
          "quit",
          "no"
        ])).has(lower);
      }
    ],
    ["too_many_words", () => wordCount > 12],
    ["too_long", () => suggestion.length >= 100],
    ["multiple_sentences", () => /[.!?]\s+[A-Z]/.test(suggestion)],
    ["has_formatting", () => /[\n*]|\*\*/.test(suggestion)],
    [
      "evaluative",
      () => /thanks|thank you|looks good|sounds good|that works|that worked|that's all|nice|great|perfect|makes sense|awesome|excellent/.test(lower)
    ],
    [
      "claude_voice",
      () => /^(let me|i'll|i've|i'm|i can|i would|i think|i notice|here's|here is|here are|that's|this is|this will|you can|you should|you could|sure,|of course|certainly)/i.test(suggestion)
    ]
  ];
  for (let [reason, check3] of filters)
    if (check3())
      return logSuggestionSuppressed(reason, suggestion, promptId, source), !0;
  return !1;
}
function logSuggestionOutcome(suggestion, userInput, emittedAt, promptId, generationRequestId) {
  let similarity = Math.round(userInput.length / (suggestion.length || 1) * 100) / 100, wasAccepted = userInput === suggestion, timeMs = Math.max(0, Date.now() - emittedAt);
  logEvent("tengu_prompt_suggestion", {
    source: "sdk",
    outcome: wasAccepted ? "accepted" : "ignored",
    prompt_id: promptId,
    ...generationRequestId && {
      generationRequestId
    },
    ...wasAccepted && {
      timeToAcceptMs: timeMs
    },
    ...!wasAccepted && { timeToIgnoreMs: timeMs },
    similarity,
    ...!1
  });
}
function logSuggestionSuppressed(reason, suggestion, promptId, source) {
  let resolvedPromptId = promptId ?? getPromptVariant();
  logEvent("tengu_prompt_suggestion", {
    ...source && {
      source
    },
    outcome: "suppressed",
    reason,
    prompt_id: resolvedPromptId,
    ...!1
  });
}
var currentAbortController = null, MAX_PARENT_UNCACHED_TOKENS = 1e4, SUGGESTION_PROMPT = `[SUGGESTION MODE: Suggest what the user might naturally type next into Claude Code.]

FIRST: Look at the user's recent messages and original request.

Your job is to predict what THEY would type - not what you think they should do.

THE TEST: Would they think "I was just about to type that"?

EXAMPLES:
User asked "fix the bug and run tests", bug is fixed \u2192 "run the tests"
After code written \u2192 "try it out"
Claude offers options \u2192 suggest the one the user would likely pick, based on conversation
Claude asks to continue \u2192 "yes" or "go ahead"
Task complete, obvious follow-up \u2192 "commit this" or "push it"
After error or misunderstanding \u2192 silence (let them assess/correct)

Be specific: "run the tests" beats "continue".

NEVER SUGGEST:
- Evaluative ("looks good", "thanks")
- Questions ("what about...?")
- Claude-voice ("Let me...", "I'll...", "Here's...")
- New ideas they didn't ask about
- Multiple sentences

Stay silent if the next step isn't obvious from what the user said.

Format: 2-12 words, match the user's style. Or nothing.

Reply with ONLY the suggestion, no quotes or explanation.`, SUGGESTION_PROMPTS;
var init_promptSuggestion = __esm(() => {
  init_state();
  init_agentSwarmsEnabled();
  init_envUtils();
  init_errors();
  init_forkedAgent();
  init_log3();
  init_messages3();
  init_settings2();
  init_teammate();
  init_claudeAiLimits();
  init_speculation();
  SUGGESTION_PROMPTS = {
    user_intent: SUGGESTION_PROMPT,
    stated_intent: SUGGESTION_PROMPT
  };
});
