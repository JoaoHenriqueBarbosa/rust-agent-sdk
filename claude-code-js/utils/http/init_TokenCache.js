// var: init_TokenCache
var init_TokenCache = __esm(() => {
  init_NodeStorage();
  init_index_node();
  init_Deserializer();
  init_Serializer();
  init_GuidGenerator();
  init_CryptoProvider();
  /*! @azure/msal-node v5.1.2 2026-04-01 */
  defaultSerializedCache = {
    Account: {},
    IdToken: {},
    AccessToken: {},
    RefreshToken: {},
    AppMetadata: {}
  };
});
