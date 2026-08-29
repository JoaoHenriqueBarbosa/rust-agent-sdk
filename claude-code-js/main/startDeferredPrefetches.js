// function: startDeferredPrefetches
function startDeferredPrefetches() {
  if (isEnvTruthy(process.env.CLAUDE_CODE_EXIT_AFTER_FIRST_RENDER) || isBareMode())
    return;
  if (initUser(), getUserContext(), prefetchSystemContextIfSafe(), getRelevantTips(), isEnvTruthy(process.env.CLAUDE_CODE_USE_BEDROCK) && !isEnvTruthy(process.env.CLAUDE_CODE_SKIP_BEDROCK_AUTH))
    prefetchAwsCredentialsAndBedRockInfoIfSafe();
  if (isEnvTruthy(process.env.CLAUDE_CODE_USE_VERTEX) && !isEnvTruthy(process.env.CLAUDE_CODE_SKIP_VERTEX_AUTH))
    prefetchGcpCredentialsIfSafe();
  if (countFilesRoundedRg(getCwd(), AbortSignal.timeout(3000), []), initializeAnalyticsGates(), prefetchOfficialMcpUrls(), refreshModelCapabilities(), settingsChangeDetector.initialize(), !isBareMode())
    skillChangeDetector.initialize();
}
