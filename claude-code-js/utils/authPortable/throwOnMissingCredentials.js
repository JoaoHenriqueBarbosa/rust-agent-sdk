// function: throwOnMissingCredentials
function throwOnMissingCredentials(logger5) {
  throw new import_property_provider30.CredentialsProviderError("Response from Amazon Cognito contained no credentials", { logger: logger5 });
}
