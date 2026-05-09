// function: getConfiguredOtelHeadersHelper
function getConfiguredOtelHeadersHelper() {
  return (getSettings_DEPRECATED() || {}).otelHeadersHelper;
}
