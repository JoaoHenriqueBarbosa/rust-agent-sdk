// function: extractWWWAuthenticateParams
function extractWWWAuthenticateParams(res) {
  let authenticateHeader = res.headers.get("WWW-Authenticate");
  if (!authenticateHeader)
    return {};
  let [type, scheme] = authenticateHeader.split(" ");
  if (type.toLowerCase() !== "bearer" || !scheme)
    return {};
  let resourceMetadataMatch = extractFieldFromWwwAuth(res, "resource_metadata") || void 0, resourceMetadataUrl;
  if (resourceMetadataMatch)
    try {
      resourceMetadataUrl = new URL(resourceMetadataMatch);
    } catch {}
  let scope = extractFieldFromWwwAuth(res, "scope") || void 0, error44 = extractFieldFromWwwAuth(res, "error") || void 0;
  return {
    resourceMetadataUrl,
    scope,
    error: error44
  };
}
