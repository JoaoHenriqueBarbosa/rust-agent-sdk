// function: fromCognitoIdentity
function fromCognitoIdentity(parameters) {
  return async (awsIdentityProperties) => {
    parameters.logger?.debug("@aws-sdk/credential-provider-cognito-identity - fromCognitoIdentity");
    let { GetCredentialsForIdentityCommand: GetCredentialsForIdentityCommand2, CognitoIdentityClient: CognitoIdentityClient2 } = await Promise.resolve().then(() => (init_loadCognitoIdentity(), exports_loadCognitoIdentity)), fromConfigs = (property2) => parameters.clientConfig?.[property2] ?? parameters.parentClientConfig?.[property2] ?? awsIdentityProperties?.callerClientConfig?.[property2], { Credentials: { AccessKeyId = throwOnMissingAccessKeyId(parameters.logger), Expiration, SecretKey = throwOnMissingSecretKey(parameters.logger), SessionToken } = throwOnMissingCredentials(parameters.logger) } = await (parameters.client ?? new CognitoIdentityClient2(Object.assign({}, parameters.clientConfig ?? {}, {
      region: fromConfigs("region"),
      profile: fromConfigs("profile"),
      userAgentAppId: fromConfigs("userAgentAppId")
    }))).send(new GetCredentialsForIdentityCommand2({
      CustomRoleArn: parameters.customRoleArn,
      IdentityId: parameters.identityId,
      Logins: parameters.logins ? await resolveLogins(parameters.logins) : void 0
    }));
    return {
      identityId: parameters.identityId,
      accessKeyId: AccessKeyId,
      secretAccessKey: SecretKey,
      sessionToken: SessionToken,
      expiration: Expiration
    };
  };
}
