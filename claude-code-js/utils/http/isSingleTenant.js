// function: isSingleTenant
function isSingleTenant(accountEntity) {
  return !accountEntity.tenantProfiles;
}
