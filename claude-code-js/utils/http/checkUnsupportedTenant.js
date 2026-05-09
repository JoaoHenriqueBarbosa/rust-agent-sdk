// function: checkUnsupportedTenant
function checkUnsupportedTenant(tenantId) {
  let unsupportedTenantError = unsupportedTenantIds[tenantId];
  if (unsupportedTenantError)
    throw new CredentialUnavailableError(unsupportedTenantError);
}
