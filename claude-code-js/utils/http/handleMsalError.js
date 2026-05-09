// function: handleMsalError
function handleMsalError(scopes, error43, getTokenOptions) {
  if (error43.name === "AuthError" || error43.name === "ClientAuthError" || error43.name === "BrowserAuthError") {
    let msalError = error43;
    switch (msalError.errorCode) {
      case "endpoints_resolution_error":
        return logger10.info(formatError2(scopes, error43.message)), new CredentialUnavailableError(error43.message);
      case "device_code_polling_cancelled":
        return new AbortError2("The authentication has been aborted by the caller.");
      case "consent_required":
      case "interaction_required":
      case "login_required":
        logger10.info(formatError2(scopes, `Authentication returned errorCode ${msalError.errorCode}`));
        break;
      default:
        logger10.info(formatError2(scopes, `Failed to acquire token: ${error43.message}`));
        break;
    }
  }
  if (error43.name === "ClientConfigurationError" || error43.name === "BrowserConfigurationAuthError" || error43.name === "AbortError" || error43.name === "AuthenticationError")
    return error43;
  if (error43.name === "NativeAuthError")
    return logger10.info(formatError2(scopes, `Error from the native broker: ${error43.message} with status code: ${error43.statusCode}`)), error43;
  return new AuthenticationRequiredError({ scopes, getTokenOptions, message: error43.message });
}
