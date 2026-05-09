// class: UnavailableDefaultCredential
class UnavailableDefaultCredential {
  credentialUnavailableErrorMessage;
  credentialName;
  constructor(credentialName4, message) {
    this.credentialName = credentialName4, this.credentialUnavailableErrorMessage = message;
  }
  getToken() {
    return logger28.getToken.info(`Skipping ${this.credentialName}, reason: ${this.credentialUnavailableErrorMessage}`), Promise.resolve(null);
  }
}
