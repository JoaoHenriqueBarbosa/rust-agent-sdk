// function: prepareInvalidRequestOptions
function prepareInvalidRequestOptions(scopes) {
  if (!mapScopesToResource(scopes))
    throw Error(`${msiName}: Multiple scopes are not supported.`);
  let url3 = new URL(imdsEndpointPath, process.env.AZURE_POD_IDENTITY_AUTHORITY_HOST ?? imdsHost), rawHeaders = {
    Accept: "application/json"
  };
  return {
    url: `${url3}`,
    method: "GET",
    headers: createHttpHeaders2(rawHeaders)
  };
}
