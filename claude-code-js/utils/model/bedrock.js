// Original: src/utils/model/bedrock.ts
function findFirstMatch(profiles, substring) {
  return profiles.find((p3) => p3.includes(substring)) ?? null;
}
async function createBedrockClient() {
  let { BedrockClient: BedrockClient3 } = await Promise.resolve().then(() => (init_dist_es21(), exports_dist_es11)), region = getAWSRegion(), skipAuth = isEnvTruthy(process.env.CLAUDE_CODE_SKIP_BEDROCK_AUTH), clientConfig = {
    region,
    ...process.env.ANTHROPIC_BEDROCK_BASE_URL && {
      endpoint: process.env.ANTHROPIC_BEDROCK_BASE_URL
    },
    ...await getAWSClientProxyConfig(),
    ...skipAuth && {
      requestHandler: new (await Promise.resolve().then(() => __toESM(require_dist_cjs5(), 1))).NodeHttpHandler,
      httpAuthSchemes: [
        {
          schemeId: "smithy.api#noAuth",
          identityProvider: () => async () => ({}),
          signer: new (await Promise.resolve().then(() => __toESM(require_dist_cjs37(), 1))).NoAuthSigner
        }
      ],
      httpAuthSchemeProvider: () => [{ schemeId: "smithy.api#noAuth" }]
    }
  };
  if (!skipAuth && !process.env.AWS_BEARER_TOKEN_BEDROCK) {
    let cachedCredentials = await refreshAndGetAwsCredentials();
    if (cachedCredentials)
      clientConfig.credentials = {
        accessKeyId: cachedCredentials.accessKeyId,
        secretAccessKey: cachedCredentials.secretAccessKey,
        sessionToken: cachedCredentials.sessionToken
      };
  }
  return new BedrockClient3(clientConfig);
}
async function createBedrockRuntimeClient() {
  let { BedrockRuntimeClient: BedrockRuntimeClient3 } = await Promise.resolve().then(() => (init_dist_es39(), exports_dist_es13)), region = getAWSRegion(), skipAuth = isEnvTruthy(process.env.CLAUDE_CODE_SKIP_BEDROCK_AUTH), clientConfig = {
    region,
    ...process.env.ANTHROPIC_BEDROCK_BASE_URL && {
      endpoint: process.env.ANTHROPIC_BEDROCK_BASE_URL
    },
    ...await getAWSClientProxyConfig(),
    ...skipAuth && {
      requestHandler: new (await Promise.resolve().then(() => __toESM(require_dist_cjs5(), 1))).NodeHttpHandler,
      httpAuthSchemes: [
        {
          schemeId: "smithy.api#noAuth",
          identityProvider: () => async () => ({}),
          signer: new (await Promise.resolve().then(() => __toESM(require_dist_cjs37(), 1))).NoAuthSigner
        }
      ],
      httpAuthSchemeProvider: () => [{ schemeId: "smithy.api#noAuth" }]
    }
  };
  if (!skipAuth && !process.env.AWS_BEARER_TOKEN_BEDROCK) {
    let cachedCredentials = await refreshAndGetAwsCredentials();
    if (cachedCredentials)
      clientConfig.credentials = {
        accessKeyId: cachedCredentials.accessKeyId,
        secretAccessKey: cachedCredentials.secretAccessKey,
        sessionToken: cachedCredentials.sessionToken
      };
  }
  return new BedrockRuntimeClient3(clientConfig);
}
function isFoundationModel(modelId) {
  return modelId.startsWith("anthropic.");
}
function extractModelIdFromArn(modelId) {
  if (!modelId.startsWith("arn:"))
    return modelId;
  let lastSlashIndex = modelId.lastIndexOf("/");
  if (lastSlashIndex === -1)
    return modelId;
  return modelId.substring(lastSlashIndex + 1);
}
function getBedrockRegionPrefix(modelId) {
  let effectiveModelId = extractModelIdFromArn(modelId);
  for (let prefix of BEDROCK_REGION_PREFIXES)
    if (effectiveModelId.startsWith(`${prefix}.anthropic.`))
      return prefix;
  return;
}
function applyBedrockRegionPrefix(modelId, prefix) {
  let existingPrefix = getBedrockRegionPrefix(modelId);
  if (existingPrefix)
    return modelId.replace(`${existingPrefix}.`, `${prefix}.`);
  if (isFoundationModel(modelId))
    return `${prefix}.${modelId}`;
  return modelId;
}
var getBedrockInferenceProfiles, getInferenceProfileBackingModel, BEDROCK_REGION_PREFIXES;
var init_bedrock = __esm(() => {
  init_memoize();
  init_auth14();
  init_envUtils();
  init_log3();
  init_proxy();
  getBedrockInferenceProfiles = memoize_default(async function() {
    let [client7, { ListInferenceProfilesCommand: ListInferenceProfilesCommand3 }] = await Promise.all([
      createBedrockClient(),
      Promise.resolve().then(() => (init_dist_es21(), exports_dist_es11))
    ]), allProfiles = [], nextToken;
    try {
      do {
        let command7 = new ListInferenceProfilesCommand3({
          ...nextToken && { nextToken },
          typeEquals: "SYSTEM_DEFINED"
        }), response4 = await client7.send(command7);
        if (response4.inferenceProfileSummaries)
          allProfiles.push(...response4.inferenceProfileSummaries);
        nextToken = response4.nextToken;
      } while (nextToken);
      return allProfiles.filter((profile4) => profile4.inferenceProfileId?.includes("anthropic")).map((profile4) => profile4.inferenceProfileId).filter(Boolean);
    } catch (error41) {
      throw logError2(error41), error41;
    }
  });
  getInferenceProfileBackingModel = memoize_default(async function(profileId) {
    try {
      let [client7, { GetInferenceProfileCommand: GetInferenceProfileCommand3 }] = await Promise.all([
        createBedrockClient(),
        Promise.resolve().then(() => (init_dist_es21(), exports_dist_es11))
      ]), command7 = new GetInferenceProfileCommand3({
        inferenceProfileIdentifier: profileId
      }), response4 = await client7.send(command7);
      if (!response4.models || response4.models.length === 0)
        return null;
      let primaryModel = response4.models[0];
      if (!primaryModel?.modelArn)
        return null;
      let lastSlashIndex = primaryModel.modelArn.lastIndexOf("/");
      return lastSlashIndex >= 0 ? primaryModel.modelArn.substring(lastSlashIndex + 1) : primaryModel.modelArn;
    } catch (error41) {
      return logError2(error41), null;
    }
  });
  BEDROCK_REGION_PREFIXES = ["us", "eu", "apac", "global"];
});
