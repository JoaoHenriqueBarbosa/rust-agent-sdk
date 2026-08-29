// function: createAwsAuthSigv4HttpAuthOption2
function createAwsAuthSigv4HttpAuthOption2(authParameters) {
  return {
    schemeId: "aws.auth#sigv4",
    signingProperties: {
      name: "bedrock",
      region: authParameters.region
    },
    propertiesExtractor: (config5, context) => ({
      signingProperties: {
        config: config5,
        context
      }
    })
  };
}
