// function: processMultiTenantRequest
function processMultiTenantRequest(tenantId, getTokenOptions, additionallyAllowedTenantIds = [], logger14) {
  let resolvedTenantId;
  if (process.env.AZURE_IDENTITY_DISABLE_MULTITENANTAUTH)
    resolvedTenantId = tenantId;
  else if (tenantId === "adfs")
    resolvedTenantId = tenantId;
  else
    resolvedTenantId = getTokenOptions?.tenantId ?? tenantId;
  if (tenantId && resolvedTenantId !== tenantId && !additionallyAllowedTenantIds.includes("*") && !additionallyAllowedTenantIds.some((t2) => t2.localeCompare(resolvedTenantId) === 0)) {
    let message = createConfigurationErrorMessage(resolvedTenantId);
    throw logger14?.info(message), new CredentialUnavailableError(message);
  }
  return resolvedTenantId;
}
