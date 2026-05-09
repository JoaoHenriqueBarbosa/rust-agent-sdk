// var: require_client
var require_client = __commonJS((exports) => {
  var state = {
    warningEmitted: !1
  }, emitWarningIfUnsupportedVersion = (version2) => {
    if (version2 && !state.warningEmitted && parseInt(version2.substring(1, version2.indexOf("."))) < 20)
      state.warningEmitted = !0, process.emitWarning(`NodeDeprecationWarning: The AWS SDK for JavaScript (v3) will
no longer support Node.js ${version2} in January 2026.

To continue receiving updates to AWS services, bug fixes, and security
updates please upgrade to a supported Node.js LTS version.

More information can be found at: https://a.co/c895JFp`);
  };
  function setCredentialFeature(credentials, feature, value) {
    if (!credentials.$source)
      credentials.$source = {};
    return credentials.$source[feature] = value, credentials;
  }
  function setFeature(context, feature, value) {
    if (!context.__aws_sdk_context)
      context.__aws_sdk_context = {
        features: {}
      };
    else if (!context.__aws_sdk_context.features)
      context.__aws_sdk_context.features = {};
    context.__aws_sdk_context.features[feature] = value;
  }
  function setTokenFeature(token, feature, value) {
    if (!token.$source)
      token.$source = {};
    return token.$source[feature] = value, token;
  }
  exports.emitWarningIfUnsupportedVersion = emitWarningIfUnsupportedVersion;
  exports.setCredentialFeature = setCredentialFeature;
  exports.setFeature = setFeature;
  exports.setTokenFeature = setTokenFeature;
  exports.state = state;
});
