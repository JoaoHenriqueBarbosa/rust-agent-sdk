// function: authorizeRequestOnCaeChallenge
async function authorizeRequestOnCaeChallenge(onChallengeOptions, caeClaims) {
  let { scopes } = onChallengeOptions, accessToken = await onChallengeOptions.getAccessToken(scopes, {
    enableCae: !0,
    claims: caeClaims
  });
  if (!accessToken)
    return !1;
  return onChallengeOptions.request.headers.set("Authorization", `${accessToken.tokenType ?? "Bearer"} ${accessToken.token}`), !0;
}
