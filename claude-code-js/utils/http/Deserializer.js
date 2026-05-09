// class: Deserializer
class Deserializer {
  static deserializeJSONBlob(jsonFile) {
    return !jsonFile ? {} : JSON.parse(jsonFile);
  }
  static deserializeAccounts(accounts) {
    let accountObjects = {};
    if (accounts)
      Object.keys(accounts).map(function(key) {
        let serializedAcc = accounts[key], mappedAcc = {
          homeAccountId: serializedAcc.home_account_id,
          environment: serializedAcc.environment,
          realm: serializedAcc.realm,
          localAccountId: serializedAcc.local_account_id,
          username: serializedAcc.username,
          authorityType: serializedAcc.authority_type,
          name: serializedAcc.name,
          clientInfo: serializedAcc.client_info,
          lastModificationTime: serializedAcc.last_modification_time,
          lastModificationApp: serializedAcc.last_modification_app,
          tenantProfiles: serializedAcc.tenantProfiles?.map((serializedTenantProfile) => {
            return JSON.parse(serializedTenantProfile);
          }),
          lastUpdatedAt: Date.now().toString()
        }, account = {};
        CacheManager.toObject(account, mappedAcc), accountObjects[key] = account;
      });
    return accountObjects;
  }
  static deserializeIdTokens(idTokens) {
    let idObjects = {};
    if (idTokens)
      Object.keys(idTokens).map(function(key) {
        let serializedIdT = idTokens[key], idToken = {
          homeAccountId: serializedIdT.home_account_id,
          environment: serializedIdT.environment,
          credentialType: serializedIdT.credential_type,
          clientId: serializedIdT.client_id,
          secret: serializedIdT.secret,
          realm: serializedIdT.realm,
          lastUpdatedAt: Date.now().toString()
        };
        idObjects[key] = idToken;
      });
    return idObjects;
  }
  static deserializeAccessTokens(accessTokens) {
    let atObjects = {};
    if (accessTokens)
      Object.keys(accessTokens).map(function(key) {
        let serializedAT = accessTokens[key], accessToken = {
          homeAccountId: serializedAT.home_account_id,
          environment: serializedAT.environment,
          credentialType: serializedAT.credential_type,
          clientId: serializedAT.client_id,
          secret: serializedAT.secret,
          realm: serializedAT.realm,
          target: serializedAT.target,
          cachedAt: serializedAT.cached_at,
          expiresOn: serializedAT.expires_on,
          extendedExpiresOn: serializedAT.extended_expires_on,
          refreshOn: serializedAT.refresh_on,
          keyId: serializedAT.key_id,
          tokenType: serializedAT.token_type,
          userAssertionHash: serializedAT.userAssertionHash,
          resource: serializedAT.resource,
          lastUpdatedAt: Date.now().toString()
        };
        atObjects[key] = accessToken;
      });
    return atObjects;
  }
  static deserializeRefreshTokens(refreshTokens) {
    let rtObjects = {};
    if (refreshTokens)
      Object.keys(refreshTokens).map(function(key) {
        let serializedRT = refreshTokens[key], refreshToken = {
          homeAccountId: serializedRT.home_account_id,
          environment: serializedRT.environment,
          credentialType: serializedRT.credential_type,
          clientId: serializedRT.client_id,
          secret: serializedRT.secret,
          familyId: serializedRT.family_id,
          target: serializedRT.target,
          realm: serializedRT.realm,
          lastUpdatedAt: Date.now().toString()
        };
        rtObjects[key] = refreshToken;
      });
    return rtObjects;
  }
  static deserializeAppMetadata(appMetadata) {
    let appMetadataObjects = {};
    if (appMetadata)
      Object.keys(appMetadata).map(function(key) {
        let serializedAmdt = appMetadata[key];
        appMetadataObjects[key] = {
          clientId: serializedAmdt.client_id,
          environment: serializedAmdt.environment,
          familyId: serializedAmdt.family_id
        };
      });
    return appMetadataObjects;
  }
  static deserializeAllCache(jsonCache) {
    return {
      accounts: jsonCache.Account ? this.deserializeAccounts(jsonCache.Account) : {},
      idTokens: jsonCache.IdToken ? this.deserializeIdTokens(jsonCache.IdToken) : {},
      accessTokens: jsonCache.AccessToken ? this.deserializeAccessTokens(jsonCache.AccessToken) : {},
      refreshTokens: jsonCache.RefreshToken ? this.deserializeRefreshTokens(jsonCache.RefreshToken) : {},
      appMetadata: jsonCache.AppMetadata ? this.deserializeAppMetadata(jsonCache.AppMetadata) : {}
    };
  }
}
