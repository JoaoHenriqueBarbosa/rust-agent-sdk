// class: ResponseHandler
class ResponseHandler {
  constructor(clientId, cacheStorage, cryptoObj, logger10, performanceClient, serializableCache, persistencePlugin) {
    this.clientId = clientId, this.cacheStorage = cacheStorage, this.cryptoObj = cryptoObj, this.logger = logger10, this.performanceClient = performanceClient, this.serializableCache = serializableCache, this.persistencePlugin = persistencePlugin;
  }
  validateTokenResponse(serverResponse, correlationId, refreshAccessToken) {
    if (serverResponse.error || serverResponse.error_description || serverResponse.suberror) {
      let errString = `Error(s): ${serverResponse.error_codes || NOT_AVAILABLE} - Timestamp: ${serverResponse.timestamp || NOT_AVAILABLE} - Description: ${serverResponse.error_description || NOT_AVAILABLE} - Correlation ID: ${serverResponse.correlation_id || NOT_AVAILABLE} - Trace ID: ${serverResponse.trace_id || NOT_AVAILABLE}`, serverErrorNo = serverResponse.error_codes?.length ? serverResponse.error_codes[0] : void 0, serverError = new ServerError(serverResponse.error, errString, serverResponse.suberror, serverErrorNo, serverResponse.status);
      if (refreshAccessToken && serverResponse.status && serverResponse.status >= HTTP_SERVER_ERROR_RANGE_START && serverResponse.status <= HTTP_SERVER_ERROR_RANGE_END) {
        this.logger.warning(`executeTokenRequest:validateTokenResponse - AAD is currently unavailable and the access token is unable to be refreshed.
${serverError}`, correlationId);
        return;
      } else if (refreshAccessToken && serverResponse.status && serverResponse.status >= HTTP_CLIENT_ERROR_RANGE_START && serverResponse.status <= HTTP_CLIENT_ERROR_RANGE_END) {
        this.logger.warning(`executeTokenRequest:validateTokenResponse - AAD is currently available but is unable to refresh the access token.
${serverError}`, correlationId);
        return;
      }
      if (isInteractionRequiredError(serverResponse.error, serverResponse.error_description, serverResponse.suberror))
        throw new InteractionRequiredAuthError(serverResponse.error, serverResponse.error_description, serverResponse.suberror, serverResponse.timestamp || "", serverResponse.trace_id || "", serverResponse.correlation_id || "", serverResponse.claims || "", serverErrorNo);
      throw serverError;
    }
  }
  async handleServerTokenResponse(serverTokenResponse, authority, reqTimestamp, request2, apiId, authCodePayload, userAssertionHash, handlingRefreshTokenResponse, forceCacheRefreshTokenResponse, serverRequestId) {
    let idTokenClaims;
    if (serverTokenResponse.id_token) {
      if (idTokenClaims = extractTokenClaims(serverTokenResponse.id_token || "", this.cryptoObj.base64Decode), authCodePayload && authCodePayload.nonce) {
        if (idTokenClaims.nonce !== authCodePayload.nonce)
          throw createClientAuthError(nonceMismatch);
      }
      if (request2.maxAge || request2.maxAge === 0) {
        let authTime = idTokenClaims.auth_time;
        if (!authTime)
          throw createClientAuthError(authTimeNotFound);
        checkMaxAge(authTime, request2.maxAge);
      }
    }
    this.homeAccountIdentifier = generateHomeAccountId(serverTokenResponse.client_info || "", authority.authorityType, this.logger, this.cryptoObj, request2.correlationId, idTokenClaims);
    let requestStateObj;
    if (!!authCodePayload && !!authCodePayload.state)
      requestStateObj = parseRequestState(this.cryptoObj.base64Decode, authCodePayload.state);
    serverTokenResponse.key_id = serverTokenResponse.key_id || request2.sshKid || void 0;
    let cacheRecord = this.generateCacheRecord(serverTokenResponse, authority, reqTimestamp, request2, idTokenClaims, userAssertionHash, authCodePayload), cacheContext;
    try {
      if (this.persistencePlugin && this.serializableCache)
        this.logger.verbose("Persistence enabled, calling beforeCacheAccess", request2.correlationId), cacheContext = new TokenCacheContext(this.serializableCache, !0), await this.persistencePlugin.beforeCacheAccess(cacheContext);
      if (handlingRefreshTokenResponse && !forceCacheRefreshTokenResponse && cacheRecord.account) {
        if (this.cacheStorage.getAllAccounts({
          homeAccountId: cacheRecord.account.homeAccountId,
          environment: cacheRecord.account.environment
        }, request2.correlationId).length < 1)
          return this.logger.warning("Account used to refresh tokens not in persistence, refreshed tokens will not be stored in the cache", request2.correlationId), this.performanceClient?.addFields({
            acntLoggedOut: !0
          }, request2.correlationId), await ResponseHandler.generateAuthenticationResult(this.cryptoObj, authority, cacheRecord, !1, request2, this.performanceClient, idTokenClaims, requestStateObj, void 0, serverRequestId);
      }
      await this.cacheStorage.saveCacheRecord(cacheRecord, request2.correlationId, isKmsi(idTokenClaims || {}), apiId, request2.storeInCache);
    } finally {
      if (this.persistencePlugin && this.serializableCache && cacheContext)
        this.logger.verbose("Persistence enabled, calling afterCacheAccess", request2.correlationId), await this.persistencePlugin.afterCacheAccess(cacheContext);
    }
    return ResponseHandler.generateAuthenticationResult(this.cryptoObj, authority, cacheRecord, !1, request2, this.performanceClient, idTokenClaims, requestStateObj, serverTokenResponse, serverRequestId);
  }
  generateCacheRecord(serverTokenResponse, authority, reqTimestamp, request2, idTokenClaims, userAssertionHash, authCodePayload) {
    let env5 = authority.getPreferredCache();
    if (!env5)
      throw createClientAuthError(invalidCacheEnvironment);
    let claimsTenantId = getTenantIdFromIdTokenClaims(idTokenClaims), cachedIdToken, cachedAccount;
    if (serverTokenResponse.id_token && !!idTokenClaims)
      cachedIdToken = createIdTokenEntity(this.homeAccountIdentifier, env5, serverTokenResponse.id_token, this.clientId, claimsTenantId || ""), cachedAccount = buildAccountToCache(this.cacheStorage, authority, this.homeAccountIdentifier, this.cryptoObj.base64Decode, request2.correlationId, idTokenClaims, serverTokenResponse.client_info, env5, claimsTenantId, authCodePayload, void 0, this.logger, this.performanceClient);
    let cachedAccessToken = null;
    if (serverTokenResponse.access_token) {
      let responseScopes = serverTokenResponse.scope ? ScopeSet.fromString(serverTokenResponse.scope) : new ScopeSet(request2.scopes || []), expiresIn = (typeof serverTokenResponse.expires_in === "string" ? parseInt(serverTokenResponse.expires_in, 10) : serverTokenResponse.expires_in) || 0, extExpiresIn = (typeof serverTokenResponse.ext_expires_in === "string" ? parseInt(serverTokenResponse.ext_expires_in, 10) : serverTokenResponse.ext_expires_in) || 0, refreshIn = (typeof serverTokenResponse.refresh_in === "string" ? parseInt(serverTokenResponse.refresh_in, 10) : serverTokenResponse.refresh_in) || void 0, tokenExpirationSeconds = reqTimestamp + expiresIn, extendedTokenExpirationSeconds = tokenExpirationSeconds + extExpiresIn, refreshOnSeconds = refreshIn && refreshIn > 0 ? reqTimestamp + refreshIn : void 0;
      cachedAccessToken = createAccessTokenEntity(this.homeAccountIdentifier, env5, serverTokenResponse.access_token, this.clientId, claimsTenantId || authority.tenant || "", responseScopes.printScopes(), tokenExpirationSeconds, extendedTokenExpirationSeconds, this.cryptoObj.base64Decode, refreshOnSeconds, serverTokenResponse.token_type, userAssertionHash, serverTokenResponse.key_id);
      let resource = request2.resource || null;
      if (resource)
        cachedAccessToken.resource = resource;
    }
    let cachedRefreshToken = null;
    if (serverTokenResponse.refresh_token) {
      let rtExpiresOn;
      if (serverTokenResponse.refresh_token_expires_in) {
        let rtExpiresIn = typeof serverTokenResponse.refresh_token_expires_in === "string" ? parseInt(serverTokenResponse.refresh_token_expires_in, 10) : serverTokenResponse.refresh_token_expires_in;
        rtExpiresOn = reqTimestamp + rtExpiresIn, this.performanceClient?.addFields({ ntwkRtExpiresOnSeconds: rtExpiresOn }, request2.correlationId);
      }
      cachedRefreshToken = createRefreshTokenEntity(this.homeAccountIdentifier, env5, serverTokenResponse.refresh_token, this.clientId, serverTokenResponse.foci, userAssertionHash, rtExpiresOn);
    }
    let cachedAppMetadata = null;
    if (serverTokenResponse.foci)
      cachedAppMetadata = {
        clientId: this.clientId,
        environment: env5,
        familyId: serverTokenResponse.foci
      };
    return {
      account: cachedAccount,
      idToken: cachedIdToken,
      accessToken: cachedAccessToken,
      refreshToken: cachedRefreshToken,
      appMetadata: cachedAppMetadata
    };
  }
  static async generateAuthenticationResult(cryptoObj, authority, cacheRecord, fromTokenCache, request2, performanceClient, idTokenClaims, requestState, serverTokenResponse, requestId) {
    let accessToken = "", responseScopes = [], expiresOn = null, extExpiresOn, refreshOn, familyId = "";
    if (cacheRecord.accessToken) {
      if (cacheRecord.accessToken.tokenType === AuthenticationScheme.POP && !request2.popKid) {
        let popTokenGenerator = new PopTokenGenerator(cryptoObj, performanceClient), { secret, keyId } = cacheRecord.accessToken;
        if (!keyId)
          throw createClientAuthError(keyIdMissing);
        accessToken = await popTokenGenerator.signPopToken(secret, keyId, request2);
      } else
        accessToken = cacheRecord.accessToken.secret;
      if (responseScopes = ScopeSet.fromString(cacheRecord.accessToken.target).asArray(), expiresOn = toDateFromSeconds(cacheRecord.accessToken.expiresOn), extExpiresOn = toDateFromSeconds(cacheRecord.accessToken.extendedExpiresOn), cacheRecord.accessToken.refreshOn)
        refreshOn = toDateFromSeconds(cacheRecord.accessToken.refreshOn);
    }
    if (cacheRecord.appMetadata)
      familyId = cacheRecord.appMetadata.familyId === THE_FAMILY_ID ? THE_FAMILY_ID : "";
    let uid = idTokenClaims?.oid || idTokenClaims?.sub || "", tid = idTokenClaims?.tid || "";
    if (serverTokenResponse?.spa_accountid && !!cacheRecord.account)
      cacheRecord.account.nativeAccountId = serverTokenResponse?.spa_accountid;
    let accountInfo = cacheRecord.account ? updateAccountTenantProfileData(getAccountInfo(cacheRecord.account), void 0, idTokenClaims, cacheRecord.idToken?.secret) : null;
    return {
      authority: authority.canonicalAuthority,
      uniqueId: uid,
      tenantId: tid,
      scopes: responseScopes,
      account: accountInfo,
      idToken: cacheRecord?.idToken?.secret || "",
      idTokenClaims: idTokenClaims || {},
      accessToken,
      fromCache: fromTokenCache,
      expiresOn,
      extExpiresOn,
      refreshOn,
      correlationId: request2.correlationId,
      requestId: requestId || "",
      familyId,
      tokenType: cacheRecord.accessToken?.tokenType || "",
      state: requestState ? requestState.userRequestState : "",
      cloudGraphHostName: cacheRecord.account?.cloudGraphHostName || "",
      msGraphHost: cacheRecord.account?.msGraphHost || "",
      code: serverTokenResponse?.spa_code,
      fromPlatformBroker: !1
    };
  }
}
