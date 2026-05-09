// function: hasAnthropicApiKeyAuth
function hasAnthropicApiKeyAuth() {
  let { key, source } = getAnthropicApiKeyWithSource({
    skipRetrievingKeyFromApiKeyHelper: !0
  });
  return key !== null && source !== "none";
}
