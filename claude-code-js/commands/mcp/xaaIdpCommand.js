// Original: src/commands/mcp/xaaIdpCommand.ts
function registerMcpXaaIdpCommand(mcp2) {
  let xaaIdp = mcp2.command("xaa").description("Manage the XAA (SEP-990) IdP connection");
  xaaIdp.command("setup").description("Configure the IdP connection (one-time setup for all XAA-enabled servers)").requiredOption("--issuer <url>", "IdP issuer URL (OIDC discovery)").requiredOption("--client-id <id>", "Claude Code's client_id at the IdP").option("--client-secret", "Read IdP client secret from MCP_XAA_IDP_CLIENT_SECRET env var").option("--callback-port <port>", "Fixed loopback callback port (only if IdP does not honor RFC 8252 port-any matching)").action((options2) => {
    let issuerUrl;
    try {
      issuerUrl = new URL(options2.issuer);
    } catch {
      return cliError(`Error: --issuer must be a valid URL (got "${options2.issuer}")`);
    }
    if (issuerUrl.protocol !== "https:" && !(issuerUrl.protocol === "http:" && (issuerUrl.hostname === "localhost" || issuerUrl.hostname === "127.0.0.1" || issuerUrl.hostname === "[::1]")))
      return cliError(`Error: --issuer must use https:// (got "${issuerUrl.protocol}//${issuerUrl.host}")`);
    let callbackPort = options2.callbackPort ? parseInt(options2.callbackPort, 10) : void 0;
    if (callbackPort !== void 0 && (!Number.isInteger(callbackPort) || callbackPort <= 0))
      return cliError("Error: --callback-port must be a positive integer");
    let secret = options2.clientSecret ? process.env.MCP_XAA_IDP_CLIENT_SECRET : void 0;
    if (options2.clientSecret && !secret)
      return cliError("Error: --client-secret requires MCP_XAA_IDP_CLIENT_SECRET env var");
    let old = getXaaIdpSettings(), oldIssuer = old?.issuer, oldClientId = old?.clientId, { error: error44 } = updateSettingsForSource("userSettings", {
      xaaIdp: {
        issuer: options2.issuer,
        clientId: options2.clientId,
        callbackPort
      }
    });
    if (error44)
      return cliError(`Error writing settings: ${error44.message}`);
    if (oldIssuer) {
      if (issuerKey(oldIssuer) !== issuerKey(options2.issuer))
        clearIdpIdToken(oldIssuer), clearIdpClientSecret(oldIssuer);
      else if (oldClientId !== options2.clientId)
        clearIdpIdToken(oldIssuer), clearIdpClientSecret(oldIssuer);
    }
    if (secret) {
      let { success: success2, warning } = saveIdpClientSecret(options2.issuer, secret);
      if (!success2)
        return cliError(`Error: settings written but keychain save failed${warning ? ` \u2014 ${warning}` : ""}. Re-run with --client-secret once keychain is available.`);
    }
    cliOk(`XAA IdP connection configured for ${options2.issuer}`);
  }), xaaIdp.command("login").description("Cache an IdP id_token so XAA-enabled MCP servers authenticate silently. Default: run the OIDC browser login. With --id-token: write a pre-obtained JWT directly (used by conformance/e2e tests where the mock IdP does not serve /authorize).").option("--force", "Ignore any cached id_token and re-login (useful after IdP-side revocation)").option("--id-token <jwt>", "Write this pre-obtained id_token directly to cache, skipping the OIDC browser login").action(async (options2) => {
    let idp = getXaaIdpSettings();
    if (!idp)
      return cliError("Error: no XAA IdP connection. Run 'claude mcp xaa setup' first.");
    if (options2.idToken) {
      let expiresAt = saveIdpIdTokenFromJwt(idp.issuer, options2.idToken);
      return cliOk(`id_token cached for ${idp.issuer} (expires ${new Date(expiresAt).toISOString()})`);
    }
    if (options2.force)
      clearIdpIdToken(idp.issuer);
    if (getCachedIdpIdToken(idp.issuer) !== void 0)
      return cliOk(`Already logged in to ${idp.issuer} (cached id_token still valid). Use --force to re-login.`);
    process.stdout.write(`Opening browser for IdP login at ${idp.issuer}\u2026
`);
    try {
      await acquireIdpIdToken({
        idpIssuer: idp.issuer,
        idpClientId: idp.clientId,
        idpClientSecret: getIdpClientSecret(idp.issuer),
        callbackPort: idp.callbackPort,
        onAuthorizationUrl: (url3) => {
          process.stdout.write(`If the browser did not open, visit:
  ${url3}
`);
        }
      }), cliOk("Logged in. MCP servers with --xaa will now authenticate silently.");
    } catch (e) {
      cliError(`IdP login failed: ${errorMessage(e)}`);
    }
  }), xaaIdp.command("show").description("Show the current IdP connection config").action(() => {
    let idp = getXaaIdpSettings();
    if (!idp)
      return cliOk("No XAA IdP connection configured.");
    let hasSecret = getIdpClientSecret(idp.issuer) !== void 0, hasIdToken = getCachedIdpIdToken(idp.issuer) !== void 0;
    if (process.stdout.write(`Issuer:        ${idp.issuer}
`), process.stdout.write(`Client ID:     ${idp.clientId}
`), idp.callbackPort !== void 0)
      process.stdout.write(`Callback port: ${idp.callbackPort}
`);
    process.stdout.write(`Client secret: ${hasSecret ? "(stored in keychain)" : "(not set \u2014 PKCE-only)"}
`), process.stdout.write(`Logged in:     ${hasIdToken ? "yes (id_token cached)" : "no \u2014 run 'claude mcp xaa login'"}
`), cliOk();
  }), xaaIdp.command("clear").description("Clear the IdP connection config and cached id_token").action(() => {
    let idp = getXaaIdpSettings(), { error: error44 } = updateSettingsForSource("userSettings", {
      xaaIdp: void 0
    });
    if (error44)
      return cliError(`Error writing settings: ${error44.message}`);
    if (idp)
      clearIdpIdToken(idp.issuer), clearIdpClientSecret(idp.issuer);
    cliOk("XAA IdP connection cleared");
  });
}
var init_xaaIdpCommand = __esm(() => {
  init_xaaIdpLogin();
  init_errors();
  init_settings2();
});
