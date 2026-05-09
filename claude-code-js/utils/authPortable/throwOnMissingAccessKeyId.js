// function: throwOnMissingAccessKeyId
function throwOnMissingAccessKeyId(logger5) {
  throw new import_property_provider30.CredentialsProviderError("Response from Amazon Cognito contained no access key ID", { logger: logger5 });
}
