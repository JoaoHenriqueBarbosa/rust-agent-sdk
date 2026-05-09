// var: getCanonicalHeaders
var getCanonicalHeaders = ({ headers }, unsignableHeaders, signableHeaders) => {
  let canonical = {};
  for (let headerName of Object.keys(headers).sort()) {
    if (headers[headerName] == null)
      continue;
    let canonicalHeaderName = headerName.toLowerCase();
    if (canonicalHeaderName in ALWAYS_UNSIGNABLE_HEADERS || unsignableHeaders?.has(canonicalHeaderName) || PROXY_HEADER_PATTERN.test(canonicalHeaderName) || SEC_HEADER_PATTERN.test(canonicalHeaderName)) {
      if (!signableHeaders || signableHeaders && !signableHeaders.has(canonicalHeaderName))
        continue;
    }
    canonical[canonicalHeaderName] = headers[headerName].trim().replace(/\s+/g, " ");
  }
  return canonical;
};
