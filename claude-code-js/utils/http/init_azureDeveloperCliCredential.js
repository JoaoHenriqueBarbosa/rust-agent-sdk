// var: init_azureDeveloperCliCredential
var init_azureDeveloperCliCredential = __esm(() => {
  init_logging();
  init_errors7();
  init_tenantIdUtils();
  init_tracing();
  init_scopeUtils();
  logger23 = credentialLogger("AzureDeveloperCliCredential"), azureDeveloperCliPublicErrorMessages = {
    notInstalled: "Azure Developer CLI couldn't be found. To mitigate this issue, see the troubleshooting guidelines at https://aka.ms/azsdk/js/identity/azdevclicredential/troubleshoot.",
    login: "Please run 'azd auth login' from a command prompt to authenticate before using this credential. For more information, see the troubleshooting guidelines at https://aka.ms/azsdk/js/identity/azdevclicredential/troubleshoot.",
    unknown: "Unknown error while trying to retrieve the access token",
    claim: "This credential doesn't support claims challenges. To authenticate with the required claims, please run the following command:"
  }, developerCliCredentialInternals = {
    getSafeWorkingDir() {
      if (process.platform === "win32") {
        let systemRoot = process.env.SystemRoot || process.env.SYSTEMROOT;
        if (!systemRoot)
          logger23.getToken.warning("The SystemRoot environment variable is not set. This may cause issues when using the Azure Developer CLI credential."), systemRoot = "C:\\Windows";
        return systemRoot;
      } else
        return "/bin";
    },
    async getAzdAccessToken(scopes, tenantId, timeout, claims) {
      let tenantSection = [];
      if (tenantId)
        tenantSection = ["--tenant-id", tenantId];
      let claimsSections = [];
      if (claims)
        claimsSections = ["--claims", btoa(claims)];
      return new Promise((resolve9, reject) => {
        try {
          let command12 = ["azd", ...[
            "auth",
            "token",
            "--output",
            "json",
            "--no-prompt",
            ...scopes.reduce((previous, current) => previous.concat("--scope", current), []),
            ...tenantSection,
            ...claimsSections
          ]].join(" ");
          child_process.exec(command12, {
            cwd: developerCliCredentialInternals.getSafeWorkingDir(),
            timeout
          }, (error43, stdout, stderr) => {
            resolve9({ stdout, stderr, error: error43 });
          });
        } catch (err) {
          reject(err);
        }
      });
    }
  };
});
