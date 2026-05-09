// function: getApiKeyHelperElapsedMs
function getApiKeyHelperElapsedMs() {
  let startedAt = _apiKeyHelperInflight?.startedAt;
  return startedAt ? Date.now() - startedAt : 0;
}
