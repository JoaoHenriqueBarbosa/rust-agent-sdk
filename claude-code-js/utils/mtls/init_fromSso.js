// var: init_fromSso
var init_fromSso = __esm(() => {
  init_getNewSsoOidcToken();
  init_validateTokenExpiry();
  init_validateTokenKey();
  init_writeSSOTokenToFile();
  import_property_provider12 = __toESM(require_dist_cjs6(), 1), import_shared_ini_file_loader2 = __toESM(require_dist_cjs8(), 1), lastRefreshAttemptTime = /* @__PURE__ */ new Date(0);
});
