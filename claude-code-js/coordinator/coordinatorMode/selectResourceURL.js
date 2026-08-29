// function: selectResourceURL
async function selectResourceURL(serverUrl, provider5, resourceMetadata) {
  let defaultResource = resourceUrlFromServerUrl(serverUrl);
  if (provider5.validateResourceURL)
    return await provider5.validateResourceURL(defaultResource, resourceMetadata?.resource);
  if (!resourceMetadata)
    return;
  if (!checkResourceAllowed({ requestedResource: defaultResource, configuredResource: resourceMetadata.resource }))
    throw Error(`Protected resource ${resourceMetadata.resource} does not match expected ${defaultResource} (or origin)`);
  return new URL(resourceMetadata.resource);
}
