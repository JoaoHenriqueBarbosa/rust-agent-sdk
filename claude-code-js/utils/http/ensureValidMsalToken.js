// function: ensureValidMsalToken
function ensureValidMsalToken(scopes, msalToken, getTokenOptions) {
  let error43 = (message) => {
    return logger10.getToken.info(message), new AuthenticationRequiredError({
      scopes: Array.isArray(scopes) ? scopes : [scopes],
      getTokenOptions,
      message
    });
  };
  if (!msalToken)
    throw error43("No response");
  if (!msalToken.expiresOn)
    throw error43('Response had no "expiresOn" property.');
  if (!msalToken.accessToken)
    throw error43('Response had no "accessToken" property.');
}
