// class: VisualStudioCodeCredential
class VisualStudioCodeCredential {
  tenantId;
  additionallyAllowedTenantIds;
  msalClient;
  options;
  constructor(options) {
    if (this.options = options || {}, options && options.tenantId)
      checkTenantId(logger26, options.tenantId), this.tenantId = options.tenantId;
    else
      this.tenantId = CommonTenantId;
    this.additionallyAllowedTenantIds = resolveAdditionallyAllowedTenantIds(options?.additionallyAllowedTenants), checkUnsupportedTenant(this.tenantId);
  }
  async prepare(scopes) {
    let tenantId = processMultiTenantRequest(this.tenantId, this.options, this.additionallyAllowedTenantIds, logger26) || this.tenantId;
    if (!hasVSCodePlugin() || !vsCodeAuthRecordPath)
      throw new CredentialUnavailableError("Visual Studio Code Authentication is not available. Ensure you have have Azure Resources Extension installed in VS Code, signed into Azure via VS Code, installed the @azure/identity-vscode package, and properly configured the extension.");
    let authenticationRecord = await this.loadAuthRecord(vsCodeAuthRecordPath, scopes);
    this.msalClient = createMsalClient(VSCodeClientId, tenantId, {
      ...this.options,
      isVSCodeCredential: !0,
      brokerOptions: {
        enabled: !0,
        parentWindowHandle: new Uint8Array(0),
        useDefaultBrokerAccount: !0
      },
      authenticationRecord
    });
  }
  preparePromise;
  prepareOnce(scopes) {
    if (!this.preparePromise)
      this.preparePromise = this.prepare(scopes);
    return this.preparePromise;
  }
  async getToken(scopes, options) {
    let scopeArray = ensureScopes(scopes);
    if (await this.prepareOnce(scopeArray), !this.msalClient)
      throw new CredentialUnavailableError("Visual Studio Code Authentication failed to initialize. Ensure you have have Azure Resources Extension installed in VS Code, signed into Azure via VS Code, installed the @azure/identity-vscode package, and properly configured the extension.");
    return this.msalClient.getTokenByInteractiveRequest(scopeArray, {
      ...options,
      disableAutomaticAuthentication: !0
    });
  }
  async loadAuthRecord(authRecordPath, scopes) {
    try {
      let authRecordContent = await readFile9(authRecordPath, { encoding: "utf8" });
      return deserializeAuthenticationRecord(authRecordContent);
    } catch (error43) {
      throw logger26.getToken.info(formatError2(scopes, error43)), new CredentialUnavailableError("Cannot load authentication record in Visual Studio Code. Ensure you have have Azure Resources Extension installed in VS Code, signed into Azure via VS Code, installed the @azure/identity-vscode package, and properly configured the extension.");
    }
  }
}
