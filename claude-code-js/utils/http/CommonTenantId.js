// var: CommonTenantId
var CommonTenantId = "common", VSCodeClientId = "aebc6443-996d-45c2-90f0-388ff96faa56", logger26, unsupportedTenantIds;
var init_visualStudioCodeCredential = __esm(() => {
  init_logging();
  init_tenantIdUtils();
  init_errors7();
  init_tenantIdUtils();
  init_msalClient();
  init_scopeUtils();
  init_msalPlugins();
  init_utils4();
  logger26 = credentialLogger("VisualStudioCodeCredential"), unsupportedTenantIds = {
    adfs: "The VisualStudioCodeCredential does not support authentication with ADFS tenants."
  };
});
