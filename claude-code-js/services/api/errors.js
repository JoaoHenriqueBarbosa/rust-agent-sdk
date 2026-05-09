// Original: src/services/api/errors.ts
function startsWithApiErrorPrefix(text2) {
  return text2.startsWith(API_ERROR_MESSAGE_PREFIX) || text2.startsWith(`Please run /login \xB7 ${API_ERROR_MESSAGE_PREFIX}`);
}
function isPromptTooLongMessage(msg) {
  if (!msg.isApiErrorMessage)
    return !1;
  let content = msg.message.content;
  if (!Array.isArray(content))
    return !1;
  return content.some((block2) => block2.type === "text" && block2.text.startsWith(PROMPT_TOO_LONG_ERROR_MESSAGE));
}
function parsePromptTooLongTokenCounts(rawMessage) {
  let match = rawMessage.match(/prompt is too long[^0-9]*(\d+)\s*tokens?\s*>\s*(\d+)/i);
  return {
    actualTokens: match ? parseInt(match[1], 10) : void 0,
    limitTokens: match ? parseInt(match[2], 10) : void 0
  };
}
function getPromptTooLongTokenGap(msg) {
  if (!isPromptTooLongMessage(msg) || !msg.errorDetails)
    return;
  let { actualTokens, limitTokens } = parsePromptTooLongTokenCounts(msg.errorDetails);
  if (actualTokens === void 0 || limitTokens === void 0)
    return;
  let gap = actualTokens - limitTokens;
  return gap > 0 ? gap : void 0;
}
function getPdfTooLargeErrorMessage() {
  let limits = `max ${API_PDF_MAX_PAGES} pages, ${formatFileSize(PDF_TARGET_RAW_SIZE)}`;
  return getIsNonInteractiveSession() ? `PDF too large (${limits}). Try reading the file a different way (e.g., extract text with pdftotext).` : `PDF too large (${limits}). Double press esc to go back and try again, or use pdftotext to convert to text first.`;
}
function getPdfPasswordProtectedErrorMessage() {
  return getIsNonInteractiveSession() ? "PDF is password protected. Try using a CLI tool to extract or convert the PDF." : "PDF is password protected. Please double press esc to edit your message and try again.";
}
function getPdfInvalidErrorMessage() {
  return getIsNonInteractiveSession() ? "The PDF file was not valid. Try converting it to text first (e.g., pdftotext)." : "The PDF file was not valid. Double press esc to go back and try again with a different file.";
}
function getImageTooLargeErrorMessage() {
  return getIsNonInteractiveSession() ? "Image was too large. Try resizing the image or using a different approach." : "Image was too large. Double press esc to go back and try again with a smaller image.";
}
function getRequestTooLargeErrorMessage() {
  let limits = `max ${formatFileSize(PDF_TARGET_RAW_SIZE)}`;
  return getIsNonInteractiveSession() ? `Request too large (${limits}). Try with a smaller file.` : `Request too large (${limits}). Double press esc to go back and try with a smaller file.`;
}
function getTokenRevokedErrorMessage() {
  return getIsNonInteractiveSession() ? "Your account does not have access to Claude. Please login again or contact your administrator." : TOKEN_REVOKED_ERROR_MESSAGE;
}
function getOauthOrgNotAllowedErrorMessage() {
  return getIsNonInteractiveSession() ? "Your organization does not have access to Claude. Please login again or contact your administrator." : OAUTH_ORG_NOT_ALLOWED_ERROR_MESSAGE;
}
function isCCRMode() {
  return isEnvTruthy(process.env.CLAUDE_CODE_REMOTE);
}
function logToolUseToolResultMismatch(toolUseId, messages, messagesForAPI) {
  try {
    let normalizedIndex = -1;
    for (let i5 = 0;i5 < messagesForAPI.length; i5++) {
      let msg = messagesForAPI[i5];
      if (!msg)
        continue;
      let content = msg.message.content;
      if (Array.isArray(content)) {
        for (let block2 of content)
          if (block2.type === "tool_use" && "id" in block2 && block2.id === toolUseId) {
            normalizedIndex = i5;
            break;
          }
      }
      if (normalizedIndex !== -1)
        break;
    }
    let originalIndex = -1;
    for (let i5 = 0;i5 < messages.length; i5++) {
      let msg = messages[i5];
      if (!msg)
        continue;
      if (msg.type === "assistant" && "message" in msg) {
        let content = msg.message.content;
        if (Array.isArray(content)) {
          for (let block2 of content)
            if (block2.type === "tool_use" && "id" in block2 && block2.id === toolUseId) {
              originalIndex = i5;
              break;
            }
        }
      }
      if (originalIndex !== -1)
        break;
    }
    let normalizedSeq = [];
    for (let i5 = normalizedIndex + 1;i5 < messagesForAPI.length; i5++) {
      let msg = messagesForAPI[i5];
      if (!msg)
        continue;
      let content = msg.message.content;
      if (Array.isArray(content))
        for (let block2 of content) {
          let role = msg.message.role;
          if (block2.type === "tool_use" && "id" in block2)
            normalizedSeq.push(`${role}:tool_use:${block2.id}`);
          else if (block2.type === "tool_result" && "tool_use_id" in block2)
            normalizedSeq.push(`${role}:tool_result:${block2.tool_use_id}`);
          else if (block2.type === "text")
            normalizedSeq.push(`${role}:text`);
          else if (block2.type === "thinking")
            normalizedSeq.push(`${role}:thinking`);
          else if (block2.type === "image")
            normalizedSeq.push(`${role}:image`);
          else
            normalizedSeq.push(`${role}:${block2.type}`);
        }
      else if (typeof content === "string")
        normalizedSeq.push(`${msg.message.role}:string_content`);
    }
    let preNormalizedSeq = [];
    for (let i5 = originalIndex + 1;i5 < messages.length; i5++) {
      let msg = messages[i5];
      if (!msg)
        continue;
      switch (msg.type) {
        case "user":
        case "assistant": {
          if ("message" in msg) {
            let content = msg.message.content;
            if (Array.isArray(content))
              for (let block2 of content) {
                let role = msg.message.role;
                if (block2.type === "tool_use" && "id" in block2)
                  preNormalizedSeq.push(`${role}:tool_use:${block2.id}`);
                else if (block2.type === "tool_result" && "tool_use_id" in block2)
                  preNormalizedSeq.push(`${role}:tool_result:${block2.tool_use_id}`);
                else if (block2.type === "text")
                  preNormalizedSeq.push(`${role}:text`);
                else if (block2.type === "thinking")
                  preNormalizedSeq.push(`${role}:thinking`);
                else if (block2.type === "image")
                  preNormalizedSeq.push(`${role}:image`);
                else
                  preNormalizedSeq.push(`${role}:${block2.type}`);
              }
            else if (typeof content === "string")
              preNormalizedSeq.push(`${msg.message.role}:string_content`);
          }
          break;
        }
        case "attachment":
          if ("attachment" in msg)
            preNormalizedSeq.push(`attachment:${msg.attachment.type}`);
          break;
        case "system":
          if ("subtype" in msg)
            preNormalizedSeq.push(`system:${msg.subtype}`);
          break;
        case "progress":
          if ("progress" in msg && msg.progress && typeof msg.progress === "object" && "type" in msg.progress)
            preNormalizedSeq.push(`progress:${msg.progress.type ?? "unknown"}`);
          else
            preNormalizedSeq.push("progress:unknown");
          break;
      }
    }
    logEvent("tengu_tool_use_tool_result_mismatch_error", {
      toolUseId,
      normalizedSequence: normalizedSeq.join(", "),
      preNormalizedSequence: preNormalizedSeq.join(", "),
      normalizedMessageCount: messagesForAPI.length,
      originalMessageCount: messages.length,
      normalizedToolUseIndex: normalizedIndex,
      originalToolUseIndex: originalIndex
    });
  } catch (_) {}
}
function getAssistantMessageFromError(error44, model, options2) {
  if (error44 instanceof APIConnectionTimeoutError || error44 instanceof APIConnectionError && error44.message.toLowerCase().includes("timeout"))
    return createAssistantAPIErrorMessage({
      content: API_TIMEOUT_ERROR_MESSAGE,
      error: "unknown"
    });
  if (error44 instanceof ImageSizeError || error44 instanceof ImageResizeError)
    return createAssistantAPIErrorMessage({
      content: getImageTooLargeErrorMessage()
    });
  if (error44 instanceof Error && error44.message.includes(CUSTOM_OFF_SWITCH_MESSAGE))
    return createAssistantAPIErrorMessage({
      content: CUSTOM_OFF_SWITCH_MESSAGE,
      error: "rate_limit"
    });
  if (error44 instanceof APIError && error44.status === 429 && shouldProcessRateLimits(isClaudeAISubscriber())) {
    let rateLimitType = error44.headers?.get?.("anthropic-ratelimit-unified-representative-claim"), overageStatus = error44.headers?.get?.("anthropic-ratelimit-unified-overage-status");
    if (rateLimitType || overageStatus) {
      let limits = {
        status: "rejected",
        unifiedRateLimitFallbackAvailable: !1,
        isUsingOverage: !1
      }, resetHeader = error44.headers?.get?.("anthropic-ratelimit-unified-reset");
      if (resetHeader)
        limits.resetsAt = Number(resetHeader);
      if (rateLimitType)
        limits.rateLimitType = rateLimitType;
      if (overageStatus)
        limits.overageStatus = overageStatus;
      let overageResetHeader = error44.headers?.get?.("anthropic-ratelimit-unified-overage-reset");
      if (overageResetHeader)
        limits.overageResetsAt = Number(overageResetHeader);
      let overageDisabledReason = error44.headers?.get?.("anthropic-ratelimit-unified-overage-disabled-reason");
      if (overageDisabledReason)
        limits.overageDisabledReason = overageDisabledReason;
      let specificErrorMessage = getRateLimitErrorMessage(limits, model);
      if (specificErrorMessage)
        return createAssistantAPIErrorMessage({
          content: specificErrorMessage,
          error: "rate_limit"
        });
      return createAssistantAPIErrorMessage({
        content: NO_RESPONSE_REQUESTED,
        error: "rate_limit"
      });
    }
    if (error44.message.includes("Extra usage is required for long context")) {
      let hint = getIsNonInteractiveSession() ? "enable extra usage at claude.ai/settings/usage, or use --model to switch to standard context" : "run /extra-usage to enable, or /model to switch to standard context";
      return createAssistantAPIErrorMessage({
        content: `${API_ERROR_MESSAGE_PREFIX}: Extra usage is required for 1M context \xB7 ${hint}`,
        error: "rate_limit"
      });
    }
    let stripped = error44.message.replace(/^429\s+/, ""), detail = stripped.match(/"message"\s*:\s*"([^"]*)"/)?.[1] || stripped;
    return createAssistantAPIErrorMessage({
      content: `${API_ERROR_MESSAGE_PREFIX}: Request rejected (429) \xB7 ${detail || "this may be a temporary capacity issue \u2014 check status.anthropic.com"}`,
      error: "rate_limit"
    });
  }
  if (error44 instanceof Error && error44.message.toLowerCase().includes("prompt is too long"))
    return createAssistantAPIErrorMessage({
      content: PROMPT_TOO_LONG_ERROR_MESSAGE,
      error: "invalid_request",
      errorDetails: error44.message
    });
  if (error44 instanceof Error && /maximum of \d+ PDF pages/.test(error44.message))
    return createAssistantAPIErrorMessage({
      content: getPdfTooLargeErrorMessage(),
      error: "invalid_request",
      errorDetails: error44.message
    });
  if (error44 instanceof Error && error44.message.includes("The PDF specified is password protected"))
    return createAssistantAPIErrorMessage({
      content: getPdfPasswordProtectedErrorMessage(),
      error: "invalid_request"
    });
  if (error44 instanceof Error && error44.message.includes("The PDF specified was not valid"))
    return createAssistantAPIErrorMessage({
      content: getPdfInvalidErrorMessage(),
      error: "invalid_request"
    });
  if (error44 instanceof APIError && error44.status === 400 && error44.message.includes("image exceeds") && error44.message.includes("maximum"))
    return createAssistantAPIErrorMessage({
      content: getImageTooLargeErrorMessage(),
      errorDetails: error44.message
    });
  if (error44 instanceof APIError && error44.status === 400 && error44.message.includes("image dimensions exceed") && error44.message.includes("many-image"))
    return createAssistantAPIErrorMessage({
      content: getIsNonInteractiveSession() ? "An image in the conversation exceeds the dimension limit for many-image requests (2000px). Start a new session with fewer images." : "An image in the conversation exceeds the dimension limit for many-image requests (2000px). Run /compact to remove old images from context, or start a new session.",
      error: "invalid_request",
      errorDetails: error44.message
    });
  if (AFK_MODE_BETA_HEADER && error44 instanceof APIError && error44.status === 400 && error44.message.includes(AFK_MODE_BETA_HEADER) && error44.message.includes("anthropic-beta"))
    return createAssistantAPIErrorMessage({
      content: "Auto mode is unavailable for your plan",
      error: "invalid_request"
    });
  if (error44 instanceof APIError && error44.status === 413)
    return createAssistantAPIErrorMessage({
      content: getRequestTooLargeErrorMessage(),
      error: "invalid_request"
    });
  if (error44 instanceof APIError && error44.status === 400 && error44.message.includes("`tool_use` ids were found without `tool_result` blocks immediately after")) {
    if (options2?.messages && options2?.messagesForAPI) {
      let toolUseIdMatch = error44.message.match(/toolu_[a-zA-Z0-9]+/), toolUseId = toolUseIdMatch ? toolUseIdMatch[0] : null;
      if (toolUseId)
        logToolUseToolResultMismatch(toolUseId, options2.messages, options2.messagesForAPI);
    }
    {
      let rewindInstruction = getIsNonInteractiveSession() ? "" : " Run /rewind to recover the conversation.";
      return createAssistantAPIErrorMessage({
        content: "API Error: 400 due to tool use concurrency issues." + rewindInstruction,
        error: "invalid_request"
      });
    }
  }
  if (error44 instanceof APIError && error44.status === 400 && error44.message.includes("unexpected `tool_use_id` found in `tool_result`"))
    logEvent("tengu_unexpected_tool_result", {});
  if (error44 instanceof APIError && error44.status === 400 && error44.message.includes("`tool_use` ids must be unique")) {
    logEvent("tengu_duplicate_tool_use_id", {});
    let rewindInstruction = getIsNonInteractiveSession() ? "" : " Run /rewind to recover the conversation.";
    return createAssistantAPIErrorMessage({
      content: `API Error: 400 duplicate tool_use ID in conversation history.${rewindInstruction}`,
      error: "invalid_request",
      errorDetails: error44.message
    });
  }
  if (isClaudeAISubscriber() && error44 instanceof APIError && error44.status === 400 && error44.message.toLowerCase().includes("invalid model name") && (isNonCustomOpusModel(model) || model === "opus"))
    return createAssistantAPIErrorMessage({
      content: "Claude Opus is not available with the Claude Pro plan. If you have updated your subscription plan recently, run /logout and /login for the plan to take effect.",
      error: "invalid_request"
    });
  if (error44 instanceof Error && error44.message.includes("Your credit balance is too low"))
    return createAssistantAPIErrorMessage({
      content: CREDIT_BALANCE_TOO_LOW_ERROR_MESSAGE,
      error: "billing_error"
    });
  if (error44 instanceof APIError && error44.status === 400 && error44.message.toLowerCase().includes("organization has been disabled")) {
    let { source } = getAnthropicApiKeyWithSource();
    if (source === "ANTHROPIC_API_KEY" && process.env.ANTHROPIC_API_KEY && !isClaudeAISubscriber()) {
      let hasStoredOAuth = getClaudeAIOAuthTokens()?.accessToken != null;
      return createAssistantAPIErrorMessage({
        error: "invalid_request",
        content: hasStoredOAuth ? ORG_DISABLED_ERROR_MESSAGE_ENV_KEY_WITH_OAUTH : ORG_DISABLED_ERROR_MESSAGE_ENV_KEY
      });
    }
  }
  if (error44 instanceof Error && error44.message.toLowerCase().includes("x-api-key")) {
    if (isCCRMode())
      return createAssistantAPIErrorMessage({
        error: "authentication_failed",
        content: CCR_AUTH_ERROR_MESSAGE
      });
    let { source } = getAnthropicApiKeyWithSource();
    return createAssistantAPIErrorMessage({
      error: "authentication_failed",
      content: source === "ANTHROPIC_API_KEY" || source === "apiKeyHelper" ? INVALID_API_KEY_ERROR_MESSAGE_EXTERNAL : INVALID_API_KEY_ERROR_MESSAGE
    });
  }
  if (error44 instanceof APIError && error44.status === 403 && error44.message.includes("OAuth token has been revoked"))
    return createAssistantAPIErrorMessage({
      error: "authentication_failed",
      content: getTokenRevokedErrorMessage()
    });
  if (error44 instanceof APIError && (error44.status === 401 || error44.status === 403) && error44.message.includes("OAuth authentication is currently not allowed for this organization"))
    return createAssistantAPIErrorMessage({
      error: "authentication_failed",
      content: getOauthOrgNotAllowedErrorMessage()
    });
  if (error44 instanceof APIError && (error44.status === 401 || error44.status === 403)) {
    if (isCCRMode())
      return createAssistantAPIErrorMessage({
        error: "authentication_failed",
        content: CCR_AUTH_ERROR_MESSAGE
      });
    return createAssistantAPIErrorMessage({
      error: "authentication_failed",
      content: getIsNonInteractiveSession() ? `Failed to authenticate. ${API_ERROR_MESSAGE_PREFIX}: ${error44.message}` : `Please run /login \xB7 ${API_ERROR_MESSAGE_PREFIX}: ${error44.message}`
    });
  }
  if (isEnvTruthy(process.env.CLAUDE_CODE_USE_BEDROCK) && error44 instanceof Error && error44.message.toLowerCase().includes("model id")) {
    let switchCmd = getIsNonInteractiveSession() ? "--model" : "/model", fallbackSuggestion = get3PModelFallbackSuggestion(model);
    return createAssistantAPIErrorMessage({
      content: fallbackSuggestion ? `${API_ERROR_MESSAGE_PREFIX} (${model}): ${error44.message}. Try ${switchCmd} to switch to ${fallbackSuggestion}.` : `${API_ERROR_MESSAGE_PREFIX} (${model}): ${error44.message}. Run ${switchCmd} to pick a different model.`,
      error: "invalid_request"
    });
  }
  if (error44 instanceof APIError && error44.status === 404) {
    let switchCmd = getIsNonInteractiveSession() ? "--model" : "/model", fallbackSuggestion = get3PModelFallbackSuggestion(model);
    return createAssistantAPIErrorMessage({
      content: fallbackSuggestion ? `The model ${model} is not available on your ${getAPIProvider()} deployment. Try ${switchCmd} to switch to ${fallbackSuggestion}, or ask your admin to enable this model.` : `There's an issue with the selected model (${model}). It may not exist or you may not have access to it. Run ${switchCmd} to pick a different model.`,
      error: "invalid_request"
    });
  }
  if (error44 instanceof APIConnectionError)
    return createAssistantAPIErrorMessage({
      content: `${API_ERROR_MESSAGE_PREFIX}: ${formatAPIError(error44)}`,
      error: "unknown"
    });
  if (error44 instanceof Error)
    return createAssistantAPIErrorMessage({
      content: `${API_ERROR_MESSAGE_PREFIX}: ${error44.message}`,
      error: "unknown"
    });
  return createAssistantAPIErrorMessage({
    content: API_ERROR_MESSAGE_PREFIX,
    error: "unknown"
  });
}
function get3PModelFallbackSuggestion(model) {
  if (getAPIProvider() === "firstParty")
    return;
  let m4 = model.toLowerCase();
  if (m4.includes("opus-4-6") || m4.includes("opus_4_6"))
    return getModelStrings2().opus41;
  if (m4.includes("sonnet-4-6") || m4.includes("sonnet_4_6"))
    return getModelStrings2().sonnet45;
  if (m4.includes("sonnet-4-5") || m4.includes("sonnet_4_5"))
    return getModelStrings2().sonnet40;
  return;
}
function classifyAPIError(error44) {
  if (error44 instanceof Error && error44.message === "Request was aborted.")
    return "aborted";
  if (error44 instanceof APIConnectionTimeoutError || error44 instanceof APIConnectionError && error44.message.toLowerCase().includes("timeout"))
    return "api_timeout";
  if (error44 instanceof Error && error44.message.includes(REPEATED_529_ERROR_MESSAGE))
    return "repeated_529";
  if (error44 instanceof Error && error44.message.includes(CUSTOM_OFF_SWITCH_MESSAGE))
    return "capacity_off_switch";
  if (error44 instanceof APIError && error44.status === 429)
    return "rate_limit";
  if (error44 instanceof APIError && (error44.status === 529 || error44.message?.includes('"type":"overloaded_error"')))
    return "server_overload";
  if (error44 instanceof Error && error44.message.toLowerCase().includes(PROMPT_TOO_LONG_ERROR_MESSAGE.toLowerCase()))
    return "prompt_too_long";
  if (error44 instanceof Error && /maximum of \d+ PDF pages/.test(error44.message))
    return "pdf_too_large";
  if (error44 instanceof Error && error44.message.includes("The PDF specified is password protected"))
    return "pdf_password_protected";
  if (error44 instanceof APIError && error44.status === 400 && error44.message.includes("image exceeds") && error44.message.includes("maximum"))
    return "image_too_large";
  if (error44 instanceof APIError && error44.status === 400 && error44.message.includes("image dimensions exceed") && error44.message.includes("many-image"))
    return "image_too_large";
  if (error44 instanceof APIError && error44.status === 400 && error44.message.includes("`tool_use` ids were found without `tool_result` blocks immediately after"))
    return "tool_use_mismatch";
  if (error44 instanceof APIError && error44.status === 400 && error44.message.includes("unexpected `tool_use_id` found in `tool_result`"))
    return "unexpected_tool_result";
  if (error44 instanceof APIError && error44.status === 400 && error44.message.includes("`tool_use` ids must be unique"))
    return "duplicate_tool_use_id";
  if (error44 instanceof APIError && error44.status === 400 && error44.message.toLowerCase().includes("invalid model name"))
    return "invalid_model";
  if (error44 instanceof Error && error44.message.toLowerCase().includes(CREDIT_BALANCE_TOO_LOW_ERROR_MESSAGE.toLowerCase()))
    return "credit_balance_low";
  if (error44 instanceof Error && error44.message.toLowerCase().includes("x-api-key"))
    return "invalid_api_key";
  if (error44 instanceof APIError && error44.status === 403 && error44.message.includes("OAuth token has been revoked"))
    return "token_revoked";
  if (error44 instanceof APIError && (error44.status === 401 || error44.status === 403) && error44.message.includes("OAuth authentication is currently not allowed for this organization"))
    return "oauth_org_not_allowed";
  if (error44 instanceof APIError && (error44.status === 401 || error44.status === 403))
    return "auth_error";
  if (isEnvTruthy(process.env.CLAUDE_CODE_USE_BEDROCK) && error44 instanceof Error && error44.message.toLowerCase().includes("model id"))
    return "bedrock_model_access";
  if (error44 instanceof APIError) {
    let status = error44.status;
    if (status >= 500)
      return "server_error";
    if (status >= 400)
      return "client_error";
  }
  if (error44 instanceof APIConnectionError) {
    if (extractConnectionErrorDetails(error44)?.isSSLError)
      return "ssl_cert_error";
    return "connection_error";
  }
  return "unknown";
}
function categorizeRetryableAPIError(error44) {
  if (error44.status === 529 || error44.message?.includes('"type":"overloaded_error"'))
    return "rate_limit";
  if (error44.status === 429)
    return "rate_limit";
  if (error44.status === 401 || error44.status === 403)
    return "authentication_failed";
  if (error44.status !== void 0 && error44.status >= 408)
    return "server_error";
  return "unknown";
}
function getErrorMessageIfRefusal(stopReason, model) {
  if (stopReason !== "refusal")
    return;
  logEvent("tengu_refusal_api_response", {});
  let baseMessage = getIsNonInteractiveSession() ? `${API_ERROR_MESSAGE_PREFIX}: Sorry, nothing we can do \u2014 Anthropic is refusing this request from their server. They train on everyone's content, but when it's time to help you, suddenly they can't. Try rephrasing the request or attempting a different approach.` : `${API_ERROR_MESSAGE_PREFIX}: Sorry, nothing we can do \u2014 Anthropic is refusing this request from their server. They train on everyone's content, but when it's time to help you, suddenly they can't. Double press esc to edit your last message or try a different approach.`;
  return createAssistantAPIErrorMessage({
    content: baseMessage + (model !== "claude-sonnet-4-20250514" ? " If this keeps happening, try running /model claude-sonnet-4-20250514 to switch models." : ""),
    error: "invalid_request"
  });
}
var API_ERROR_MESSAGE_PREFIX = "API Error", PROMPT_TOO_LONG_ERROR_MESSAGE = "Prompt is too long", CREDIT_BALANCE_TOO_LOW_ERROR_MESSAGE = "Credit balance is too low", INVALID_API_KEY_ERROR_MESSAGE = "Not logged in \xB7 Please run /login", INVALID_API_KEY_ERROR_MESSAGE_EXTERNAL = "Invalid API key \xB7 Fix external API key", ORG_DISABLED_ERROR_MESSAGE_ENV_KEY_WITH_OAUTH = "Your ANTHROPIC_API_KEY belongs to a disabled organization \xB7 Unset the environment variable to use your subscription instead", ORG_DISABLED_ERROR_MESSAGE_ENV_KEY = "Your ANTHROPIC_API_KEY belongs to a disabled organization \xB7 Update or unset the environment variable", TOKEN_REVOKED_ERROR_MESSAGE = "OAuth token revoked \xB7 Please run /login", CCR_AUTH_ERROR_MESSAGE = "Authentication error \xB7 This may be a temporary network issue, please try again", REPEATED_529_ERROR_MESSAGE = "Repeated 529 Overloaded errors", CUSTOM_OFF_SWITCH_MESSAGE = "Opus is experiencing high load, please use /model to switch to Sonnet", API_TIMEOUT_ERROR_MESSAGE = "Request timed out", OAUTH_ORG_NOT_ALLOWED_ERROR_MESSAGE = "Your account does not have access to Claude Code. Please run /login.";
var init_errors11 = __esm(() => {
  init_sdk();
  init_betas();
  init_auth14();
  init_messages3();
  init_model();
  init_modelStrings();
  init_providers();
  init_state();
  init_envUtils();
  init_format();
  init_imageResizer();
  init_imageValidation();
  init_claudeAiLimits();
  init_rateLimitMocking();
  init_errorUtils();
});
