// function: throwOnMissingSecretKey
function throwOnMissingSecretKey(logger5) {
  throw new import_property_provider30.CredentialsProviderError("Response from Amazon Cognito contained no secret key", { logger: logger5 });
}
