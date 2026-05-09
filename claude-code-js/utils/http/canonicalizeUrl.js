// function: canonicalizeUrl
function canonicalizeUrl(url3) {
  if (!url3)
    return url3;
  let lowerCaseUrl = url3.toLowerCase();
  if (StringUtils.endsWith(lowerCaseUrl, "?"))
    lowerCaseUrl = lowerCaseUrl.slice(0, -1);
  else if (StringUtils.endsWith(lowerCaseUrl, "?/"))
    lowerCaseUrl = lowerCaseUrl.slice(0, -2);
  if (!StringUtils.endsWith(lowerCaseUrl, "/"))
    lowerCaseUrl += "/";
  return lowerCaseUrl;
}
