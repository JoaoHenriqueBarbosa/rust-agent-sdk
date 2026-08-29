// function: getAuthCodeRequestUrl
function getAuthCodeRequestUrl(config8, authority, request2, logger10) {
  let parameters = exports_Authorize.getStandardAuthorizeRequestParameters({
    ...config8.auth,
    authority,
    redirectUri: request2.redirectUri || ""
  }, request2, logger10);
  if (exports_RequestParameterBuilder.addLibraryInfo(parameters, {
    sku: Constants.MSAL_SKU,
    version: version4,
    cpu: process.arch || "",
    os: process.platform || ""
  }), config8.system.protocolMode !== ProtocolMode.OIDC)
    exports_RequestParameterBuilder.addApplicationTelemetry(parameters, config8.telemetry.application);
  if (exports_RequestParameterBuilder.addResponseType(parameters, exports_Constants.OAuthResponseType.CODE), request2.codeChallenge && request2.codeChallengeMethod)
    exports_RequestParameterBuilder.addCodeChallengeParams(parameters, request2.codeChallenge, request2.codeChallengeMethod);
  return exports_RequestParameterBuilder.addExtraParameters(parameters, request2.extraQueryParameters || {}), exports_Authorize.getAuthorizeUrl(authority, parameters);
}
