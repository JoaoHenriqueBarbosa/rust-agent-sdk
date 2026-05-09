// class: BrokerCredential
class BrokerCredential {
  brokerMsalClient;
  brokerTenantId;
  brokerAdditionallyAllowedTenantIds;
  constructor(options) {
    this.brokerTenantId = resolveTenantId(logger27, options.tenantId), this.brokerAdditionallyAllowedTenantIds = resolveAdditionallyAllowedTenantIds(options?.additionallyAllowedTenants);
    let msalClientOptions = {
      ...options,
      tokenCredentialOptions: options,
      logger: logger27,
      brokerOptions: {
        enabled: !0,
        parentWindowHandle: new Uint8Array(0),
        useDefaultBrokerAccount: !0
      }
    };
    this.brokerMsalClient = createMsalClient(DeveloperSignOnClientId, this.brokerTenantId, msalClientOptions);
  }
  async getToken(scopes, options = {}) {
    return tracingClient.withSpan(`${this.constructor.name}.getToken`, options, async (newOptions) => {
      newOptions.tenantId = processMultiTenantRequest(this.brokerTenantId, newOptions, this.brokerAdditionallyAllowedTenantIds, logger27);
      let arrayScopes = ensureScopes(scopes);
      try {
        return this.brokerMsalClient.getBrokeredToken(arrayScopes, !0, {
          ...newOptions,
          disableAutomaticAuthentication: !0
        });
      } catch (e) {
        throw logger27.getToken.info(formatError2(arrayScopes, e)), new CredentialUnavailableError("Failed to acquire token using broker authentication", { cause: e });
      }
    });
  }
}
