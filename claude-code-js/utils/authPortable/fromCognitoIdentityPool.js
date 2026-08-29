// function: fromCognitoIdentityPool
function fromCognitoIdentityPool({ accountId, cache: cache4 = localStorage2(), client: client9, clientConfig, customRoleArn, identityPoolId, logins, userIdentifier = !logins || Object.keys(logins).length === 0 ? "ANONYMOUS" : void 0, logger: logger5, parentClientConfig }) {
  logger5?.debug("@aws-sdk/credential-provider-cognito-identity - fromCognitoIdentity");
  let cacheKey = userIdentifier ? `aws:cognito-identity-credentials:${identityPoolId}:${userIdentifier}` : void 0, provider3 = async (awsIdentityProperties) => {
    let { GetIdCommand: GetIdCommand2, CognitoIdentityClient: CognitoIdentityClient2 } = await Promise.resolve().then(() => (init_loadCognitoIdentity(), exports_loadCognitoIdentity)), fromConfigs = (property2) => clientConfig?.[property2] ?? parentClientConfig?.[property2] ?? awsIdentityProperties?.callerClientConfig?.[property2], _client = client9 ?? new CognitoIdentityClient2(Object.assign({}, clientConfig ?? {}, {
      region: fromConfigs("region"),
      profile: fromConfigs("profile"),
      userAgentAppId: fromConfigs("userAgentAppId")
    })), identityId = cacheKey && await cache4.getItem(cacheKey);
    if (!identityId) {
      let { IdentityId = throwOnMissingId(logger5) } = await _client.send(new GetIdCommand2({
        AccountId: accountId,
        IdentityPoolId: identityPoolId,
        Logins: logins ? await resolveLogins(logins) : void 0
      }));
      if (identityId = IdentityId, cacheKey)
        Promise.resolve(cache4.setItem(cacheKey, identityId)).catch(() => {});
    }
    return provider3 = fromCognitoIdentity({
      client: _client,
      customRoleArn,
      logins,
      identityId
    }), provider3(awsIdentityProperties);
  };
  return (awsIdentityProperties) => provider3(awsIdentityProperties).catch(async (err) => {
    if (cacheKey)
      Promise.resolve(cache4.removeItem(cacheKey)).catch(() => {});
    throw err;
  });
}
