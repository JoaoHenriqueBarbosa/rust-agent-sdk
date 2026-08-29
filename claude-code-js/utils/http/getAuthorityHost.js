// function: getAuthorityHost
function getAuthorityHost(options) {
  let authorityHost = options?.authorityHost;
  if (!authorityHost && isNodeLike2)
    authorityHost = process.env.AZURE_AUTHORITY_HOST;
  return authorityHost ?? DefaultAuthorityHost;
}
