// function: createClientPipeline
function createClientPipeline(options = {}) {
  let pipeline2 = createPipelineFromOptions(options ?? {});
  if (options.credentialOptions)
    pipeline2.addPolicy(bearerTokenAuthenticationPolicy({
      credential: options.credentialOptions.credential,
      scopes: options.credentialOptions.credentialScopes
    }));
  return pipeline2.addPolicy(serializationPolicy(options.serializationOptions), { phase: "Serialize" }), pipeline2.addPolicy(deserializationPolicy(options.deserializationOptions), {
    phase: "Deserialize"
  }), pipeline2;
}
