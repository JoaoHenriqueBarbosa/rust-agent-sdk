// function: createDefaultPipeline
function createDefaultPipeline(options) {
  let credentialScopes = getCredentialScopes(options), credentialOptions = options.credential && credentialScopes ? { credentialScopes, credential: options.credential } : void 0;
  return createClientPipeline({
    ...options,
    credentialOptions
  });
}
