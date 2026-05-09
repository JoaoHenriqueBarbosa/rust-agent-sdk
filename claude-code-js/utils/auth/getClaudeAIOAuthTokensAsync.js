// function: getClaudeAIOAuthTokensAsync
async function getClaudeAIOAuthTokensAsync() {
  if (process.env.CLAUDE_CODE_OAUTH_TOKEN || getOAuthTokenFromFileDescriptor())
    return getClaudeAIOAuthTokens();
  try {
    let oauthData = (await getSecureStorage().readAsync())?.claudeAiOauth;
    if (!oauthData?.accessToken)
      return null;
    return oauthData;
  } catch (error44) {
    return logError2(error44), null;
  }
}
