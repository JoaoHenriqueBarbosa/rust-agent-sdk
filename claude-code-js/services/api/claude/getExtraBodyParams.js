// function: getExtraBodyParams
function getExtraBodyParams(betaHeaders) {
  let extraBodyStr = process.env.CLAUDE_CODE_EXTRA_BODY, result = {};
  if (extraBodyStr)
    try {
      let parsed = safeParseJSON(extraBodyStr);
      if (parsed && typeof parsed === "object" && !Array.isArray(parsed))
        result = { ...parsed };
      else
        logForDebugging(`CLAUDE_CODE_EXTRA_BODY env var must be a JSON object, but was given ${extraBodyStr}`, { level: "error" });
    } catch (error44) {
      logForDebugging(`Error parsing CLAUDE_CODE_EXTRA_BODY: ${errorMessage(error44)}`, { level: "error" });
    }
  if (betaHeaders && betaHeaders.length > 0)
    if (result.anthropic_beta && Array.isArray(result.anthropic_beta)) {
      let existingHeaders = result.anthropic_beta, newHeaders = betaHeaders.filter((header) => !existingHeaders.includes(header));
      result.anthropic_beta = [...existingHeaders, ...newHeaders];
    } else
      result.anthropic_beta = betaHeaders;
  return result;
}
