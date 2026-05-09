// function: generateAppMetadataKey
function generateAppMetadataKey({ environment, clientId }) {
  return [
    APP_METADATA,
    environment,
    clientId
  ].join(CACHE_KEY_SEPARATOR).toLowerCase();
}
