// function: getStandardAuthorizeRequestParameters
function getStandardAuthorizeRequestParameters(authOptions, request2, logger10, performanceClient) {
  let correlationId = request2.correlationId, parameters = /* @__PURE__ */ new Map;
  addClientId(parameters, request2.embeddedClientId || request2.extraQueryParameters?.[CLIENT_ID] || authOptions.clientId);
  let requestScopes = [
    ...request2.scopes || [],
    ...request2.extraScopesToConsent || []
  ];
  if (addScopes(parameters, requestScopes, !0, authOptions.authority.options.OIDCOptions?.defaultScopes), addResource(parameters, request2.resource), addRedirectUri(parameters, request2.redirectUri), addCorrelationId(parameters, correlationId), addResponseMode(parameters, request2.responseMode), addClientInfo(parameters), addCliData(parameters), request2.prompt)
    addPrompt(parameters, request2.prompt), performanceClient?.addFields({ prompt: request2.prompt }, correlationId);
  if (request2.domainHint)
    addDomainHint(parameters, request2.domainHint), performanceClient?.addFields({ domainHintFromRequest: !0 }, correlationId);
  if (request2.prompt !== PromptValue.SELECT_ACCOUNT) {
    if (request2.sid && request2.prompt === PromptValue.NONE)
      logger10.verbose("createAuthCodeUrlQueryString: Prompt is none, adding sid from request", request2.correlationId), addSid(parameters, request2.sid), performanceClient?.addFields({ sidFromRequest: !0 }, correlationId);
    else if (request2.account) {
      let accountSid = extractAccountSid(request2.account), accountLoginHintClaim = extractLoginHint(request2.account);
      if (accountLoginHintClaim && request2.domainHint)
        logger10.warning('AuthorizationCodeClient.createAuthCodeUrlQueryString: "domainHint" param is set, skipping opaque "login_hint" claim. Please consider not passing domainHint', request2.correlationId), accountLoginHintClaim = null;
      if (accountLoginHintClaim) {
        logger10.verbose("createAuthCodeUrlQueryString: login_hint claim present on account", request2.correlationId), addLoginHint(parameters, accountLoginHintClaim), performanceClient?.addFields({ loginHintFromClaim: !0 }, correlationId);
        try {
          let clientInfo = buildClientInfoFromHomeAccountId(request2.account.homeAccountId);
          addCcsOid(parameters, clientInfo);
        } catch (e) {
          logger10.verbose("createAuthCodeUrlQueryString: Could not parse home account ID for CCS Header", request2.correlationId);
        }
      } else if (accountSid && request2.prompt === PromptValue.NONE) {
        logger10.verbose("createAuthCodeUrlQueryString: Prompt is none, adding sid from account", request2.correlationId), addSid(parameters, accountSid), performanceClient?.addFields({ sidFromClaim: !0 }, correlationId);
        try {
          let clientInfo = buildClientInfoFromHomeAccountId(request2.account.homeAccountId);
          addCcsOid(parameters, clientInfo);
        } catch (e) {
          logger10.verbose("createAuthCodeUrlQueryString: Could not parse home account ID for CCS Header", request2.correlationId);
        }
      } else if (request2.loginHint)
        logger10.verbose("createAuthCodeUrlQueryString: Adding login_hint from request", request2.correlationId), addLoginHint(parameters, request2.loginHint), addCcsUpn(parameters, request2.loginHint), performanceClient?.addFields({ loginHintFromRequest: !0 }, correlationId);
      else if (request2.account.username) {
        logger10.verbose("createAuthCodeUrlQueryString: Adding login_hint from account", request2.correlationId), addLoginHint(parameters, request2.account.username), performanceClient?.addFields({ loginHintFromUpn: !0 }, correlationId);
        try {
          let clientInfo = buildClientInfoFromHomeAccountId(request2.account.homeAccountId);
          addCcsOid(parameters, clientInfo);
        } catch (e) {
          logger10.verbose("createAuthCodeUrlQueryString: Could not parse home account ID for CCS Header", request2.correlationId);
        }
      }
    } else if (request2.loginHint)
      logger10.verbose("createAuthCodeUrlQueryString: No account, adding login_hint from request", request2.correlationId), addLoginHint(parameters, request2.loginHint), addCcsUpn(parameters, request2.loginHint), performanceClient?.addFields({ loginHintFromRequest: !0 }, correlationId);
  } else
    logger10.verbose("createAuthCodeUrlQueryString: Prompt is select_account, ignoring account hints", request2.correlationId);
  if (request2.nonce)
    addNonce(parameters, request2.nonce);
  if (request2.state)
    addState(parameters, request2.state);
  if (request2.claims || authOptions.clientCapabilities && authOptions.clientCapabilities.length > 0)
    addClaims(parameters, request2.claims, authOptions.clientCapabilities);
  if (request2.embeddedClientId)
    addBrokerParameters(parameters, authOptions.clientId, authOptions.redirectUri);
  if (authOptions.instanceAware && (!request2.extraQueryParameters || !Object.keys(request2.extraQueryParameters).includes(INSTANCE_AWARE)))
    addInstanceAware(parameters);
  return parameters;
}
