// function: getAuthorizeUrl
function getAuthorizeUrl(authority, requestParameters) {
  let queryString = mapToQueryString(requestParameters);
  return UrlString.appendQueryString(authority.authorizationEndpoint, queryString);
}
