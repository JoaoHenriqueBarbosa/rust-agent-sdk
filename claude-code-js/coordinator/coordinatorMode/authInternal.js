// function: authInternal
async function authInternal(provider5, { serverUrl, authorizationCode, scope, resourceMetadataUrl, fetchFn }) {
  let cachedState = await provider5.discoveryState?.(), resourceMetadata, authorizationServerUrl, metadata, effectiveResourceMetadataUrl = resourceMetadataUrl;
  if (!effectiveResourceMetadataUrl && cachedState?.resourceMetadataUrl)
    effectiveResourceMetadataUrl = new URL(cachedState.resourceMetadataUrl);
  if (cachedState?.authorizationServerUrl) {
    if (authorizationServerUrl = cachedState.authorizationServerUrl, resourceMetadata = cachedState.resourceMetadata, metadata = cachedState.authorizationServerMetadata ?? await discoverAuthorizationServerMetadata(authorizationServerUrl, { fetchFn }), !resourceMetadata)
      try {
        resourceMetadata = await discoverOAuthProtectedResourceMetadata(serverUrl, { resourceMetadataUrl: effectiveResourceMetadataUrl }, fetchFn);
      } catch {}
    if (metadata !== cachedState.authorizationServerMetadata || resourceMetadata !== cachedState.resourceMetadata)
      await provider5.saveDiscoveryState?.({
        authorizationServerUrl: String(authorizationServerUrl),
        resourceMetadataUrl: effectiveResourceMetadataUrl?.toString(),
        resourceMetadata,
        authorizationServerMetadata: metadata
      });
  } else {
    let serverInfo = await discoverOAuthServerInfo(serverUrl, { resourceMetadataUrl: effectiveResourceMetadataUrl, fetchFn });
    authorizationServerUrl = serverInfo.authorizationServerUrl, metadata = serverInfo.authorizationServerMetadata, resourceMetadata = serverInfo.resourceMetadata, await provider5.saveDiscoveryState?.({
      authorizationServerUrl: String(authorizationServerUrl),
      resourceMetadataUrl: effectiveResourceMetadataUrl?.toString(),
      resourceMetadata,
      authorizationServerMetadata: metadata
    });
  }
  let resource = await selectResourceURL(serverUrl, provider5, resourceMetadata), resolvedScope = scope || resourceMetadata?.scopes_supported?.join(" ") || provider5.clientMetadata.scope, clientInformation = await Promise.resolve(provider5.clientInformation());
  if (!clientInformation) {
    if (authorizationCode !== void 0)
      throw Error("Existing OAuth client information is required when exchanging an authorization code");
    let supportsUrlBasedClientId = metadata?.client_id_metadata_document_supported === !0, clientMetadataUrl = provider5.clientMetadataUrl;
    if (clientMetadataUrl && !isHttpsUrl(clientMetadataUrl))
      throw new InvalidClientMetadataError(`clientMetadataUrl must be a valid HTTPS URL with a non-root pathname, got: ${clientMetadataUrl}`);
    if (supportsUrlBasedClientId && clientMetadataUrl)
      clientInformation = {
        client_id: clientMetadataUrl
      }, await provider5.saveClientInformation?.(clientInformation);
    else {
      if (!provider5.saveClientInformation)
        throw Error("OAuth client information must be saveable for dynamic registration");
      let fullInformation = await registerClient(authorizationServerUrl, {
        metadata,
        clientMetadata: provider5.clientMetadata,
        scope: resolvedScope,
        fetchFn
      });
      await provider5.saveClientInformation(fullInformation), clientInformation = fullInformation;
    }
  }
  let nonInteractiveFlow = !provider5.redirectUrl;
  if (authorizationCode !== void 0 || nonInteractiveFlow) {
    let tokens2 = await fetchToken(provider5, authorizationServerUrl, {
      metadata,
      resource,
      authorizationCode,
      fetchFn
    });
    return await provider5.saveTokens(tokens2), "AUTHORIZED";
  }
  let tokens = await provider5.tokens();
  if (tokens?.refresh_token)
    try {
      let newTokens = await refreshAuthorization(authorizationServerUrl, {
        metadata,
        clientInformation,
        refreshToken: tokens.refresh_token,
        resource,
        addClientAuthentication: provider5.addClientAuthentication,
        fetchFn
      });
      return await provider5.saveTokens(newTokens), "AUTHORIZED";
    } catch (error44) {
      if (!(error44 instanceof OAuthError) || error44 instanceof ServerError2)
        ;
      else
        throw error44;
    }
  let state3 = provider5.state ? await provider5.state() : void 0, { authorizationUrl, codeVerifier } = await startAuthorization(authorizationServerUrl, {
    metadata,
    clientInformation,
    state: state3,
    redirectUrl: provider5.redirectUrl,
    scope: resolvedScope,
    resource
  });
  return await provider5.saveCodeVerifier(codeVerifier), await provider5.redirectToAuthorization(authorizationUrl), "REDIRECT";
}
