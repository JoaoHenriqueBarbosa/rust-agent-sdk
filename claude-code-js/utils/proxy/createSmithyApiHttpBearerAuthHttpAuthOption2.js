// function: createSmithyApiHttpBearerAuthHttpAuthOption2
function createSmithyApiHttpBearerAuthHttpAuthOption2(authParameters) {
  return {
    schemeId: "smithy.api#httpBearerAuth",
    propertiesExtractor: ({ profile: profile4, filepath, configFilepath, ignoreCache }, context) => ({
      identityProperties: {
        profile: profile4,
        filepath,
        configFilepath,
        ignoreCache
      }
    })
  };
}
