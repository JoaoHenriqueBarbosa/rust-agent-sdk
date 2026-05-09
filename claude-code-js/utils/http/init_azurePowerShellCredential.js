// var: init_azurePowerShellCredential
var init_azurePowerShellCredential = __esm(() => {
  init_tenantIdUtils();
  init_logging();
  init_scopeUtils();
  init_errors7();
  init_processUtils();
  init_tracing();
  logger25 = credentialLogger("AzurePowerShellCredential"), isWindows = process.platform === "win32";
  powerShellErrors = {
    login: "Run Connect-AzAccount to login",
    installed: "The specified module 'Az.Accounts' with version '2.2.0' was not loaded because no valid module file was found in any module directory"
  }, powerShellPublicErrorMessages = {
    login: "Please run 'Connect-AzAccount' from PowerShell to authenticate before using this credential.",
    installed: `The 'Az.Account' module >= 2.2.0 is not installed. Install the Azure Az PowerShell module with: "Install-Module -Name Az -Scope CurrentUser -Repository PSGallery -Force".`,
    claim: "This credential doesn't support claims challenges. To authenticate with the required claims, please run the following command:",
    troubleshoot: "To troubleshoot, visit https://aka.ms/azsdk/js/identity/powershellcredential/troubleshoot."
  }, commandStack = [formatCommand("pwsh")];
  if (isWindows)
    commandStack.push(formatCommand("powershell"));
});
