// var: init_ICrypto
var init_ICrypto = __esm(() => {
  init_ClientAuthError();
  init_ClientAuthErrorCodes();
  /*! @azure/msal-common v16.4.1 2026-04-01 */
  DEFAULT_CRYPTO_IMPLEMENTATION = {
    createNewGuid: () => {
      throw createClientAuthError(methodNotImplemented);
    },
    base64Decode: () => {
      throw createClientAuthError(methodNotImplemented);
    },
    base64Encode: () => {
      throw createClientAuthError(methodNotImplemented);
    },
    base64UrlEncode: () => {
      throw createClientAuthError(methodNotImplemented);
    },
    encodeKid: () => {
      throw createClientAuthError(methodNotImplemented);
    },
    async getPublicKeyThumbprint() {
      throw createClientAuthError(methodNotImplemented);
    },
    async removeTokenBindingKey() {
      throw createClientAuthError(methodNotImplemented);
    },
    async clearKeystore() {
      throw createClientAuthError(methodNotImplemented);
    },
    async signJwt() {
      throw createClientAuthError(methodNotImplemented);
    },
    async hashString() {
      throw createClientAuthError(methodNotImplemented);
    }
  };
});
