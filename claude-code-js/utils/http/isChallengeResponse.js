// function: isChallengeResponse
function isChallengeResponse(response7) {
  return response7.status === 401 && response7.headers.has("WWW-Authenticate");
}
