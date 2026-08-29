// function: getAuthority
function getAuthority(tenantId, host) {
  if (!host)
    host = DefaultAuthorityHost;
  if (new RegExp(`${tenantId}/?$`).test(host))
    return host;
  if (host.endsWith("/"))
    return host + tenantId;
  else
    return `${host}/${tenantId}`;
}
