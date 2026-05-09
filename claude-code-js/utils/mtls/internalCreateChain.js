// var: internalCreateChain
var internalCreateChain = (providers) => async (awsIdentityProperties) => {
  let lastProviderError;
  for (let provider of providers)
    try {
      return await provider(awsIdentityProperties);
    } catch (err) {
      if (lastProviderError = err, err?.tryNextLink)
        continue;
      throw err;
    }
  throw lastProviderError;
};
