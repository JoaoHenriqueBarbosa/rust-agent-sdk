// Original: src/utils/mcp/dateTimeParser.ts
async function parseNaturalLanguageDateTime(input, format5, signal) {
  let now2 = /* @__PURE__ */ new Date, currentDateTime = now2.toISOString(), timezoneOffset = -now2.getTimezoneOffset(), tzHours = Math.floor(Math.abs(timezoneOffset) / 60), tzMinutes = Math.abs(timezoneOffset) % 60, timezone = `${timezoneOffset >= 0 ? "+" : "-"}${String(tzHours).padStart(2, "0")}:${String(tzMinutes).padStart(2, "0")}`, dayOfWeek = now2.toLocaleDateString("en-US", { weekday: "long" }), systemPrompt = asSystemPrompt([
    "You are a date/time parser that converts natural language into ISO 8601 format.",
    "You MUST respond with ONLY the ISO 8601 formatted string, with no explanation or additional text.",
    "If the input is ambiguous, prefer future dates over past dates.",
    "For times without dates, use today's date.",
    "For dates without times, do not include a time component.",
    'If the input is incomplete or you cannot confidently parse it into a valid date, respond with exactly "INVALID" (nothing else).',
    'Examples of INVALID input: partial dates like "2025-01-", lone numbers like "13", gibberish.',
    'Examples of valid natural language: "tomorrow", "next Monday", "jan 1st 2025", "in 2 hours", "yesterday".'
  ]), formatDescription = format5 === "date" ? "YYYY-MM-DD (date only, no time)" : `YYYY-MM-DDTHH:MM:SS${timezone} (full date-time with timezone)`, userPrompt = `Current context:
- Current date and time: ${currentDateTime} (UTC)
- Local timezone: ${timezone}
- Day of week: ${dayOfWeek}

User input: "${input}"

Output format: ${formatDescription}

Parse the user's input into ISO 8601 format. Return ONLY the formatted string, or "INVALID" if the input is incomplete or unparseable.`;
  try {
    let result = await queryHaiku({
      systemPrompt,
      userPrompt,
      signal,
      options: {
        querySource: "mcp_datetime_parse",
        agents: [],
        isNonInteractiveSession: !1,
        hasAppendSystemPrompt: !1,
        mcpTools: [],
        enablePromptCaching: !1
      }
    }), parsedText = extractTextContent(result.message.content).trim();
    if (!parsedText || parsedText === "INVALID")
      return {
        success: !1,
        error: "Unable to parse date/time from input"
      };
    if (!/^\d{4}/.test(parsedText))
      return {
        success: !1,
        error: "Unable to parse date/time from input"
      };
    return { success: !0, value: parsedText };
  } catch (error44) {
    return logError2(error44), {
      success: !1,
      error: "Unable to parse date/time. Please enter in ISO 8601 format manually."
    };
  }
}
function looksLikeISO8601(input) {
  return /^\d{4}-\d{2}-\d{2}(T|$)/.test(input.trim());
}
var init_dateTimeParser = __esm(() => {
  init_claude();
  init_log3();
  init_messages3();
});
