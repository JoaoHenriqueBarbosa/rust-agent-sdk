// function: addScopes
function addScopes(parameters, scopes, addOidcScopes = !0, defaultScopes = OIDC_DEFAULT_SCOPES) {
  if (addOidcScopes && !defaultScopes.includes("openid") && !scopes.includes("openid"))
    defaultScopes.push("openid");
  let requestScopes = addOidcScopes ? [...scopes || [], ...defaultScopes] : scopes || [], scopeSet = new ScopeSet(requestScopes);
  parameters.set(SCOPE, scopeSet.printScopes());
}
