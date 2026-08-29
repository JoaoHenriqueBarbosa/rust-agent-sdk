// function: validateForceLoginOrg
async function validateForceLoginOrg() {
  if (process.env.ANTHROPIC_UNIX_SOCKET)
    return { valid: !0 };
  if (!isAnthropicAuthEnabled())
    return { valid: !0 };
  let requiredOrgUuid = getSettingsForSource("policySettings")?.forceLoginOrgUUID;
  if (!requiredOrgUuid)
    return { valid: !0 };
  await checkAndRefreshOAuthTokenIfNeeded();
  let tokens = getClaudeAIOAuthTokens();
  if (!tokens)
    return { valid: !0 };
  let { source } = getAuthTokenSource(), isEnvVarToken = source === "CLAUDE_CODE_OAUTH_TOKEN" || source === "CLAUDE_CODE_OAUTH_TOKEN_FILE_DESCRIPTOR", profile7 = await getOauthProfileFromOauthToken(tokens.accessToken);
  if (!profile7)
    return {
      valid: !1,
      message: `Unable to verify organization for the current authentication token.
This machine requires organization ${requiredOrgUuid} but the profile could not be fetched.
This may be a network error, or the token may lack the user:profile scope required for
verification (tokens from 'claude setup-token' do not include this scope).
Try again, or obtain a full-scope token via 'claude auth login'.`
    };
  let tokenOrgUuid = profile7.organization.uuid;
  if (tokenOrgUuid === requiredOrgUuid)
    return { valid: !0 };
  if (isEnvVarToken)
    return {
      valid: !1,
      message: `The ${source === "CLAUDE_CODE_OAUTH_TOKEN" ? "CLAUDE_CODE_OAUTH_TOKEN" : "CLAUDE_CODE_OAUTH_TOKEN_FILE_DESCRIPTOR"} environment variable provides a token for a
different organization than required by this machine's managed settings.

Required organization: ${requiredOrgUuid}
Token organization:   ${tokenOrgUuid}

Remove the environment variable or obtain a token for the correct organization.`
    };
  return {
    valid: !1,
    message: `Your authentication token belongs to organization ${tokenOrgUuid},
but this machine requires organization ${requiredOrgUuid}.

Please log in with the correct organization: claude auth login`
  };
}
