// class: ChainedTokenCredential
class ChainedTokenCredential {
  _sources = [];
  constructor(...sources) {
    this._sources = sources;
  }
  async getToken(scopes, options = {}) {
    let { token } = await this.getTokenInternal(scopes, options);
    return token;
  }
  async getTokenInternal(scopes, options = {}) {
    let token = null, successfulCredential, errors6 = [];
    return tracingClient.withSpan("ChainedTokenCredential.getToken", options, async (updatedOptions) => {
      for (let i4 = 0;i4 < this._sources.length && token === null; i4++)
        try {
          token = await this._sources[i4].getToken(scopes, updatedOptions), successfulCredential = this._sources[i4];
        } catch (err) {
          if (err.name === "CredentialUnavailableError" || err.name === "AuthenticationRequiredError")
            errors6.push(err);
          else
            throw logger9.getToken.info(formatError2(scopes, err)), err;
        }
      if (!token && errors6.length > 0) {
        let err = new AggregateAuthenticationError(errors6, "ChainedTokenCredential authentication failed.");
        throw logger9.getToken.info(formatError2(scopes, err)), err;
      }
      if (logger9.getToken.info(`Result for ${successfulCredential.constructor.name}: ${formatSuccess(scopes)}`), token === null)
        throw new CredentialUnavailableError("Failed to retrieve a valid token");
      return { token, successfulCredential };
    });
  }
}
