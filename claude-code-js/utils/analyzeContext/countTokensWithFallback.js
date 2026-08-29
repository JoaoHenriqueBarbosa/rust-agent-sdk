// function: countTokensWithFallback
async function countTokensWithFallback(messages, tools) {
  try {
    let result = await countMessagesTokensWithAPI(messages, tools);
    if (result !== null)
      return result;
    logForDebugging(`countTokensWithFallback: API returned null, trying haiku fallback (${tools.length} tools)`);
  } catch (err2) {
    logForDebugging(`countTokensWithFallback: API failed: ${errorMessage(err2)}`), logError2(err2);
  }
  try {
    let fallbackResult = await countTokensViaHaikuFallback(messages, tools);
    if (fallbackResult === null)
      logForDebugging(`countTokensWithFallback: haiku fallback also returned null (${tools.length} tools)`);
    return fallbackResult;
  } catch (err2) {
    return logForDebugging(`countTokensWithFallback: haiku fallback failed: ${errorMessage(err2)}`), logError2(err2), null;
  }
}
