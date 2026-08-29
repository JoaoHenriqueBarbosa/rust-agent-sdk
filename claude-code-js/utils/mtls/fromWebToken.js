// var: fromWebToken
var fromWebToken = (init) => async (awsIdentityProperties) => {
  init.logger?.debug("@aws-sdk/credential-provider-web-identity - fromWebToken");
  let { roleArn, roleSessionName, webIdentityToken, providerId, policyArns, policy, durationSeconds } = init, { roleAssumerWithWebIdentity } = init;
  if (!roleAssumerWithWebIdentity) {
    let { getDefaultRoleAssumerWithWebIdentity } = await Promise.resolve().then(() => __toESM(require_sts(), 1));
    roleAssumerWithWebIdentity = getDefaultRoleAssumerWithWebIdentity({
      ...init.clientConfig,
      credentialProviderLogger: init.logger,
      parentClientConfig: {
        ...awsIdentityProperties?.callerClientConfig,
        ...init.parentClientConfig
      }
    }, init.clientPlugins);
  }
  return roleAssumerWithWebIdentity({
    RoleArn: roleArn,
    RoleSessionName: roleSessionName ?? `aws-sdk-js-session-${Date.now()}`,
    WebIdentityToken: webIdentityToken,
    ProviderId: providerId,
    PolicyArns: policyArns,
    Policy: policy,
    DurationSeconds: durationSeconds
  });
};
