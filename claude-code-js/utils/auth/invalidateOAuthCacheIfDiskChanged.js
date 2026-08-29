// function: invalidateOAuthCacheIfDiskChanged
async function invalidateOAuthCacheIfDiskChanged() {
  try {
    let { mtimeMs } = await stat5(join23(getClaudeConfigHomeDir(), ".credentials.json"));
    if (mtimeMs !== lastCredentialsMtimeMs)
      lastCredentialsMtimeMs = mtimeMs, clearOAuthTokenCache();
  } catch {
    getClaudeAIOAuthTokens.cache?.clear?.();
  }
}
