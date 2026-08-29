// class: OnBehalfOfCredential
class OnBehalfOfCredential {
  tenantId;
  additionallyAllowedTenantIds;
  msalClient;
  sendCertificateChain;
  certificatePath;
  clientSecret;
  userAssertionToken;
  clientAssertion;
  constructor(options) {
    let { clientSecret } = options, { certificatePath, sendCertificateChain } = options, { getAssertion } = options, { tenantId, clientId, userAssertionToken, additionallyAllowedTenants: additionallyAllowedTenantIds } = options;
    if (!tenantId)
      throw new CredentialUnavailableError(`${credentialName5}: tenantId is a required parameter. To troubleshoot, visit https://aka.ms/azsdk/js/identity/serviceprincipalauthentication/troubleshoot.`);
    if (!clientId)
      throw new CredentialUnavailableError(`${credentialName5}: clientId is a required parameter. To troubleshoot, visit https://aka.ms/azsdk/js/identity/serviceprincipalauthentication/troubleshoot.`);
    if (!clientSecret && !certificatePath && !getAssertion)
      throw new CredentialUnavailableError(`${credentialName5}: You must provide one of clientSecret, certificatePath, or a getAssertion callback but none were provided. To troubleshoot, visit https://aka.ms/azsdk/js/identity/serviceprincipalauthentication/troubleshoot.`);
    if (!userAssertionToken)
      throw new CredentialUnavailableError(`${credentialName5}: userAssertionToken is a required parameter. To troubleshoot, visit https://aka.ms/azsdk/js/identity/serviceprincipalauthentication/troubleshoot.`);
    this.certificatePath = certificatePath, this.clientSecret = clientSecret, this.userAssertionToken = userAssertionToken, this.sendCertificateChain = sendCertificateChain, this.clientAssertion = getAssertion, this.tenantId = tenantId, this.additionallyAllowedTenantIds = resolveAdditionallyAllowedTenantIds(additionallyAllowedTenantIds), this.msalClient = createMsalClient(clientId, this.tenantId, {
      ...options,
      logger: logger33,
      tokenCredentialOptions: options
    });
  }
  async getToken(scopes, options = {}) {
    return tracingClient.withSpan(`${credentialName5}.getToken`, options, async (newOptions) => {
      newOptions.tenantId = processMultiTenantRequest(this.tenantId, newOptions, this.additionallyAllowedTenantIds, logger33);
      let arrayScopes = ensureScopes(scopes);
      if (this.certificatePath) {
        let clientCertificate = await this.buildClientCertificate(this.certificatePath);
        return this.msalClient.getTokenOnBehalfOf(arrayScopes, this.userAssertionToken, clientCertificate, newOptions);
      } else if (this.clientSecret)
        return this.msalClient.getTokenOnBehalfOf(arrayScopes, this.userAssertionToken, this.clientSecret, options);
      else if (this.clientAssertion)
        return this.msalClient.getTokenOnBehalfOf(arrayScopes, this.userAssertionToken, this.clientAssertion, options);
      else
        throw Error("Expected either clientSecret or certificatePath or clientAssertion to be defined.");
    });
  }
  async buildClientCertificate(certificatePath) {
    try {
      let parts = await this.parseCertificate({ certificatePath }, this.sendCertificateChain);
      return {
        thumbprint: parts.thumbprint,
        thumbprintSha256: parts.thumbprintSha256,
        privateKey: parts.certificateContents,
        x5c: parts.x5c
      };
    } catch (error43) {
      throw logger33.info(formatError2("", error43)), error43;
    }
  }
  async parseCertificate(configuration, sendCertificateChain) {
    let certificatePath = configuration.certificatePath, certificateContents = await readFile10(certificatePath, "utf8"), x5c = sendCertificateChain ? certificateContents : void 0, certificatePattern = /(-+BEGIN CERTIFICATE-+)(\n\r?|\r\n?)([A-Za-z0-9+/\n\r]+=*)(\n\r?|\r\n?)(-+END CERTIFICATE-+)/g, publicKeys = [], match;
    do
      if (match = certificatePattern.exec(certificateContents), match)
        publicKeys.push(match[3]);
    while (match);
    if (publicKeys.length === 0)
      throw Error("The file at the specified path does not contain a PEM-encoded certificate.");
    let thumbprint = createHash4("sha1").update(Buffer.from(publicKeys[0], "base64")).digest("hex").toUpperCase(), thumbprintSha256 = createHash4("sha256").update(Buffer.from(publicKeys[0], "base64")).digest("hex").toUpperCase();
    return {
      certificateContents,
      thumbprintSha256,
      thumbprint,
      x5c
    };
  }
}
