// function: resolveAdditionallyAllowedTenantIds
function resolveAdditionallyAllowedTenantIds(additionallyAllowedTenants) {
  if (!additionallyAllowedTenants || additionallyAllowedTenants.length === 0)
    return [];
  if (additionallyAllowedTenants.includes("*"))
    return ALL_TENANTS;
  return additionallyAllowedTenants;
}
