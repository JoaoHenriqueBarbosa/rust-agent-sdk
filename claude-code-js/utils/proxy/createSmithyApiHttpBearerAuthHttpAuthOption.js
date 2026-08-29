// function: createSmithyApiHttpBearerAuthHttpAuthOption
function createSmithyApiHttpBearerAuthHttpAuthOption(authParameters) {
  return {
    schemeId: "smithy.api#httpBearerAuth",
    propertiesExtractor: ({ profile: profile3, filepath, configFilepath, ignoreCache }, context) => ({
      identityProperties: {
        profile: profile3,
        filepath,
        configFilepath,
        ignoreCache
      }
    })
  };
}
