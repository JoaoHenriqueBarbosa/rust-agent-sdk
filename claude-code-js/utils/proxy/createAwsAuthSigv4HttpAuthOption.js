// function: createAwsAuthSigv4HttpAuthOption
function createAwsAuthSigv4HttpAuthOption(authParameters) {
  return {
    schemeId: "aws.auth#sigv4",
    signingProperties: {
      name: "bedrock",
      region: authParameters.region
    },
    propertiesExtractor: (config4, context) => ({
      signingProperties: {
        config: config4,
        context
      }
    })
  };
}
