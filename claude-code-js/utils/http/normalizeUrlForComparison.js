// function: normalizeUrlForComparison
function normalizeUrlForComparison(url3) {
  if (!url3)
    return url3;
  let urlWithoutHash = url3.split("#")[0];
  try {
    let urlObj = new URL(urlWithoutHash), normalizedUrl = urlObj.origin + urlObj.pathname + urlObj.search;
    return canonicalizeUrl(normalizedUrl);
  } catch (e) {
    return canonicalizeUrl(urlWithoutHash);
  }
}
