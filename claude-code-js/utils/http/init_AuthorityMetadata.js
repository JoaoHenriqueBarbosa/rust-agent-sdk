// var: init_AuthorityMetadata
var init_AuthorityMetadata = __esm(() => {
  init_UrlString();
  init_Constants();
  /*! @azure/msal-common v16.4.1 2026-04-01 */
  endpointHosts = [
    { host: "login.microsoftonline.com" },
    {
      host: "login.chinacloudapi.cn",
      issuerHost: "login.partner.microsoftonline.cn"
    },
    { host: "login.microsoftonline.us" },
    { host: "login.sovcloud-identity.fr" },
    { host: "login.sovcloud-identity.de" },
    { host: "login.sovcloud-identity.sg" }
  ];
  dynamicEndpointMetadata = endpointHosts.reduce((acc, { host, issuerHost }) => {
    return acc[host] = buildOpenIdConfig(host, issuerHost || host), acc;
  }, {}), rawMetdataJSON = {
    endpointMetadata: dynamicEndpointMetadata,
    instanceDiscoveryMetadata: {
      metadata: [
        {
          preferred_network: "login.microsoftonline.com",
          preferred_cache: "login.windows.net",
          aliases: [
            "login.microsoftonline.com",
            "login.windows.net",
            "login.microsoft.com",
            "sts.windows.net"
          ]
        },
        {
          preferred_network: "login.partner.microsoftonline.cn",
          preferred_cache: "login.partner.microsoftonline.cn",
          aliases: [
            "login.partner.microsoftonline.cn",
            "login.chinacloudapi.cn"
          ]
        },
        {
          preferred_network: "login.microsoftonline.de",
          preferred_cache: "login.microsoftonline.de",
          aliases: ["login.microsoftonline.de"]
        },
        {
          preferred_network: "login.microsoftonline.us",
          preferred_cache: "login.microsoftonline.us",
          aliases: [
            "login.microsoftonline.us",
            "login.usgovcloudapi.net"
          ]
        },
        {
          preferred_network: "login-us.microsoftonline.com",
          preferred_cache: "login-us.microsoftonline.com",
          aliases: ["login-us.microsoftonline.com"]
        },
        {
          preferred_network: "login.sovcloud-identity.fr",
          preferred_cache: "login.sovcloud-identity.fr",
          aliases: ["login.sovcloud-identity.fr"]
        },
        {
          preferred_network: "login.sovcloud-identity.de",
          preferred_cache: "login.sovcloud-identity.de",
          aliases: ["login.sovcloud-identity.de"]
        },
        {
          preferred_network: "login.sovcloud-identity.sg",
          preferred_cache: "login.sovcloud-identity.sg",
          aliases: ["login.sovcloud-identity.sg"]
        }
      ]
    }
  }, EndpointMetadata = rawMetdataJSON.endpointMetadata, InstanceDiscoveryMetadata = rawMetdataJSON.instanceDiscoveryMetadata, InstanceDiscoveryMetadataAliases = /* @__PURE__ */ new Set;
  InstanceDiscoveryMetadata.metadata.forEach((metadataEntry) => {
    metadataEntry.aliases.forEach((alias) => {
      InstanceDiscoveryMetadataAliases.add(alias);
    });
  });
});
