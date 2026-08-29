// class: CacheManager
class CacheManager {
  constructor(clientId, cryptoImpl, logger10, performanceClient, staticAuthorityOptions) {
    this.clientId = clientId, this.cryptoImpl = cryptoImpl, this.commonLogger = logger10.clone(name, version2), this.staticAuthorityOptions = staticAuthorityOptions, this.performanceClient = performanceClient;
  }
  getAllAccounts(accountFilter = {}, correlationId) {
    return this.buildTenantProfiles(this.getAccountsFilteredBy(accountFilter, correlationId), correlationId, accountFilter);
  }
  getAccountInfoFilteredBy(accountFilter, correlationId) {
    if (Object.keys(accountFilter).length === 0 || Object.values(accountFilter).every((value) => value === null || value === void 0 || value === ""))
      return this.commonLogger.warning("getAccountInfoFilteredBy: Account filter is empty or invalid, returning null", correlationId), null;
    let allAccounts = this.getAllAccounts(accountFilter, correlationId);
    if (allAccounts.length > 1)
      return allAccounts.sort((account) => {
        return account.idTokenClaims ? -1 : 1;
      })[0];
    else if (allAccounts.length === 1)
      return allAccounts[0];
    else
      return null;
  }
  getBaseAccountInfo(accountFilter, correlationId) {
    let accountEntities = this.getAccountsFilteredBy(accountFilter, correlationId);
    if (accountEntities.length > 0)
      return getAccountInfo(accountEntities[0]);
    else
      return null;
  }
  buildTenantProfiles(cachedAccounts, correlationId, accountFilter) {
    return cachedAccounts.flatMap((accountEntity) => {
      return this.getTenantProfilesFromAccountEntity(accountEntity, correlationId, accountFilter?.tenantId, accountFilter);
    });
  }
  getTenantedAccountInfoByFilter(accountInfo, tokenKeys, tenantProfile, correlationId, tenantProfileFilter) {
    let tenantedAccountInfo = null, idTokenClaims;
    if (tenantProfileFilter) {
      if (!this.tenantProfileMatchesFilter(tenantProfile, tenantProfileFilter))
        return null;
    }
    let idToken = this.getIdToken(accountInfo, correlationId, tokenKeys, tenantProfile.tenantId);
    if (idToken) {
      if (idTokenClaims = extractTokenClaims(idToken.secret, this.cryptoImpl.base64Decode), !this.idTokenClaimsMatchTenantProfileFilter(idTokenClaims, tenantProfileFilter))
        return null;
    }
    return tenantedAccountInfo = updateAccountTenantProfileData(accountInfo, tenantProfile, idTokenClaims, idToken?.secret), tenantedAccountInfo;
  }
  getTenantProfilesFromAccountEntity(accountEntity, correlationId, targetTenantId, tenantProfileFilter) {
    let accountInfo = getAccountInfo(accountEntity), searchTenantProfiles = accountInfo.tenantProfiles || /* @__PURE__ */ new Map, tokenKeys = this.getTokenKeys();
    if (targetTenantId) {
      let tenantProfile = searchTenantProfiles.get(targetTenantId);
      if (tenantProfile)
        searchTenantProfiles = /* @__PURE__ */ new Map([
          [targetTenantId, tenantProfile]
        ]);
      else
        return [];
    }
    let matchingTenantProfiles = [];
    return searchTenantProfiles.forEach((tenantProfile) => {
      let tenantedAccountInfo = this.getTenantedAccountInfoByFilter(accountInfo, tokenKeys, tenantProfile, correlationId, tenantProfileFilter);
      if (tenantedAccountInfo)
        matchingTenantProfiles.push(tenantedAccountInfo);
    }), matchingTenantProfiles;
  }
  tenantProfileMatchesFilter(tenantProfile, tenantProfileFilter) {
    if (!!tenantProfileFilter.localAccountId && !this.matchLocalAccountIdFromTenantProfile(tenantProfile, tenantProfileFilter.localAccountId))
      return !1;
    if (!!tenantProfileFilter.name && tenantProfile.name !== tenantProfileFilter.name)
      return !1;
    if (tenantProfileFilter.isHomeTenant !== void 0 && tenantProfile.isHomeTenant !== tenantProfileFilter.isHomeTenant)
      return !1;
    return !0;
  }
  idTokenClaimsMatchTenantProfileFilter(idTokenClaims, tenantProfileFilter) {
    if (tenantProfileFilter) {
      if (!!tenantProfileFilter.localAccountId && !this.matchLocalAccountIdFromTokenClaims(idTokenClaims, tenantProfileFilter.localAccountId))
        return !1;
      if (!!tenantProfileFilter.loginHint && !this.matchLoginHintFromTokenClaims(idTokenClaims, tenantProfileFilter.loginHint))
        return !1;
      if (!!tenantProfileFilter.username && !this.matchUsername(idTokenClaims.preferred_username, tenantProfileFilter.username))
        return !1;
      if (!!tenantProfileFilter.name && !this.matchName(idTokenClaims, tenantProfileFilter.name))
        return !1;
      if (!!tenantProfileFilter.sid && !this.matchSid(idTokenClaims, tenantProfileFilter.sid))
        return !1;
    }
    return !0;
  }
  async saveCacheRecord(cacheRecord, correlationId, kmsi, apiId, storeInCache) {
    if (!cacheRecord)
      throw createClientAuthError(invalidCacheRecord);
    try {
      if (cacheRecord.account)
        await this.setAccount(cacheRecord.account, correlationId, kmsi, apiId);
      if (!!cacheRecord.idToken && storeInCache?.idToken !== !1)
        await this.setIdTokenCredential(cacheRecord.idToken, correlationId, kmsi);
      if (!!cacheRecord.accessToken && storeInCache?.accessToken !== !1)
        await this.saveAccessToken(cacheRecord.accessToken, correlationId, kmsi);
      if (!!cacheRecord.refreshToken && storeInCache?.refreshToken !== !1)
        await this.setRefreshTokenCredential(cacheRecord.refreshToken, correlationId, kmsi);
      if (cacheRecord.appMetadata)
        this.setAppMetadata(cacheRecord.appMetadata, correlationId);
    } catch (e) {
      if (this.commonLogger?.error("CacheManager.saveCacheRecord: failed", correlationId), e instanceof AuthError)
        throw e;
      else
        throw createCacheError(e);
    }
  }
  async saveAccessToken(credential, correlationId, kmsi) {
    let accessTokenFilter = {
      clientId: credential.clientId,
      credentialType: credential.credentialType,
      environment: credential.environment,
      homeAccountId: credential.homeAccountId,
      realm: credential.realm,
      tokenType: credential.tokenType
    }, tokenKeys = this.getTokenKeys(), currentScopes = ScopeSet.fromString(credential.target);
    tokenKeys.accessToken.forEach((key) => {
      if (!this.accessTokenKeyMatchesFilter(key, accessTokenFilter, !1))
        return;
      let tokenEntity = this.getAccessTokenCredential(key, correlationId);
      if (tokenEntity && this.credentialMatchesFilter(tokenEntity, accessTokenFilter, correlationId)) {
        if (ScopeSet.fromString(tokenEntity.target).intersectingScopeSets(currentScopes))
          this.removeAccessToken(key, correlationId);
      }
    }), await this.setAccessTokenCredential(credential, correlationId, kmsi);
  }
  getAccountsFilteredBy(accountFilter, correlationId) {
    let allAccountKeys = this.getAccountKeys(), matchingAccounts = [];
    return allAccountKeys.forEach((cacheKey) => {
      let entity = this.getAccount(cacheKey, correlationId);
      if (!entity)
        return;
      if (!!accountFilter.homeAccountId && !this.matchHomeAccountId(entity, accountFilter.homeAccountId))
        return;
      if (!!accountFilter.username && !this.matchUsername(entity.username, accountFilter.username))
        return;
      if (!!accountFilter.environment && !this.matchEnvironment(entity, accountFilter.environment, correlationId))
        return;
      if (!!accountFilter.realm && !this.matchRealm(entity, accountFilter.realm))
        return;
      if (!!accountFilter.nativeAccountId && !this.matchNativeAccountId(entity, accountFilter.nativeAccountId))
        return;
      if (!!accountFilter.authorityType && !this.matchAuthorityType(entity, accountFilter.authorityType))
        return;
      let tenantProfileFilter = {
        localAccountId: accountFilter?.localAccountId,
        name: accountFilter?.name
      }, matchingTenantProfiles = entity.tenantProfiles?.filter((tenantProfile) => {
        return this.tenantProfileMatchesFilter(tenantProfile, tenantProfileFilter);
      });
      if (matchingTenantProfiles && matchingTenantProfiles.length === 0)
        return;
      matchingAccounts.push(entity);
    }), matchingAccounts;
  }
  credentialMatchesFilter(entity, filter2, correlationId) {
    if (!!filter2.clientId && !this.matchClientId(entity, filter2.clientId))
      return !1;
    if (!!filter2.userAssertionHash && !this.matchUserAssertionHash(entity, filter2.userAssertionHash))
      return !1;
    if (typeof filter2.homeAccountId === "string" && !this.matchHomeAccountId(entity, filter2.homeAccountId))
      return !1;
    if (!!filter2.environment && !this.matchEnvironment(entity, filter2.environment, correlationId))
      return !1;
    if (!!filter2.realm && !this.matchRealm(entity, filter2.realm))
      return !1;
    if (!!filter2.credentialType && !this.matchCredentialType(entity, filter2.credentialType))
      return !1;
    if (!!filter2.familyId && !this.matchFamilyId(entity, filter2.familyId))
      return !1;
    if (!!filter2.target && !this.matchTarget(entity, filter2.target))
      return !1;
    if (entity.credentialType === CredentialType.ACCESS_TOKEN_WITH_AUTH_SCHEME) {
      if (!!filter2.tokenType && !this.matchTokenType(entity, filter2.tokenType))
        return !1;
      if (filter2.tokenType === AuthenticationScheme.SSH) {
        if (filter2.keyId && !this.matchKeyId(entity, filter2.keyId))
          return !1;
      }
    }
    return !0;
  }
  getAppMetadataFilteredBy(filter2, correlationId) {
    let allCacheKeys = this.getKeys(), matchingAppMetadata = {};
    return allCacheKeys.forEach((cacheKey) => {
      if (!this.isAppMetadata(cacheKey))
        return;
      let entity = this.getAppMetadata(cacheKey, correlationId);
      if (!entity)
        return;
      if (!!filter2.environment && !this.matchEnvironment(entity, filter2.environment, correlationId))
        return;
      if (!!filter2.clientId && !this.matchClientId(entity, filter2.clientId))
        return;
      matchingAppMetadata[cacheKey] = entity;
    }), matchingAppMetadata;
  }
  getAuthorityMetadataByAlias(host, correlationId) {
    let allCacheKeys = this.getAuthorityMetadataKeys(), matchedEntity = null;
    return allCacheKeys.forEach((cacheKey) => {
      if (!this.isAuthorityMetadata(cacheKey) || cacheKey.indexOf(this.clientId) === -1)
        return;
      let entity = this.getAuthorityMetadata(cacheKey, correlationId);
      if (!entity)
        return;
      if (entity.aliases.indexOf(host) === -1)
        return;
      matchedEntity = entity;
    }), matchedEntity;
  }
  removeAllAccounts(correlationId) {
    this.getAllAccounts({}, correlationId).forEach((account) => {
      this.removeAccount(account, correlationId);
    });
  }
  removeAccount(account, correlationId) {
    this.removeAccountContext(account, correlationId);
    let accountKeys = this.getAccountKeys(), keyFilter = (key) => {
      return key.includes(account.homeAccountId) && key.includes(account.environment);
    };
    accountKeys.filter(keyFilter).forEach((key) => {
      this.removeItem(key, correlationId), this.performanceClient.incrementFields({ accountsRemoved: 1 }, correlationId);
    });
  }
  removeAccountContext(account, correlationId) {
    let allTokenKeys = this.getTokenKeys(), keyFilter = (key) => {
      return key.includes(account.homeAccountId) && key.includes(account.environment);
    };
    allTokenKeys.idToken.filter(keyFilter).forEach((key) => {
      this.removeIdToken(key, correlationId);
    }), allTokenKeys.accessToken.filter(keyFilter).forEach((key) => {
      this.removeAccessToken(key, correlationId);
    }), allTokenKeys.refreshToken.filter(keyFilter).forEach((key) => {
      this.removeRefreshToken(key, correlationId);
    });
  }
  removeAccessToken(key, correlationId) {
    let credential = this.getAccessTokenCredential(key, correlationId);
    if (!credential)
      return;
    if (this.removeItem(key, correlationId), this.performanceClient.incrementFields({ accessTokensRemoved: 1 }, correlationId), credential.credentialType.toLowerCase() === CredentialType.ACCESS_TOKEN_WITH_AUTH_SCHEME.toLowerCase()) {
      if (credential.tokenType === AuthenticationScheme.POP) {
        let kid = credential.keyId;
        if (kid)
          this.cryptoImpl.removeTokenBindingKey(kid, correlationId).catch(() => {
            this.commonLogger.error(`Failed to remove token binding key '${kid}'`, correlationId), this.performanceClient?.incrementFields({ removeTokenBindingKeyFailure: 1 }, correlationId);
          });
      }
    }
  }
  removeAppMetadata(correlationId) {
    return this.getKeys().forEach((cacheKey) => {
      if (this.isAppMetadata(cacheKey))
        this.removeItem(cacheKey, correlationId);
    }), !0;
  }
  getIdToken(account, correlationId, tokenKeys, targetRealm) {
    this.commonLogger.trace("CacheManager - getIdToken called", correlationId);
    let idTokenFilter = {
      homeAccountId: account.homeAccountId,
      environment: account.environment,
      credentialType: CredentialType.ID_TOKEN,
      clientId: this.clientId,
      realm: targetRealm
    }, idTokenMap = this.getIdTokensByFilter(idTokenFilter, correlationId, tokenKeys), numIdTokens = idTokenMap.size;
    if (numIdTokens < 1)
      return this.commonLogger.info("CacheManager:getIdToken - No token found", correlationId), null;
    else if (numIdTokens > 1) {
      let tokensToBeRemoved = idTokenMap;
      if (!targetRealm) {
        let homeIdTokenMap = /* @__PURE__ */ new Map;
        idTokenMap.forEach((idToken, key) => {
          if (idToken.realm === account.tenantId)
            homeIdTokenMap.set(key, idToken);
        });
        let numHomeIdTokens = homeIdTokenMap.size;
        if (numHomeIdTokens < 1)
          return this.commonLogger.info("CacheManager:getIdToken - Multiple ID tokens found for account but none match account entity tenant id, returning first result", correlationId), idTokenMap.values().next().value;
        else if (numHomeIdTokens === 1)
          return this.commonLogger.info("CacheManager:getIdToken - Multiple ID tokens found for account, defaulting to home tenant profile", correlationId), homeIdTokenMap.values().next().value;
        else
          tokensToBeRemoved = homeIdTokenMap;
      }
      return this.commonLogger.info("CacheManager:getIdToken - Multiple matching ID tokens found, clearing them", correlationId), tokensToBeRemoved.forEach((idToken, key) => {
        this.removeIdToken(key, correlationId);
      }), this.performanceClient.addFields({ multiMatchedID: idTokenMap.size }, correlationId), null;
    }
    return this.commonLogger.info("CacheManager:getIdToken - Returning ID token", correlationId), idTokenMap.values().next().value;
  }
  getIdTokensByFilter(filter2, correlationId, tokenKeys) {
    let idTokenKeys = tokenKeys && tokenKeys.idToken || this.getTokenKeys().idToken, idTokens = /* @__PURE__ */ new Map;
    return idTokenKeys.forEach((key) => {
      if (!this.idTokenKeyMatchesFilter(key, {
        clientId: this.clientId,
        ...filter2
      }))
        return;
      let idToken = this.getIdTokenCredential(key, correlationId);
      if (idToken && this.credentialMatchesFilter(idToken, filter2, correlationId))
        idTokens.set(key, idToken);
    }), idTokens;
  }
  idTokenKeyMatchesFilter(inputKey, filter2) {
    let key = inputKey.toLowerCase();
    if (filter2.clientId && key.indexOf(filter2.clientId.toLowerCase()) === -1)
      return !1;
    if (filter2.homeAccountId && key.indexOf(filter2.homeAccountId.toLowerCase()) === -1)
      return !1;
    return !0;
  }
  removeIdToken(key, correlationId) {
    this.removeItem(key, correlationId);
  }
  removeRefreshToken(key, correlationId) {
    this.removeItem(key, correlationId);
  }
  getAccessToken(account, request2, tokenKeys, targetRealm) {
    let correlationId = request2.correlationId;
    this.commonLogger.trace("CacheManager - getAccessToken called", correlationId);
    let scopes = ScopeSet.createSearchScopes(request2.scopes), authScheme = request2.authenticationScheme || AuthenticationScheme.BEARER, credentialType = authScheme && authScheme.toLowerCase() !== AuthenticationScheme.BEARER.toLowerCase() ? CredentialType.ACCESS_TOKEN_WITH_AUTH_SCHEME : CredentialType.ACCESS_TOKEN, accessTokenFilter = {
      homeAccountId: account.homeAccountId,
      environment: account.environment,
      credentialType,
      clientId: this.clientId,
      realm: targetRealm || account.tenantId,
      target: scopes,
      tokenType: authScheme,
      keyId: request2.sshKid
    }, accessTokenKeys = tokenKeys && tokenKeys.accessToken || this.getTokenKeys().accessToken, accessTokens = [];
    accessTokenKeys.forEach((key) => {
      if (this.accessTokenKeyMatchesFilter(key, accessTokenFilter, !0)) {
        let accessToken = this.getAccessTokenCredential(key, correlationId);
        if (accessToken && this.credentialMatchesFilter(accessToken, accessTokenFilter, correlationId))
          accessTokens.push(accessToken);
      }
    });
    let numAccessTokens = accessTokens.length;
    if (numAccessTokens < 1)
      return this.commonLogger.info("CacheManager:getAccessToken - No token found", correlationId), null;
    else if (numAccessTokens > 1)
      return this.commonLogger.info("CacheManager:getAccessToken - Multiple access tokens found, clearing them", correlationId), accessTokens.forEach((accessToken) => {
        this.removeAccessToken(this.generateCredentialKey(accessToken), correlationId);
      }), this.performanceClient.addFields({ multiMatchedAT: accessTokens.length }, correlationId), null;
    return this.commonLogger.info("CacheManager:getAccessToken - Returning access token", correlationId), accessTokens[0];
  }
  accessTokenKeyMatchesFilter(inputKey, filter2, keyMustContainAllScopes) {
    let key = inputKey.toLowerCase();
    if (filter2.clientId && key.indexOf(filter2.clientId.toLowerCase()) === -1)
      return !1;
    if (filter2.homeAccountId && key.indexOf(filter2.homeAccountId.toLowerCase()) === -1)
      return !1;
    if (filter2.realm && key.indexOf(filter2.realm.toLowerCase()) === -1)
      return !1;
    if (filter2.target) {
      let scopes = filter2.target.asArray();
      for (let i4 = 0;i4 < scopes.length; i4++)
        if (keyMustContainAllScopes && !key.includes(scopes[i4].toLowerCase()))
          return !1;
        else if (!keyMustContainAllScopes && key.includes(scopes[i4].toLowerCase()))
          return !0;
    }
    return !0;
  }
  getAccessTokensByFilter(filter2, correlationId) {
    let tokenKeys = this.getTokenKeys(), accessTokens = [];
    return tokenKeys.accessToken.forEach((key) => {
      if (!this.accessTokenKeyMatchesFilter(key, filter2, !0))
        return;
      let accessToken = this.getAccessTokenCredential(key, correlationId);
      if (accessToken && this.credentialMatchesFilter(accessToken, filter2, correlationId))
        accessTokens.push(accessToken);
    }), accessTokens;
  }
  getRefreshToken(account, familyRT, correlationId, tokenKeys) {
    this.commonLogger.trace("CacheManager - getRefreshToken called", correlationId);
    let id = familyRT ? THE_FAMILY_ID : void 0, refreshTokenFilter = {
      homeAccountId: account.homeAccountId,
      environment: account.environment,
      credentialType: CredentialType.REFRESH_TOKEN,
      clientId: this.clientId,
      familyId: id
    }, refreshTokenKeys = tokenKeys && tokenKeys.refreshToken || this.getTokenKeys().refreshToken, refreshTokens = [];
    refreshTokenKeys.forEach((key) => {
      if (this.refreshTokenKeyMatchesFilter(key, refreshTokenFilter)) {
        let refreshToken = this.getRefreshTokenCredential(key, correlationId);
        if (refreshToken && this.credentialMatchesFilter(refreshToken, refreshTokenFilter, correlationId))
          refreshTokens.push(refreshToken);
      }
    });
    let numRefreshTokens = refreshTokens.length;
    if (numRefreshTokens < 1)
      return this.commonLogger.info("CacheManager:getRefreshToken - No refresh token found.", correlationId), null;
    if (numRefreshTokens > 1)
      this.performanceClient.addFields({ multiMatchedRT: numRefreshTokens }, correlationId);
    return this.commonLogger.info("CacheManager:getRefreshToken - returning refresh token", correlationId), refreshTokens[0];
  }
  refreshTokenKeyMatchesFilter(inputKey, filter2) {
    let key = inputKey.toLowerCase();
    if (filter2.familyId && key.indexOf(filter2.familyId.toLowerCase()) === -1)
      return !1;
    if (!filter2.familyId && filter2.clientId && key.indexOf(filter2.clientId.toLowerCase()) === -1)
      return !1;
    if (filter2.homeAccountId && key.indexOf(filter2.homeAccountId.toLowerCase()) === -1)
      return !1;
    return !0;
  }
  readAppMetadataFromCache(environment, correlationId) {
    let appMetadataFilter = {
      environment,
      clientId: this.clientId
    }, appMetadata = this.getAppMetadataFilteredBy(appMetadataFilter, correlationId), appMetadataEntries = Object.keys(appMetadata).map((key) => appMetadata[key]), numAppMetadata = appMetadataEntries.length;
    if (numAppMetadata < 1)
      return null;
    else if (numAppMetadata > 1)
      throw createClientAuthError(multipleMatchingAppMetadata);
    return appMetadataEntries[0];
  }
  isAppMetadataFOCI(environment, correlationId) {
    let appMetadata = this.readAppMetadataFromCache(environment, correlationId);
    return !!(appMetadata && appMetadata.familyId === THE_FAMILY_ID);
  }
  matchHomeAccountId(entity, homeAccountId) {
    return typeof entity.homeAccountId === "string" && homeAccountId === entity.homeAccountId;
  }
  matchLocalAccountIdFromTokenClaims(tokenClaims, localAccountId) {
    let idTokenLocalAccountId = tokenClaims.oid || tokenClaims.sub;
    return localAccountId === idTokenLocalAccountId;
  }
  matchLocalAccountIdFromTenantProfile(tenantProfile, localAccountId) {
    return tenantProfile.localAccountId === localAccountId;
  }
  matchName(claims, name2) {
    return name2.toLowerCase() === claims.name?.toLowerCase();
  }
  matchUsername(cachedUsername, filterUsername) {
    return !!(cachedUsername && typeof cachedUsername === "string" && filterUsername?.toLowerCase() === cachedUsername.toLowerCase());
  }
  matchUserAssertionHash(entity, userAssertionHash) {
    return !!(entity.userAssertionHash && userAssertionHash === entity.userAssertionHash);
  }
  matchEnvironment(entity, environment, correlationId) {
    if (this.staticAuthorityOptions) {
      let staticAliases = getAliasesFromStaticSources(this.staticAuthorityOptions, this.commonLogger, correlationId);
      if (staticAliases.includes(environment) && staticAliases.includes(entity.environment))
        return !0;
    }
    let cloudMetadata = this.getAuthorityMetadataByAlias(environment, correlationId);
    if (cloudMetadata && cloudMetadata.aliases.indexOf(entity.environment) > -1)
      return !0;
    return !1;
  }
  matchCredentialType(entity, credentialType) {
    return entity.credentialType && credentialType.toLowerCase() === entity.credentialType.toLowerCase();
  }
  matchClientId(entity, clientId) {
    return !!(entity.clientId && clientId === entity.clientId);
  }
  matchFamilyId(entity, familyId) {
    return !!(entity.familyId && familyId === entity.familyId);
  }
  matchRealm(entity, realm) {
    return entity.realm?.toLowerCase() === realm.toLowerCase();
  }
  matchNativeAccountId(entity, nativeAccountId) {
    return !!(entity.nativeAccountId && nativeAccountId === entity.nativeAccountId);
  }
  matchLoginHintFromTokenClaims(tokenClaims, loginHint) {
    if (tokenClaims.login_hint === loginHint)
      return !0;
    if (tokenClaims.preferred_username === loginHint)
      return !0;
    if (tokenClaims.upn === loginHint)
      return !0;
    return !1;
  }
  matchSid(idTokenClaims, sid) {
    return idTokenClaims.sid === sid;
  }
  matchAuthorityType(entity, authorityType) {
    return !!(entity.authorityType && authorityType.toLowerCase() === entity.authorityType.toLowerCase());
  }
  matchTarget(entity, target) {
    if (entity.credentialType !== CredentialType.ACCESS_TOKEN && entity.credentialType !== CredentialType.ACCESS_TOKEN_WITH_AUTH_SCHEME || !entity.target)
      return !1;
    return ScopeSet.fromString(entity.target).containsScopeSet(target);
  }
  matchTokenType(entity, tokenType) {
    return !!(entity.tokenType && entity.tokenType === tokenType);
  }
  matchKeyId(entity, keyId) {
    return !!(entity.keyId && entity.keyId === keyId);
  }
  isAppMetadata(key) {
    return key.indexOf(APP_METADATA) !== -1;
  }
  isAuthorityMetadata(key) {
    return key.indexOf(AUTHORITY_METADATA_CACHE_KEY) !== -1;
  }
  generateAuthorityMetadataCacheKey(authority) {
    return `${AUTHORITY_METADATA_CACHE_KEY}-${this.clientId}-${authority}`;
  }
  static toObject(obj, json2) {
    for (let propertyName in json2)
      obj[propertyName] = json2[propertyName];
    return obj;
  }
}
