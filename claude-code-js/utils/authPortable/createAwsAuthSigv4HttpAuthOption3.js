// function: createAwsAuthSigv4HttpAuthOption3
function createAwsAuthSigv4HttpAuthOption3(authParameters) {
  return {
    schemeId: "aws.auth#sigv4",
    signingProperties: {
      name: "sts",
      region: authParameters.region
    },
    propertiesExtractor: (config6, context) => ({
      signingProperties: {
        config: config6,
        context
      }
    })
  };
}
