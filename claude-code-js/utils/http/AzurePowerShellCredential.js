// class: AzurePowerShellCredential
class AzurePowerShellCredential {
  tenantId;
  additionallyAllowedTenantIds;
  timeout;
  constructor(options) {
    if (options?.tenantId)
      checkTenantId(logger25, options?.tenantId), this.tenantId = options?.tenantId;
    this.additionallyAllowedTenantIds = resolveAdditionallyAllowedTenantIds(options?.additionallyAllowedTenants), this.timeout = options?.processTimeoutInMs;
  }
  async getAzurePowerShellAccessToken(resource, tenantId, timeout) {
    for (let powerShellCommand of [...commandStack]) {
      try {
        await runCommands([[powerShellCommand, "/?"]], timeout);
      } catch (e) {
        commandStack.shift();
        continue;
      }
      let result = (await runCommands([
        [
          powerShellCommand,
          "-NoProfile",
          "-NonInteractive",
          "-Command",
          `
          $tenantId = "${tenantId ?? ""}"
          $m = Import-Module Az.Accounts -MinimumVersion 2.2.0 -PassThru
          $useSecureString = $m.Version -ge [version]'2.17.0' -and $m.Version -lt [version]'5.0.0'

          $params = @{
            ResourceUrl = "${resource}"
          }

          if ($tenantId.Length -gt 0) {
            $params["TenantId"] = $tenantId
          }

          if ($useSecureString) {
            $params["AsSecureString"] = $true
          }

          $token = Get-AzAccessToken @params

          $result = New-Object -TypeName PSObject
          $result | Add-Member -MemberType NoteProperty -Name ExpiresOn -Value $token.ExpiresOn

          if ($token.Token -is [System.Security.SecureString]) {
            if ($PSVersionTable.PSVersion.Major -lt 7) {
              $ssPtr = [System.Runtime.InteropServices.Marshal]::SecureStringToBSTR($token.Token)
              try {
                $result | Add-Member -MemberType NoteProperty -Name Token -Value ([System.Runtime.InteropServices.Marshal]::PtrToStringBSTR($ssPtr))
              }
              finally {
                [System.Runtime.InteropServices.Marshal]::ZeroFreeBSTR($ssPtr)
              }
            }
            else {
              $result | Add-Member -MemberType NoteProperty -Name Token -Value ($token.Token | ConvertFrom-SecureString -AsPlainText)
            }
          }
          else {
            $result | Add-Member -MemberType NoteProperty -Name Token -Value $token.Token
          }

          Write-Output (ConvertTo-Json $result)
          `
        ]
      ]))[0];
      return parseJsonToken(result);
    }
    throw Error("Unable to execute PowerShell. Ensure that it is installed in your system");
  }
  async getToken(scopes, options = {}) {
    return tracingClient.withSpan(`${this.constructor.name}.getToken`, options, async () => {
      let scope = typeof scopes === "string" ? scopes : scopes[0], claimsValue = options.claims;
      if (claimsValue && claimsValue.trim()) {
        let loginCmd = `Connect-AzAccount -ClaimsChallenge ${btoa(claimsValue)}`, tenantIdFromOptions = options.tenantId;
        if (tenantIdFromOptions)
          loginCmd += ` -Tenant ${tenantIdFromOptions}`;
        let error43 = new CredentialUnavailableError(`${powerShellPublicErrorMessages.claim} ${loginCmd}`);
        throw logger25.getToken.info(formatError2(scope, error43)), error43;
      }
      let tenantId = processMultiTenantRequest(this.tenantId, options, this.additionallyAllowedTenantIds);
      if (tenantId)
        checkTenantId(logger25, tenantId);
      try {
        ensureValidScopeForDevTimeCreds(scope, logger25), logger25.getToken.info(`Using the scope ${scope}`);
        let resource = getScopeResource(scope), response7 = await this.getAzurePowerShellAccessToken(resource, tenantId, this.timeout);
        return logger25.getToken.info(formatSuccess(scopes)), {
          token: response7.Token,
          expiresOnTimestamp: new Date(response7.ExpiresOn).getTime(),
          tokenType: "Bearer"
        };
      } catch (err) {
        if (isNotInstalledError(err)) {
          let error44 = new CredentialUnavailableError(powerShellPublicErrorMessages.installed);
          throw logger25.getToken.info(formatError2(scope, error44)), error44;
        } else if (isLoginError(err)) {
          let error44 = new CredentialUnavailableError(powerShellPublicErrorMessages.login);
          throw logger25.getToken.info(formatError2(scope, error44)), error44;
        }
        let error43 = new CredentialUnavailableError(`${err}. ${powerShellPublicErrorMessages.troubleshoot}`);
        throw logger25.getToken.info(formatError2(scope, error43)), error43;
      }
    });
  }
}
