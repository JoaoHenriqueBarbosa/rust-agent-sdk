// var: getExtendedInstanceMetadataCredentials
var getExtendedInstanceMetadataCredentials = (credentials, logger) => {
  let refreshInterval = 300 + Math.floor(Math.random() * 300), newExpiration = new Date(Date.now() + refreshInterval * 1000);
  logger.warn(`Attempting credential expiration extension due to a credential service availability issue. A refresh of these credentials will be attempted after ${new Date(newExpiration)}.
For more information, please visit: https://docs.aws.amazon.com/sdkref/latest/guide/feature-static-credentials.html`);
  let originalExpiration = credentials.originalExpiration ?? credentials.expiration;
  return {
    ...credentials,
    ...originalExpiration ? { originalExpiration } : {},
    expiration: newExpiration
  };
};
