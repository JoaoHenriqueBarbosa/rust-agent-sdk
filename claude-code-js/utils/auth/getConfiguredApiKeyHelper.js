// function: getConfiguredApiKeyHelper
function getConfiguredApiKeyHelper() {
  return (getSettings_DEPRECATED() || {}).apiKeyHelper;
}
