// var: init_azureCliCredential
var init_azureCliCredential = __esm(() => {
  init_tenantIdUtils();
  init_logging();
  init_scopeUtils();
  init_errors7();
  init_tracing();
  init_subscriptionUtils();
  logger24 = credentialLogger("AzureCliCredential"), azureCliPublicErrorMessages = {
    claim: "This credential doesn't support claims challenges. To authenticate with the required claims, please run the following command:",
    notInstalled: "Azure CLI could not be found. Please visit https://aka.ms/azure-cli for installation instructions and then, once installed, authenticate to your Azure account using 'az login'.",
    login: "Please run 'az login' from a command prompt to authenticate before using this credential.",
    unknown: "Unknown error while trying to retrieve the access token",
    unexpectedResponse: 'Unexpected response from Azure CLI when getting token. Expected "expiresOn" to be a RFC3339 date string. Got:'
  }, cliCredentialInternals = {
    getSafeWorkingDir() {
      if (process.platform === "win32") {
        let systemRoot = process.env.SystemRoot || process.env.SYSTEMROOT;
        if (!systemRoot)
          logger24.getToken.warning("The SystemRoot environment variable is not set. This may cause issues when using the Azure CLI credential."), systemRoot = "C:\\Windows";
        return systemRoot;
      } else
        return "/bin";
    },
    async getAzureCliAccessToken(resource, tenantId, subscription, timeout) {
      let tenantSection = [], subscriptionSection = [];
      if (tenantId)
        tenantSection = ["--tenant", tenantId];
      if (subscription)
        subscriptionSection = ["--subscription", `"${subscription}"`];
      return new Promise((resolve9, reject) => {
        try {
          let command12 = ["az", ...[
            "account",
            "get-access-token",
            "--output",
            "json",
            "--resource",
            resource,
            ...tenantSection,
            ...subscriptionSection
          ]].join(" ");
          child_process2.exec(command12, { cwd: cliCredentialInternals.getSafeWorkingDir(), timeout }, (error43, stdout, stderr) => {
            resolve9({ stdout, stderr, error: error43 });
          });
        } catch (err) {
          reject(err);
        }
      });
    }
  };
});
