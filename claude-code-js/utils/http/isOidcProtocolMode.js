// function: isOidcProtocolMode
function isOidcProtocolMode(config8) {
  return config8.authOptions.authority.options.protocolMode === ProtocolMode.OIDC;
}
