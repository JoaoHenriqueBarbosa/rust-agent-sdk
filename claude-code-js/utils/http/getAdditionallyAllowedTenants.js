// function: getAdditionallyAllowedTenants
function getAdditionallyAllowedTenants() {
  return (process.env.AZURE_ADDITIONALLY_ALLOWED_TENANTS ?? "").split(";");
}
