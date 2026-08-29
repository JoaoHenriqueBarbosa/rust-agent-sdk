// function: revokeServerTokens
async function revokeServerTokens(serverName, serverConfig, { preserveStepUpState = !1 } = {}) {
  let storage = getSecureStorage(), existingData = storage.read();
  if (!existingData?.mcpOAuth)
    return;
  let serverKey = getServerKey(serverName, serverConfig), tokenData = existingData.mcpOAuth[serverKey];
  if (tokenData?.accessToken || tokenData?.refreshToken)
    try {
      let asUrl = tokenData.discoveryState?.authorizationServerUrl ?? serverConfig.url, metadata = await fetchAuthServerMetadata(serverName, asUrl, serverConfig.oauth?.authServerMetadataUrl);
      if (!metadata)
        logMCPDebug(serverName, "No OAuth metadata found");
      else {
        let revocationEndpoint = "revocation_endpoint" in metadata ? metadata.revocation_endpoint : null;
        if (!revocationEndpoint)
          logMCPDebug(serverName, "Server does not support token revocation");
        else {
          let revocationEndpointStr = String(revocationEndpoint), authMethods = ("revocation_endpoint_auth_methods_supported" in metadata ? metadata.revocation_endpoint_auth_methods_supported : void 0) ?? ("token_endpoint_auth_methods_supported" in metadata ? metadata.token_endpoint_auth_methods_supported : void 0), authMethod = authMethods && !authMethods.includes("client_secret_basic") && authMethods.includes("client_secret_post") ? "client_secret_post" : "client_secret_basic";
          if (logMCPDebug(serverName, `Revoking tokens via ${revocationEndpointStr} (${authMethod})`), tokenData.refreshToken)
            try {
              await revokeToken({
                serverName,
                endpoint: revocationEndpointStr,
                token: tokenData.refreshToken,
                tokenTypeHint: "refresh_token",
                clientId: tokenData.clientId,
                clientSecret: tokenData.clientSecret,
                accessToken: tokenData.accessToken,
                authMethod
              });
            } catch (error44) {
              logMCPDebug(serverName, `Failed to revoke refresh token: ${errorMessage(error44)}`);
            }
          if (tokenData.accessToken)
            try {
              await revokeToken({
                serverName,
                endpoint: revocationEndpointStr,
                token: tokenData.accessToken,
                tokenTypeHint: "access_token",
                clientId: tokenData.clientId,
                clientSecret: tokenData.clientSecret,
                accessToken: tokenData.accessToken,
                authMethod
              });
            } catch (error44) {
              logMCPDebug(serverName, `Failed to revoke access token: ${errorMessage(error44)}`);
            }
        }
      }
    } catch (error44) {
      logMCPDebug(serverName, `Failed to revoke tokens: ${errorMessage(error44)}`);
    }
  else
    logMCPDebug(serverName, "No tokens to revoke");
  if (clearServerTokensFromLocalStorage(serverName, serverConfig), preserveStepUpState && tokenData && (tokenData.stepUpScope || tokenData.discoveryState)) {
    let freshData = storage.read() || {}, updatedData = {
      ...freshData,
      mcpOAuth: {
        ...freshData.mcpOAuth,
        [serverKey]: {
          ...freshData.mcpOAuth?.[serverKey],
          serverName,
          serverUrl: serverConfig.url,
          accessToken: freshData.mcpOAuth?.[serverKey]?.accessToken ?? "",
          expiresAt: freshData.mcpOAuth?.[serverKey]?.expiresAt ?? 0,
          ...tokenData.stepUpScope ? { stepUpScope: tokenData.stepUpScope } : {},
          ...tokenData.discoveryState ? {
            discoveryState: {
              authorizationServerUrl: tokenData.discoveryState.authorizationServerUrl,
              resourceMetadataUrl: tokenData.discoveryState.resourceMetadataUrl
            }
          } : {}
        }
      }
    };
    storage.update(updatedData), logMCPDebug(serverName, "Preserved step-up auth state across revocation");
  }
}
