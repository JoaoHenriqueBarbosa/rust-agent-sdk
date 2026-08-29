// function: buildFullPath
function buildFullPath(baseURL, requestedURL, allowAbsoluteUrls) {
  let isRelativeUrl = !isAbsoluteURL2(requestedURL);
  if (baseURL && (isRelativeUrl || allowAbsoluteUrls == !1))
    return combineURLs(baseURL, requestedURL);
  return requestedURL;
}
