// class: ScopeSet
class ScopeSet {
  constructor(inputScopes) {
    let scopeArr = inputScopes ? StringUtils.trimArrayEntries([...inputScopes]) : [], filteredInput = scopeArr ? StringUtils.removeEmptyStringsFromArray(scopeArr) : [];
    if (!filteredInput || !filteredInput.length)
      throw createClientConfigurationError(emptyInputScopesError);
    this.scopes = /* @__PURE__ */ new Set, filteredInput.forEach((scope) => this.scopes.add(scope));
  }
  static fromString(inputScopeString) {
    let inputScopes = (inputScopeString || "").split(" ");
    return new ScopeSet(inputScopes);
  }
  static createSearchScopes(inputScopeString) {
    let scopesToUse = inputScopeString && inputScopeString.length > 0 ? inputScopeString : [...OIDC_DEFAULT_SCOPES], scopeSet = new ScopeSet(scopesToUse);
    if (!scopeSet.containsOnlyOIDCScopes())
      scopeSet.removeOIDCScopes();
    else
      scopeSet.removeScope(OFFLINE_ACCESS_SCOPE);
    return scopeSet;
  }
  containsScope(scope) {
    let lowerCaseScopes = this.printScopesLowerCase().split(" "), lowerCaseScopesSet = new ScopeSet(lowerCaseScopes);
    return scope ? lowerCaseScopesSet.scopes.has(scope.toLowerCase()) : !1;
  }
  containsScopeSet(scopeSet) {
    if (!scopeSet || scopeSet.scopes.size <= 0)
      return !1;
    return this.scopes.size >= scopeSet.scopes.size && scopeSet.asArray().every((scope) => this.containsScope(scope));
  }
  containsOnlyOIDCScopes() {
    let defaultScopeCount = 0;
    return OIDC_SCOPES.forEach((defaultScope) => {
      if (this.containsScope(defaultScope))
        defaultScopeCount += 1;
    }), this.scopes.size === defaultScopeCount;
  }
  appendScope(newScope) {
    if (newScope)
      this.scopes.add(newScope.trim());
  }
  appendScopes(newScopes) {
    try {
      newScopes.forEach((newScope) => this.appendScope(newScope));
    } catch (e) {
      throw createClientAuthError(cannotAppendScopeSet);
    }
  }
  removeScope(scope) {
    if (!scope)
      throw createClientAuthError(cannotRemoveEmptyScope);
    this.scopes.delete(scope.trim());
  }
  removeOIDCScopes() {
    OIDC_SCOPES.forEach((defaultScope) => {
      this.scopes.delete(defaultScope);
    });
  }
  unionScopeSets(otherScopes) {
    if (!otherScopes)
      throw createClientAuthError(emptyInputScopeSet);
    let unionScopes = /* @__PURE__ */ new Set;
    return otherScopes.scopes.forEach((scope) => unionScopes.add(scope.toLowerCase())), this.scopes.forEach((scope) => unionScopes.add(scope.toLowerCase())), unionScopes;
  }
  intersectingScopeSets(otherScopes) {
    if (!otherScopes)
      throw createClientAuthError(emptyInputScopeSet);
    if (!otherScopes.containsOnlyOIDCScopes())
      otherScopes.removeOIDCScopes();
    let unionScopes = this.unionScopeSets(otherScopes), sizeOtherScopes = otherScopes.getScopeCount(), sizeThisScopes = this.getScopeCount();
    return unionScopes.size < sizeThisScopes + sizeOtherScopes;
  }
  getScopeCount() {
    return this.scopes.size;
  }
  asArray() {
    let array2 = [];
    return this.scopes.forEach((val) => array2.push(val)), array2;
  }
  printScopes() {
    if (this.scopes)
      return this.asArray().join(" ");
    return "";
  }
  printScopesLowerCase() {
    return this.printScopes().toLowerCase();
  }
}
