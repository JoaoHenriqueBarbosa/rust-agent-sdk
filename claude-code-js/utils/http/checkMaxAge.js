// function: checkMaxAge
function checkMaxAge(authTime, maxAge) {
  if (maxAge === 0 || Date.now() - 300000 > authTime + maxAge)
    throw createClientAuthError(maxAgeTranspired);
}
