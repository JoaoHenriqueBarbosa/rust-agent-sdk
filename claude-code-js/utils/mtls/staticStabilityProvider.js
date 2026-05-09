// var: staticStabilityProvider
var staticStabilityProvider = (provider, options = {}) => {
  let logger = options?.logger || console, pastCredentials;
  return async () => {
    let credentials;
    try {
      if (credentials = await provider(), credentials.expiration && credentials.expiration.getTime() < Date.now())
        credentials = getExtendedInstanceMetadataCredentials(credentials, logger);
    } catch (e) {
      if (pastCredentials)
        logger.warn("Credential renew failed: ", e), credentials = getExtendedInstanceMetadataCredentials(pastCredentials, logger);
      else
        throw e;
    }
    return pastCredentials = credentials, credentials;
  };
};
