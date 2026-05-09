// function: extractFieldFromWwwAuth
function extractFieldFromWwwAuth(response7, fieldName) {
  let wwwAuthHeader = response7.headers.get("WWW-Authenticate");
  if (!wwwAuthHeader)
    return null;
  let pattern = new RegExp(`${fieldName}=(?:"([^"]+)"|([^\\s,]+))`), match = wwwAuthHeader.match(pattern);
  if (match)
    return match[1] || match[2];
  return null;
}
