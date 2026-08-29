// function: resolveTenantId
function resolveTenantId(logger14, tenantId, clientId) {
  if (tenantId)
    return checkTenantId(logger14, tenantId), tenantId;
  if (!clientId)
    clientId = DeveloperSignOnClientId;
  if (clientId !== DeveloperSignOnClientId)
    return "common";
  return "organizations";
}
