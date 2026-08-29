// function: getKnownAuthorities
function getKnownAuthorities(tenantId, authorityHost, disableInstanceDiscovery) {
  if (tenantId === "adfs" && authorityHost || disableInstanceDiscovery)
    return [authorityHost];
  return [];
}
