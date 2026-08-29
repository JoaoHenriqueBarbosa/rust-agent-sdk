// function: withOAuth401Retry
async function withOAuth401Retry(request2, opts) {
  try {
    return await request2();
  } catch (err) {
    if (!axios_default.isAxiosError(err))
      throw err;
    let status = err.response?.status;
    if (!(status === 401 || opts?.also403Revoked && status === 403 && typeof err.response?.data === "string" && err.response.data.includes("OAuth token has been revoked")))
      throw err;
    let failedAccessToken = getClaudeAIOAuthTokens()?.accessToken;
    if (!failedAccessToken)
      throw err;
    return await handleOAuth401Error(failedAccessToken), await request2();
  }
}
