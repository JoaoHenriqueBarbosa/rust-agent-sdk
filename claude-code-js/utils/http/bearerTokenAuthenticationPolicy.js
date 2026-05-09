// function: bearerTokenAuthenticationPolicy
function bearerTokenAuthenticationPolicy(options) {
  let { credential, scopes, challengeCallbacks } = options, logger13 = options.logger || logger12, callbacks = {
    authorizeRequest: challengeCallbacks?.authorizeRequest?.bind(challengeCallbacks) ?? defaultAuthorizeRequest,
    authorizeRequestOnChallenge: challengeCallbacks?.authorizeRequestOnChallenge?.bind(challengeCallbacks)
  }, getAccessToken = credential ? createTokenCycler(credential) : () => Promise.resolve(null);
  return {
    name: bearerTokenAuthenticationPolicyName,
    async sendRequest(request2, next) {
      if (!request2.url.toLowerCase().startsWith("https://"))
        throw Error("Bearer token authentication is not permitted for non-TLS protected (non-https) URLs.");
      await callbacks.authorizeRequest({
        scopes: Array.isArray(scopes) ? scopes : [scopes],
        request: request2,
        getAccessToken,
        logger: logger13
      });
      let response7, error43, shouldSendRequest;
      if ([response7, error43] = await trySendRequest(request2, next), isChallengeResponse(response7)) {
        let claims = getCaeChallengeClaims(response7.headers.get("WWW-Authenticate"));
        if (claims) {
          let parsedClaim;
          try {
            parsedClaim = atob(claims);
          } catch (e) {
            return logger13.warning(`The WWW-Authenticate header contains "claims" that cannot be parsed. Unable to perform the Continuous Access Evaluation authentication flow. Unparsable claims: ${claims}`), response7;
          }
          if (shouldSendRequest = await authorizeRequestOnCaeChallenge({
            scopes: Array.isArray(scopes) ? scopes : [scopes],
            response: response7,
            request: request2,
            getAccessToken,
            logger: logger13
          }, parsedClaim), shouldSendRequest)
            [response7, error43] = await trySendRequest(request2, next);
        } else if (callbacks.authorizeRequestOnChallenge) {
          if (shouldSendRequest = await callbacks.authorizeRequestOnChallenge({
            scopes: Array.isArray(scopes) ? scopes : [scopes],
            request: request2,
            response: response7,
            getAccessToken,
            logger: logger13
          }), shouldSendRequest)
            [response7, error43] = await trySendRequest(request2, next);
          if (isChallengeResponse(response7)) {
            if (claims = getCaeChallengeClaims(response7.headers.get("WWW-Authenticate")), claims) {
              let parsedClaim;
              try {
                parsedClaim = atob(claims);
              } catch (e) {
                return logger13.warning(`The WWW-Authenticate header contains "claims" that cannot be parsed. Unable to perform the Continuous Access Evaluation authentication flow. Unparsable claims: ${claims}`), response7;
              }
              if (shouldSendRequest = await authorizeRequestOnCaeChallenge({
                scopes: Array.isArray(scopes) ? scopes : [scopes],
                response: response7,
                request: request2,
                getAccessToken,
                logger: logger13
              }, parsedClaim), shouldSendRequest)
                [response7, error43] = await trySendRequest(request2, next);
            }
          }
        }
      }
      if (error43)
        throw error43;
      else
        return response7;
    }
  };
}
