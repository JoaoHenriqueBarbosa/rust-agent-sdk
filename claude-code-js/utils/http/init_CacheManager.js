// var: init_CacheManager
var init_CacheManager = __esm(() => {
  init_Constants();
  init_ScopeSet();
  init_ClientAuthError();
  init_AccountInfo();
  init_AuthToken();
  init_packageMetadata();
  init_AuthorityMetadata();
  init_CacheError();
  init_AccountEntityUtils();
  init_AuthError();
  init_ClientAuthErrorCodes();
  /*! @azure/msal-common v16.4.1 2026-04-01 */
  DefaultStorageClass = class DefaultStorageClass extends CacheManager {
    async setAccount() {
      throw createClientAuthError(methodNotImplemented);
    }
    getAccount() {
      throw createClientAuthError(methodNotImplemented);
    }
    async setIdTokenCredential() {
      throw createClientAuthError(methodNotImplemented);
    }
    getIdTokenCredential() {
      throw createClientAuthError(methodNotImplemented);
    }
    async setAccessTokenCredential() {
      throw createClientAuthError(methodNotImplemented);
    }
    getAccessTokenCredential() {
      throw createClientAuthError(methodNotImplemented);
    }
    async setRefreshTokenCredential() {
      throw createClientAuthError(methodNotImplemented);
    }
    getRefreshTokenCredential() {
      throw createClientAuthError(methodNotImplemented);
    }
    setAppMetadata() {
      throw createClientAuthError(methodNotImplemented);
    }
    getAppMetadata() {
      throw createClientAuthError(methodNotImplemented);
    }
    setServerTelemetry() {
      throw createClientAuthError(methodNotImplemented);
    }
    getServerTelemetry() {
      throw createClientAuthError(methodNotImplemented);
    }
    setAuthorityMetadata() {
      throw createClientAuthError(methodNotImplemented);
    }
    getAuthorityMetadata() {
      throw createClientAuthError(methodNotImplemented);
    }
    getAuthorityMetadataKeys() {
      throw createClientAuthError(methodNotImplemented);
    }
    setThrottlingCache() {
      throw createClientAuthError(methodNotImplemented);
    }
    getThrottlingCache() {
      throw createClientAuthError(methodNotImplemented);
    }
    removeItem() {
      throw createClientAuthError(methodNotImplemented);
    }
    getKeys() {
      throw createClientAuthError(methodNotImplemented);
    }
    getAccountKeys() {
      throw createClientAuthError(methodNotImplemented);
    }
    getTokenKeys() {
      throw createClientAuthError(methodNotImplemented);
    }
    generateCredentialKey() {
      throw createClientAuthError(methodNotImplemented);
    }
    generateAccountKey() {
      throw createClientAuthError(methodNotImplemented);
    }
  };
});
