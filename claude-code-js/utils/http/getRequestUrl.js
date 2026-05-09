// function: getRequestUrl
function getRequestUrl(baseUri, operationSpec, operationArguments, fallbackObject) {
  let urlReplacements = calculateUrlReplacements(operationSpec, operationArguments, fallbackObject), isAbsolutePath = !1, requestUrl = replaceAll(baseUri, urlReplacements);
  if (operationSpec.path) {
    let path11 = replaceAll(operationSpec.path, urlReplacements);
    if (operationSpec.path === "/{nextLink}" && path11.startsWith("/"))
      path11 = path11.substring(1);
    if (isAbsoluteUrl(path11))
      requestUrl = path11, isAbsolutePath = !0;
    else
      requestUrl = appendPath(requestUrl, path11);
  }
  let { queryParams, sequenceParams } = calculateQueryParameters(operationSpec, operationArguments, fallbackObject);
  return requestUrl = appendQueryParams(requestUrl, queryParams, sequenceParams, isAbsolutePath), requestUrl;
}
