// class: ClientCertificateCredential
class ClientCertificateCredential {
  tenantId;
  additionallyAllowedTenantIds;
  certificateConfiguration;
  sendCertificateChain;
  msalClient;
  constructor(tenantId, clientId, certificatePathOrConfiguration, options = {}) {
    if (!tenantId || !clientId)
      throw Error(`${credentialName}: tenantId and clientId are required parameters.`);
    this.tenantId = tenantId, this.additionallyAllowedTenantIds = resolveAdditionallyAllowedTenantIds(options?.additionallyAllowedTenants), this.sendCertificateChain = options.sendCertificateChain, this.certificateConfiguration = {
      ...typeof certificatePathOrConfiguration === "string" ? {
        certificatePath: certificatePathOrConfiguration
      } : certificatePathOrConfiguration
    };
    let certificate = this.certificateConfiguration.certificate, certificatePath = this.certificateConfiguration.certificatePath;
    if (!this.certificateConfiguration || !(certificate || certificatePath))
      throw Error(`${credentialName}: Provide either a PEM certificate in string form, or the path to that certificate in the filesystem. To troubleshoot, visit https://aka.ms/azsdk/js/identity/serviceprincipalauthentication/troubleshoot.`);
    if (certificate && certificatePath)
      throw Error(`${credentialName}: To avoid unexpected behaviors, providing both the contents of a PEM certificate and the path to a PEM certificate is forbidden. To troubleshoot, visit https://aka.ms/azsdk/js/identity/serviceprincipalauthentication/troubleshoot.`);
    this.msalClient = createMsalClient(clientId, tenantId, {
      ...options,
      logger: logger14,
      tokenCredentialOptions: options
    });
  }
  async getToken(scopes, options = {}) {
    return tracingClient.withSpan(`${credentialName}.getToken`, options, async (newOptions) => {
      newOptions.tenantId = processMultiTenantRequest(this.tenantId, newOptions, this.additionallyAllowedTenantIds, logger14);
      let arrayScopes = Array.isArray(scopes) ? scopes : [scopes], certificate = await this.buildClientCertificate();
      return this.msalClient.getTokenByClientCertificate(arrayScopes, certificate, newOptions);
    });
  }
  async buildClientCertificate() {
    let parts = await parseCertificate(this.certificateConfiguration, this.sendCertificateChain ?? !1), privateKey;
    if (this.certificateConfiguration.certificatePassword !== void 0)
      privateKey = createPrivateKey2({
        key: parts.certificateContents,
        passphrase: this.certificateConfiguration.certificatePassword,
        format: "pem"
      }).export({
        format: "pem",
        type: "pkcs8"
      }).toString();
    else
      privateKey = parts.certificateContents;
    return {
      thumbprint: parts.thumbprint,
      thumbprintSha256: parts.thumbprintSha256,
      privateKey,
      x5c: parts.x5c
    };
  }
}
