// function: getCaeChallengeClaims
function getCaeChallengeClaims(challenges) {
  if (!challenges)
    return;
  return parseChallenges(challenges).find((x3) => x3.scheme === "Bearer" && x3.params.claims && x3.params.error === "insufficient_claims")?.params.claims;
}
